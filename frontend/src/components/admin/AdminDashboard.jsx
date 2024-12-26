import React from "react";

const AdminDashBoard = () => {
  return (
    <div className="flex h-screen bg-gray-100 mt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold tracking-wide">Admin Dashboard</h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 px-4">
            <li>
              <a
                href="#"
                className="flex items-center p-3 text-gray-200 hover:bg-blue-700 rounded-md"
              >
                <span className="material-icons-outlined mr-3">local_hospital</span>
                Doctors
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-3 text-gray-200 hover:bg-blue-700 rounded-md"
              >
                <span className="material-icons-outlined mr-3">person</span>
                Patients
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-3 text-gray-200 hover:bg-blue-700 rounded-md"
              >
                <span className="material-icons-outlined mr-3">category</span>
                Categories
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-3 text-gray-200 hover:bg-blue-700 rounded-md"
              >
                <span className="material-icons-outlined mr-3">layers</span>
                Subcategories
              </a>
            </li>
          </ul>
        </nav>
        <div className="px-4 py-4">
          <button className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <button className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
            Add New
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="p-6 bg-white rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-600">Total Doctors</h3>
            <p className="mt-2 text-3xl font-bold text-gray-800">150</p>
          </div>
          <div className="p-6 bg-white rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-600">Total Patients</h3>
            <p className="mt-2 text-3xl font-bold text-gray-800">350</p>
          </div>
          <div className="p-6 bg-white rounded-md shadow-md">
            <h3 className="text-lg font-medium text-gray-600">Categories</h3>
            <p className="mt-2 text-3xl font-bold text-gray-800">10</p>
          </div>
        </div>

        <section className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activities</h3>
          <div className="bg-white p-4 rounded-md shadow-md">
            <ul className="divide-y divide-gray-200">
              <li className="py-2 flex justify-between">
                <span className="text-gray-600">Dr. John added a new patient.</span>
                <span className="text-sm text-gray-400">5 mins ago</span>
              </li>
              <li className="py-2 flex justify-between">
                <span className="text-gray-600">New category created: Pediatrics.</span>
                <span className="text-sm text-gray-400">10 mins ago</span>
              </li>
              <li className="py-2 flex justify-between">
                <span className="text-gray-600">Patient appointment confirmed.</span>
                <span className="text-sm text-gray-400">30 mins ago</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashBoard;
