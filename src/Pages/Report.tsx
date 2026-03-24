/*import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import Filters from "../Components/Filters";
import SalesTable from "../Components/SalesTable";
import TrendCharts from "../Components/TrendCharts";

export default function Dashboard() {
  const [chartData] = useState({
    months: ["Apr-23", "Apr-24", "Apr-25"],
    qty: [190, 240, 310],
    value: [3500000, 4200000, 5100000],
    productMix: [
      { label: "Drymix", qty: 300 },
      { label: "Cement", qty: 220 },
      { label: "RSP", qty: 90 },
    ],
  });

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Sales Trend Dashboard
      </Typography>

      <Filters />
      <TrendCharts data={chartData} />
      <SalesTable />
    </Container>
  );
}
*/


import Grid from "../Components/grid";
import TextInput from "../Components/TextInput";
import SelectInput from "../Components/SelectInput";
import DateInput from "../Components/DateInput";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Components/Loading"

interface GridColumn {
  key: string;
  label: string;
  type: "label" | "text" | "combo"|"date";
  width: string;
  editable?: boolean;
  options?: Array<{ label: string; value: string }>;
}



const Reports:React.FC=()=> {
  const [CustomerFrom, setCustomerfrom] = useState("");
  const [Customerto, SetCustomerto] = useState("");
  const [tradetype, Settradetype] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [tradetypecombo, settradetypecombo] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const navigate = useNavigate();
  const [columns,setcolumns]=useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
    const fetchInit = async () => {
      const InitPayload = {
        servicename: "ReportsInit",
        JsonValue: {},
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/common",
          InitPayload
        );

       if (response.data.success) {
      // 1. Get the raw columns from recordset[1]
      const rawColumns = response.data.data[1];
        console.log("Raw Columns:", rawColumns);
      // 2. Transform strings into real Arrays/Booleans
      const sanitizedColumns = rawColumns.map((col: any) => ({
        ...col,
        // Convert "options" string to actual Array
        options: typeof col.options === 'string' ? JSON.parse(col.options) : col.options,
        
        // Convert "editable" string to actual Boolean
        editable: col.editable === 'true' || col.editable === true
      }));
      console.log("Sanitized Columns:", sanitizedColumns);
      // 3. Save the clean data to state
      setcolumns(sanitizedColumns);
    }
      } catch (error) {
        console.error("Error fetching Reports:", error);
      }
    };

    fetchInit();
  }, []);



   const onSearchClick = async () => 
  {
    setIsLoading(true);
    //if (!CustomerFrom || !Customerto) {
      //alert("Please select Customer From and To");
   //   return;   
   // }
    const payload={
      servicename :"Reportssearch",
      JsonValue:{
        CustomerFrom:CustomerFrom,
        Customerto:Customerto,
        tradetype:tradetype
      }
    }
    console.log("Search",payload)
      try {
      const response = await axios.post(
        "http://localhost:5000/api/common",
        payload
      );
      console.log("rows",response.data);
      if (response.data.success) {
        setRows(response.data.data[0]); 
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Search:", error);
    }
    
  };

  
  return (
    
    <div className="min-h-screen dark:bg-gray-900 text-gray-900 dark:text-white p-4">
          <div className="mb-4 flex items-center justify-between 
                bg-blue-50 dark:bg-gray-800 
                px-4 py-2 rounded-md border 
                border-blue-200 dark:border-gray-700">
          {/* Title */}
              <h1 className="text-2xl font-bold mb-4">
                Master View
              </h1>
              <Button variant="contained" color="primary" className="mb-4"
                       onClick={() => navigate("/Mainpage")}>
                                    Home Screen
              </Button>
          </div>
    
          {/* Search Criteria */}
          <div className="dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow p-4 mb-6">
            <h2 className="font-semibold dark:bg-gray-900 text-gray-900 dark:text-white mb-4">
              Search Criteria
            </h2>
    
            {/* Row 1 */}
            <div className="dark:bg-gray-900 text-gray-900 dark:text-white grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <TextInput label="Customer From" value={CustomerFrom} onChange={setCustomerfrom} />
              <TextInput label="Customer To" value={Customerto} onChange={SetCustomerto} />
              <SelectInput
                label="Trade Type"
                value={tradetype}
                options={tradetypecombo}
                onChange={Settradetype}
              />
            </div>   
            {/* Search Button */}
            <div className="flex justify-center">
              <button
                onClick={onSearchClick}
                className={`transition-all duration-200
                           ${isLoading ? 'cursor-not-allowed ' : 'px-6 py-2 bg-blue-700 hover:bg-blue-500 text-white rounded-md  hover:scale-105'}`}
              >
            {isLoading ?( <div className="flex items-center justify-center">
              <Loader  loading={isLoading} minDuration={9000} color={"#2e0066ff"} size={30} message="Please Wait..." />
          </div>):(
                 'Search')}
              </button>
            </div>
          </div>

    <div className="dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow overflow-x-auto">
      <Grid data={rows} columns={columns} buttonvisible={false} onSelectionChange={setSelectedRows} 
      onDataChange={(newdata)=>setRows(newdata) }/>
    </div>
  </div>
  );
}


export default Reports;


