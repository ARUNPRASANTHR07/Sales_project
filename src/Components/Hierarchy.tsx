import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

interface Mark_Hier {
    State: string,
    Region: string,
    Zone: string,
    Sector: string,
    Area: string,
    InfluencerCount: number,
    BalanceAmount: number,
    RedeemedAmount: number,
    ScannedAmount: number
}

interface Props {
    row: Mark_Hier;
    showBack?: boolean;        // control visibility
    onBack?: () => void;       // callback
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value || 0);
};

const HierarchyCard: React.FC<Props> = ({ row, showBack = true, onBack }) => {

    const redemptionPercent = row.ScannedAmount
        ? (row.RedeemedAmount / row.ScannedAmount) * 100
        : 0;

    return (
        <div className="bg-white dark:bg-gray-900 
                    rounded-3xl shadow-lg 
                    p-4 sm:p-6 
                    border border-gray-100 dark:border-gray-700 
                    hover:shadow-2xl transition-all duration-300">

            {/* Header Section */}
            <div className="flex flex-wrap justify-between items-start gap-3 sm:gap-4 mb-4 sm:mb-6">

                <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white truncate">
                        {row.State}
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words line-clamp-2">
                        {row.Region} • {row.Zone} • {row.Sector} • {row.Area}
                    </p>
                </div>

                <div className="text-right flex-shrink-0">
                    <p className="text-[10px] sm:text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                        Influencers
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                        {row.InfluencerCount || 0}
                    </p>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">

                <div className="text-center">
                    <p className="text-[10px] sm:text-xs uppercase text-gray-500 dark:text-gray-400 tracking-widest">
                        Scanned
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-1 truncate">
                        {formatCurrency(row.ScannedAmount)}
                    </p>
                </div>

                <div className="text-center border-x border-gray-200 dark:border-gray-700">
                    <p className="text-[10px] sm:text-xs uppercase text-gray-500 dark:text-gray-400 tracking-widest">
                        Redeemed
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1 truncate">
                        {formatCurrency(row.RedeemedAmount)}
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-[10px] sm:text-xs uppercase text-gray-500 dark:text-gray-400 tracking-widest">
                        Balance
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 mt-1 truncate">
                        {formatCurrency(row.BalanceAmount)}
                    </p>
                </div>

            </div>

            {/* Performance Indicator */}
            <div className="mt-4 sm:mt-6">
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Redemption Ratio</span>
                    <span>{redemptionPercent.toFixed(1)}%</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${redemptionPercent}%` }}
                    />
                </div>
            </div>

        </div>
    );
};

export default HierarchyCard;
