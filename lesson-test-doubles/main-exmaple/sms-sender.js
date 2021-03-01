module.exports.sendSMS = async (message, number) => {
  console.log(`‼️ ☎️ 📱 Real SMS sender which incur costs`);

  return {
    succeeded: true,
  };
};

module.exports.verify = async (number) => {
  console.log(`‼️ ☎️ 📱 Real SMS verify which incur costs`);
};
