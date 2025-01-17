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
  const checkQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(checkQuery, [username, email], (checkErr, checkResult) => {
    if(checkErr) {
      console.error(checkErr);
      return res.status(500).json({error: "DB error while checking username"})
    }
    if(checkResult.length > 0) {
      return res.status(400).json({error: "Username already exists"})
    }
    const q = "INSERT INTO users (email, username, password) VALUES(?, ?, ?)"
    db.query(q, [email, username, password], (err, result) => {
      if(err) {
        console.error(err)
        res.status(500).json({error: "DB error"})
      } else {
        res.json({message: "user registered successfully"})
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
      const token = jwt.sign(data, jwtSecretKey, {expiresIn: '1h'})
      return res
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
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

app.get("/api/logout", (req, res) => {
  return res
  .clearCookie("access_token")
  .status(200)
  .json({message: "successfully logged out"})
})

app.get("/api/protected", authorization, (req, res) => {
  return res.json({user: {id: req.userId, username: req.username}})
})

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
    const fileType = /jpeg|jpg|png|gif/
    const mimeType = fileType.test(file.mimetype)
    const extname = fileType.test(path.extname(file.originalname))
    if(mimeType && extname){
        return cb(null, true)
    }
    cb('Give proper file format to upload')
  }
}).single('tweet_post_image')

app.post('/api/tweets', [authorization, upload], (req, res) => {
  try {
    const { text, date } = req.body
    const userId = req.userId
    const username = req.username
    const file = req.file 
    const filePath = req.file ? req.file.filename : null;
    console.log(req.file)
    res.json({message: file})
    const q = "INSERT INTO tweets (userId, username, text, date, image) VALUES (?, ?, ?, ?, ?)"
    db.query(q, [userId, username, text, date, filePath], (err, result) => {
      if(err) {
        return res.status(500).json('error while checking the db', err)
      }
      console.log("1 tweet added")
    })

  } catch  {
    return res.sendStatus(500)
  }
})

app.get("/api/tweets", authorization, (req, res) => {
  try {
    const q = "SELECT * FROM tweets"
    db.query(q, (err, result) => {
      if(err) throw err;
      const tweetsWithImages = result.map((tweet) => ({
        ...tweet, 
        image: tweet.image ? `http://localhost:8080/uploads/${tweet.image}` : null
      }))
      res.status(200).json({tweets: tweetsWithImages})
    })
  } catch (err) {
    return res.status(500).json('erorr uwu', err)
  }
})


app.listen(8080, () => {
    console.log("Server started on port 8080")
});

