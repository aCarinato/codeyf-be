import User from '../models/User.js';
import jwt from 'jsonwebtoken';
// import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';

import { sendEmail } from '../utils/sendEmail.js';

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const ses = new AWS.SES({ apiVersion: '2010-12-01' });

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

  // HTML Message
  const message = `
  <html lang="en">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    </head>
    <body>
      <div style="color: rgb(63, 80, 110); font-family: 'Montserrat', sans-serif; font-size: 16px; ">
        <p>Hi ${username}!</p>
        <p>Please click on the link below to verify your identity:</p>
        <a href='${process.env.CLIENT_URL}/login/activate/${token}' clicktracking=off>Confirm Account</a>
        <br></br>
        <p>Or copy and paste the following link in your browser</p>
        <p>${process.env.CLIENT_URL}/login/activate/${token}</p>
        <br></br>
        <p>If you do not click the verification link your account will not be activated.</p>
        <p>The link will expire in 7 days. If you try to activate after that time you need to re register (you can use the same credentials)</p>
      </div>
    </body>
  </html>
      `;
  //   <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  try {
    await sendEmail({
      to: email,
      subject: 'Welcome to Codeyful',
      text: message,
    });

    res.status(200).json({
      success: true,
      message: `
        <div className="center-text">
          <br></br>
          <br></br>
          <p>The verification link for your account <span className="submit-success-msg">has been sent to ${email}!</span> Follow the instructions there contained.<p>
          <br></br>
          <p>If you do not click the verification link your account <span className="submit-success-msg">will not be activated.</span></p>
          <br></br>
          <p>Please note the link <span className="submit-success-msg">will expire in 7 days.</span></p>
        </div>
        `,
    });
  } catch (err) {
    console.log(err);
  }

  // SEND EMAIL WITH AWS
  // const params = {
  //   Source: process.env.EMAIL_FROM,
  //   Destination: {
  //     ToAddresses: [email],
  //   },
  //   ReplyToAddresses: [process.env.EMAIL_TO],
  //   Message: {
  //     Body: {
  //       Html: {
  //         Charset: 'UTF-8',
  //         Data: `<html>
  //             <h1>Hello ${username}</h1>
  //             <p>Please verify your email address through thil link:</p>
  //             <a href='${process.env.CLIENT_URL}/login/activate/${token}'>Link</a>
  //             <p>${process.env.CLIENT_URL}/login/activate/${token}</p>
  //             <br></br>
  //             <p>The link will expire in 7 days. If you try to activate after that time you need to re register (you can use the same credentials)</p>
  //             </html>`,
  //       },
  //     },
  //     Subject: {
  //       Charset: 'UTF-8',
  //       Data: `DEI DESSOOOOO`,
  //     },
  //   },
  // };

  // const sendEmailOnRegister = ses.sendEmail(params).promise();
  // sendEmailOnRegister
  //   .then((data) => res.status(200).json({ success: true }))
  //   .catch((error) => console.log('ERRONE', error));

  // res.status(200).json({ success: true });
};

// @desc    Activate user account
// @route   POST /api/auth/signup/activate
// @access  Public
export const activateAccount = async (req, res) => {
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

// @desc    Request to reset forgotten password
// @route   PUT /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // check if user exist
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    res.status(500).json(err);
  }

  if (!existingUser) {
    return res.json({
      error:
        'User not found! Either the user does not exist or the entered email was mispelled. Please double check',
    });
  }

  // generate token with user name
  let token;
  token = jwt.sign({ email }, process.env.JWT_RESET_PASSWORD, {
    expiresIn: '1d',
  });
  const userID = existingUser._id;
  // console.log(userID);
  await User.updateOne({ _id: userID }, { $set: { resetPasswordLink: token } });
  const message = `
  <p>Please verify your email address through thil link:</p>
  <a href='${process.env.CLIENT_URL}/login/password/${token}' clicktracking=off>Link</a>
  <br></br>
  <p>The link will expire in 24 hours. If you try to reset after that time you need to repeat the procedure</p>`;
  //   <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  try {
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      text: message,
    });
    // this will be res.data
    res
      .status(200)
      .json({ success: true, message: `Email successfully sent to ${email}` });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password
// @access  Public
export const resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (!resetPasswordLink) {
    return res.json({
      error: 'Link not provided',
    });
  }

  // check if token is expired
  jwt.verify(
    resetPasswordLink,
    process.env.JWT_RESET_PASSWORD,
    async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error:
            'Expired link. Please repeat the reset procedure from start to get a new link. The link expires in 24 hours.',
        });
      }
      let existingUser;
      try {
        existingUser = await User.findOne({
          resetPasswordLink: resetPasswordLink,
        });
      } catch (err) {
        res.status(500).json(err);
      }

      if (!existingUser) {
        return res.json({
          error:
            'User not found! The password may have already been reset. Repeat the whole procedure',
        });
      }

      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(newPassword, 12);
      } catch (err) {
        res.status(500).json(err);
      }

      const userID = existingUser._id;
      await User.updateOne(
        { _id: userID },
        { $set: { password: hashedPassword, resetPasswordLink: '' } }
      );

      res.status(200).json({
        success: true,
        message: 'Password reset',
      });
    }
  );
};

// export const testEmail = async (req, res) => {
//   const { email } = req.body;

//   console.log(email);

//   // HTML Message
//   const message = `
//   <h1>You have requested a password reset</h1>
//   <p>Please make a put request to the following link:</p>
// `;
//   //   <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
//   try {
//     await sendEmail({
//       to: email,
//       subject: 'Password Reset Request',
//       text: message,
//     });

//     res.status(200).json({ success: true, data: 'Email Sent' });
//   } catch (err) {
//     console.log(err);
//   }
// };
