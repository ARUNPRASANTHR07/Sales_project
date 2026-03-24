import React from 'react';
import { Button } from "../../Components/Button";
import { useState, useEffect, useCallback } from 'react';
import Loader from '../../Components/Loading';
import Grid, { ColumnType, GridRow } from '../../Components/grid';
import SuccessPopup from '../../Components/SuccessPopup';
import ErrorPopup from '../../Components/ErrorMsgpopup';
import apiClient from '../../api/apiClient';
import Pagetitlecard from '../../Components/Pagetitlecard';



interface SearchCriteria {
  KPICode: string;
  KPI: string;
  Descr: string;
  UOM: string;
  Criteria: string;
  Flag: string;
  SPName: string;
  MonthWiseSp: string;
}

interface ProcessCriteria {
  FromDate: string;
  ToDate: string;
  ProcessMonth: string;
}

interface GridColumn {
  key: string;
  label: string;
  type: "label" | "text" | "combo" | "date" | "number";
  width: string;
  editable?: boolean;
  options?: Array<{ label: string; value: string }>;
  ismandatory?: boolean;
  popupedit?: boolean;
  popuptype?: ColumnType;
}

const col = (
  key: string,
  label: string,
  type: GridColumn["type"],
  width: string,
  editable?: boolean,
  options?: Array<{ label: string; value: string }>,
  ismandatory?: boolean,
  popupedit?: boolean,
  popuptype?: GridColumn["type"]
): GridColumn => ({
  key, label, type, width, editable, options, ismandatory, popupedit, popuptype
});


interface Props {
  onSearch?: (criteria: SearchCriteria) => void;
  onProcess?: (Processcriteria: ProcessCriteria) => void;
}

