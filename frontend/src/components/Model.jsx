import React, { useEffect } from "react";
import { format } from "date-fns";
import { fetchDoctorById } from "../store/doctor"; 
import { fetchSubcategoryDetail } from '../store/subcategories';
import { useDispatch, useSelector } from 'react-redux';

const Modal = ({ isOpen, onClose, selectedOrder }) => {
  const dispatch = useDispatch();

  // Get doctor details and subcategory from the Redux store
  const doctorDetails = useSelector((state) => state.doctors.doctorDetails);
  const subcategory = useSelector((state) => state.subcategory.subcategory);

  useEffect(() => {
    if (!selectedOrder) return;

    // Clear previous subcategory details before fetching new ones
    dispatch(fetchSubcategoryDetail(null)); // Reset subcategory to null

    // Fetch doctor and subcategory details if valid
    if (selectedOrder.referredBy !== 0) {
      dispatch(fetchDoctorById(selectedOrder.referredBy));
    }
    if (selectedOrder.subcategory) {
      dispatch(fetchSubcategoryDetail(selectedOrder.subcategory));
    }
  }, [dispatch, selectedOrder]); // Re-run effect when selectedOrder changes

  if (!isOpen) return null; // If modal is not open, return nothing

  // Get doctor name and subcategory name, show 'None' if referredBy is 0 or invalid
  const doctorName = selectedOrder.referredBy === 0 || !doctorDetails ? "None" : doctorDetails?.name;
  const subcategoryName = subcategory?.name || "N/A";

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="mb-4">
          <p><strong>Serial No:</strong> {selectedOrder.serialNo}</p>
          <p><strong>Patient Name:</strong> {selectedOrder.name}</p>
          <p><strong>Patient PhoneNo:</strong> {selectedOrder.phoneNo}</p>
          <p><strong>Patient Age:</strong> {selectedOrder.age}</p>
          <p><strong>Patient Address:</strong> {selectedOrder.address}</p>
          <p><strong>Date:</strong> {format(new Date(selectedOrder.createdAt), "yyyy-MM-dd")}</p>
          <p><strong>Doctor:</strong> {doctorName}</p> {/* Display doctor name or 'None' */}
          <p><strong>Category:</strong> {selectedOrder.category}</p>
          <p><strong>SubCategory:</strong> {subcategoryName}</p> {/* Display subcategory name */}
          <p><strong>Referral Fees:</strong> {selectedOrder.referralFee}</p>
          <p><strong>Fees:</strong> {selectedOrder.fees}</p>
          <p><strong>Discount:</strong> {selectedOrder.discount}</p>
          <p><strong>Final Payment:</strong> {selectedOrder.finalPayment}</p>
          {selectedOrder.referredBy !== 0 && (
  <p><strong>Doctor Commission:</strong> {selectedOrder.referralFee - selectedOrder.discount}</p>
)}
          <p><strong>Payment Mode:</strong> {selectedOrder.paymentMode}</p>
        </div>

        <div className="flex justify-end gap-4">
          
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
