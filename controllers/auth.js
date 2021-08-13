const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const env = require("dotenv").config();
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
var nodemailer = require("nodemailer");
const TempUser = require("../models/tempUser");
const user = require("../models/user");

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user signout successfully",
  });
};

exports.signup = async (req, res) => {
  console.log("----------------------------"+req.body.email)
  const { code, email } = await req.body;
  const data = await TempUser.findOne({email} );
  
//  await console.log("################-------------"+data.code)
  
  if (data!==null) {
    if (code === data.code) {
      let userData = await {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const user = new User(userData);
      user.save((err, u) => {
        if (err) {
          return res.status(400).json({
            error: "not able to register the user",
          });
        }
        TempUser.findOneAndDelete({email},(err,du)=>{
          if(err)
          {
            console.log(err)
          }
          else{
            console.log("deleted the temp user")
          }
        })
        return res.status(200).json(u);
      });
    }
    else{
      return res.status(404).json({
        error:"code is not valid"
      })
    }

  }
  else
  {
    return res.status(400).json({
      error:"unable to match or something went wrong"
    })
  }
};

exports.preSignup = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const vCode = Math.floor(1000 + (9999 - 1000) * Math.random());
  let userData = await {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    code: vCode,
  };
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: JSON.stringify(process.env.MAIL_ID),
    to: JSON.stringify(req.body.email),
    subject: "verification",
    html: JSON.stringify(vCode),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // return res.status(400).json({
      //   error:"not able to send email to verify"
      // })
      console.log("not able to send mail----------------------" + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  const user = new TempUser(userData);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: " Not able to save in db",
      });
    }
    res.json(user);
  });
};

exports.signin = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  console.log(user);
  if (user === null) {
    return res.status(400).json({
      error: "user doesn't exist",
    });
  } else {
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordCorrect) {
      //create Token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      //Put token into the users cookies
      res.cookie("token", token, {
        expire: new Date() + 10000,
      });
      //responce to frontend
      const { _id, name, email, role } = user;
      return res.json({ token, user: { _id, name, email, role } });
    } else {
      return res.status(400).json({
        error: "incorrect password",
      });
    }
  }
};

//Protected routs
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

//Custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      message: " Access denied",
    });
  }
  next();
};

exports.isAdmain = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(401).json({
      message: "You are not admin",
    });
  }
  next();
};
