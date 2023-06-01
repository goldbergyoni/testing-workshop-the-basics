const DefaultWeatherProvider = require("./weather-provider");
const defaultMailSender = require("./mail-sender");
const defaultVideoProducer = require("./video-producer");
const { validate } = require("./instructions-validator");
const dataAccess = require("./data-access");
const { default: Axios } = require("axios");
const subtitlesProvider = require("./subtitles-provider");

function TripClipService(
  mailSender = defaultMailSender,
  videoProducer = defaultVideoProducer,
  WeatherProvider = DefaultWeatherProvider
) {
  this.videoProducer = videoProducer;
  this.weatherProvider = new WeatherProvider();
  this.mailSender = mailSender;

  this.generateVideoScript = function (instructions, forecastedWeather, subtitles) {
    let succeeded;
    if (process.env.MANDATORY_SUBTITLES === "true" && !subtitles) {
      throw new Error("Subtitles are mandatory but empty");
    } else {
      succeeded = true;
    }
    return {
      script: "something",
      succeeded,
    }; //pseudo result
  };

  // Input example:
  // {
  //   creator: {
  //     name: "Yoni Goldberg",
  //     email: "yoni@testjavascript.com",
  //   },
  //   destination: countriesList.countries.US,
  //   startDate: new Date(new Date().setDate(today.getDate() + 7)),
  //   endDate: new Date(new Date().setDate(today.getDate() + 30)),
  //   photos: ["beach.jpg"],
  //   tips: ["Must eat at the Italian restaurant!"],
  //   slogan: "It was amazing",
  //   background: "green-grass",
  // }
  this.generateClip = async function (instructions) {
    try {
      //initialize result
      const result = {
        videoURL: "undefined",
        succeed: false,
        instructionsValidation: {},
      };

      //validation
      if (!instructions) {
        const invalidInputException = new Error("Some mandatory property was not provided");
        invalidInputException.code = "invalidInput";
        throw invalidInputException;
      }
      const validationResult = validate(instructions);
      result.instructionsValidation = validationResult;
      if (!result.instructionsValidation.succeeded) {
        return result;
      }

      // Check the whether to put in the script
      const forecastedWeather = await this.weatherProvider.getWeather(
        instructions.destination,
        instructions.startDate,
        instructions.endDate
      );
      if (forecastedWeather === null) {
        result.succeed = false;
        return result;
      }

      // Generate video, send email and save in DB
      const subtitles = subtitlesProvider(instructions);
      const videoScript = this.generateVideoScript(instructions, forecastedWeather, subtitles);
      const videoURL = await this.videoProducer.produce(videoScript);
      await this.mailSender.send(instructions.creator.email, "Your video is ready");
      new dataAccess().save(instructions, true, videoURL);

      //Upload to YouTube, uncomment this lines when ready to test this
      Axios.defaults.validateStatus = () => true;
      const YouTubeResponse = await Axios.post(`http://like-youtube.com/upload?url=${videoURL}`);
      if (YouTubeResponse.status !== 200) {
        result.succeed = false;
        return result;
      }
      result.succeed = true;

      return result;
    } catch (err) {
      // Throw descriptive error
      console.log("Error", err);
      const errorToThrow = new Error(`video production failed ${err}`);
      errorToThrow.name = "video-production-failed";
      throw errorToThrow;
    }
  };
}

module.exports.TripClipService = TripClipService;
