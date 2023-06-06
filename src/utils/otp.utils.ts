import otpGenerator from "otp-generator";
import axios from "axios";

const generateOTP = (length: number) => {
  return otpGenerator.generate(length, {
    digits: true,
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
};

const sendSMS = (phone: String, msg: String) => {
  axios({
    url: process.env.SMS_URL,
    method: "POST",
    data: {
      msg: msg,
      phone: phone,
      token: process.env.SMS_TOKEN,
    },
  })
    .then((response) => {
      console.log(response.data.url);
    })
    .catch((error) => {
      console.log(error);
    });
};

export { generateOTP, sendSMS };
