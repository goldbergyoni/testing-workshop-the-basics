class WeatherProvider {
  

  async getWeather(destination, dates) {
    //Might respond with null when no data found
    return "warm";
  }
}

module.exports = WeatherProvider;
