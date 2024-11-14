import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js";
import connectDB  from "./config/db.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import LandmarkModel from "./models/landMarkModels.js";

dotenv.config();
const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',  // Allow only this specific origin
  credentials: true,                // Allow cookies and credentials
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

async function getLandmarkHierarchy(parentId = null) {
  // Find all landmarks with the given parentId
  const landmarks = await LandmarkModel.find({ parent: parentId });

  // Recursively fetch children for each landmark
  for (let landmark of landmarks) {
    landmark._doc.children = await getLandmarkHierarchy(landmark._id); // Add children property dynamically
  }

  return landmarks;
}


app.use("/api/fillData", async (req, res)=>{
  // console.log(req.body);
  // await buildLandmarkHierarchy(req.body);
  const hierarchy = await getLandmarkHierarchy("6733de728924507706bafc83", 10)
  return res.json({hierarchy});
});
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  connectDB();
  bcrypt.genSalt(10, (err,salt)=>{
    console.log(salt);
  })
  console.log("Server is running!");
});
