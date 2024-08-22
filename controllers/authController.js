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
import { sendError, sendSuccessResponse } from '../utils/ApiResponse.js';


const register = async (req, res) => {
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
    return sendError(error, req, res, 400);
  }
};

const registerAdmin = async (req, res) => {
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
    return sendError(error, req, res, 400);
  }
};

const login = async (req, res) => {
  try {
    const user = await fetchUserFromEmailAndPassword(req.body);
    const tokens = await generateAuthTokens(user);
    res.json({ user, tokens });
  } catch (error) {
    return sendError(error, req, res, 400);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const user = await fetchAdminFromEmailAndPassword(req.body);
    const tokens = await generateAuthTokens(user);
    res.json({ user, tokens });
  } catch (error) {
    return sendError(error, req, res, 400);
  }
};

const fetchBlockedUsers = async (req, res) => {
  try {
    const blockedUsersData = await getBlockedUsers();
    return sendSuccessResponse(req, res, blockedUsersData, blockedUsersData?.length)
  } catch (error) {
    return sendError(error, req, res, 400);
  }
}

const UnblockedUsers = async (req, res) => {
  try {
    const userId = req?.params?.id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isBlock: false, loginCount: 0 } }, 
      { new: true } 
    );

    if (!updatedUser) {
      throw new APIError(httpStatus.BAD_REQUEST, "User not found");
    }
    return sendSuccessResponse(req, res, updatedUser)
  } catch (error) {
    console.log(error);
    return sendError(error, req, res, 400);
  }
}

const logout = async (req, res) => {
  try {
    await clearRefreshToken(req.body.refreshToken);
    res.json({});
  } catch (error) {
    return sendError(error, req, res, 400);
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
  googleUserLogin
}