import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Darkmode from "./Darkmode";
import RolePopup from "./RolePopup";

interface PageCaptionProps {
    title: string;
    showHome?: boolean;
}

const PageCaption: React.FC<PageCaptionProps> = ({
    title,
    showHome = true,
}) => {
    const navigate = useNavigate();
    const [isRoleOpen, setIsRoleOpen] = useState(false);

    const onLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (confirmed) {
            navigate("/"); // Redirect to login page
        }
    };

    return (
        <div
            className="
        mb-4 flex items-center justify-between
        bg-blue-50 dark:bg-gray-800
        px-4 py-3 rounded-md border
        border-blue-200 dark:border-gray-900
        
      "
        >
            {/* Title */}
            <div className="flex-grow">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {title}
                </h1>
            </div>

            {/* Right Controls */}
            <div className="relative flex items-center gap-3">

                {/* Role Change Button */}
                <button
                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                    className="
            flex items-center gap-1
            px-4 py-1 rounded-md bg-blue-50
             dark:bg-gray-900
            text-gray-800 dark:text-white
            hover:bg-gray-300 dark:hover:bg-gray-600
            transition text-sm h-9 w-12 
           "
                >
                    <ArrowPathIcon className="h-5 w-5 justify-center" />

                </button>

                {/* Role Popup */}
                <RolePopup
                    isOpen={isRoleOpen}
                    onClose={() => setIsRoleOpen(false)}
                />

                {/* Dark Mode */}
                <Darkmode />

                {/* Home Button */}
                {showHome && (
                    <button
                        onClick={() => navigate("/Mainpage")}
                        className="
              p-2 rounded-md
              bg-blue-600 hover:bg-blue-700
              text-white transition
            "
                    >
                        <HomeIcon className="h-5 w-5" />
                    </button>
                )}

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
    );
};

export default PageCaption;
