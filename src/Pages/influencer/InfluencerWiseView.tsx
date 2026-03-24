import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/solid";
import Darkmode from "../../Components/Darkmode";
import { Button } from "../../Components/Button";
import Grid, { ColumnType, GridRow } from "../../Components/grid";
import Loader from "../../Components/Loading";
import SuccessPopup from "../../Components/SuccessPopup";
import ErrorPopup from "../../Components/ErrorMsgpopup";
import apiClient from "../../api/apiClient";

interface SearchCriteria {
    State: string;
    FinancialYear: string;
    PeriodFrom: string;
    PeriodTo: string;
    InfluencerMobile: string;
    InfluencerName: string;
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
    options?: Array<{ label: string; value: string }>
): GridColumn => ({
    key,
    label,
    type,
    width,
    editable,
    options
});

const InfluencerCouponReport: React.FC = () => {
    const navigate = useNavigate();

    const [criteria, setCriteria] = useState<SearchCriteria>({
        State: "",
        FinancialYear: "",
        PeriodFrom: "",
        PeriodTo: "",
        InfluencerMobile: "",
        InfluencerName: ""
    });

    const [rows, setRows] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);
    const [errMsg, setErrMsg] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [financialYear, setFinancialYear] = useState<string>("");
    const [Fromperiod, setFromperiod] = useState<string>("");
    const [ToPeriod, setToPeriod] = useState<string>("");

    const [stateOptions, setStateOptions] = useState<Array<{ label: string, value: string }>>([]);
    const [financialYearOptions, setFinancialYearOptions] = useState<Array<{ label: string, value: string }>>([]);
    const [periodOptions, setPeriodOptions] = useState<Array<{ label: string, value: string, yearid: string, Sno: number }>>([]);
    const [mobileOptions, setMobileOptions] = useState<Array<{ label: string, value: string, yearid: string, Sno: number }>>([]);
    const [nameOptions, setNameOptions] = useState<any[]>([]);
    const [itemOptions, setItemOptions] = useState<any[]>([]);
    const [filteredPeriodOpts, setFilteredPeriodOpts] = useState<
        Array<{ label: string; value: string; yearid: string, Sno: number }>
    >([]);

    /* ================= INIT ================= */

    useEffect(() => {
        fetchInit();
    }, []);

    useEffect(() => {
        setColumns([
            col("State", "State", "label", "120px"),
            col("Region", "Region", "label", "120px"),
            col("Zone", "Zone", "label", "120px"),
            col("Sector", "Sector", "label", "120px"),
            col("Area", "Area", "label", "120px"),
            col("InfluencerMobile", "Influencer Mobile", "label", "150px"),
            col("InfluencerName", "Influencer Name", "label", "180px"),
            col("ItemCode", "Item Code", "combo", "140px", true, itemOptions),
            col("ScannedAmount", "Scanned Amount", "number", "140px"),
            col("RedeemedAmount", "Redeemed Amount", "number", "150px"),
            col("BalanceAmount", "Balance Amount", "number", "140px"),
        ]);
    }, [itemOptions]);



    useEffect(() => {
        if (!financialYear) {
            setFilteredPeriodOpts([]);
            setFromperiod("");
            setToPeriod("");
            return;
        }

        const filtered = periodOptions
            .filter((period) => period.yearid === financialYear)
            .sort((a, b) => a.Sno - b.Sno);   // 🔥 ORDER BY Sno ASC

        setFilteredPeriodOpts(filtered);
        setFromperiod("");
        setToPeriod("");
    }, [financialYear, periodOptions]);


    const fetchInit = async () => {
        try {
            setLoading(true);

            const res = await apiClient.post("/common", {
                Usercontext: JSON.parse(localStorage.getItem("activeUserInfo") || "{}"),
                servicename: "InfluencerCouponInit",
                JsonValue: {}
            });

            if (res.data.success) {
                setStateOptions(res.data.data[0] || []);
                setFinancialYearOptions(res.data.data[1] || []);
                setPeriodOptions(res.data.data[2] || []);
                setFinancialYear(res.data.data[3]?.[0] || ""); // Set default financial year
                // setMobileOptions(res.data.data[3] || []);
                // setNameOptions(res.data.data[4] || []);
                // setItemOptions(res.data.data[5] || []);
            }
        } catch (err: any) {
            setErrMsg(true);
            setErrorMessage(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ================= SEARCH ================= */

    const handleGetDetails = async () => {

        if (criteria.PeriodFrom && criteria.PeriodTo) {
            if (criteria.PeriodFrom > criteria.PeriodTo) {
                setErrMsg(true);
                setErrorMessage("Period From cannot be greater than Period To");
                return;
            }
        }


        try {
            setLoading(true);

            const res = await apiClient.post("/common", {
                Usercontext: JSON.parse(localStorage.getItem("activeUserInfo") || "{}"),
                servicename: "InfluencerCouponSearch",
                JsonValue: criteria
            });

            if (res.data.success) {
                setRows(res.data.data[0] || []);
            }
        } catch (err: any) {
            setErrMsg(true);
            setErrorMessage(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="min-h-screen dark:bg-gray-900 text-gray-900 dark:text-white p-4">

            {/* ===== Caption Section (Like Reference) ===== */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl md:text-2xl font-bold">
                    Influencer Coupon Report
                </h1>

                <div className="flex gap-3">
                    <Darkmode />
                    <Button onClick={() => navigate("/Mainpage")}>
                        <HomeIcon className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* ===== Search Section ===== */}
            <div className="dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Search</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                    {/* State */}
                    <select
                        value={criteria.State}
                        onChange={(e) =>
                            setCriteria({ ...criteria, State: e.target.value })
                        }
                        className="h-10 border rounded px-3 dark:bg-gray-700"
                    >
                        <option value="">Select State</option>
                        {stateOptions.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Financial Year */}
                    <select
                        value={financialYear}
                        onChange={(e) => setFinancialYear(e.target.value)}
                        className="h-10 border rounded px-3 dark:bg-gray-700"
                    >
                        <option value="">Financial Year</option>
                        {financialYearOptions.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Period From */}
                    <select
                        value={Fromperiod}
                        onChange={(e) => setFromperiod(e.target.value)}
                        className="h-10 border rounded px-3 dark:bg-gray-700"
                    >
                        <option value="">Period From</option>
                        {filteredPeriodOpts.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Period To */}
                    <select
                        value={ToPeriod}
                        onChange={(e) => setToPeriod(e.target.value)}
                        className="h-10 border rounded px-3 dark:bg-gray-700"
                    >
                        <option value="">Period To</option>
                        {filteredPeriodOpts.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Influencer Mobile Auto Suggest */}
                    <input
                        list="mobileList"
                        placeholder="Influencer Mobile"
                        value={criteria.InfluencerMobile}
                        onChange={(e) =>
                            setCriteria({ ...criteria, InfluencerMobile: e.target.value })
                        }
                        className="h-10 border rounded px-3 dark:bg-gray-700"
                    />
                    <datalist id="mobileList">
                        {mobileOptions.map((m: any) => (
                            <option key={m.value} value={m.value} />
                        ))}
                    </datalist>

                    {/* Influencer Name Auto Suggest */}
                    <input
                        list="nameList"
                        placeholder="Influencer Name"
                        value={criteria.InfluencerName}
                        onChange={(e) =>
                            setCriteria({ ...criteria, InfluencerName: e.target.value })
                        }
                        className="h-10 border rounded px-3 dark:bg-gray-700"
                    />
                    <datalist id="nameList">
                        {nameOptions.map((n: any) => (
                            <option key={n.value} value={n.value} />
                        ))}
                    </datalist>

                </div>

                <div className="flex justify-center mt-6">
                    <Button onClick={handleGetDetails}>
                        Get Details
                    </Button>
                </div>
            </div>

            {/* ===== Grid Section ===== */}
            {loading && <Loader loading />}

            <Grid
                data={rows}
                columns={columns}
                buttonvisible={true}
                disableEdit={true}
                isdelete={false}
                isedit={false}

                filename={"InfluencerCouponReport.xlsx"}
            />

            {successMsg && (
                <SuccessPopup
                    message="Data Loaded Successfully"
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
};

export default InfluencerCouponReport;