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


app.listen(Port, ()=>
console.log("Backend running on "+Port))
