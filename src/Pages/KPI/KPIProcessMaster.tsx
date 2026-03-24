import React from 'react';
import { Button } from "../../Components/Button";
import { useNavigate } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/solid";
import Darkmode from '../../Components/Darkmode';
import { useState, useEffect, useCallback, useRef } from 'react';
import Loader from '../../Components/Loading';
import Grid, { GridRow } from '../../Components/grid';
import SuccessPopup from '../../Components/SuccessPopup';
import ErrorPopup from '../../Components/ErrorMsgpopup';
import apiClient from '../../api/apiClient';



interface SearchCriteria {
  KPICode: string;
  StateCode: string;
  RegionCode: string;
  ZoneCode: string;
}

interface GridColumn {
  key: string;
  label: string;
  type: "label" | "text" | "combo" | "date" | "number";
  width: string;
  editable?: boolean;
  options?: Array<{ label: string; value: string }> | ((row: any) => Array<{ label: string; value: string }>);
  ismandatory?: boolean;
  popupedit?: boolean;
  popuptype?: "label" | "text" | "combo" | "date" | "number" | "checkbox";
}

const col = (
  key: string,
  label: string,
  type: GridColumn["type"],
  width: string,
  editable?: boolean,
  options?: Array<{ label: string; value: string }> | ((row: any) => Array<{ label: string; value: string }>),
  ismandatory?: boolean,
  popupedit?: boolean,
  popuptype?: GridColumn["popuptype"]
): GridColumn => ({
  key, label, type, width, editable, options, ismandatory, popupedit, popuptype
});


interface Props {
  onSearch?: (criteria: SearchCriteria) => void;
}

