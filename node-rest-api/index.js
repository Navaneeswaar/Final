const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const multer = require("multer")
const postRoute = require("./routes/posts")
const conversationRoute = require("./routes/conversations")
const messageRoute = require("./routes/messages")
const PORT=8800;
const path =require('path')

dotenv.config();
app.use(cors());

mongoose.connect(process.env.MONGO_URL) 
.then(()=> console.log("Connected to MongoDB"));

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, "public/images");
    },
    filename: (req,file,cb)=>{
        cb(null, req.body.name);
    }
});

const upload = multer({ storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/users" ,userRoute);
app.use("/api/auth" ,authRoute);
app.use("/api/posts" ,postRoute);
app.use("/api/conversations" ,conversationRoute);
app.use("/api/messages" ,messageRoute);


app.listen(PORT,()=>{
    console.log(`Back end server is Running! on http://localhost:${PORT}`)
});