const express = require("express");
const { generateExcelReport } = require("../controller/generateExcel");

const router = express.Router();

router.get("/generate", async (req, res) => {
  try {
    const filePath = await generateExcelReport();
    res.status(200).send({ message: "Report Generated", filePath });
  } catch (error) {
    res.status(500).send({ message: "Error Generating Report", error });
  }
});

module.exports = router;
