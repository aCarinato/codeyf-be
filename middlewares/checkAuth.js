import jwt from 'jsonwebtoken';
// import { expressjwt } from 'express-jwt';
import User from '../models/User.js';

export const requireSignin = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // console.log('token found');
    try {
      // console.log(req.headers.authorization);
      token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
        // async function (err, decoded) {
        //   if (err) {
        //     return res.status(401).json({
        //       error:
        //         'Expired link. Please repeat the reset procedure from start to get a new link. The link expires in 24 hours.',
        //     });
        //   }
        //   req.user = await User.findById(decodedToken._id).select('-password');
        //   // console.log(req.user);
        //   next();
        // }
      );
      req.user = await User.findById(decodedToken._id).select('-password');
      // console.log(req.user);
      next();
    } catch (err) {
      console.log(err);
      return res.status(403).send('Authentication failed!');
    }
  }

  if (!token) {
    console.log('token NOT found (by the middleware)');
    return res.status(401).send('Authentication failed. Token NOT found');
  }
};

export const requireAdmin = async (req, res, next) => {
  // console.log('SECONDO MIDDLEWARE');
  if (req.user && req.user.isAdmin) {
    // console.log('UN ADMIN');
    next();
  } else {
    // console.log('NOT UN ADMIN');
    return res.status(401).send('User not found or user is NOT AN ADMIN');
  }
};
