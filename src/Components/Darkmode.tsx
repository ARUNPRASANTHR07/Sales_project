import React  from 'react';
import { useTheme } from "../Components/Theme";
import { SunIcon,MoonIcon } from "@heroicons/react/24/solid";




const Darkmode:React.FC=()=> {
      const { darkMode, toggleDarkMode } = useTheme();


    return( <button
      onClick={toggleDarkMode}
      className="flex items-center gap-2 px-4 py-2 rounded dark:bg-gray-900 text-gray-900 dark:text-white dark:hover:bg-gray-700 transition"
    >
      {darkMode ? (
        // Sun icon for light mode
        <SunIcon className="h-5 w-5 text-gray-700 dark:text-white" />

      ) : (
        // Moon icon for dark mode
        <MoonIcon className="h-5 w-5 text-gray-700 dark:text-white" />
         
      )}
      
    </button>);
}



export default Darkmode;