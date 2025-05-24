import React from "react";
import { Link } from "react-router-dom";

const Error: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Сторінка, яку ви шукаєте, не існує.
      </p>
      <Link
        to="/"
        className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
      >
        На головну
      </Link>
    </div>
  );
};

export default Error;