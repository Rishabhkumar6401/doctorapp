const express = require("express");
const checkAdminAuth = require("../middleware/checkAdminAuth");


const router = express.Router();


router.get("/checkauth",checkAdminAuth, (req, res) => {
    const admin = req.admin;
    res.json({ success:true,
        message: 'Admin is authenticated', admin:admin.admin.username });})
module.exports = router;