const express = require("express");
const {
  registerUserCtrl,
  loginUserCtrl,
} = require("../../controllers/users/usersCtrl");

const usersRouter = express.Router();

// ! Register
usersRouter.post("/api/v1/users/register", registerUserCtrl);
usersRouter.post("/api/v1/users/login", loginUserCtrl);

module.exports = usersRouter;
