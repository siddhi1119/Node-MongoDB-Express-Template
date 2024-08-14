
import { UserModel } from '../models/index.js';
import httpStatus from 'http-status';

import APIError from '../utils/APIError.js';
import bcrypt from 'bcrypt';
import { systemRoles } from '../utils/constant.js';


const createNewUser = async (user) => {
  const oldUser = await UserModel.findOne({ email: user.email.toLowerCase(), role: systemRoles.USER }).lean();
  if (oldUser)
    throw new APIError(httpStatus.BAD_REQUEST, "Email already exists.")
  const newUser = await UserModel.create(user);
  if (!newUser)
    throw new APIError(httpStatus.BAD_REQUEST, "Oops...seems our server needed a break!")
  return newUser;
}

const createNewAdminUser = async ({ email, password, role }) => {
  const existingUser = await UserModel.findOne({ email: email.toLowerCase(), role: systemRoles.ADMIN }).lean();  
  if (existingUser) {
    throw new APIError(httpStatus.BAD_REQUEST, "Email is already registered as an admin");
  } else {
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      password: password,
      role: role || 'admin'
    });
    return newUser;
  }
}

const getBlockedUsers = async () => {
  try {
    const blockedUsers = await UserModel.find({ isBlock: true, role: systemRoles.USER , isDeleted :false}).lean();       
    return blockedUsers;
  } catch (error) {   
    throw new Error("Error fetching blocked users: " + error.message);
  }
}




const fetchAdminFromEmailAndPassword = async ({ email, password }) => {
  try {
    const lowerCaseEmail = email.toLowerCase();
    const admin = await UserModel.findOne({ email: lowerCaseEmail, role: systemRoles.ADMIN }).lean();

    if (!admin) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Invalid credentials');
    }
    const adminPasswordMatches = await bcrypt.compare(password, admin.password);    
    if (!adminPasswordMatches) {
       throw new APIError(httpStatus.BAD_REQUEST, 'Invalid credentials');      
    }
    return admin;  
  } catch (err) {
    console.log(err);
    throw new APIError(httpStatus.BAD_REQUEST, err.message || 'An error occurred');
  }
};

const fetchUserFromEmailAndPassword = async ({ email, password }) => {
  try {
    
    const lowerCaseEmail = email.toLowerCase();
    const user = await UserModel.findOne({ email: lowerCaseEmail, role: systemRoles.USER }).lean();
    if (!user) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Invalid credentials');
    }
    
    const userPasswordMatches = await bcrypt.compare(password, user.password);
    if (!userPasswordMatches) {
      const updatedLoginCount = user.loginCount + 1;
      const updateData = {
        loginCount: updatedLoginCount,
      };
      if (updatedLoginCount >= 5) {
        updateData.loginCount = 5;
        updateData.isBlock = true;
      }
      
      await UserModel.findOneAndUpdate({ email: user.email,role: systemRoles.USER }, { $set: updateData }, { new: true });
      

      if (updateData.isBlock) {
        throw new APIError(httpStatus.BAD_REQUEST, 'Your account has been blocked due to too many failed login attempts.');
      }

      throw new APIError(httpStatus.BAD_REQUEST, 'Invalid credentials');
    }
    if (user.isBlock) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Your account is blocked due to too many failed login attempts.');
    }

    if (!user.isAdminApproved) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Your account is not approved. Please contact an admin for assistance.');
    }

    await UserModel.findOneAndUpdate({ email: user.email }, { $set: { loginCount: 0, isBlock: false } });
    return user;
  } catch (err) {
    console.log(err);
    throw new APIError(httpStatus.BAD_REQUEST, err.message || 'An error occurred');
  }
};




const fetchUserFromEmail = async ({ email }) => {
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
  })
    .lean();

  if (!user)
    throw new APIError(httpStatus.BAD_REQUEST, 'please sign up - this email does not exist');

  return user;
};

const verifyUserFromRefreshTokenPayload = async ({ userId }) => {
  const userExists = await UserModel.exists({
    _id: userId,
  });

  if (!userExists)
    throw new APIError(httpStatus.FORBIDDEN, 'Invalid Refresh Token - logout');
};

const fetchUserFromAuthData = async ({ userId }) => {
  const user = await UserModel.findOne({
    _id: userId,
  })
    .lean();

  if (!user)
    throw new APIError(httpStatus.UNAUTHORIZED, 'invalid access token user');

  return user;
};

const verifyCurrentPassword = async (userId, password) => {
  const user = await UserModel.findOne({
    _id: userId,
  })
    .select('password')
    .lean();

  let passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches)
    throw new APIError(httpStatus.BAD_REQUEST, 'invalid current password');
};

const updatePassword = async (userId, newPassword) => {
  let newHash = await bcrypt.hash(newPassword, 10);

  let user = await UserModel.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      password: newHash,
    },
    {
      new: true,
    }
  );

};



export {
  fetchUserFromEmailAndPassword,
  fetchAdminFromEmailAndPassword,
  fetchUserFromEmail,
  verifyUserFromRefreshTokenPayload,
  fetchUserFromAuthData,
  verifyCurrentPassword,
  updatePassword,
  createNewUser,
  createNewAdminUser, 
  getBlockedUsers
};
