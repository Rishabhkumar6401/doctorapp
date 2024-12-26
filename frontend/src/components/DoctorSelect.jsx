import React, { useState } from "react";

const DoctorSelect = ({ doctors, formData, handleInputChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(formData.referredBy || "");

  // Filter logic for search
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const handleSelect = (doctorId, doctorName) => {
    setSelectedDoctor(doctorName);
    handleInputChange({ target: { name: "referredBy", value: doctorId } });
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Select Button */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:border-blue-500"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className="text-gray-700">
          {selectedDoctor || "-- Select Doctor --"}
        </span>
        <i
          className={`uil uil-angle-down transition-transform duration-300 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        ></i>
      </div>

      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search Bar */}
          <div className="relative p-2">
            <i className="uil uil-search absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search Doctor"
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
              className="w-full px-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Options List */}
          <ul className="max-h-56 overflow-y-auto">
            {filteredDoctors.map((doctor) => (
              <li
                key={doctor._id}
                className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-blue-100"
                onClick={() => handleSelect(doctor._id, doctor.name)}
              >
                {doctor.name}
              </li>
            ))}
            {filteredDoctors.length === 0 && (
              <li className="px-4 py-2 text-gray-500">No doctors found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoctorSelect;
