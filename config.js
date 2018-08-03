const twitterApp = {
  access_token: process.env.ACCESS_TOKEN,
   
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  //timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
};

module.exports = {
  twitterApp,
  userName: process.env.USERNAME,
  dbUserName: process.env.DB_USERNAME,
  dbUserPwd: process.env.DB_USERPWD	,
   botToken:process.env.BOT_TOKEN
};
