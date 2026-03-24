import React from "react";

interface InfluencerRow {
    InfluencerMobile: string;
    Name: string;
    ScannedAmount: number;
    RedeemedAmount: number;
    BalanceAmount: number;
}

interface Props {
    row: InfluencerRow;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);
};

const InfluencerComponent: React.FC<Props> = ({ row }) => {

    const performance =
        row.ScannedAmount > 0
            ? (row.RedeemedAmount / row.ScannedAmount) * 100
            : 0;

    return (
        <div className="bg-white dark:bg-gray-900 
                    rounded-2xl shadow-md hover:shadow-xl 
                    transition duration-300 
                    border border-gray-100 dark:border-gray-700 
                    p-4 sm:p-6">

            {/* Header Section */}
            <div className="flex justify-between items-start mb-4 sm:mb-5">
                <div>
                    <div className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                        {row.Name}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300">
                        {row.InfluencerMobile}
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wide">
                        Redemption Rate
                    </div>
                    <div className="text-base sm:text-lg font-bold text-indigo-600">
                        {performance.toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Financial Metrics */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">

                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                        Scanned
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mt-1">
                        {formatCurrency(row.ScannedAmount)}
                    </div>
                </div>

                <div className="bg-teal-100 dark:bg-teal-800/40 rounded-xl p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                        Redeemed
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-teal-900 dark:text-teal-200 mt-1">
                        {formatCurrency(row.RedeemedAmount)}
                    </div>
                </div>

                <div className="bg-rose-100 dark:bg-rose-800/40 rounded-xl p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                        Balance
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-rose-900 dark:text-rose-200 mt-1">
                        {formatCurrency(row.BalanceAmount)}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default InfluencerComponent;