const DefaultWeatherProvider = require("./weather-provider");
const defaultMailSender = require("./mail-sender");
const defaultVideoProducer = require("./video-producer");
const instructionsValidator = require("./instructions-validator");
const dataAccess = require("./data-access");
const { default: Axios } = require("axios");

function TripClipService(
  videoProducer = defaultVideoProducer,
  WeatherProvider = DefaultWeatherProvider,
  mailSender = defaultMailSender
) {
  this.videoProducer = videoProducer;
  this.weatherProvider = new WeatherProvider();
  this.mailSender = mailSender;

  this.generateVideoScript = function (instructions, forecastedWeather) {
    return {
      script: "something",
      succeeded: true,
    }; //pseudo result
  };

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
      const validationResult = instructionsValidator.validate(instructions);
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
      const videoScript = this.generateVideoScript(instructions, forecastedWeather);
      const videoURL = await this.videoProducer.produce(videoScript);
      await this.mailSender.send(instructions.creator.email, "Your video is ready");
      new dataAccess().save(instructions, true, videoURL);

      //Upload to YouTube, uncomment this lines when ready to test this
      Axios.defaults.validateStatus = () => true;
      const YouTubeResponse = await Axios.post(`http://like-youtube.com/upload/${videoURL}`);
      if (YouTubeResponse.status !== 200) {
        result.succeed = false;
        return result;
      }
      result.succeed = true;

      return result;
    } catch (err) {
      // Throw descriptive error
      console.log(err);
      const errorToThrow = new Error(`video production failed ${err}`);
      errorToThrow.name = "video-production-failed";
      throw errorToThrow;
    }
  };
}

module.exports.TripClipService = TripClipService;
