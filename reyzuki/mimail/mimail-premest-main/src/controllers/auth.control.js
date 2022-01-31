const User = require("../models/user.model");

const handlErrors = (err) => {
  let errors = { username: "", password: "", msg: "" };

  if (err.message === "incorrect username") {
    errors.username = err.message;
  }

  if (err.message === "incorrect password") {
    errors.password = err.message;
  }

  if (err.code === 11000) {
    errors.username = "the username is not available";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const userCtrl = {};

userCtrl.signup = async function (req, res) {
  const { username, password } = req.body;

  try {
    let user = await User.create({ username, password });

    res.status(201).json(user);
  } catch (error) {
    const errObj = handlErrors(error);
    res.status(400).json(errObj);
  }
};

userCtrl.login = async function (req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);

    res.status(200).json(user);
  } catch (error) {
    const errMsg = handlErrors(error);
    res.status(400).json(errMsg);
  }
};

module.exports = userCtrl;
