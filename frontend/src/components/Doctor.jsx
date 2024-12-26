import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Doctor = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Button
        style={{
          backgroundColor: "blue",
          color: "white",
          margin: "10px",
        }}
        onClick={() => navigate('/addDoctor')}
      >
        Add Doctor
      </Button>
      <Button
        style={{
          backgroundColor: "blue",
          color: "white",
          margin: "10px",
        }}
        onClick={() => navigate('/doctorReport')}
      >
        Doctors Report
      </Button>
    </div>
  );
};

export default Doctor;
