const express = require("express")
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
}
require("dotenv").config()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json())

var db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log("connected");
})

app.post('/api/register', (req, res) => {
  const { email, username, password } = req.body
  const at = username
  const checkQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(checkQuery, [username, email], (checkErr, checkResult) => {
    if(checkErr) {
      console.error(checkErr);
      return res.status(500).json({error: "DB error while checking username"})
    }
    if(checkResult.length > 0) {
      return res.status(400).json({error: "Username already exists"})
    }
    const q = "INSERT INTO users (email, username, at, password) VALUES(?, ?, ?, ?)"
    db.query(q, [email, username, at, password], (err, result) => {
      if(err) {
        console.error(err)
        res.status(500).json({error: "DB error"})
      } else {
        
        const likesQuery = "CREATE TABLE ?? (id INT AUTO_INCREMENT PRIMARY KEY, tweet_id INT)"
        likesUsername = username + '_likes'
        db.query(likesQuery, [likesUsername], (err, result) => {
          if(err) throw err;
          console.log('table created too...')
          res.status(200).json({message: 'user registered successfully'})
        })
      }
    })
  });
});


app.post('/api/login',  (req, res) => {
  const {username, password} = req.body
  const checkQuery = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(checkQuery, [username, password], (checkErr, checkResult) => {
    if(checkErr) {
      console.error(checkErr);
      return res.status(500).json({error: "DB error while checking login credentials"})
    }
    if(checkResult.length === 1) {

      let jwtSecretKey = process.env.JWT_SECRET_KEY
      let data = {
        time: Date(),
        userId: checkResult[0].id,
        username: checkResult[0].username
      }
      const token = jwt.sign(data, jwtSecretKey, {expiresIn: '7d'})
      return res
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({message: 'logged in successfully'})
    } else {
      return res.status(401).json({error: "Invalid username or password"})
    }
  })
})

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if(!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = data.userId;
    req.username = data.username;
    return next();
  } catch {
    return res.sendStatus(403);
  }
}

app.get("/api/logout", authorization, (req, res) => {
  return res
  .clearCookie("access_token")
  .status(200)
  .json({message: "successfully logged out"})
})

app.get("/api/protected", authorization, (req, res) => {
  return res.json({user: {id: req.userId, username: req.username}})
})

app.get("/api/users/:username", authorization, (req, res) => {
  const { username } = req.params;

  const userQuery = "SELECT * FROM users WHERE username = ?";
  db.query(userQuery, [username], (err, userResult) => {
    if (err) {
      console.error("User query error:", err);
      return res.status(500).json({ message: "Error while fetching user data" });
    }

    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const tweetsQuery = "SELECT * FROM tweets WHERE username = ?";
    db.query(tweetsQuery, [username], (tweetsErr, tweetsResult) => {
      if (tweetsErr) {
        console.error("Tweets query error:", tweetsErr);
        return res.status(500).json({ message: "Error while fetching tweets" });
      }

      const responseData = {
        username: req.username, 
        tweets: tweetsResult  
      };

      res.status(200).json(responseData);
    });
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}.${file.originalname}` )
  }
})

const upload = multer({
    
  storage: storage,
  limits:{fileSize:'1000000'},
  fileFilter:(req, file, cb)=>{
    const fileType = /jpeg|jpg|png|jfif|gif/
    const mimeType = fileType.test(file.mimetype)
    const extname = fileType.test(path.extname(file.originalname))
    if(mimeType && extname){
        return cb(null, true)
    }
    cb('Give proper file format to upload')
  }
})

app.post('/api/tweets', [authorization, upload.single('tweet_post_image')], (req, res) => {
  try {
    const { text, date } = req.body
    const userId = req.userId
    const username = req.username
    const at = req.username
    const filePath = req.file ? req.file.filename : null;
    const q = "INSERT INTO tweets (userId, at, username, text, date, image) VALUES (?, ?, ?, ?, ?, ?)"
    db.query(q, [userId, at, username, text, date, filePath], (err, result) => {
      if(err) {
        return res.status(500).json('error while checking the db', err)
      }
      console.log("tweet added")
    })

  } catch  {
    return res.sendStatus(500)
  }
})

app.get("/api/tweets/all", authorization, (req, res) => {
  try {
    const q = "SELECT * FROM tweets ORDER BY date DESC"
    db.query(q, (err, result) => {
      if(err) throw err;
      const username = req.username + "_likes";
      const likesQuery = "SELECT * FROM ??"
      db.query(likesQuery, [username], (likesErr, likesResult) => {
        if(likesErr) throw err;
        const tweetsWithImages = result.map((tweet) => ({
          ...tweet, 
          image: tweet.image ? `http://localhost:8080/uploads/${tweet.image}` : null,
          liked: likesResult.some(like => like.tweet_id === tweet.id) ? true : false,
        }))
        res.status(200).json({tweets: tweetsWithImages})
      })
    })
  } catch (err) {
    return res.status(500).json('erorr uwu', err)
  }
})

app.get("/api/tweets/posts", authorization, (req, res) => {
  try {
    const q = "select * from tweets where username = ? order by date desc"
    username = req.query.username
    db.query(q, [username], (err, result) => {
      if(err) res.status(403).json({message: "bad request"})
        const likesQuery = "SELECT * FROM ??"
      db.query(likesQuery, [username + "_likes"], (likesErr, likesResult) => {
        if(likesErr) throw err;
        const tweetsWithImages = result.map((tweet) => ({
          ...tweet, 
          image: tweet.image ? `http://localhost:8080/uploads/${tweet.image}` : null,
          liked: likesResult.some(like => like.tweet_id === tweet.id) ? true : false,
        }))
        res.status(200).json({tweets: tweetsWithImages})
      })
    })

  } catch (err) {
    return res.status(500).json({message: "server error"})
  }
})

app.put("/api/tweets/likes", authorization, (req, res) => {
  try {
    const index = req.body.index;
    const username = req.username
    const findQuery = "SELECT * FROM tweets WHERE id = ?"
    db.query(findQuery, index, (err, result) => {
      if(err) throw err;
      const tweet_id = result[0].id 
      checkQuery = "SELECT * FROM ?? WHERE tweet_id = ?"
      db.query(checkQuery, [username + '_likes', tweet_id], (err, result) => {
        if(err) throw err;
        if (result.length === 0) {
          addQuery = "INSERT INTO ?? (tweet_id) VALUES (?)"
          db.query(addQuery, [username + '_likes', tweet_id], (err, result) => {
            if(err) throw err
            addCountQuery = "UPDATE tweets SET likes = likes + 1 WHERE id = ?"

            db.query(addCountQuery, [tweet_id], (err, result) => {
              if(err) throw err;
              console.log('tweet like added and the count increased')
              res.status(200).json({message: 'like added', result})
            })
          })
        }
        if (result.length === 1) {
          deleteQuery = "DELETE FROM ?? WHERE tweet_id = ?"
          db.query(deleteQuery, [username + '_likes', tweet_id], (err, result) => {
            if(err) throw err;
            removeCountQuery = "UPDATE tweets SET likes = likes - 1 WHERE id = ?"
            db.query(removeCountQuery, [tweet_id], (err, result) => {
              if(err) throw err;
              console.log('tweet like removed and the count decremented')
              res.status(200).json({message: 'the tweet count has been decremented'})
            })
          })
        }
      }) 
    })
  } catch(err) {
    res.status(500).json('error while accessing likes API')
  }
})

app.listen(8080, () => {
    console.log("Server started on port 8080")
});

