const express = require("express");
const { AddCategory, UpdateCategory, getCategoryById, getAllCategory, DeleteCategory } = require("../controller/category");

const router = express.Router();

router.post("/addCategory",AddCategory)
router.put("/category/:id",UpdateCategory)
router.delete("/category/:id",DeleteCategory)
router.get("/category/:id",getCategoryById)
router.get("/categories",getAllCategory)
module.exports = router;