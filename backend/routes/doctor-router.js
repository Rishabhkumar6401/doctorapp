const express = require("express");
const { AddDoctor, UpdateDoctor, DeleteDoctor, GetDoctorById, GetAllDoctors } = require("../controller/doctor");
const router = express.Router();

router.post('/doctor/add',AddDoctor);
router.put('/doctor/:doctorId',UpdateDoctor);
router.delete('/doctor/:doctorId',DeleteDoctor);
router.get('/doctor/:doctorId',GetDoctorById);
router.get('/doctors',GetAllDoctors);

module.exports = router;

