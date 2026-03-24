import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/solid";
import Darkmode from "../../Components/Darkmode";
import { Button } from "../../Components/Button";
import Grid, { ColumnType, GridRow } from '../../Components/grid';
import Loader from "../../Components/Loading";
import apiClient from "../../api/apiClient";
import SuccessPopup from '../../Components/SuccessPopup';
import ErrorPopup from '../../Components/ErrorMsgpopup';
import HierarchyComponent from "../../Components/Hierarchy";



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


const CouponDetails: React.FC = () => {
    const navigate = useNavigate();


    /* MAIN DROPDOWNS */

    const [successMsg, setSuccessMsg] = useState(false);
    const [errMsg, setErrMsg] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");


    const [financialYear, setFinancialYear] = useState<string>("");
    const [financialPeriod, setFinancialPeriod] = useState<string>("");

    const [financialYearOpts, setFinancialYearOpts] = useState<Array<{ label: string, value: string }>>([]);
    const [financialPeriodOpts, setFinancialPeriodOpts] = useState<Array<{ label: string, value: string, yearid: string, Sno: number }>>([]);

    const [rows, setRows] = useState<any[]>([]);
    const [columns, setColumns] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const [staticData, setStaticData] = useState<Array<any>>([]);
    const [InfluencerDetails, setInfluencerDetails] = useState<any[]>([]);
    const [PreviousDrillHierarchy, setPreviousDrillHierarchy] = useState<any[]>([]);
    const [filteredPeriodOpts, setFilteredPeriodOpts] = useState<
        Array<{ label: string; value: string; yearid: string, Sno: number }>
    >([]);

    const [selectedHierarchy, setSelectedHierarchy] = useState({
        State: "",
        Region: "",
        Zone: "",
        Sector: "",
        Area: ""
    });
    const [level, setLevel] = useState<
        "STATE" | "REGION" | "ZONE" | "SECTOR" | "AREA" | "INFLUENCER"
    >("STATE");

    const hierarchyDisplay = [
        selectedHierarchy.State && `State: ${selectedHierarchy.State}`,
        selectedHierarchy.Region && `Region: ${selectedHierarchy.Region}`,
        selectedHierarchy.Zone && `Zone: ${selectedHierarchy.Zone}`,
        selectedHierarchy.Sector && `Sector: ${selectedHierarchy.Sector}`,
        selectedHierarchy.Area && `Area: ${selectedHierarchy.Area}`,
    ]
        .filter(Boolean)
        .join("  |  ");

    useEffect(() => {
        if (!financialYear) {
            setFilteredPeriodOpts([]);
            setFinancialPeriod("");
            return;
        }

        const filtered = financialPeriodOpts
            .filter((period) => period.yearid === financialYear)
            .sort((a, b) => a.Sno - b.Sno);   // 🔥 ORDER BY Sno ASC

        setFilteredPeriodOpts(filtered);
        setFinancialPeriod("");

    }, [financialYear, financialPeriodOpts]);

    const handleGetDetails = async () => {


        // /Please select Financial Year or Financial Period 
        if (!financialYear) {
            setErrMsg(true);
            seterrorMessage("Please select Financial Year");
            return;
        }

        const payload = {
            Usercontext: JSON.parse(localStorage.getItem("activeUserInfo") || "{}"),
            servicename: "CouponSearch",   // or your backend service name
            JsonValue: {
                FinancialYear: financialYear,
                FinancialPeriod: financialPeriod || ""
            }
        }

        console.log("Request Payload:", payload);

        try {
            setLoading(true);

            const res = await apiClient.post("/common", payload);

            if (res.data.success) {
                setStaticData(res.data.data[0] || []);
                setLevel("STATE"); // Reset drill level
            }

        } catch (err: any) {

            setErrMsg(true);

            let message = "An unknown error occurred";

            if (err?.response?.data?.message) {
                message = err.response.data.message;
            } else if (err?.message) {
                message = err.message;
            }

            seterrorMessage(message);

        } finally {
            setLoading(false);
        }
    };


    /* INIT LOAD */
    const fetchInit = async () => {
        setLoading(true);

        setColumns([
            col("id", "S.No", "label", "70px", false, undefined, false, false, "label"),
            col("InfluencerMobile", "InfluencerMobile", "label", "70px", false, undefined, false, false, "label"),
            col("Name", "Name", "label", "150px", false, undefined, false, false, "label"),
            col("ScannedAmount", "Scanned Amount", "number", "100px", false, undefined, false, false, "number"),
            col("RedeemedAmount", "Redeemed Amount", "number", "100px", false, undefined, false, false, "number"),
            col("BalanceAmount", "Balance Amount", "number", "100px", false, undefined, false, false, "number"),
        ]);

        try {
            const res = await apiClient.post("/common", {
                Usercontext: JSON.parse(localStorage.getItem("activeUserInfo") || "{}"),
                servicename: "CouponInit",
                JsonValue: {},
            });

            console.log("Init API response:", res);

            if (res.data.success) {
                setStaticData(res.data.data[0] || []);

                setFinancialYearOpts(res.data.data[1] || []);
                setFinancialPeriodOpts(res.data.data[2] || []);
                setFinancialYear(res.data.data[3] || "");
            }


        }
        catch (err: any) {


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
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchInit();
    }, []);


    useEffect(() => {

        const stateWise = Object.values(
            staticData.reduce((acc: any, item: any) => {
                if (!acc[item.State]) {
                    acc[item.State] = {
                        State: item.State,
                        InfluencerCount: 0,
                        ScannedAmount: 0,
                        RedeemedAmount: 0,
                        BalanceAmount: 0,
                    };
                }

                acc[item.State].InfluencerCount += item.InfluencerCount;
                acc[item.State].ScannedAmount += item.ScannedAmount;
                acc[item.State].RedeemedAmount += item.RedeemedAmount;
                acc[item.State].BalanceAmount += item.BalanceAmount;

                return acc;
            }, {})
        );

        setRows(stateWise);
    }, [staticData]);

    const handleDrill = (row: any) => {
        if (level === "STATE") {
            setSelectedHierarchy({ ...selectedHierarchy, State: row.State });
            setLevel("REGION");
            loadRegionWise(row.State);
        }
        else if (level === "REGION") {
            setSelectedHierarchy({ ...selectedHierarchy, Region: row.Region });
            setLevel("ZONE");
            loadZoneWise(selectedHierarchy.State, row.Region);
        }
        else if (level === "ZONE") {
            setSelectedHierarchy({ ...selectedHierarchy, Zone: row.Zone });
            setLevel("SECTOR");
            loadSectorWise(selectedHierarchy.State, selectedHierarchy.Region, row.Zone);
        }
        else if (level === "SECTOR") {
            setSelectedHierarchy({ ...selectedHierarchy, Sector: row.Sector });
            setLevel("AREA");
            loadAreaWise(
                selectedHierarchy.State,
                selectedHierarchy.Region,
                selectedHierarchy.Zone,
                row.Sector
            );
        }
        else if (level === "AREA") {

            const selectedArea = row.Area;

            setSelectedHierarchy(prev => ({
                ...prev,
                Area: selectedArea
            }));

            // 🔥 TRIGGER API HERE
            fetchAreaDetails(
                selectedHierarchy.State,
                selectedHierarchy.Region,
                selectedHierarchy.Zone,
                selectedHierarchy.Sector,
                selectedArea
            );
        }
    };


    const loadRegionWise = (state: string) => {
        const regionWise = Object.values(
            staticData
                .filter(x => x.State === state)
                .reduce((acc: any, item: any) => {
                    if (!acc[item.Region]) {
                        acc[item.Region] = {
                            State: state,
                            Region: item.Region,
                            InfluencerCount: 0,
                            ScannedAmount: 0,
                            RedeemedAmount: 0,
                            BalanceAmount: 0,
                        };
                    }

                    acc[item.Region].InfluencerCount += item.InfluencerCount;
                    acc[item.Region].ScannedAmount += item.ScannedAmount;
                    acc[item.Region].RedeemedAmount += item.RedeemedAmount;
                    acc[item.Region].BalanceAmount += item.BalanceAmount;

                    return acc;
                }, {})
        );

        setRows(regionWise);
    };
    const loadZoneWise = (state: string, region: string) => {
        const zoneWise = Object.values(
            staticData
                .filter(
                    x =>
                        x.State === state &&
                        x.Region === region
                )
                .reduce((acc: any, item: any) => {
                    if (!acc[item.Zone]) {
                        acc[item.Zone] = {
                            State: state,
                            Region: region,
                            Zone: item.Zone,
                            InfluencerCount: 0,
                            ScannedAmount: 0,
                            RedeemedAmount: 0,
                            BalanceAmount: 0,
                        };
                    }

                    acc[item.Zone].InfluencerCount += item.InfluencerCount;
                    acc[item.Zone].ScannedAmount += item.ScannedAmount;
                    acc[item.Zone].RedeemedAmount += item.RedeemedAmount;
                    acc[item.Zone].BalanceAmount += item.BalanceAmount;

                    return acc;
                }, {})
        );

        setRows(zoneWise);
    };
    const loadSectorWise = (
        state: string,
        region: string,
        zone: string
    ) => {
        const sectorWise = Object.values(
            staticData
                .filter(
                    x =>
                        x.State === state &&
                        x.Region === region &&
                        x.Zone === zone
                )
                .reduce((acc: any, item: any) => {
                    if (!acc[item.Sector]) {
                        acc[item.Sector] = {
                            State: state,
                            Region: region,
                            Zone: zone,
                            Sector: item.Sector,
                            InfluencerCount: 0,
                            ScannedAmount: 0,
                            RedeemedAmount: 0,
                            BalanceAmount: 0,
                        };
                    }

                    acc[item.Sector].InfluencerCount += item.InfluencerCount;
                    acc[item.Sector].ScannedAmount += item.ScannedAmount;
                    acc[item.Sector].RedeemedAmount += item.RedeemedAmount;
                    acc[item.Sector].BalanceAmount += item.BalanceAmount;

                    return acc;
                }, {})
        );

        setRows(sectorWise);
    };
    const loadAreaWise = (
        state: string,
        region: string,
        zone: string,
        sector: string
    ) => {
        const areaWise = Object.values(
            staticData
                .filter(
                    x =>
                        x.State === state &&
                        x.Region === region &&
                        x.Zone === zone &&
                        x.Sector === sector
                )
                .reduce((acc: any, item: any) => {
                    if (!acc[item.Area]) {
                        acc[item.Area] = {
                            State: state,
                            Region: region,
                            Zone: zone,
                            Sector: sector,
                            Area: item.Area,
                            InfluencerCount: 0,
                            ScannedAmount: 0,
                            RedeemedAmount: 0,
                            BalanceAmount: 0,
                        };
                    }

                    acc[item.Area].InfluencerCount += item.InfluencerCount;
                    acc[item.Area].ScannedAmount += item.ScannedAmount;
                    acc[item.Area].RedeemedAmount += item.RedeemedAmount;
                    acc[item.Area].BalanceAmount += item.BalanceAmount;

                    return acc;
                }, {})
        );

        setRows(areaWise);
    };

    const handleBack = () => {
        if (level === "INFLUENCER") {
            setLevel("AREA");
            loadAreaWise(
                selectedHierarchy.State,
                selectedHierarchy.Region,
                selectedHierarchy.Zone,
                selectedHierarchy.Sector
            );
            setSelectedHierarchy(prev => ({
                ...prev,
                Area: ""
            }));
        }
        if (level === "AREA") {
            setLevel("SECTOR");
            loadSectorWise(
                selectedHierarchy.State,
                selectedHierarchy.Region,
                selectedHierarchy.Zone
            );
            setSelectedHierarchy(prev => ({
                ...prev,
                Sector: ""
            }));
        }
        else if (level === "SECTOR") {
            setLevel("ZONE");
            loadZoneWise(
                selectedHierarchy.State,
                selectedHierarchy.Region
            );
            setSelectedHierarchy(prev => ({
                ...prev,
                Zone: ""
            }));
        }
        else if (level === "ZONE") {
            setLevel("REGION");
            loadRegionWise(selectedHierarchy.State);
            setSelectedHierarchy(prev => ({
                ...prev,
                Region: ""
            }));
        }
        else if (level === "REGION") {
            setLevel("STATE");

            // Reload state level summary
            const stateWise = Object.values(
                staticData.reduce((acc: any, item: any) => {
                    if (!acc[item.State]) {
                        acc[item.State] = {
                            State: item.State,
                            InfluencerCount: 0,
                            ScannedAmount: 0,
                            RedeemedAmount: 0,
                            BalanceAmount: 0,
                        };
                    }

                    acc[item.State].InfluencerCount += item.InfluencerCount;
                    acc[item.State].ScannedAmount += item.ScannedAmount;
                    acc[item.State].RedeemedAmount += item.RedeemedAmount;
                    acc[item.State].BalanceAmount += item.BalanceAmount;

                    return acc;
                }, {})
            );

            setRows(stateWise);
            setSelectedHierarchy({
                State: "",
                Region: "",
                Zone: "",
                Sector: "",
                Area: ""
            });
        }
    };


    const fetchAreaDetails = async (
        state: string,
        region: string,
        zone: string,
        sector: string,
        area: string
    ) => {


        // 🔥 API CALL TO FETCH INFLUENCER LEVEL Only If InfluencerDetails length is 0 or previous hier is differ from current seledted hierarchy
        if (InfluencerDetails.length === 0 || !PreviousDrillHierarchy.some(h =>
            h.state === state && h.region === region && h.zone === zone && h.sector === sector && h.area === area
        )) {
            try {
                setLoading(true);

                const res = await apiClient.post("/common", {
                    Usercontext: JSON.parse(localStorage.getItem("activeUserInfo") || "{}"),
                    servicename: "CouponAreaDetails",  // create backend service
                    JsonValue: {
                        State: state,
                        Region: region,
                        Zone: zone,
                        Sector: sector,
                        Area: area
                    }
                });

                if (res.data.success) {
                    setRows(res.data.data[0]);   // influencer level data
                    setInfluencerDetails(res.data.data[0]); // additional details if needed
                    setLevel("INFLUENCER");     // new level
                    setPreviousDrillHierarchy([]); // clear drill history on new drill 
                    setPreviousDrillHierarchy((prev) => [...prev, { state, region, zone, sector, area }]); // store drill path
                }

            } catch (err: any) {

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
                setLoading(false);
            }
        }
        else {

            console.log("Using cached influencer details for:", { state, region, zone, sector, area }, PreviousDrillHierarchy);
            if (InfluencerDetails.length > 0) {
                setLevel("INFLUENCER");
                setRows(InfluencerDetails);
            }
            else {
                setErrMsg(true);
                seterrorMessage("No influencer details available kindly refresh the screen");
            }
        }
    };

    return (
        <div className="min-h-screen dark:bg-gray-900 p-4 
                    text-sm sm:text-base 
                    text-gray-900 dark:text-white">

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                    Coupon Details
                </h1>

                <div className="flex gap-3">
                    <Darkmode />
                    <Button
                        onClick={() => navigate("/Mainpage")}
                        className="px-3 py-1 sm:px-4 sm:py-2"
                    >
                        <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </div>
            </div>
            {/* Financial Filters */}
            {/* Executive Financial Filter Bar */}
            <div className="bg-gradient-to-r 
                from-gray-50 to-gray-100 
                dark:from-gray-800 dark:to-gray-900
                p-6 rounded-2xl 
                shadow-lg mb-6">

                <div className="flex flex-col lg:flex-row 
                    lg:items-end 
                    justify-between gap-6">

                    {/* Left Section */}
                    <div className="flex flex-col sm:flex-row gap-6 w-full">

                        {/* Financial Year */}
                        <div className="flex flex-col w-full sm:w-64">
                            <label className="text-sm font-semibold 
                                  text-gray-600 dark:text-gray-300 mb-2">
                                Financial Year
                            </label>

                            <select
                                value={financialYear}
                                onChange={(e) => setFinancialYear(e.target.value)}
                                className="h-12 px-4 
                               rounded-xl 
                               border border-gray-300 
                               dark:border-gray-600
                               bg-white dark:bg-gray-800
                               focus:ring-2 focus:ring-blue-500
                               outline-none
                               text-base font-medium"
                            >
                                <option value="">Select Financial Year</option>
                                {financialYearOpts.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Financial Period */}
                        <div className="flex flex-col w-full sm:w-64">
                            <label className="text-sm font-semibold 
                                  text-gray-600 dark:text-gray-300 mb-2">
                                Financial Period
                            </label>

                            <select
                                value={financialPeriod}
                                onChange={(e) => setFinancialPeriod(e.target.value)}
                                className="h-12 px-4 
                               rounded-xl 
                               border border-gray-300 
                               dark:border-gray-600
                               bg-white dark:bg-gray-800
                               focus:ring-2 focus:ring-blue-500
                               outline-none
                               text-base font-medium"
                            >
                                <option value="">Select Financial Period</option>
                                {filteredPeriodOpts.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {hierarchyDisplay && (
                            <div className="mt-4 lg:mt-0 
        bg-blue-50 dark:bg-blue-900/30 
        text-blue-800 dark:text-blue-200
        px-4 py-3 rounded-xl 
        text-sm font-semibold 
        shadow-inner">

                                {hierarchyDisplay}
                            </div>
                        )}
                    </div>

                    {/* Right Section - CTA */}
                    <div className="flex items-end">
                        <Button
                            onClick={handleGetDetails}
                            className="h-12 px-8 
                           rounded-xl 
                           text-base font-semibold 
                           shadow-md 
                           bg-blue-600 hover:bg-blue-700
                           transition-all duration-200"
                        >
                            Get Details
                        </Button>
                    </div>

                </div>
            </div>
            {loading && <Loader loading />}

            {level !== "STATE" && (
                <div className="mb-4">
                    <Button
                        onClick={handleBack}
                        className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm"
                    >
                        ← Back
                    </Button>
                </div>
            )}

            {level === "INFLUENCER" ? (
                <div className="grid 
                           
                            gap-4 mt-4 
                            text-xs sm:text-sm md:text-base">


                    <Grid data={rows}
                        columns={columns}
                        buttonvisible={true}
                        disableEdit={true} filename={"View Coupon Details.xlsx"}
                        isdelete={false}
                        isedit={false}
                    />

                </div>
            ) : (
                <div className="grid 
                            grid-cols-1 
                            sm:grid-cols-1 
                            md:grid-cols-2 
                            lg:grid-cols-3 
                            gap-4 mt-4 
                            text-xs sm:text-sm md:text-base">
                    {rows.map((row, i) => (
                        <div
                            key={i}
                            onClick={() => handleDrill(row)}
                            className="cursor-pointer"
                        >
                            <HierarchyComponent row={row} />
                        </div>
                    ))}
                </div>
            )}

            {successMsg && (
                <SuccessPopup
                    message={"Data Saved successfully!"}
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

export default CouponDetails;
