const express = require("express");
const { registerUserCtrl } = require("../../controllers/users/usersCtrl");

const usersRouter = express.Router();

// ! Register
usersRouter.post("/api/v1/users/register", registerUserCtrl);

module.exports = usersRouter;
