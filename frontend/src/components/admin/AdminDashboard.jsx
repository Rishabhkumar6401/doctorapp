import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../store/doctor";
import { fetchAllPatients } from "../../store/patient";
import { fetchAllOrders } from "../../store/order"; // Import action to fetch orders

const AdminDashBoard = () => {
  const dispatch = useDispatch();

  // Selecting data from the Redux store
  const { doctors, loading: doctorsLoading } = useSelector((state) => state.doctors);
  const { allPatients, loading: patientsLoading } = useSelector((state) => state.patient);
  const { allOrders, loading: ordersLoading } = useSelector((state) => state.order); // Select orders

  // Fetch doctors, patients, and orders on component mount
  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchAllPatients());
    dispatch(fetchAllOrders()); // Dispatch action to fetch orders
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-100 mt-16">
      {/* Sidebar can go here */}

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="p-6 bg-white rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-600">Total Doctors</h3>
            <p className="mt-2 text-3xl font-bold text-gray-800">
              {doctorsLoading ? "Loading..." : doctors?.length || 0}
            </p>
          </div>
          <div className="p-6 bg-white rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-600">Total Patients</h3>
            <p className="mt-2 text-3xl font-bold text-gray-800">
              {patientsLoading ? "Loading..." : allPatients?.length || 0}
            </p>
          </div>
          <div className="p-6 bg-white rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-600">Total Reports</h3>
            <p className="mt-2 text-3xl font-bold text-gray-800">
              {ordersLoading ? "Loading..." : allOrders?.length || 0}
            </p>
          </div>
        </div>

        <section className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activities</h3>
          <div className="bg-white p-4 rounded-md shadow-md">
            <ul className="divide-y divide-gray-200">
              {doctorsLoading || patientsLoading || ordersLoading ? (
                <li className="py-2 text-gray-600">Loading recent activities...</li>
              ) : (
                <>
                  <li className="py-2 flex justify-between">
                    <span className="text-gray-600">Data</span>
                    <span className="text-sm text-gray-400">doctor</span>
                  </li>
                  <li className="py-2 flex justify-between">
                    <span className="text-gray-600">Data</span>
                    <span className="text-sm text-gray-400">doctor</span>
                  </li>
                  <li className="py-2 flex justify-between">
                    <span className="text-gray-600">data</span>
                    <span className="text-sm text-gray-400">doctor</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashBoard;
