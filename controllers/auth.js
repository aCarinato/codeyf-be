import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// @desc    Signup new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  //   console.log('CIAOOOOOO');

  //   console.log(req.body);
  const { username, email, password } = req.body;

  if (!username) {
    return res.json({
      error: 'Username not entered',
    });
  }

  if (!password || password.length < 7) {
    return res.json({
      error: 'Password at least 7 characters',
    });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    res.status(500).json(err);
  }

  if (existingUser) {
    return res.json({
      error: 'Username already in use. Please try with another one.',
    });
  }

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    res.status(500).json(err);
  }

  if (existingUser) {
    return res.json({
      error: 'Email already in use. Please try with another one.',
    });
  }

  // GENERATE TOKEN WITH USER, EMAIL AND PASSWORD
  let token;
  token = jwt.sign(
    { username, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: '7d',
    }
  );

  // SEND EMAIL
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html>
              <h1>Hello ${username}</h1>
              <p>Please verify your email address through thil link:</p>
              <a href='${process.env.CLIENT_URL}/login/activate/${token}'>Link</a>
              <p>${process.env.CLIENT_URL}/login/activate/${token}</p>
              <br></br>
              <p>The link will expire in 7 days. If you try to activate after that time you need to re register (you can use the same credentials)</p>
              </html>`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `DEI DESSOOOOO`,
      },
    },
  };

  const sendEmailOnRegister = ses.sendEmail(params).promise();
  sendEmailOnRegister
    // .then((data) => console.log('email submitted to ses', data))
    .then((data) => res.status(200).json({ success: true }))
    .catch((error) => console.log('ERRONE', error));

  res.status(200).json({ success: true });
};

// @desc    Activate user account
// @route   POST /api/auth/signup/activate
// @access  Public
export const activateAccount = async (req, res) => {
  // console.log('CIAOOOOO');
  // console.log(req.body);
  const token = req.body.token;
  if (token === null) {
    return res.status(401).json({
      error: 'ERROR: token not found',
    });
  }

  // console.log(req.body.token);
  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error:
            'Expired link. Please try again to register by entering username, email and password (they can be the same)',
        });
      }

      const { username, email, password } = jwt.decode(token);

      let existingUser;
      try {
        existingUser = await User.findOne({ email: email });
      } catch (err) {
        res.status(500).json(err);
      }

      if (existingUser) {
        // console.log('EXISTING USER FOUND HAHAH!');
        return res.status(401).json({
          error:
            'A user already registered with this email address. Please try with another one.',
        });
      }

      // User.findOne({ email }).exec((err, user) => {
      //   if (user) {
      //     return res
      //       .status(401)
      //       .json({ error: 'User already registered with this email' });
      //   }
      // });

      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 12);
      } catch (err) {
        res.status(500).json(err);
      }

      const createdUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      // console.log(createdUser);
      const newUser = await createdUser.save();

      res.status(200).json({
        success: true,
        newUser: {
          username: newUser.username,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          token: token,
        },
      });
    }
  );
};
