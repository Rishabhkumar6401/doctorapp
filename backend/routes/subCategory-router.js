const express = require("express");
const { AddSubCategory, UpdateSubCategory, DeleteSubCategory, getSubCategoryById, getAllSubCategory, getSubCategoryByCategory } = require("../controller/subCategory");


const router = express.Router();

router.post("/addSubCategory",AddSubCategory)
router.put("/subcategory/:id",UpdateSubCategory)
router.delete("/subcategory/:id",DeleteSubCategory)
router.get("/subcategory/:id",getSubCategoryById)
router.get("/subcategory",getSubCategoryByCategory)
router.get("/subcategories",getAllSubCategory)
module.exports = router;