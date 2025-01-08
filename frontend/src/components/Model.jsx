import React, { useEffect } from "react";
import { format } from "date-fns";
import { fetchDoctorById } from "../store/doctor";
import { useDispatch, useSelector } from 'react-redux';

const Modal = ({ isOpen, onClose, selectedOrder }) => {
  const dispatch = useDispatch();

  // Get doctor details and subcategory from the Redux store
  const doctorDetails = useSelector((state) => state.doctors.doctorDetails);
  const { subcategory, loading } = useSelector((state) => state.subcategory);

  useEffect(() => {
    if (!selectedOrder) return;

    // Fetch doctor details if referredBy is not 0
    if (selectedOrder.referredBy !== 0) {
      dispatch(fetchDoctorById(selectedOrder.referredBy));
    }
  }, [dispatch, selectedOrder]);

  if (!isOpen) return null;

  const doctorName = selectedOrder.referredBy === 0 || !doctorDetails ? "None" : doctorDetails?.name;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-3/4 max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div className="space-y-4">
            <p><strong className="font-medium">Serial No:</strong> {selectedOrder.serialNo}</p>
            <p><strong className="font-medium">Patient Name:</strong> {selectedOrder.name}</p>
            <p><strong className="font-medium">Patient Phone No:</strong> {selectedOrder.phoneNo}</p>
            <p><strong className="font-medium">Patient Age:</strong> {selectedOrder.age}</p>
            <p><strong className="font-medium">Date:</strong> {format(new Date(selectedOrder.createdAt), "yyyy-MM-dd")}</p>
            <p><strong className="font-medium">Doctor:</strong> {doctorName}</p>
            <p><strong className="font-medium">Category:</strong> {selectedOrder.category}</p>
          </div>

          <div className="space-y-4">
            <p><strong className="font-medium">Patient Address:</strong> {selectedOrder.address}</p>
            <p><strong className="font-medium">SubCategory:</strong> {selectedOrder.subcategory}</p>
            <p><strong className="font-medium">Referral Fees:</strong> {selectedOrder.referralFee}</p>
            <p><strong className="font-medium">Fees:</strong> {selectedOrder.fees}</p>
            <p><strong className="font-medium">Discount:</strong> {selectedOrder.discount}</p>
            <p><strong className="font-medium">Final Payment:</strong> {selectedOrder.finalPayment}</p>
            {selectedOrder.referredBy !== 0 && (
              <p><strong className="font-medium">Doctor Commission:</strong> {selectedOrder.referralFee - selectedOrder.discount}</p>
            )}
            <p><strong className="font-medium">Payment Mode:</strong> {selectedOrder.paymentMode}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
