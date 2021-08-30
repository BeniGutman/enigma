const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const generateAccessToken = (userId) => {
  const newAccessToken = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m', // 15 minutes
    }
  );
  return newAccessToken;
};

exports.register = async (req, res) => {
  const { email, password, userName } = req.body;

  let user;
  user = await User.findOne({
    where: {
      [Op.or]: [{ email }, { userName }],
    },
  });

  if (user) {
    const error = new Error('user already exists');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

  user = await User.create({
    email,
    password: hashedPassword,
    userName,
  });
  return res.status(201).send({ success: true });
};

exports.login = async (req, res) => {
  const { userName, password } = req.body;

  const user = await User.findOne({
    where: {
      userName,
    },
  });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    const error = new Error('wrong username or password');
    error.statusCode = 400;
    throw error;
  }

  const newAccessToken = generateAccessToken(user.id);

  const newRefreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET
  );

  return res.send({
    auth: true,
    userId: user.id,
    userName: user.userName,
    email: user.email,
    token: newAccessToken,
    expiresIn: 15 * 60, // 15 minutes
    refreshToken: newRefreshToken,
  });
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.body.token;
  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        const error = new Error('token not valid');
        error.statusCode = 403;
        throw error;
      }

      const newAccessToken = generateAccessToken(user.id);
      return res.status(201).send({
        accessToken: newAccessToken,
        expiresIn: 15 * 60, // 15 minutes
      });
    }
  );
};

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('No token provided');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      const error = new Error('Failed to authenticate token');
      error.statusCode = 500;
      throw error;
    } else {
      req.userId = user.id;
      next();
    }
  });
};
