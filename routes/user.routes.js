const express = require('express');
const userController = require('../controller/user.controller');


const router = express.Router();
router.post("/api/user/register", userController.RegisterUser);
router.get("/api/user/getall", userController.findAll);
router.get("/api/user/get/:id", userController.findOneUser);
router.put("/api/user/update/:id", userController.updateUser);
router.delete("/api/user/remove/:id", userController.deleteUser);

module.exports = router;