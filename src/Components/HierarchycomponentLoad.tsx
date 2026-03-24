import React, { useState, useMemo } from "react";

interface Props {
    Marketing_Hier: any[];
}

const HierarchyComponent: React.FC<Props> = ({ Marketing_Hier }) => {

    const [selectedState, setSelectedState] = useState<string>("");
    const [selectedRegion, setSelectedRegion] = useState<string>("");
    const [selectedZone, setSelectedZone] = useState<string>("");
    const [selectedSector, setSelectedSector] = useState<string>("");

    /* UNIQUE STATES */
    const states = useMemo(() => {
        return Array.from(
            new Map(
                Marketing_Hier.map(item => [
                    item.State_Code,
                    { code: item.State_Code, name: item.State }
                ])
            ).values()
        );
    }, [Marketing_Hier]);

    /* FILTERED LEVELS */

    const regions = Marketing_Hier
        .filter(x => x.State_Code === selectedState)
        .filter((v, i, arr) =>
            arr.findIndex(t => t.Region_Code === v.Region_Code) === i
        );

    const zones = Marketing_Hier
        .filter(x => x.State_Code === selectedState && x.Region_Code === selectedRegion)
        .filter((v, i, arr) =>
            arr.findIndex(t => t.Zone_Code === v.Zone_Code) === i
        );

    const sectors = Marketing_Hier
        .filter(x =>
            x.State_Code === selectedState &&
            x.Region_Code === selectedRegion &&
            x.Zone_Code === selectedZone
        )
        .filter((v, i, arr) =>
            arr.findIndex(t => t.Sector_Code === v.Sector_Code) === i
        );

    const areas = Marketing_Hier
        .filter(x =>
            x.State_Code === selectedState &&
            x.Region_Code === selectedRegion &&
            x.Zone_Code === selectedZone &&
            x.Sector_Code === selectedSector
        );

    return (
        <div className="grid md:grid-cols-5 gap-6 mt-6">

            {/* STATES */}
            <div>
                <h3 className="font-bold mb-3">States</h3>
                {states.map(state => (
                    <div
                        key={state.code}
                        onClick={() => {
                            setSelectedState(state.code);
                            setSelectedRegion("");
                            setSelectedZone("");
                            setSelectedSector("");
                        }}
                        className={`cursor-pointer p-2 rounded mb-2 ${selectedState === state.code ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                    >
                        {state.name}
                    </div>
                ))}
            </div>

            {/* REGIONS */}
            {selectedState && (
                <div>
                    <h3 className="font-bold mb-3">Regions</h3>
                    {regions.map(r => (
                        <div
                            key={r.Region_Code}
                            onClick={() => {
                                setSelectedRegion(r.Region_Code);
                                setSelectedZone("");
                                setSelectedSector("");
                            }}
                            className={`cursor-pointer p-2 rounded mb-2 ${selectedRegion === r.Region_Code ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                        >
                            {r.Region}
                        </div>
                    ))}
                </div>
            )}

            {/* ZONES */}
            {selectedRegion && (
                <div>
                    <h3 className="font-bold mb-3">Zones</h3>
                    {zones.map(z => (
                        <div
                            key={z.Zone_Code}
                            onClick={() => {
                                setSelectedZone(z.Zone_Code);
                                setSelectedSector("");
                            }}
                            className={`cursor-pointer p-2 rounded mb-2 ${selectedZone === z.Zone_Code ? "bg-purple-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                        >
                            {z.Zone}
                        </div>
                    ))}
                </div>
            )}

            {/* SECTORS */}
            {selectedZone && (
                <div>
                    <h3 className="font-bold mb-3">Sectors</h3>
                    {sectors.map(s => (
                        <div
                            key={s.Sector_Code}
                            onClick={() => setSelectedSector(s.Sector_Code)}
                            className={`cursor-pointer p-2 rounded mb-2 ${selectedSector === s.Sector_Code ? "bg-yellow-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                        >
                            {s.Sector}
                        </div>
                    ))}
                </div>
            )}

            {/* AREAS */}
            {selectedSector && (
                <div>
                    <h3 className="font-bold mb-3">Areas</h3>
                    {areas.map(a => (
                        <div
                            key={a.Area_Code}
                            className="p-2 rounded mb-2 bg-red-200 dark:bg-red-800"
                        >
                            {a.Area}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default HierarchyComponent;