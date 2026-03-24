import React, { useMemo } from "react";
import { GridColumn, GridRow } from "./grid";

interface AddRowModalProps {
    open: boolean;
    columns: GridColumn[];
    row: GridRow;
    onChange: (row: GridRow) => void;
    onAddNewPopupClose: () => void;
    onAddNewPopupSave: (row: GridRow) => void;
}

const AddRowModal: React.FC<AddRowModalProps> = ({
    open,
    columns,
    row,
    onChange,
    onAddNewPopupClose,
    onAddNewPopupSave,
}) => {




    /* ================= VALIDATION ================= */

    const isFormValid = useMemo(() => {
        return columns
            .filter(col => col.ismandatory) // ✅ only mandatory fields
            .every(col => {
                const value = row?.[col.key];

                switch (col.popuptype) {
                    case "combo":
                        // combo must have a selected value (not empty)
                        return value !== "" && value !== null && value !== undefined;

                    case "number":
                        // number must be a valid number
                        return typeof value === "number" && !isNaN(value);

                    case "date":
                        // date must be non-empty
                        return Boolean(value);

                    case "text":
                    default:
                        // text must be non-empty string
                        return typeof value === "string" && value.trim() !== "";
                }
            });
    }, [columns, row]);

    /* ================= UI ================= */
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-xl p-6 space-y-4">

                {/* HEADER */}
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Add New Record
                </h2>

                {/* FORM */}
                <div className="grid grid-cols-2 gap-4">
                    {columns.map(col => {
                        const value = row[col.key] ?? "";
                        const isInvalid = col.ismandatory && (() => {
                            const value = row[col.key];

                            if (col.popuptype === "combo") {
                                return value === "" || value === null || value === undefined || value === " ";
                            }

                            if (col.popuptype === "number") {
                                return typeof value !== "number" || isNaN(value);
                            }

                            return value === "" || value === null || value === undefined;
                        })();


                        return (
                            <div key={col.key} className="flex flex-col gap-1">
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    {col.label}
                                    {col.ismandatory && (
                                        <span className="text-red-500 ml-1">*</span>
                                    )}
                                </label>

                                {/* TEXT */}
                                {col.popuptype === "text" && col.popupedit ? (
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={e =>
                                            onChange({ ...row, [col.key]: e.target.value })
                                        }
                                        className={`px-3 py-2 rounded border dark:bg-gray-800
                      ${isInvalid ? "border-red-500" : "border-gray-300"}`}
                                    />
                                ) : ('')}

                                {/* NUMBER */}
                                {col.popuptype === "number" && (
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={e =>
                                            onChange({
                                                ...row,
                                                [col.key]: Number(e.target.value),
                                            })
                                        }
                                        className={`px-3 py-2 rounded border dark:bg-gray-800
                      ${isInvalid ? "border-red-500" : "border-gray-300"}`}
                                    />
                                )}

                                {/* DATE */}
                                {col.popuptype === "date" && (
                                    <input
                                        type="date"
                                        value={value}
                                        onChange={e =>
                                            onChange({ ...row, [col.key]: e.target.value })
                                        }
                                        className={`px-3 py-2 rounded border dark:bg-gray-800
                      ${isInvalid ? "border-red-500" : "border-gray-300"}`}
                                    />
                                )}

                                {/* COMBO */}
                                {col.popuptype === "combo" && (
                                    <select
                                        value={value}
                                        onChange={e =>
                                            onChange({ ...row, [col.key]: e.target.value })
                                        }
                                        className={`px-3 py-2 rounded border dark:bg-gray-800
                      ${isInvalid ? "border-red-500" : "border-gray-300"}`}
                                    >
                                        <option value="">Select</option>
                                        {(typeof col.options === "function"
                                            ? col.options(row)
                                            : col.options)?.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={onAddNewPopupClose}
                        className="px-4 py-2 rounded border"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onAddNewPopupSave(row)}
                        disabled={!isFormValid}
                        className={`px-4 py-2 rounded text-white
              ${isFormValid
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"}`}
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddRowModal;
