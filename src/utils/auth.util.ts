import axios from "axios";

const verfiyAccessToken = async (accessToken: any) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
    );
    console.log(response.data);
    const { aud } = response.data;
    if (aud === process.env.GOOGLE_CLIENT_ID) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to verify access token");
  }
};

const getUserDataFromFacebook = async (accessToken: any) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/me`, {
      params: {
        access_token: accessToken,
        fields: "id,email", // Specify the fields you want to retrieve
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve user data from Facebook");
  }
};

const verifyFacebookAccessToken = async (accessToken: any) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/debug_token`, {
      params: {
        input_token: accessToken,
        access_token: `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
      },
    });
    const isValid = response.data.data.is_valid;
    return isValid;
  } catch (error) {
    throw new Error("Failed to verify access token");
  }
};

export {
  verfiyAccessToken,
  getUserDataFromFacebook,
  verifyFacebookAccessToken,
};
