class VideoProducer {
  async produce(instructions) {
    //Not really doing anything, just for testing purposes
    return Promise.resolve("https://s3/video/newvideo.mp4");
  }
}

module.exports = new VideoProducer();
