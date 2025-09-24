
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-notfound-bg">
      <h1 className="text-5xl font-bold text-notfound-primary mb-4">404</h1>
      <p className="text-xl text-notfound-text mb-8">Page Not Found</p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 bg-notfound-primary text-notfound-button-text rounded-lg shadow hover:bg-notfound-hover transition"
      >
        Go to Login
      </button>
    </div>
  );
};

export default NotFound;
