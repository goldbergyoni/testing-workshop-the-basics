class WeatherProvider {
  async getWeather(destination, startDate, endDate) {
    // Can predict for today, it's too close, unless now is before 3am
    if (startDate.getDate() === new Date().getDate()) {
      if (new Date().getHours() > 3) {
        return null;
      }
    }
    //Might respond with null when no data found
    return "warm";
  }
}

module.exports = WeatherProvider;
