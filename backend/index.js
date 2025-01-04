const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const nodeSchedule = require("node-schedule");
const { generateExcelReport } = require("./controller/generateExcel");

// Importing Routes
const patientRouter = require("./routes/patient-router");
const doctorRouter = require("./routes/doctor-router");
const categoryRouter = require("./routes/category-router");
const subCategoryRouter = require("./routes/subCategory-router");
const orderRouter = require("./routes/order-router");
const adminRouter = require("./routes/admin-router");
const checkAuthRouter = require("./routes/checkAuth-router");
const reportRouter = require("./routes/report-router");

const app = express();
const PORT = 5000;

// MongoDB Connection
mongoose
  .connect("mongodb+srv://rishabh1234:EW5ibRCAbCDIt2vk@cluster0.uejtnl9.mongodb.net/DoctorApp")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Base Route
app.get("/", (req, res) => {
  res.send("Backend running on port 5000");
});

// API Routes
app.use("/api/", patientRouter);
app.use("/api/", doctorRouter);
app.use("/api/", categoryRouter);
app.use("/api/", subCategoryRouter);
app.use("/api/", orderRouter);
app.use("/api/", checkAuthRouter);
app.use("/admin/api/", adminRouter);
app.use("/api/reports", reportRouter); // Route for generating reports


// Scheduled Job to Generate Excel Report on the Last Day of Each Month at 11 PM

nodeSchedule.scheduleJob(new Date(Date.now() + 1 * 60 * 1000), async () => {
  try {
    console.log("Generating Excel Report...");
    const filePath = await generateExcelReport();
    console.log("Excel Report Generated and Email Sent:", filePath);
  } catch (error) {
    console.error("Error during Excel Report Generation:", error);
  }
});


// Start the Server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
