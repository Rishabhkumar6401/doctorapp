import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPhoneNo, fetchPatients, setIsNewEntry, } from '../../store/patient';
import { useNavigate } from 'react-router-dom';

const Patient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchInitiated, setSearchInitiated] = useState(false);
  const { phoneNo, patients, isNewEntry, loading } = useSelector((state) => state.patient);

  // Local state to handle phone validation message and selected patient
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handlePhoneNoChange = (e) => {
    const phone = e.target.value;
    dispatch(setPhoneNo(phone));
    setErrorMessage(''); // Reset error message when the user types
  };

  useEffect(() => {
    if (searchInitiated && !loading) {
      if (patients.length === 0) {
        dispatch(setIsNewEntry(true));
        navigate('/patient-form', { state: { patient: null, phoneNo:phoneNo } });
      } else if (patients.length === 1) {
        dispatch(setIsNewEntry(false));
        setSearchInitiated(false);
      } else if (patients.length > 1) {
        dispatch(setIsNewEntry(false));
        setSearchInitiated(false);
      }
    }
  }, [patients, searchInitiated, navigate, loading]);

  
 

  const handleSearch = async (e) => {
    e.preventDefault();

    // Phone number validation
    if (phoneNo.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }
    setSearchInitiated(true);
    await dispatch(fetchPatients(phoneNo));
  };

  const handlePatientSelection = (e) => {
    const patientId = e.target.value;

    
    if (patientId === "new") {
     
      // Handle new patient selection
      setSelectedPatient("new");  // Set to "new" to indicate a new patient
    } else {
      const selected = patients.find((patient) => patient._id === patientId);
      setSelectedPatient(selected);  // Set selected patient object
    }
  };
  

  const handleProceed = () => {
  
    if (selectedPatient) {
      // If a patient is selected (not "new"), proceed with the selected patient
      dispatch(setIsNewEntry(false));
      navigate('/patient-form', { state: { patient: selectedPatient } });
    }
  
    if (selectedPatient === "new") {
      dispatch(setIsNewEntry(true));
      // If the "New Patient with same Number" option is selected, proceed with phoneNo
      navigate('/patient-form', { state: { patient: null, phoneNo: phoneNo } });
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute right-4 top-24 hidden lg:block">
        <img src="./src/assets/pateint.svg" alt="Patient" className="w-[39rem] h-[36rem]" />
      </div>

      <form className="w-full max-w-md px-4 sm:px-0" onSubmit={handleSearch}>
        <label
          htmlFor="phone-input"
          className="block mb-2 text-lg font-medium text-gray-900 dark:text-white text-center"
        >
          Search Patient by Phone Number
        </label>
        <div className="relative">
          <input
            type="text"
            id="phone-input"
            className="block w-full p-4 pl-12 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="1234567890"
            pattern="^\d{10}$"
            value={phoneNo}
            onChange={handlePhoneNoChange}
            required
          />

          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 19 18"
            >
              <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
            </svg>
          </div>
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Error message for phone number validation */}
        {errorMessage && (
          <p className="text-red-500 text-xs mt-1">
            {errorMessage}
          </p>
        )}
      </form>

      {/* Dropdown for multiple patients */}
     {/* Dropdown for multiple patients */}
{patients.length >= 1 && (
  <div className="mt-4 w-full max-w-md">
    <label
      htmlFor="patient-select"
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Select a Patient
    </label>
    <select
  id="patient-select"
  className="block w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
  onChange={handlePatientSelection}
  value={selectedPatient?._id || selectedPatient || ""}  // Default to 'new' if no patient is selected
>
  <option value="" disabled>
    Select a patient
  </option>
  <option value="new">
    New Patient with same Number
  </option>
  {patients.map((patient) => (
    <option key={patient._id} value={patient._id}>
      {patient.name}
    </option>
  ))}
</select>

    <button
      onClick={handleProceed}
      className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-500"
      disabled={!selectedPatient}
    >
      Proceed to Patient Form
    </button>
  </div>
)}

    </div>
  );
};

export default Patient;