const ReactApp: React.FC<Props> = ({ onSearch, onProcess }) => {
  const [criteria, setCriteria] = React.useState<SearchCriteria>({
    KPICode: "",
    KPI: "",
    Descr: "",
    UOM: "",
    Criteria: "",
    Flag: "",
    SPName: "",
    MonthWiseSp: "",
  });
  const [Processcriteria, setProcessCriteria] = React.useState<ProcessCriteria>({
    FromDate: "",
    ToDate: "",
    ProcessMonth: "",
  });
  const [row, setrow] = useState<Array<any>>([]);
  const [columns, setcolumns] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [MessageDesc, setMessageDesc] = useState("");
  const [ProcessShowPopup, setProcessShowPopup] = useState(false);
  const [isimport, setIsimport] = useState(false);
  /* ===================== INIT COLUMNS ===================== */

  const isFormValid =
    Processcriteria.FromDate &&
    Processcriteria.ToDate &&
    Processcriteria.ProcessMonth;


  const KPIProcess = async (payload: any) => {
    const response = await apiClient.post("/common", payload);
    return response;
  };

  const fetchInit = useCallback(async (
    serviceName: string,
    JsonValue: object
  ) => {
    setIsLoading(true);
    const InitPayload = {
      Usercontext: JSON.parse(localStorage.getItem("activeUserInfo") || "{}"),
      servicename: serviceName,
      JsonValue: JsonValue,
    }
    console.log("KPIProcess Init Payload:", InitPayload);
    try {
      const response = await KPIProcess(InitPayload);
      console.log("KPIProcess Init Response:", response.data);

      if (response.data.success) {
        setrow(response.data.data[0]);
      }

    } catch (err: any) {
      console.error("Error submitting KPI:", err.AxiosError ? err.AxiosError : err);

      setErrMsg(true);

      let message = "An unknown error occurred";

      if (err?.response?.data) {
        const backendData = err.response.data;

        if (typeof backendData.message === "string") {
          message = backendData.message;
        } else if (typeof backendData.error === "string") {
          message = backendData.error;
        } else {
          message = JSON.stringify(backendData);
        }
      } else if (err?.message) {
        message = err.message;
      }

      seterrorMessage(message);
    }
    finally {
      setIsLoading(false);
    }
  }, []
  );

  const initCalled = React.useRef(false);

  useEffect(() => {

    if (initCalled.current) return;  // skip if already called
    initCalled.current = true;


    setcolumns([
      col("id", "S.No", "label", "70px", false, undefined, false, false, "label"),
      col("KPICode", "KPI Code", "text", "90px", false, undefined, true, true, "text"),
      col("KPI", "KPI", "text", "250px", false, undefined, true, true, "text"),
      col("Descr", "Description", "text", "350px", false, undefined, true, true, "text"),
      col("UOM", "UOM", "text", "120px", true, undefined, true, true, "text"),
      col("Criteria", "Criteria", "text", "120px", true, undefined, true, true, "text"),
      col("Flag", "Flag", "combo", "100px", true, [
        { label: "Active", value: "A" },
        { label: "Inactive", value: "IN" },
      ], true, true, "combo"),
      col("SPName", "SP Name", "text", "350px", true, undefined, true, true, "text"),
      col("MonthWiseSp", "Month Wise SP", "text", "350px", true, undefined, true, true, "text"),
    ]);
    fetchInit("KPIMasterInit", {});
  }, [fetchInit]);



  const handleImportClick = () => {
    setIsimport(true);

  }

  /* ===================== SEARCH HANDLER ===================== */

  const handleSearch = async () => {
    const searchPayload = {
      Usercontext: JSON.parse(localStorage.getItem("activeUserInfo") || "{}"),
      servicename: "KPIMasterSearch",
      JsonValue: {
        KPICode: criteria.KPICode,
        KPI: criteria.KPI,
        Descr: criteria.Descr,
        UOM: criteria.UOM,
        Criteria: criteria.Criteria,
        Flag: criteria.Flag,
        SPName: criteria.SPName,
        MonthWiseSp: criteria.MonthWiseSp,
      },
    };

    fetchInit("KPIMasterSearch", searchPayload.JsonValue);

    onSearch?.(criteria);
  }


  const submitKPI = async (
    rows: GridRow[] | GridRow,
    serviceName: string,
    messagedesc: string,
    emptyCheck = false,
    confirmmessage: string,
    isimport = false
  ) => {
    if (emptyCheck && Array.isArray(rows) && rows.length === 0) {
      alert("Kindly select at least one row to proceed.");
      return;
    }


    const confirmed = window.confirm(confirmmessage || "Are you sure you want to submit the data?");

    if (!confirmed) {
      return;
    }

    if (isimport) {
      serviceName = "KPIMasterAdd";
    }

    if (serviceName === "KPIMasterProcess" && selectedRows.length > 1) {
      alert("Only one row can be processed at a time.");
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
            Flag: row.Flag?.value ?? row.Flag
          })),
        }
      };
      console.log("KPI Submit Payload:", payload);
      const res = await KPIProcess(payload);
      console.log("KPI Submit Response:", res.data);
      setrow([]);
      setrow(res.data.data[0]);
      setSuccessMsg(true);
      if (isimport) {
        setIsimport(false);
      }
      setMessageDesc(messagedesc || "Data Saved successfully!");
    } catch (err: any) {
      console.error("Error submitting KPI data:", err);

      setErrMsg(true);

      let message = "An unknown error occurred";

      if (err?.response?.data) {
        const backendData = err.response.data;

        if (typeof backendData.message === "string") {
          message = backendData.message;
        } else if (typeof backendData.error === "string") {
          message = backendData.error;
        } else {
          message = JSON.stringify(backendData);
        }
      } else if (err?.message) {
        message = err.message;
      }

      seterrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFromChild = () =>
    submitKPI(selectedRows, "KPIMasterSubmit", "Data Submitted successfully!", true, "Do you want to submit the selected rows?", isimport);

  const handlesingleSubmitFromChild = (row: GridRow) =>
    submitKPI(row, "KPIMasterSubmit", "Data Submitted successfully!", false, "Do you want to submit the row?", isimport);

  const handleAddRowSaveFromChild = async (newRow: GridRow) =>
    submitKPI(newRow, "KPIMasterAdd", "Data Added successfully!", false, "Do you want to add the new row?");
  const handledeleteFromChild = async (row: GridRow) =>
    submitKPI(row, "KPIMasterDelete", "Data Deleted successfully!", false, "Do you want to delete the row?");

  const handleProcess = () =>
    submitKPI(selectedRows, "KPIMasterProcess", "KPI Processed successfully!", true, "Do you want to process the selected rows?");


  return (
    <div className="scale-[0.95] origin-top min-h-screen dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <Pagetitlecard
        title="KPI Master"

      />

      <div className="dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">KPI Search</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* KPI Code */}
          <div>
            <label htmlFor="KPICode" className="block mb-2 font-small">KPI Code</label>
            <input
              type="text"
              id="KPICode"
              name="KPICode"
              value={criteria.KPICode}
              onChange={(e) => setCriteria({ ...criteria, KPICode: e.target.value })}
              className="max-w-xs w-auto h-8 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="KPI" className="block mb-2 font-small">KPI</label>
            <input
              type="text"
              id="KPI"
              name="KPI"
              value={criteria.KPI}
              onChange={(e) => setCriteria({ ...criteria, KPI: e.target.value })}
              className="max-w-xs w-auto h-8 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="KPIDescr" className="block mb-2 font-small">KPI Description</label>
            <input
              type="text"
              id="KPIDescr"
              name="KPIDescr"
              value={criteria.Descr}
              onChange={(e) => setCriteria({ ...criteria, Descr: e.target.value })}
              className="max-w-xs w-auto h-8 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="UOM" className="block mb-2 font-small">UOM</label>
            <input
              type="text"
              id="UOM"
              name="UOM"
              value={criteria.UOM}
              onChange={(e) => setCriteria({ ...criteria, UOM: e.target.value })}
              className="max-w-xs w-auto h-8 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="Criteria" className="block mb-2 font-small">Criteria</label>
            <input
              type="text"
              id="Criteria"
              name="Criteria"
              value={criteria.Criteria}
              onChange={(e) => setCriteria({ ...criteria, Criteria: e.target.value })}
              className="max-w-xs w-auto h-8 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="SPName" className="block mb-2 font-small">SP Name</label>
            <input
              type="text"
              id="SPName"
              name="SPName"
              value={criteria.SPName}
              onChange={(e) => setCriteria({ ...criteria, SPName: e.target.value })}
              className="max-w-xs w-auto h-8 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="MonthWiseSp" className="block mb-2 font-small">Month Wise SP</label>
            <input
              type="text"
              id="MonthWiseSp"
              name="MonthWiseSp"
              value={criteria.MonthWiseSp}
              onChange={(e) => setCriteria({ ...criteria, MonthWiseSp: e.target.value })}
              className="max-w-xs w-auto h-8 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="Flag" className="block mb-2 font-small">Flag</label>
            <select
              id="Flag"
              name="Flag"
              value={criteria.Flag}
              onChange={(e) => setCriteria({ ...criteria, Flag: e.target.value })}
              className="max-w-xs w-auto h-8 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Flag</option>
              <option value="A">A</option>
              <option value="IN">IN</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center">
          <Button variant="primary" color="primary" className="mt-6 hover:opacity-90 hover:scale-105 transition-transform"
            onClick={handleSearch}
          >
            Search
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
        ondelete={handledeleteFromChild}
        disableEdit={false} filename={"KPIMaster.xlsx"}
        AddRowSave={handleAddRowSaveFromChild}
        handleImportClick={handleImportClick}
        isdelete={true}
        isedit={true}
      />
      <div className="flex justify-center">
        <button
          onClick={() => {
            if (selectedRows.length > 1) {
              alert("Only one row can be processed at a time.");
              return;
            }
            if (selectedRows.length === 0) {
              alert("Kindly select at least one row to proceed.");
              return;
            }
            setProcessShowPopup(true);
          }}
          className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center mt-4 ml-2"
        >
          Process
        </button>
      </div>


      {ProcessShowPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">

            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Process Criteria
            </h2>
            <h3 className="text-md mb-4 text-gray-600 dark:text-gray-300">
              {selectedRows[0]?.KPICode} - {selectedRows[0]?.KPI}
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="FromDate" className="block mb-1 text-sm">
                  From Date
                </label>
                <input
                  type="date"
                  id="FromDate"
                  value={Processcriteria.FromDate}
                  onChange={(e) =>
                    setProcessCriteria({ ...Processcriteria, FromDate: e.target.value })
                  }
                  className="w-full h-9 px-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="ToDate" className="block mb-1 text-sm">
                  To Date
                </label>
                <input
                  type="date"
                  id="ToDate"
                  value={Processcriteria.ToDate}
                  onChange={(e) =>
                    setProcessCriteria({ ...Processcriteria, ToDate: e.target.value })
                  }
                  className="w-full h-9 px-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="ProcessMonth" className="block mb-1 text-sm">
                  Process Month
                </label>
                <input
                  type="month"
                  id="ProcessMonth"
                  value={Processcriteria.ProcessMonth}
                  onChange={(e) =>
                    setProcessCriteria({
                      ...Processcriteria,
                      ProcessMonth: e.target.value,
                    })
                  }
                  className="w-full h-9 px-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setProcessShowPopup(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                disabled={!isFormValid}
                onClick={handleProcess}
                className={`px-4 py-2 rounded-md text-white
    ${isFormValid
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                Process
              </button>

            </div>

          </div>
        </div>
      )}


      {successMsg && (
        <SuccessPopup
          message={MessageDesc || "Data Saved successfully!"}
          isopen={true}
          onClose={() => setSuccessMsg(false)}
        />
      )}
      {errMsg && (
        <ErrorPopup
          message={errorMessage}
          isopen={true}
          onClose={() => setErrMsg(false)}
        />
      )}

    </div>
  );
}


export default ReactApp;