const ReactApp: React.FC<Props> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [criteria, setCriteria] = React.useState<SearchCriteria>({
    KPICode: "",
    StateCode: "",
    RegionCode: "",
    ZoneCode: "",
  });
  const [row, setrow] = useState<Array<any>>([]);
  const [columns, setcolumns] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [isimport, setIsimport] = useState(false);
  const [kpiOptions, setKpiOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [Marketing_Hier, setMarketing_Hier] = useState<Array<any>>([]);
  const [state, setState] = useState<Array<{ label: string; value: string }>>([]);
  const [region, setRegion] = useState<Array<{ label: string; value: string }>>([]);
  const [zone, setZone] = useState<Array<{ label: string; value: string }>>([]);
  const [state_ml, setState_ml] = useState<Array<{ label: string; value: string }>>([]);
  const [region_ml, setRegion_ml] = useState<Array<{ label: string; value: string }>>([]);
  const [zone_ml, setZone_ml] = useState<Array<{ label: string; value: string }>>([]);
  const [NewKPI_Description, setNewKPI_Description] = useState("N/A");
  const [NewKPI, setNewKPI] = useState("N/A");
  const [NewKPICode, setNewKPICode] = useState("N/A");
  const [KPIMaster_Data, setKPIMaster_Data] = useState<Array<{ KPICode: string; KPI: string; Descr: string }>>([]);

  /* ===================== INIT COLUMNS ===================== */

  const KPIProcess = async (payload: any) => {
    const response = await apiClient.post("/common", payload);
    return response;
  }

  const initCalled = useRef(false);


  const getRegionOptionsByState = useCallback((row: any) => {
    const stateCode = row.StateCode?.value ?? row.StateCode;

    return region_ml.filter(
      (r: any) => r.StateCode === stateCode || stateCode === "99"
    );
  }, [region_ml]);




  useEffect(() => {
    if (Marketing_Hier && Marketing_Hier.length > 0) {
      const uniqueStates = Array.from(
        new Map(
          Marketing_Hier.map(item => [
            item.State_Code, // key for uniqueness
            {
              value: item.State_Code,
              label: item.State,
            },
          ])
        ).values()
      );

      setState(uniqueStates);
    }
  }, [Marketing_Hier]);




  const fetchInit = useCallback(async (
    servicename: string,
    Jsonvalue: object
  ) => {
    const InitPayload = {
      Usercontext: JSON.parse(localStorage.getItem("activeUserInfo") || "{}"),
      servicename: servicename,
      JsonValue: Jsonvalue,
    }
    setIsLoading(true);

    try {
      const response = await KPIProcess(InitPayload);
      console.log("KPIProcess Init Response:", response.data);
      console.log("KPIProcess Init Payload:", InitPayload);
      if (response.data.success) {
        if (servicename === "KPIProcessInit") {
          setMarketing_Hier(response.data.data[0]);
          setKpiOptions(response.data.data[1]);
          //setrow(response.data.data[2]);

          const rawRows: any[] = []//response.data.data[2];
          setState_ml(response.data.data[3]);
          setRegion_ml(response.data.data[4]);
          setZone_ml(response.data.data[5]);
          setKPIMaster_Data(response.data.data[6]);

          const mappedRows = mapRowsForGrid(
            rawRows,
            state_ml,
            region_ml,
            zone_ml,
            kpiOptions
          );

          setrow(mappedRows);



          // console.log("Marketing_Hier:", response.data.data[0]);
          // console.log("state_ml", response.data.data[3]);
          // console.log("region_ml", response.data.data[4]);
          // console.log("zone_ml", response.data.data[5]);
        }
        else {
          const mappedRows = mapRowsForGrid(
            response.data.data[0],
            state_ml,
            region_ml,
            zone_ml,
            kpiOptions
          );
          setrow(mappedRows);
        }

      }

    } catch (error) {
      console.error("Error fetching KPIProcess Init:", error);
      setIsLoading(false);
      setErrMsg(true);

      const axiosError = error as any;
      const originalError = axiosError?.response?.data?.message || "An unknown error occurred";
      seterrorMessage(originalError.originalError.info.message || "An unknown error occurred");
    }
    finally {
      setIsLoading(false);
    }
  }, [state_ml, region_ml, zone_ml, kpiOptions]);



  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedState: string = e.target.value;

    // update state
    setCriteria((prev: SearchCriteria): SearchCriteria => ({
      ...prev,
      StateCode: selectedState,
    }));
    console.log("Selected State Code:", e.target.value);
    // filter regions based on selected state to load unique regions
    setRegion([]); // reset region
    setZone([]); // reset zone
    const filteredRegions = Array.from(
      new Map(
        Marketing_Hier
          .filter(item => (item.State_Code === selectedState))
          .map(item => [
            item.Region_Code + item.State_Code, // unique key
            {
              label: item.Region,
              value: item.Region_Code,
            },
          ])
      ).values()
    );

    setRegion([
      { label: 'Select Region', value: '' },
      ...filteredRegions, { label: 'others-99', value: '99' }
    ]);
    setZone([{ label: 'Select Zone', value: '' }]); // reset zone

  };

  const handleregionSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedRegion: string = e.target.value;
    // update state
    setCriteria((prev: SearchCriteria): SearchCriteria => ({
      ...prev,
      RegionCode: selectedRegion,
    }));
    setZone([]); // reset zone
    // filter zones based on selected region
    const filteredZones = Array.from(
      new Map(
        Marketing_Hier
          .filter(item => (item.State_Code === criteria.StateCode) &&
            (item.Region_Code === selectedRegion))
          .map(item => [
            item.Zone_Code + item.Region_Code + item.State_Code, // unique key
            {
              label: item.Zone,
              value: item.Zone_Code,
            },
          ])
      ).values()
    );

    setZone([
      { label: 'Select Zone', value: '' },
      ...filteredZones, { label: 'others-99', value: '99' }
    ]);

  }


  const mapRowsForGrid = (
    rows: any[],
    stateOpts: any[],
    regionOpts: any[],
    zoneOpts: any[],
    kpiOpts: any[] = []
  ) => {
    return rows.map(r => ({
      ...r,

      StateCode: stateOpts.find(o => o.value === r.StateCode) ?? {
        value: r.StateCode,
        label: r.State
      },

      RegionCode: regionOpts.find(o => o.value === r.RegionCode) ?? {
        value: r.RegionCode,
        label: r.Region
      },

      ZoneCode: zoneOpts.find(o => o.value === r.ZoneCode) ?? {
        value: r.ZoneCode,
        label: r.Zone
      },
      KPICode: kpiOpts.find(o => o.value === r.KPICode) ?? {
        value: r.KPICode,
        label: r.KPI
      }
    }));
  };




  useEffect(() => {
    if (initCalled.current) return;

    initCalled.current = true;
    fetchInit("KPIProcessInit", {});
  }, [fetchInit]);




  useEffect(() => {



    setcolumns([
      col("id", "S.No", "label", "70px", false, undefined, false, false, "label"),
      col("KPI_Code_Id", "KPI Code Id", "text", "90px", false, undefined, false, false, "label"),
      col("KPICode", "KPI Code", "combo", "90px", false, kpiOptions, true, false, "combo"),
      col("KPI", "KPI", "text", "200px", false, undefined, false, false, "label"),
      col("Descr", "KPI Description", "text", "200px", false, undefined, false, false, "label"),
      col("StateCode", "State Code", "combo", "200px", true, state_ml, true, true, "combo"),
      col("RegionCode", "Region Code", "combo", "200px", true, region_ml, true, true, "combo"),
      col("ZoneCode", "Zone Code", "combo", "200px", true, zone_ml, true, true, "combo"),
      col("Target", "Target", "number", "90px", true, undefined, true, true, "number"),
      col("Range_SNo", "Range S.No", "number", "100px", true, undefined, true, true, "number"),
      col("StartVal", "Start Value", "number", "100px", true, undefined, true, true, "number"),
      col("EndVal", "End Value", "number", "100px", true, undefined, true, true, "number"),
      col("Mark", "Mark", "number", "90px", true, undefined, true, true, "number"),
      col("MaxMark", "Max Mark", "number", "90px", true, undefined, true, true, "number"),
    ]);

    console.log("KPIProcessMaster Columns:", state_ml, region_ml, zone_ml);

  }, [fetchInit, region_ml, zone_ml, state_ml, getRegionOptionsByState, kpiOptions]);


  const handleImportClick = () => {
    setIsimport(true);

  }
  /*On Set Default Set the values from header to grid */
  const handlesetdafault = (type: string) => {



    if (!criteria.KPICode) {
      alert("Please select a KPI Code to set default values and search again.");
      return;
    }

    const distinctKPIs = Array.from(
      new Map(
        row.map(r => [r.KPICode, { KPICode: r.KPICode, Description: r.Descr, KPI: r.KPI }])
      ).values()
    );
    console.log("Distinct KPIs in Grid:", distinctKPIs);
    console.log("All KPIs in Grid:", distinctKPIs.map(k => k.KPICode.value ?? k.KPICode));
    /*If Any of the distinct KPI Appart from header KPI For Set Default Raiserror */
    if (type === 'Set Default' && distinctKPIs.some(k => k.KPICode !== criteria.KPICode)) {
      alert("Multiple KPIs found in the grid. Please ensure only the selected KPI Code is present to set default values.");
      return;
    }


    /*If count of the distinct KPI is greater then  1 For create New Raiserror */
    if (type === 'Create New' && distinctKPIs.length > 1) {
      alert("Multiple KPIs found in the grid. Please ensure only one KPI Code is present to create new default values.");
      return;
    }

    let newDescription = "N/A";
    let newKPI = "N/A";
    let newKPICode = criteria.KPICode;


    const existingKPI = distinctKPIs.find(k => k.KPICode === criteria.KPICode);

    if (existingKPI) {
      newDescription = existingKPI.Description;
      newKPI = existingKPI.KPI;
    } else {
      const masterKPI = KPIMaster_Data.find(k => k.KPICode === criteria.KPICode);
      newDescription = masterKPI?.Descr || "N/A";
      newKPI = masterKPI?.KPI || "N/A";
    }



    // Now update state ONCE
    setNewKPI_Description(newDescription);
    setNewKPI(newKPI);
    setNewKPICode(newKPICode);

    const defaultRow = row.map(r => ({
      ...r,
      Descr: newDescription,
      KPI: newKPI,
      KPI_Code_Id: type === 'Set Default' ? r.KPI_Code_Id : '',

      StateCode: state_ml.find(s => s.value === criteria.StateCode) ?? r.StateCode,

      RegionCode:
        criteria.RegionCode === "99"
          ? { value: "99", label: "others-99" }
          : region_ml.find(rg => rg.value === criteria.StateCode + criteria.RegionCode) ?? r.RegionCode,

      ZoneCode:
        criteria.ZoneCode === "99"
          ? { value: "99", label: "others-99" }
          : zone_ml.find(z => z.value === criteria.StateCode + criteria.RegionCode + criteria.ZoneCode) ?? r.ZoneCode,

      KPICode:
        kpiOptions.find(k => k.value === newKPICode) ?? r.KPICode
    }));

    setrow(defaultRow);
  };




  /* ===================== SEARCH HANDLER ===================== */

  const handleSearch = async () => {


    if (!criteria.StateCode) {
      alert("Please select a State Code to search.");
      return;
    }

    if (!criteria.RegionCode) {
      alert("Please select a Region Code to search.");
      return;
    }

    if (!criteria.ZoneCode) {
      alert("Please select a Zone Code to search.");
      return;
    }

    const searchPayload = {
      Usercontext: JSON.parse(localStorage.getItem("activeUserInfo") || "{}"),
      servicename: "KPIProcessSearch",
      JsonValue: {
        KPICode: criteria.KPICode,
        StateCode: criteria.StateCode,
        RegionCode: criteria.RegionCode,
        ZoneCode: criteria.ZoneCode,
      },
    };
    fetchInit("KPIProcessSearch", searchPayload.JsonValue);

    onSearch?.(criteria);
  };

  const submitKPI = async (
    rows: GridRow[] | GridRow,
    serviceName: string,
    messagedesc: string,
    emptyCheck = false,
    confirmmessage: string,
    isimport = false
  ) => {
    if (emptyCheck && Array.isArray(rows) && rows.length === 0) {
      alert("Please select at least one row to submit.");
      return;
    }

    const confirmed = window.confirm(confirmmessage || "Are you sure you want to submit the data?");

    if (!confirmed) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        Usercontext: JSON.parse(localStorage.getItem("activeUserInfo") || "{}"),
        servicename: serviceName,
        JsonValue: {
          searchcriteria: criteria,
          selectedRows: (Array.isArray(rows) ? rows : [rows]).map(row => ({
            ...row,
            StateCode: row.StateCode?.value ?? row.StateCode,
            RegionCode: (() => {
              const val = row.RegionCode?.value ?? row.RegionCode;
              return val === "99" ? val : val?.toString().substring(2, 4);
            })(),
            ZoneCode: (() => {
              const val = row.ZoneCode?.value ?? row.ZoneCode;
              return val === "99" ? val : val?.toString().substring(5, 7);
            })(),
            KPICode: row.KPICode?.value ?? row.KPICode,
          })),
        },
      };



      console.log("KPI Submit Payload:", payload);
      const res = await KPIProcess(payload);
      console.log("KPI Submit Response:", res.data);

      const mappedRows = mapRowsForGrid(
        res.data.data[0],
        state_ml,
        region_ml,
        zone_ml,
        kpiOptions
      );
      setrow(mappedRows);
      setSuccessMsg(true);
    } catch (err) {
      console.error("Error submitting KPI data:", err);
      setIsLoading(false);
      setErrMsg(true);

      const axiosError = err as any;
      const originalError = axiosError?.response?.data?.message || "An unknown error occurred";
      seterrorMessage(originalError.originalError.info.message || "An unknown error occurred");

    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFromChild = () =>
    submitKPI(selectedRows, "KPIProcessSubmit", "Data Submitted successfully!", true, "", isimport);

  const handlesingleSubmitFromChild = (row: GridRow) =>
    submitKPI(row, "KPIProcessSubmit", "Data Submitted successfully!", false, "", isimport);

  const handleAddRowSaveFromChild = (row: GridRow) =>
    submitKPI(row, "KPIProcessSubmit", "New Row Added successfully!", false, "Are you sure you want to add this new row?", false);

  /* ===================== RENDER ===================== */

  return (
    <div className="min-h-screen dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <div className="mb-4 flex items-center justify-between 
                bg-blue-50 dark:bg-gray-800 
                px-4 py-2 rounded-md border 
                border-blue-200 dark:border-gray-700">
        {/* Title */}
        <div className="flex-grow justify-start">
          <h1 className="text-2xl font-bold mb-4">
            KPI Process Master
          </h1>
        </div>
        <div className="flex justify-end items-center gap-4">
          <Darkmode />
          <Button variant="primary" color="primary"
            onClick={() => navigate("/Mainpage")}  >
            <HomeIcon className="h-5 w-5" />

          </Button>
        </div>
      </div>
      <div className="dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">KPI Search</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* KPI Code */}

          <div>
            <label htmlFor="KPICode" className="block mb-2 font-small">KPI Code</label>
            <select
              id="KPICode"
              name="KPICode"
              value={criteria.KPICode}
              onChange={(e) => setCriteria({ ...criteria, KPICode: e.target.value })}
              className="max-w-xs w-[calc(100%-20%)] h-8 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {kpiOptions.map((kpi) => (
                <option key={kpi.value} value={kpi.value}>
                  {kpi.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="StateCode" className="block mb-2 font-small">State Code</label>
            <select

              id="StateCode"
              name="StateCode"
              value={criteria.StateCode}
              onChange={handleStateSelect}
              className="max-w-xs w-[calc(100%-20%)] h-8  border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {state.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="RegionCode" className="block mb-2 font-small">Region Code</label>
            <select
              id="RegionCode"
              name="RegionCode"
              value={criteria.RegionCode}
              onChange={handleregionSelect}
              className="max-w-xs w-[calc(100%-20%)] h-8  border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {region.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ZoneCode" className="block mb-2 font-small">Zone Code</label>
            <select
              id="ZoneCode"
              name="ZoneCode"
              value={criteria.ZoneCode}
              onChange={(e) => setCriteria({ ...criteria, ZoneCode: e.target.value })}
              className="max-w-xs w-[calc(100%-20%)] h-8  border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {zone.map((zone) => (
                <option key={zone.value} value={zone.value}>
                  {zone.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex 
  flex-col 
  sm:flex-row 
  justify-evenly 
  items-center 
  gap-4">
          <Button variant="primary" color="primary" className="mt-6 hover:opacity-90 hover:scale-105 transition-transform"
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button variant="primary" color="primary" className="mt-6 hover:opacity-90 hover:scale-105 transition-transform"
            onClick={() => handlesetdafault('Set Default')}
          >
            Set Default
          </Button>
          <Button variant="primary" color="primary" className="mt-6 hover:opacity-90 hover:scale-105 transition-transform"
            onClick={() => handlesetdafault('Create New')}
          >
            Create New
          </Button>
        </div>
      </div>
      {isLoading && <Loader loading={isLoading} />}
      <Grid data={row}
        columns={columns}
        buttonvisible={true}
        onSelectionChange={setSelectedRows}
        onDataChange={(newdata) => setrow(newdata)}
        onsubmit={handleSubmitFromChild}
        onsingleSubmit={handlesingleSubmitFromChild}
        AddRowSave={handleAddRowSaveFromChild}
        disableEdit={false} filename={"KPIProcessMaster.xlsx"}
        handleImportClick={handleImportClick}
        isdelete={true}
        isedit={true}
      />
      {
        successMsg && (
          <SuccessPopup
            message={"Data Saved successfully!"}
            isopen={true}
            onClose={() => setSuccessMsg(false)}
          />
        )
      }
      {
        errMsg && (
          <ErrorPopup
            message={errorMessage}
            isopen={true}
            onClose={() => setErrMsg(false)}
          />
        )
      }

    </div >
  );
};

export default ReactApp;
