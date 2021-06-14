const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

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

  return res.send({
    auth: true,
    userId: user.id,
    userName: user.userName,
    email: user.email,
  });
};
