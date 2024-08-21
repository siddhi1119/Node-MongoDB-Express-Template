import bcrypt from 'bcrypt';
import {
  fetchUserFromEmailAndPassword,
  updatePassword,
  verifyCurrentPassword,
  verifyUserFromRefreshTokenPayload,
  createNewUser,
  createNewAdminUser,
  fetchUserFromEmail,
  fetchAdminFromEmailAndPassword,
  getBlockedUsers,
  // getAllSearchPosts,
  // getPostsByCategory,
  getAllPosts
} from '../services/authService.js';
import {
  generateAuthTokens,
  clearRefreshToken,
  verifyRefreshToken,
  generateAccessTokenFromRefreshTokenPayload,
} from '../services/tokenService.js';
import { OAuth2Client } from 'google-auth-library';
import httpStatus from 'http-status';
import APIError from '../utils/APIError.js';
import { UserModel } from '../models/index.js';
import { sendSuccessResponse } from '../utils/ApiResponse.js';
import postModel from '../models/postModel.js';
import axios from "axios";
import FormData from "form-data";



const register = async (req, res, next) => {
  const { firstName, lastName, hobby, role, loginCount, isBlock, gender, email, password, isAdminApproved, isDeleted } = req.body
  try {

    const newUser = await createNewUser({
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      hobby: hobby,
      email: email,
      password: password,
      role: role,
      loginCount: loginCount,
      isBlock: isBlock,
      isAdminApproved: isAdminApproved,
      isDeleted: isDeleted,
      source: "email"
    });
    const tokens = await generateAuthTokens(newUser)
    res.json({ user: newUser, tokens });
  } catch (error) {
    next(error);
  }
};

const registerAdmin = async (req, res, next) => {
  const { email, password, role } = req.body
  try {
    const newUser = await createNewAdminUser({
      email,
      password,
      role
    });
    const tokens = await generateAuthTokens(newUser)
    res.json({ user: newUser, tokens });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  const { title, image, description, category, likes, isLiked } = req.body
  try {
    let imageUrl;
    if (image) {
      const imgbbApiKey = process?.env?.IMGBB_API_KEY;
      const formData = new FormData();
      formData.append('image', image);

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        headers: {
          ...formData.getHeaders()
        },
        data: formData
      };
      const response = await axios.request(config);
      imageUrl = response?.data?.data?.display_url;
    }
    const createdBy = {
      id: req?.user._id,
      role: req?.user.role,
    };

    const newPost = await postModel.create({
      title: title,
      image: imageUrl,
      description: description,
      category: category,
      likes: likes,
      isLiked: isLiked,
      createdBy: createdBy
    })
    // res.json({post : newPost});
    return sendSuccessResponse(req, res, newPost)
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  const {postId} = req.params;
  const userId = req?.user?._id.toString();

  const likedBy = {
    id: userId,
    name: req?.user?.role === 'admin' ? req?.user?.email : req?.user?.firstName,
  };

  try{
    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
   
    const userHasLiked = post.likedBy.some(like=>like.userId?.toString()===userId);
    
    let updateOperations = {};
    if(userHasLiked){
      updateOperations = {
        $inc: { likes: -1 },
        $set: { isLiked: false },
        $pull: { likedBy: { userId: userId } }
      };
    } else {
      updateOperations = {
        $inc: { likes: 1 },
        $set: { isLiked: true },
        $push: { likedBy: { userId: likedBy.id , name : likedBy.name }}
      };   
    }
    const updatedPost = await postModel.findByIdAndUpdate(postId,updateOperations,{new:true});
    return sendSuccessResponse(req, res, updatedPost)
  } catch (error) {
    console.log(error);
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const user = await fetchUserFromEmailAndPassword(req.body);
    const tokens = await generateAuthTokens(user);
    res.json({ user, tokens });
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const user = await fetchAdminFromEmailAndPassword(req.body);
    const tokens = await generateAuthTokens(user);
    res.json({ user, tokens });
  } catch (error) {
    next(error);
  }
};

const fetchAllPost = async (req, res, next) => {
  try {
    const {searchString, category} = req.query;
    let query = {};

    if(searchString){
      const regex = new RegExp(searchString, 'i');
      query.$or = [{ title: regex }, { description: regex }];
    }

    
    if(category.length){
      // const categoriesArray = category ? category.split(',') : [];
      // const regexCategories = categoriesArray.map(category => new RegExp(category, 'i'));
      query.category = { $in: category };
    }
    const allPosts = await getAllPosts(query);
    return sendSuccessResponse(req, res, allPosts, allPosts?.length)
  } catch (error) {
    console.log(error);
    next(error);
  }
}

// const searchPost = async (req, res, next) => {
//   try {    
//     const {  searchString  } = req.body;
//     const post = await getAllSearchPosts(searchString);
//     return sendSuccessResponse(req, res, post, post?.length)
//   } catch (error) {
//     next(error);
//   }
// }

// const searchPostsByCategory = async (req, res, next) => {
//   try {    
//     const { category } = req.query;
//     const categoriesArray = category ? category.split(',') : [];
//     const post = await getPostsByCategory(categoriesArray);
//     return sendSuccessResponse(req, res, post, post?.length)
//   } catch (error) {
//     next(error);
//   }
// }

const fetchBlockedUsers = async (req, res, next) => {
  try {
    const blockedUsersData = await getBlockedUsers();
    // return res.json({ blockedUsers });
    return sendSuccessResponse(req, res, blockedUsersData, blockedUsersData?.length)
  } catch (error) {
    next(error);
  }
}

const UnblockedUsers = async (req, res, next) => {
  try {
    const userId = req?.params?.id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isBlock: false, loginCount: 0 } }, // Unblock the user and reset loginCount
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      throw new APIError(httpStatus.BAD_REQUEST, "User not found");
    }
    return sendSuccessResponse(req, res, updatedUser)
  } catch (error) {
    console.log(error);
    next(error);
  }
}

const logout = async (req, res, next) => {
  try {
    await clearRefreshToken(req.body.refreshToken);
    res.json({});
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    let refreshTokenPayload = await verifyRefreshToken(req.body.refreshToken);
    await verifyUserFromRefreshTokenPayload(refreshTokenPayload);
    let newAccessToken = await generateAccessTokenFromRefreshTokenPayload(
      refreshTokenPayload
    );

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await verifyCurrentPassword(req.authData.userId, req.body.password);
    await updatePassword(req.authData.userId, req.body.newPassword);

    res.json({});
  } catch (error) {
    next(error);
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const googleUserRegister = async (req, res, next) => {
  try {
    const { token } = req.body
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
    });
    const { name, email, picture } = ticket.getPayload();
    const newUser = await createNewUser({
      email: email,
      name: name,
      image: picture,
      source: "google"
    });
    const tokens = await generateAuthTokens(newUser)
    res.json({ user: newUser, tokens });
  } catch (error) {
    next(error);
  }

}
const googleUserLogin = async (req, res, next) => {
  try {
    console.log("dd")
    const { token } = req.body
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
    });
    const { email } = ticket.getPayload();
    const user = await fetchUserFromEmail({ email });
    const tokens = await generateAuthTokens(user);
    res.json({ user, tokens });
  } catch (error) {
    next(error);
  }
}

export default {
  login,
  loginAdmin,
  logout,
  refreshToken,
  resetPassword,
  register,
  registerAdmin,
  googleUserRegister,
  fetchBlockedUsers,
  UnblockedUsers,
  createPost,
  likePost,
  fetchAllPost,
  // searchPost,
  // searchPostsByCategory,
  googleUserLogin
}