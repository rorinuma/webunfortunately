const userModel = require('../models/userModel')
const tweetModel = require('../models/tweetModel')

exports.getProfileInfo = async (req, res) => {
  try {
    const { username } = req.params
    
    const userInfo = await userModel.findUser(username, username)
    if(userInfo.length > 0 ) {
      const userTweets = await tweetModel.tweetsByUsername(username)
      res.status(200).json({
        user: {
          username: userInfo[0].username,
          tweetsCount: userTweets.length,
          created_at: userInfo[0].created_at,
        }, 
        accessedBy: {username: req.user.username}})
    } 
  } catch (error) {
    console.error("error occured while accesing profile info: ", error);
    res.status(500).json({error: "error occured while accesing profile info"})
  }
}
