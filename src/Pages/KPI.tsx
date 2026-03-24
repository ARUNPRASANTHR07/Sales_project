import { useState } from "react";
import {
    ClipboardDocumentListIcon,
    ChartBarIcon,

} from "@heroicons/react/24/solid";

import SidebarItem from "../Components/SidebarItem";
import KPIMaster from "../Pages/KPI/KPIMaster";
import KPIPROCESSMASTER from "../Pages/KPI/KPIProcessMaster";

type ActiveView = "KPI_PROCESS" | "KPI_MASTER";

const AppLayout = () => {
    const [expanded, setExpanded] = useState(false);
    const [activeView, setActiveView] =
        useState<ActiveView>("KPI_MASTER");

    const renderContent = () => {
        switch (activeView) {
            case "KPI_MASTER":
                return <KPIMaster />;
            case "KPI_PROCESS":
            default:
                return <KPIPROCESSMASTER />;
        }
    };

    return (
        <div className="flex h-full w-full overflow-hidden dark:bg-gray-900">

            {/* Sidebar */}
            <aside
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                className={`
    flex-shrink-0
    transition-all duration-300 ease-in-out
    ${expanded ? "w-60" : "w-11"}
    bg-gray-100 dark:bg-gray-700
    border-r border-gray-200 dark:border-gray-600
  `}
            >

                <nav className="mt-6 space-y-1">
                    <SidebarItem
                        label="KPI Master"
                        expanded={expanded}
                        icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
                        active={activeView === "KPI_MASTER"}
                        onClick={() => setActiveView("KPI_MASTER")}
                    />

                    <SidebarItem
                        label="KPI Process Master"
                        expanded={expanded}
                        icon={
                            <ChartBarIcon className="h-4 w-4" />
                        }
                        active={activeView === "KPI_PROCESS"}
                        onClick={() => setActiveView("KPI_PROCESS")}
                    />
                </nav>
            </aside>

            {/* Main Section */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <main className="flex-1 overflow-auto p-4">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
