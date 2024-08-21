import APIError from '../utils/APIError.js';
import {
  UserModel,
  RefreshTokenModel,
} from '../models/index.js';
import httpStatus from 'http-status';
import { tokenTypes } from '../config/tokens.js';
import { verify } from '../utils/jwtHelpers.js';
import { systemRoles } from '../utils/constant.js';


const isActiveUser = async (req, res, next) => {
  try {
    const accessToken = req.get('Authorization');
    if (!accessToken)
      throw new APIError(httpStatus.UNAUTHORIZED, 'Invalid Access Token');

    let tokenPayload = await verify(accessToken, process.env.JWT_SECRET);
    if (!tokenPayload || tokenPayload.type !== tokenTypes.ACCESS)
      throw new APIError(httpStatus.UNAUTHORIZED, 'Invalid Access Token');

    let userExists = await UserModel.findOne({
      _id: tokenPayload.userId,
      isDeleted: false,
      isBlock: false,
      role: systemRoles.USER
    });

    if (!userExists)
      throw new APIError(httpStatus.FORBIDDEN, 'Invalid Access Token - logout');;

    req.authData = tokenPayload;
    req.user = userExists;
    req.body.createdBy = userExists;
    next();
  } catch (error) {
    next(error);
  }
};

const isActiveAdmin = async (req, res, next) => {
  try {
    const accessToken = req.get('Authorization');
    if (!accessToken)
      throw new APIError(httpStatus.UNAUTHORIZED, 'Invalid Access Token');

    let tokenPayload = await verify(accessToken, process.env.JWT_SECRET);
    if (!tokenPayload || tokenPayload.type !== tokenTypes.ACCESS){
      throw new APIError(httpStatus.UNAUTHORIZED, 'Invalid Access Token');}

    let userExists = await UserModel.findOne({
      _id: tokenPayload.userId,
      isDeleted: false,
      isBlock: false,
      role: systemRoles.ADMIN
    });

    if (!userExists)
      throw new APIError(httpStatus.FORBIDDEN, 'Invalid Access Token - logout');;

    req.authData = tokenPayload;
    req.user = userExists;
    req.body.createdBy = userExists;
    
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export { isActiveUser,isActiveAdmin };
