const express = require("express");
const { AdminLogin } = require("../controller/admin");


const router = express.Router();

router.post("/login",AdminLogin)


module.exports = router;