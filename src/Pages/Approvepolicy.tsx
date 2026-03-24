import React, { useEffect, useState } from "react";
import axios from "axios";
import TextInput from "../Components/TextInput";
import SelectInput from "../Components/SelectInput";
import DateInput from "../Components/DateInput";
import BasicGrid from "../Components/grid";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loading"

/* -------------------- Types -------------------- */
interface GridColumn {
  key: string;
  label: string;
  type: "label" | "text" | "combo"|"date";
  width: string;
  editable?: boolean;
  options?: Array<{ label: string; value: string }>;
}

/* -------------------- Static Data -------------------- */


const statusCombo = [
  { description: "Fresh", value: "FR" },
  { description: "Approved", value: "AP" },
  { description: "Deleted", value: "DL" },
];

const columns: GridColumn[] = [
  {
    key: "policyId",
    label: "Policy ID",
    type: "label",        // read-only
    width: "150px",
    editable: false
  },
  {
    key: "rebateId",
    label: "Rebate ID",
    type: "text",         // editable text
    width: "150px",
    editable: true
  },
  {
    key: "rebateType",
    label: "Rebate Type",
    type: "combo",        // dropdown
    width: "180px",
    editable: true,
    options: [
      { label: "Flat", value: "Flat" },
      { label: "Percentage", value: "Percentage" }
    ]
  },
  {
    key: "status",
    label: "Status",
    type: "combo",
    width: "140px",
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" }
    ]
  }
];


/* -------------------- Component -------------------- */
const Approvepolicy: React.FC = () => {
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [rebateid, setRebateid] = useState("");
  const [policyid, setPolicyid] = useState("");
  const [status, setStatus] = useState("");
  const [rebatetype, setRebatetype] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [RebateTypeCombo, setRebateTypeCombo] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
    
  

  useEffect(() => {
    const fetchInit = async () => {
      const InitPayload = {
        servicename: "ApproveRebatePolicyInit",
        JsonValue: {},
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/common",
          InitPayload
        );
        
        if (response.data.success) {
          setRebateTypeCombo(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching rebate policies:", error);
      }
    };

    fetchInit();
  }, []);

  /* -------------------- Search -------------------- */
  const onSearchClick = async () => {
    if (!fromdate || !todate) {
      alert("Please select From and To dates");
      return;
    }
    setIsLoading(true);
    const payload = {
      servicename: "ApproveRebatePolicyFetch",
      JsonValue: {
        rebateType: rebatetype,
        rebateId: rebateid,
        policyId: policyid,
        status: status,
        fromDate: fromdate,
        toDate: todate,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/common",
        payload
      );

      if (response.data.success) {
        const rawData = response.data.data[0];
    
    // If your COLUMNS are also coming from the backend:
    const sanitizedColumns = columns.map(col => {
      if (col.type === 'combo' && typeof col.options === 'string') {
        return { ...col, options: JSON.parse(col.options) };
      }
      return col;
    });
        setRows(rawData); 
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching rebate policies:", error);
    }
  };

  /* -------------------- Approve -------------------- */
  const onApproveClick = () => {
    console.log("Approve clicked");
    console.log(selectedRows);
  };

  return (
    <div className="min-h-screen bg-[#eaeaf5ff] p-4">
      <div className="mb-6 flex items-center justify-between">
      {/* Title */}
          <h1 className="text-2xl font-bold mb-4">
            Approve Rebate Policy
          </h1>
          <Button variant="contained" color="primary" className="mb-4"
                   onClick={() => navigate("/Mainpage")}>
                                Home Screen
          </Button>
      </div>

      {/* Search Criteria */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">
          Search Criteria
        </h2>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <DateInput label="From Date" value={fromdate} onChange={setFromdate} />
          <DateInput label="To Date" value={todate} onChange={setTodate} />
          <SelectInput
            label="Rebate Type"
            value={rebatetype}
            options={RebateTypeCombo}
            onChange={setRebatetype}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <TextInput
            label="Rebate Id"
            value={rebateid}
            onChange={setRebateid}
          />
          <TextInput
            label="Policy Id"
            value={policyid}
            onChange={setPolicyid}
          />
          <SelectInput
            label="Status"
            value={status}
            options={statusCombo}
            onChange={setStatus}
          />
        </div>

        <div className="flex justify-center">
              <button
                onClick={onSearchClick}
                className={`transition-all duration-200
                           ${isLoading ? 'cursor-not-allowed ' : 'px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:scale-105'}`}
              >
            {isLoading ?( <div className="flex items-center justify-center">
              <Loader   loading={true} minDuration={10000} color={"#2e0066ff"} size={30} message="Please Wait..." />
          </div>):(
                 'Search')}
              </button>
            </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
       <BasicGrid data={rows} columns={columns}  buttonvisible={false}
       onSelectionChange={setSelectedRows}
       onDataChange={(newdata)=>setRows(newdata)}/>
      </div>

      {/* Approve Button */}
      <div className="flex justify-center bg-white mt-4 py-4">
        <button
          onClick={onApproveClick}
          className="px-6 py-2 bg-green-600 text-white rounded-md
                     transition-all duration-200
                     hover:bg-green-700 hover:scale-105"
        >
          Approve
        </button>
      </div>
    </div>
  );
};

export default Approvepolicy;
