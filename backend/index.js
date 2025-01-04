const express = require("express")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const patientRouter = require("./routes/patient-router")
const DoctorRouter = require("./routes/doctor-router")
const CategoryRouter = require("./routes/category-router")
const subCategoryRouter = require("./routes/subCategory-router")
const OrderRouter = require("./routes/order-router")
const AdminRouter = require("./routes/admin-router")
const checkAuthRouter = require("./routes/checkAuth-router")
const cron = require("node-cron");
const app = express()
const Port = 5000;
mongoose
  .connect("mongodb+srv://rishabh1234:EW5ibRCAbCDIt2vk@cluster0.uejtnl9.mongodb.net/DoctorApp")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.get('/',(req,res) => {
    res.send("Backend running on port 5000")
})

app.use("/api/",patientRouter );
app.use("/api/",DoctorRouter );
app.use("/api/",CategoryRouter );
app.use("/api/",subCategoryRouter );
app.use("/api/",OrderRouter );
app.use("/api/",checkAuthRouter);
app.use("/admin/api/", AdminRouter );

// Cron Job to Reset `totalMontly`
cron.schedule("0 0 1 * *", async () => {
  try {
    console.log("Running Cron Job: Resetting totalMontly for all doctors...");
    const result = await DoctorDB.updateMany({}, { totalMontly: 0 });
    console.log(`Cron Job Completed: ${result.modifiedCount} documents updated.`);
  } catch (error) {
    console.error("Error during Cron Job:", error);
  }
});



app.listen(Port, ()=>
console.log("Backend running on "+Port))
