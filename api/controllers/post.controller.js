

import  UserModel  from "../models/userModel.js";
import LandmarkModel from "../models/landMarkModels.js";
import  PostModel  from "../models/postModel.js";
import SavedPostModel from "../models/savedPostModel.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const getAllDescendants = async (locationId) => {
  // This recursive function fetches all descendants of a given location_id
  const descendants = [];
  
  const getDescendants = async (parentId) => {
    const children = await LandmarkModel.find({ parent: parentId }).select('_id');
    if (children.length > 0) {
      for (const child of children) {
        descendants.push(child);
        await getDescendants(child._id);
      }
    }
  };

  // Start with the provided locationId and fetch its descendants
  await getDescendants(locationId);

  return descendants;
};

const getPostsByLocation = async (locationIds) => {
  // Find the posts where location is a descendant of one of the locationIds
  return PostModel.find({ location: { $in: locationIds } });
};


export const getPosts = async (req, res) => {
  const locationIds = req.body.locationIds;
  console.log(req.body)
  try {
    const allDescendants = []
    locationIds.forEach(async locationId=>{
      console.log(locationId)
      const descendants = await getAllDescendants(locationId);
      descendants.push(new mongoose.Types.ObjectId(locationId));
      allDescendants.concat(descendants)
    })
    
    // Add the locationId itself, since it can be part of the result as well
    console.log(allDescendants )

    const posts = await getPostsByLocation(locationIds);

    console.log(posts)

    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const posts = await PostModel.findOne({_id:id}).populate('location');

    const token = req.cookies?.token;

    if (token) {
      await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await SavedPostModel.findOne({
            postId: id,
            userId: payload.id,
          });
          res.status(200).json({ ...posts.toObject(), isSaved: saved ? true : false });
        }
      });
    }else{
      res.status(200).json({ ...posts.toObject(), isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

const findOrCreateLandmark = async (name, type, parent = null) => {
  return await LandmarkModel.findOneAndUpdate(
    { name, type, parent },
    { name, type, parent },
    { new: true, upsert: true }
  );
};

const buildLandmarkHierarchy = async (postData) => {
  let parentLandmark = await LandmarkModel.findById(postData.location)
  for (const landmarkName of postData.landmarks) {
    if(landmarkName && landmarkName != ""){
      parentLandmark = await findOrCreateLandmark(landmarkName, 'landmark', parentLandmark._id);
    }
  }

  return parentLandmark;
};

export const addPost = async (req, res) => {
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;

  try {
    const location = await buildLandmarkHierarchy(postData);

    const newPostData = {
      ...postData,
      location: location._id,
      userId: tokenUserId,
      postDetail
    };

    const newPost = await PostModel.create(newPostData);
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};
export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await PostModel.findById(id);

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

