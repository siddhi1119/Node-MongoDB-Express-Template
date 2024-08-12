
import { UserModel } from '../models/index.js';
import httpStatus from 'http-status';

import APIError from '../utils/APIError.js';
import bcrypt from 'bcrypt';


const createNewUser = async (user) => {
  const oldUser = await UserModel.findOne({ email: user.email.toLowerCase() });
  if (oldUser)
    throw new APIError(httpStatus.BAD_REQUEST, "Email already exists.")
  const newUser = await UserModel.create(user);
  if (!newUser)
    throw new APIError(httpStatus.BAD_REQUEST, "Oops...seems our server needed a break!")
  return newUser;
}

const createNewAdminUser = async ({ email, password, role }) => {

    const existingUser = await UserModel.findOne({ email: email.toLowerCase(),role :'admin'}).lean();
    console.log(existingUser);

    if(existingUser){
      throw new APIError(httpStatus.BAD_REQUEST, "Email is already registered as an admin");
    } else {

    const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'admin'
      });
      return newUser;
    }
    
}

const getBlockedUsers = async() =>{
  try {
    const blockedUsers = await UserModel.find({isBlock: true ,role : 'user',isDeleted : 'false'}).lean();
    console.log(blockedUsers);
    return blockedUsers;
  } catch (error) {
    throw new Error("Error fetching blocked users: " + error.message);
  }
}

const fetchUserFromEmailAndPassword = async ({ email, password }) => {
  try {
    const lowerCaseEmail = email.toLowerCase();

    const user = await UserModel.findOne({ email: lowerCaseEmail }).lean();
    // const admin = await adminModels.findOne({ email: lowerCaseEmail }).lean();
    
    if (!user && !admin) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Invalid credentials');
    }

    if (user.role === 'admin') {
      const adminPasswordMatches = await bcrypt.compare(password, admin.password);
      if (adminPasswordMatches) {
        return admin;
      }
    }

    if (user.role === 'user') {
      const userPasswordMatches = await bcrypt.compare(password, user.password);

      if (userPasswordMatches) {
        if (user.isBlock) {
          throw new APIError(httpStatus.BAD_REQUEST, 'Your account is blocked due to too many failed login attempts.');
        }

        if (!user.isAdminApproved) {
          throw new APIError(httpStatus.BAD_REQUEST, 'Your account is not approved. Please contact an admin for assistance.');
        }
        await UserModel.findOneAndUpdate({ email: user.email }, { $set: { loginCount: 0, isBlock: false } });
        return user;
      } else {
        const updatedLoginCount = user.loginCount + 1;
        const updateData = {
          loginCount: updatedLoginCount,
        };
        if (user.loginCount >= 5) {
          updateData.loginCount = 5;
          updateData.isBlock = true;
        }

        await UserModel.findOneAndUpdate({ email: user.email }, { $set: updateData });

        if (updateData.isBlock) {
          throw new APIError(httpStatus.BAD_REQUEST, 'Your account has been blocked due to too many failed login attempts.');
        }

        throw new APIError(httpStatus.BAD_REQUEST, 'Invalid credentials');

      }
    }
    throw new APIError(httpStatus.BAD_REQUEST, 'Invalid credentials');

  } catch (err) {
    throw new APIError(httpStatus.BAD_REQUEST, err.message || 'An error occurred');
  }
};


// const fetchUserFromEmailAndPassword = async ({ email, password }) => {
//   try {
//     const lowerCaseEmail = email.toLowerCase();

//     // Fetch both user and admin by email
//     const [user, admin] = await Promise.all([
//       UserModel.findOne({ email: lowerCaseEmail }).lean(),
//       adminModels.findOne({ email: lowerCaseEmail }).lean()
//     ]);

//     // Check for existence of either user or admin
//     if (!user && !admin) {
//       throw new APIError(httpStatus.BAD_REQUEST, 'Invalid credentials');
//     }

//     // Handle admin login
//     if (admin) {
//       const adminPasswordMatches = await bcrypt.compare(password, admin.password);
//       if (!adminPasswordMatches) {
//         throw new APIError(httpStatus.BAD_REQUEST, 'Invalid credentials');
//       }
//       return admin; // Admin successfully authenticated
//     }

//     // Handle user login
//     if (user) {
//       // Check for blocked status
//       if (user.isBlock) {
//         throw new APIError(httpStatus.BAD_REQUEST, 'Your account is blocked due to too many failed login attempts.');
//       }

//       // Check password match
//       const userPasswordMatches = await bcrypt.compare(password, user.password);
//       if (!userPasswordMatches) {
//         const updatedLoginCount = user.loginCount + 1;
//         const isBlocked = updatedLoginCount >= 5;

//         // Update login count and block status
//         await UserModel.findOneAndUpdate(
//           { email: user.email },
//           { $set: { loginCount: isBlocked ? 5 : updatedLoginCount, isBlock: isBlocked } }
//         );

//         if (isBlocked) {
//           throw new APIError(httpStatus.BAD_REQUEST, 'Your account has been blocked due to too many failed login attempts.');
//         }

//         throw new APIError(httpStatus.BAD_REQUEST, 'Invalid credentials');
//       }

//       // Check approval status and reset login count
//       if (!user.isAdminApproved) {
//         throw new APIError(httpStatus.BAD_REQUEST, 'Your account is not approved. Please contact an admin for assistance.');
//       }

//       await UserModel.findOneAndUpdate(
//         { email: user.email },
//         { $set: { loginCount: 0, isBlock: false } }
//       );

//       return user; // User successfully authenticated
//     }

//     throw new APIError(httpStatus.BAD_REQUEST, 'Invalid credentials');

//   } catch (err) {
//     throw new APIError(httpStatus.BAD_REQUEST, err.message || 'An error occurred');
//   }
// };



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
  fetchUserFromEmail,
  verifyUserFromRefreshTokenPayload,
  fetchUserFromAuthData,
  verifyCurrentPassword,
  updatePassword,
  createNewUser,
  createNewAdminUser,
  getBlockedUsers
};
