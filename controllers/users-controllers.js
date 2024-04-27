const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');
require('dotenv').config();

//Register new user
const registerUser =async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(name, email, password);
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: passwordHash });

      const accessToken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      await user.save();

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      //    res.json({ accesstoken });
      return res.status(200).json({
        msg: "User created Successfully",
        token: accessToken,
        refreshtoken: refreshtoken,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
}
//Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email,password)
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect Password" });

    const accesstoken = createAccessToken({ id: user._id });
    const refreshtoken = createRefreshToken({ id: user._id });

    console.log("ACCESS TOKEN : ", accesstoken);

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      path: "/user/refresh_token",
    });

    res.json({ accesstoken });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Update users password
const updateUserPassword = async ( req, res ) => {

    const { password, token } = req.body;

    let user;
    try{
        user = await User.findOne({resetToken: token, expToken: {$gt: Date.now()}})
    }catch(err){
        console.error(err.message);
        res.status(500).send({ msg: 'Server Error, could not find the user' });
    }

    if(!user){
        return res.status(403).json({ msg: 'Could not find user, or the time is expired'});
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    }catch(err){
        console.error(err.message);
        res.status(500).send({ msg: 'Server Error' });
    }

    try{
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expToken = undefined;
        await user.save();
    }catch(err){
        console.error(err.message);
        res.status(500).send({ msg: 'Server Error, could not save new passowrd' });
    }
};
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: "1d" });
  };
  
  const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: "7d" });
  };

  
exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.updateUserPassword = updateUserPassword;
