import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import Home from './components/Home';
import { Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar';
import Doctor from './components/Doctor';
import CheckAuth from './common/CheckAuth';
import DoctorForm from './components/DoctorForm';
import DoctorReport from './components/DoctorReport';
import Category from './components/Category';
import CategoryForm from './components/CategoryForm';
import SubCategoryForm from './components/SubCategoryForm';
import PrintReport from './components/PrintReport';
import Patient from './components/patients/Patient';
import PatientForm from './components/patients/PatientForm';
import AdminDashBoard from './components/admin/AdminDashBoard';
import { checkAuth } from "./store/auth";
import { useDispatch, useSelector } from "react-redux";
import AdminLogin from './components/admin/AdminLogin';

function App() {
  const dispatch = useDispatch();
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const loading = useSelector((state) => state.auth.loading);
  // useEffect(() => {
  //   dispatch(checkAuth());
  // }, [dispatch]);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/patients" element={<Patient />} />
        <Route path="/print-report" element={<PrintReport />} />
        <Route path="/patient-form" element={<PatientForm />} />

        {/* Admin Routes (scoped under /admin) */}
        <Route path="/admin/login" element={<CheckAuth><AdminLogin /></CheckAuth>} />

        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={
          <CheckAuth> 
            <Routes>
              <Route path="dashboard" element={<AdminDashBoard />} />
              <Route path="doctor" element={<Doctor />} />
              <Route path="addDoctor" element={<DoctorForm />} />
              <Route path="doctorReport" element={<DoctorReport />} />
              <Route path="category" element={<Category />} />
              <Route path="addCategory" element={<CategoryForm />} />
              <Route path="addSubcategory" element={<SubCategoryForm />} />
            </Routes>
          </CheckAuth>
        }/>
      </Routes>
    </div>
  );
}

export default App;

