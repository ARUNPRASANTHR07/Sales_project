import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircleCard from "../Components/CircleCard";
import UserIcon from "../assets/UserIcon.png";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
//import ApprovePolicyImg from "../assets/ApprovePolicy.png";
import ParameterSetupImg from "../assets/ParameterSetup.png";
import ProcessRebatesImg from "../assets/ProcessRebates.png";
// import KPIProcessMasterImg from "../assets/KPIProcess.svg";
import ReportsImg from "../assets/ReportsImg.png";
import Darkmode from "../Components/Darkmode";
import RolePopup from "../Components/RolePopup";
//import apiClient from '../api/apiClient';


interface ActiveUserInfo {
  name?: string;
  age?: number;
  location?: string;
  designation?: string;
  role?: string;
}




const Mainpage: React.FC = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userinfo, setuserinfo] = useState<ActiveUserInfo | null>(null);



  const onLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      // localStorage.removeItem("accessToken");
      // localStorage.removeItem("refreshToken");
      localStorage.clear()
      navigate("/"); // Redirect to login page
    }
  };



  const cardData = [
    //{ title: "Approve Policy", image: ApprovePolicyImg, path: "/Approvepolicy" },
    /*{ title: "Process Rebates", image: ProcessRebatesImg, path: "/Processrebate" },*/
    { title: "View Coupon", image: ReportsImg, path: "/ViewCouponDetails" },
    { title: "Influencer Wise View", image: ReportsImg, path: "/InfluencerWiseView" },

    { title: "KPI Process", image: ProcessRebatesImg, path: "/KPI" },
    { title: "Parameter Setup", image: ParameterSetupImg, path: "/Parametersetup" },

  ];

  useEffect(() => {
    const storedActiveUser = localStorage.getItem("activeUserInfo");

    if (storedActiveUser) {
      setuserinfo(JSON.parse(storedActiveUser));
    }
  }, []);


  console.log("activeUserInfo", userinfo)


  return (
    <div className="min-h-screen w-full dark:bg-gray-900 flex flex-wrap gap-4 p-4 justify-center">

      {/* LEFT PANEL */}
      <div className="flex-1 min-w-[320px] max-w-[380px] flex justify-center">
        <div className="
          w-full dark:bg-gray-500 text-gray-500 dark:text-white rounded-xl shadow-lg p-4
          transition-all duration-300
          hover:scale-[1.02]
        ">
          {/* Avatar */}
          <img
            src={UserIcon}
            alt="User"
            className="w-24 h-24 rounded-full object-cover mt-4"
          />

          {/* Welcome */}
          <h2 className="text-2xl font-bold mt-4">
            Welcome, User!
          </h2>

          {/* User Info */}
          <div className="flex gap-6 mt-6 text-sm">
            <div className="flex flex-col gap-2 font-medium dark:bg-gray-500 text-gray-500 dark:text-white">
              <span>Name:</span>
              <span>Age:</span>
              <span>Location:</span>
              <span>Designation:</span>
            </div>
            <div className="flex flex-col gap-2 dark:bg-gray-500 text-gray-500 dark:text-white">
              <span>{userinfo?.name || "N/A"}</span>
              <span>{userinfo?.age || "N/A"}</span>
              <span>{userinfo?.location || "N/A"}</span>
              <span>{userinfo?.designation || userinfo?.role || "N/A"}</span>

            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-[3] min-w-[100px] max-w-6xl">
        <div className="min-h-[10vh] dark:bg-gray-900 text-gray-900 dark:text-white flex items-right justify-end p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:scale-105 transition bg-white dark:bg-gray-800"
              title="Change Role/OU"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>

            <Darkmode />
            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="
            px-3 py-1 rounded-md
            bg-red-500 hover:bg-red-600
            text-white text-sm transition
          "
            >
              Logout
            </button>
          </div>

        </div>
        <h3 className=" dark:bg-gray-900 text-gray-900 dark:text-white text-xl font-semibold mt-6 mb-4">
          User Rights
        </h3>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cardData.map((item) => (
            <CircleCard
              key={item.title}
              title={item.title}
              image={item.image}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      </div>
      <RolePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />

    </div>
  );
};

export default Mainpage;
