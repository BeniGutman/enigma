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
    return res.status(400).send({ error: 'user already exists' });
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
    return res.status(400).send({ error: 'wrong username or password' });
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
    refreshToken: newRefreshToken,
  });
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).send({ error: 'token is needed' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ error: 'token not valid' });
    }

    const newAccessToken = generateAccessToken({ id: user.id });
    return res.status(201).send({ accessToken: newAccessToken });
  });
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate token.' });
    } else {
      req.userId = user.id;
      next();
    }
  });
};
