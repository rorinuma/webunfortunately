const userModel = require('../models/userModel')
const tweetModel = require('../models/tweetModel')


exports.getProfileInfo = async (req, res) => {
  try {
    const { username } = req.params
    console.log("Get profile info params", username)
    const userInfo = await userModel.findUser(username, username)
    console.log(userInfo)
    if(userInfo.length > 0 ) {
      const userTweets = await tweetModel.getTweetsByUsername(username)
      res.status(200).json({user: {username: userInfo.username, tweetsCount: userTweets.length}, accessedBy: {username: req.user.username}})
    } 
  } catch (error) {
    console.error("error occured while accesing profile info: ", error);
    res.status(500).json({error: "error occured while accesing profile info"})
  }
}