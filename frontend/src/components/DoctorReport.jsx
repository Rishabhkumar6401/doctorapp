"use client"; // Add this directive at the top

import React, { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main CSS file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import { format } from "date-fns";

const DoctorReport = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorDiscount, setDoctorDiscount] = useState();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [patients, setPatients] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/doctors");
        const data = await response.json();
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const calculateTotalCommission = () => {
    return patients.reduce((total, patient) => {
      const commission = patient.referralFee - (patient.discount || 0);
      return total + commission;
    }, 0);
  };

  const handleSubmit = async () => {
    if (!selectedDoctor) {
      alert("Please select a doctor!");
      return;
    }
  
    const { startDate, endDate } = dateRange[0];
  
    try {
      // Fetch patients report
      const reportResponse = await fetch(
        `http://localhost:5000/api/patientsReport?doctorId=${selectedDoctor}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const reportData = await reportResponse.json();
  
      // Update patients state
      setPatients(reportData.patients || []);
  
      // Fetch doctor data
      const doctorResponse = await fetch(`http://localhost:5000/api/doctor/${selectedDoctor}`);
      const doctorData = await doctorResponse.json();
  
      // Update doctor discount
      setDoctorDiscount(doctorData.doctor.discount || 0);
  
      // Show table
      setShowTable(true);
      window.scrollTo({
        top: window.scrollY + 200, // Adjust the 200 value to control how much the page scrolls
        behavior: "smooth", // Smooth scroll effect
      });
    } catch (error) {
      console.error("Error fetching patients or doctor data:", error);
    }
  };

  // Filter doctors based on the search query
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center p-4 space-y-8 mt-24">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Doctor Report</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="doctor">Select Doctor</Label>
            <Select onValueChange={setSelectedDoctor}>
              <SelectTrigger id="doctor">
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                <Input
                  type="text"
                  placeholder="Search doctor"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                  className="border border-gray-300 p-2 mb-2"
                />
                <SelectItem value="0">None</SelectItem>
                {filteredDoctors.map((doctor) => (
                  <SelectItem key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label>Date Range</Label>
            <DateRangePicker
              onChange={(item) => setDateRange([item.selection])}
              ranges={dateRange}
              rangeColors={["#3b82f6"]}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>

      {showTable && (
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Patient Report</h2>
        {patients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left">Serial No</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Patient Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">SubCategory</th>
                  <th className="border border-gray-200 px-12 py-2 text-left">Date</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Price</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Discount</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Final Payment</th>
                  {selectedDoctor !== "0" && (
                    <th className="border border-gray-200 px-4 py-2 text-left">Referral Fee</th>
                  )}
                  {selectedDoctor !== "0" && (
                    <th className="border border-gray-200 px-4 py-2 text-left">Commission</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => {
                  const commission = patient.referralFee - patient.discount;
                  return (
                    <tr key={patient._id}>
                      <td className="border border-gray-200 px-4 py-2">{patient.serialNo}</td>
                      <td className="border border-gray-200 px-4 py-2">{patient.name}</td>
                      <td className="border border-gray-200 px-4 py-2">{patient.subcategory}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        {format(new Date(patient.createdAt), "yyyy-MM-dd")}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">{patient.fees}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        {patient.discount !== null && patient.discount !== undefined
                          ? patient.discount
                          : "None"}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">{patient.finalPayment}</td>
                      {selectedDoctor !== "0" && (
                        <td className="border border-gray-200 px-4 py-2">{patient.referralFee}</td>
                      )}
                      {selectedDoctor !== "0" && (
                        <td className="border border-gray-200 px-4 py-2">{commission}</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              {selectedDoctor !== "0" && (
                <tfoot>
                  <tr>
                    <td
                      colSpan="8"
                      className="border border-gray-200 px-4 py-2 font-bold text-right"
                    >
                      Total Commission Earned:
                    </td>
                    <td className="border border-gray-200 px-4 py-2 font-bold">
                      {calculateTotalCommission()}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center bg-gray-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Results Found</h3>
            <p className="text-gray-600">
              We couldn't find any records matching the selected criteria. Please try again with different filters.
            </p>
          </div>
        )}
      </div>
      
      )}
    </div>
  );
};

export default DoctorReport;
