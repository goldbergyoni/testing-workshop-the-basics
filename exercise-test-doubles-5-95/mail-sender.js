class MailSender {
  async send(whom, what) {
    //Not really doing anything, just for testing purposes
    console.log("Im the real mailer");
    Promise.resolve(true);
  }
}

module.exports = new MailSender();
