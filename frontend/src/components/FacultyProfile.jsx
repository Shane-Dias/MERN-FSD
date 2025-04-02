import React from "react";
import { Link } from "react-router-dom";

export default function FacultyProfile({ userProfile }) {
  console.log('faculty name in component',userProfile);
  
  return (
    <div className="flex justify-between items-center px-16 pb-12 pt-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex items-center space-x-4">
        <img
          src='https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'
          alt='Profile'
          className="w-16 h-16 rounded-full border-2 border-emerald-500"
        />
        <div>
          <h1 className="text-3xl text-white font-lilita font-normal">Welcome, {userProfile}</h1>
          <p className="text-gray-400">Faculty Dashboard</p>
        </div>
      </div>
    </div>
  );
}
