const express = require("express");
const { AddPatient, UpdatePatient, getPatientById, getAllPatients, getPatientsByPhone, getPatientsByDoctorAndDate, checkPatientisNewByPhone } = require("../controller/patient");

const router = express.Router();

router.post("/patient/add",AddPatient)
router.put("/patient/:patientId",UpdatePatient)
router.get("/patient/:patientId",getPatientById)
router.get("/patients",getPatientsByPhone)
router.get("/allPatients",getAllPatients)
router.get("/patientsReport", getPatientsByDoctorAndDate);
router.get("/checkPatient/", checkPatientisNewByPhone);
module.exports = router;