import React, { useState, useMemo, useEffect } from "react";
import Button from "./Button";
import { PencilSquareIcon, TrashIcon, PlusCircleIcon, ArrowUpOnSquareIcon, ArrowLeftIcon, ArrowRightIcon, ForwardIcon, BackwardIcon } from "@heroicons/react/24/solid"
import Export from "./Excelexport";
import ImportFromExcel from "../Components/ImportExcelButton";

import DynamicPopup from "./DynamicPopup";
/* ================= TYPES ================= */

export interface GridRow {
  id: number | string;
  [key: string]: any;
}

export type ColumnType = "label" | "text" | "number" | "combo" | "date";

export interface GridColumn {
  key: string;
  label: string;
  type?: ColumnType;
  width?: string;
  editable?: boolean;
  options?:
  | { label: string; value: any }[]
  | ((row: GridRow) => { label: string; value: any }[]);
  ismandatory?: boolean;
  popupedit?: boolean;
  popuptype?: ColumnType;

}

interface GridProps {
  data: GridRow[];
  columns: GridColumn[];
  buttonvisible?: boolean;
  onSelectionChange?: (rows: GridRow[]) => void;
  onDataChange?: (newData: GridRow[]) => void;
  onsubmit?: (selectedRows: GridRow[]) => void;
  onsingleSubmit?: (row: GridRow) => void;
  ondelete?: (row: GridRow) => void;
  disableEdit?: boolean;
  isedit?: boolean;
  isdelete?: boolean;
  filename?: string;
  AddRowSave?: (row: GridRow) => Promise<void>;
  handleImportClick?: () => void;
}

const ROWS_PER_PAGE = 10;

/* ================= COMPONENT ================= */

const Grid: React.FC<GridProps> = ({
  data,
  columns,
  buttonvisible,
  onSelectionChange,
  onDataChange,
  onsubmit,
  onsingleSubmit,
  ondelete,
  disableEdit,
  isedit,
  isdelete,
  filename = "Export.xlsx",
  AddRowSave,
  handleImportClick
}) => {
  /* ===== STATE ===== */
  const [gridData, setGridData] = useState<GridRow[]>(data);
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [IsEditMode, setIsEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<GridRow | null>(null);

  /* ===== SYNC PROP DATA ===== */
  useEffect(() => {
    setGridData(data);

  }, [data]);

  /* ===== FILTER DATA ===== */
  const filteredData = useMemo(() => {
    return gridData.filter((row) => {
      if (!searchTerm) return true;

      if (searchColumn === "all") {
        return Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }

      return String(row[searchColumn] ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [gridData, searchTerm, searchColumn]);

  const handleSaveNewRow = async () => {
    if (!newRowData) return;

    const newRow: GridRow = {
      ...newRowData,

    };

    try {
      // 🔥 call parent (API happens there)
      await AddRowSave?.(newRow);
      // close popup ONLY on success
      setIsAddModalOpen(false);
      setNewRowData(null);
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save record");
    }
  };


  // ======= Pagination =======
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  /* ===== UPDATE CELL ===== */
  // 1. Add to GridProps interface
  // interface GridProps {
  //   data: GridRow[];
  //   columns: GridColumn[];
  //   buttonvisible?: boolean;
  //   onSelectionChange?: (rows: GridRow[]) => void;
  //   onDataChange?: (newData: GridRow[]) => void; // <--- Add this
  //   onsubmit?: (selectedRows: GridRow[]) => void;
  //   disableEdit?: boolean;
  // }

  // 2. Update updateCellValue function inside Grid component
  const updateCellValue = (
    rowId: number | string,
    columnKey: string,
    value: any
  ) => {
    const updatedData = gridData.map((row) =>
      row.id === rowId ? { ...row, [columnKey]: value } : row
    );

    setGridData(updatedData);

    // Notify parent immediately so the parent's state stays in sync
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  /* ===== RENDER CELL BASED ON TYPE ===== */
  const renderCell = (row: GridRow, column: GridColumn) => {
    const value = row[column.key];
    const editable = !disableEdit && IsEditMode && column.editable !== false;

    switch (column.type) {
      case "text":
        return editable ? (
          <input
            id={`row-${row.id}-${column.key}`}
            name={`${column.key}`}
            type="text"
            value={value ?? ""}
            onChange={(e) =>
              updateCellValue(row.id, column.key, e.target.value)
            }
            className="
              w-full px-2 py-1 text-sm rounded
              bg-white dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              border border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
        ) : (
          value
        );

      case "number":
        return editable ? (
          <input
            id={`row-${row.id}-${column.key}`}
            name={`${column.key}`}
            type="number"
            value={value ?? ""}
            onChange={(e) =>
              updateCellValue(row.id, column.key, Number(e.target.value))
            }
            className="
              w-full px-2 py-1 text-sm rounded
              bg-white dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              border border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
        ) : (
          value
        );

      case "combo": {
        let comboOptions: { label: string; value: any }[] = [];

        if (typeof column.options === "function") {
          comboOptions = column.options(row);
        } else if (Array.isArray(column.options)) {
          comboOptions = column.options;
        }

        const selectedValue =
          typeof value === "object" ? value?.value : value;

        return editable ? (
          <select
            id={`row-${row.id}-${column.key}`}
            value={selectedValue ?? ""}
            onChange={(e) => {
              const selectedOption = comboOptions.find(
                (opt) => String(opt.value) === e.target.value
              );

              updateCellValue(row.id, column.key, {
                value: selectedOption?.value,
                label: selectedOption?.label,
              });
            }}
            className="w-full px-2 py-1 text-sm rounded
        bg-white dark:bg-gray-800
        text-gray-800 dark:text-gray-200
        border border-gray-300 dark:border-gray-600"
          >
            <option value="">Select</option>
            {comboOptions.map((opt) => (
              <option key={`${opt.value}`} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <span>
            {Array.isArray(value)
              ? value.map(v => v.label).join(", ")
              : value?.label ?? ""}
          </span>

        );
      }


      case "date":
        return editable ? (
          <input
            id={`row-${row.id}-${column.key}`}
            name={`${column.key}`}
            type="date"
            value={value ?? ""}
            onChange={(e) =>
              updateCellValue(row.id, column.key, e.target.value)
            }
            className="
              w-full px-2 py-1 text-sm rounded
              bg-white dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              border border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
        ) : (
          value
        );

      case "label":
      default:
        return value;
    }
  };

  /* ===== SELECTION ===== */
  const toggleRowSelection = (id: number | string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]


    );
    console.log("Selected Rows:", data.filter((row) => selectedRows.includes(row.id)));
  };

  /* ===== NOTIFY PARENT ===== */
  useEffect(() => {
    if (onSelectionChange) {
      const selectedData = gridData.filter((row) =>
        selectedRows.includes(row.id)
      );
      onSelectionChange(selectedData);
    }
  }, [selectedRows, gridData, onSelectionChange]);

  /* ================= UI ================= */

  return (
    <div className="p-4 space-y-4">
      {/* SEARCH */}
      <div className="flex gap-4 sticky top-0 bg-white dark:bg-gray-900 py-2 z-20">
        {/*Add Button to enter new row to grid*/}
        {!disableEdit &&
          <div className="flex items-center">
            <PlusCircleIcon
              className="h-8 w-8 text-blue-600 cursor-pointer"
              title="Add New Row"
              onClick={() => {
                const emptyRow: GridRow = { id: "" };
                columns.forEach(col => {
                  emptyRow[col.key] = "";
                });
                setNewRowData(emptyRow);
                setIsAddModalOpen(true);
              }}
            />

            <DynamicPopup
              open={isAddModalOpen}
              columns={columns}
              row={newRowData as GridRow}
              onChange={setNewRowData}
              onAddNewPopupClose={() => { setNewRowData(null); setIsAddModalOpen(false); }}
              onAddNewPopupSave={handleSaveNewRow}

            />
          </div>}
        {/* Export To Excel*/}
        <div className="flex items-center" title="Export To Excel">
          <Export
            columns={columns.map(col => ({
              ...col,
              options: typeof col.options === 'function' ? [] : col.options
            }))}
            rows={gridData}
            fileName={filename}
          >
            <ArrowUpOnSquareIcon className="h-8 w-8 text-green-600 cursor-pointer" />
          </Export>
        </div>
        {/* Import From Excel */}
        <div className="flex items-center" title="Import From Excel">
          <ImportFromExcel
            columns={columns}
            onImport={(rows) => {
              setGridData(rows);
              onDataChange?.(rows);
            }}
            onClick={handleImportClick}

          />
        </div>

        <select
          value={searchColumn}
          onChange={(e) => setSearchColumn(e.target.value)}
          className="
            w-48 px-3 py-2 text-sm rounded-md shadow-sm
            bg-white dark:bg-gray-800
            text-gray-800 dark:text-gray-200
            border border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-blue-500
          "
        >
          <option value="all">All Columns</option>
          {columns.map((col) => (
            <option key={col.key} value={col.key}>
              {col.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="
             flex-1 px-3 py-2 text-sm rounded-md shadow-sm
            bg-white dark:bg-gray-800
            text-gray-800 dark:text-gray-200
            border border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-blue-500
          "
        />
        {!disableEdit &&
          <div className="flex justify-end items-center mb-2 gap-2">
            <span className="text-sm text-gray-800 dark:text-gray-200">{IsEditMode ? "Edit Mode" : "View Mode"}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="edit-mode-toggle"
                type="checkbox"
                className="sr-only peer"
                checked={IsEditMode}
                onChange={(e) => setIsEditMode(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all"></div>
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-all peer-checked:translate-x-5`}
              ></div>
            </label>
          </div>}

      </div>

      {/* TABLE */}
      <div className="w-full h-[80vh] rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="h-full overflow-x-auto overflow-y-auto">
          <table className="w-full table-fixed border-collapse">
            {/* HEADER */}
            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="w-12 px-2 py-3 text-center sticky left-0 top-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                  <input
                    type="checkbox"
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((row) => selectedRows.includes(row.id))
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows((prev) =>
                          Array.from(
                            new Set([
                              ...prev,
                              ...paginatedData.map((x) => x.id),
                            ])
                          )
                        );
                      } else {
                        setSelectedRows((prev) =>
                          prev.filter(
                            (id) => !paginatedData.some((row) => row.id === id)
                          )
                        );
                      }
                    }}
                  />
                </th>

                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-3 text-left text-sm font-semibold truncate text-gray-800 dark:text-gray-200"
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
                {IsEditMode &&
                  <th className="w-20 px-2 py-3 text-center z-10 sticky right-0 top-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    Action
                  </th>
                }
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="
                    border-b border-gray-200 dark:border-gray-700
                    hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                  "
                >
                  <td className="w-12 px-2 py-2 text-center sticky left-0  bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                    <input
                      type="checkbox"
                      id={`select-row-${row.id}`}
                      name={`select-row-${row.id}`}
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                    />
                  </td>

                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 py-2 text-sm truncate text-gray-800 dark:text-gray-300"
                      style={{ width: col.width }}
                      title={String(row[col.key])}
                    >
                      {renderCell(row, col)}
                    </td>
                  ))}
                  {IsEditMode &&
                    <td className="w-20 px-2 py-2 text-center  sticky right-0 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex gap-2">
                      {isedit &&
                        <Button
                          variant="primary"
                          color="blue"
                          size="sm"
                          onClick={() => {
                            onsingleSubmit?.(row);
                          }}
                          title="Edit">
                          <PencilSquareIcon className="h-3 w-3 text-white " />
                        </Button>}
                      {isdelete &&
                        <Button
                          variant="secondary"
                          color="red"
                          size="sm"
                          onClick={() => {
                            ondelete?.(row);
                          }}
                          title="Delete">
                          <TrashIcon className="h-3 w-3 text-white " />
                        </Button>
                      }
                    </td>
                  }
                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="py-10 text-center text-sm text-gray-800 dark:text-gray-300"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center w-full ">
        {/* LEFT */}
        <span className="text-sm text-gray-800 dark:text-gray-200">
          Page {currentPage} of {totalPages || 1}
        </span>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <div className="flex gap-3">
            <text className="text-sm text-gray-800 dark:text-gray-200">
              Go to page:
              <input
                type="number"
                min={1}
                max={totalPages || 1}
                value={currentPage}
                onChange={(e) => {
                  let page = Number(e.target.value);
                  if (page < 1) page = 1;
                  if (page > totalPages) page = totalPages;
                  setCurrentPage(page);
                }}
                className="
                  w-16 ml-2 px-2 py-1 text-sm rounded-md shadow-sm
                  bg-white dark:bg-gray-800
                  text-gray-800 dark:text-gray-200
                  border border-gray-300 dark:border-gray-600
                  focus:ring-2 focus:ring-blue-500
                "
              />
            </text>


            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              title="First Page"
              className="px-3 py-1 text-sm rounded bg-white dark:bg-gray-800
          text-gray-800 dark:text-gray-200 border border-gray-300
          dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700
          disabled:opacity-40"
            >
              <BackwardIcon className="h-3 w-3 mx-auto" />
            </button>

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              title="Previous Page"
              className="px-3 py-1 text-sm rounded bg-white dark:bg-gray-800
          text-gray-800 dark:text-gray-200 border border-gray-300
          dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700
          disabled:opacity-40"
            >
              <ArrowLeftIcon className="h-3 w-3 mx-auto" />
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              title="Next Page"
              className="px-3 py-1 text-sm rounded bg-white dark:bg-gray-800
          text-gray-800 dark:text-gray-200 border border-gray-300
          dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700
          disabled:opacity-40"
            >
              <ArrowRightIcon className="h-3 w-3 mx-auto" />
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages || 1)}
              title="Last Page"
              className="px-3 py-1 text-sm rounded bg-white dark:bg-gray-800
          text-gray-800 dark:text-gray-200 border border-gray-300
          dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700
          disabled:opacity-40"
            >
              <ForwardIcon className="h-3 w-3 mx-auto" />
            </button>
          </div>


        </div>
        <span className="text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
          Selected Records: {selectedRows.length} / {filteredData.length}
        </span>
      </div>


      {/* Submit Button */}
      {IsEditMode && buttonvisible && (
        <button
          onClick={() => onsubmit?.(gridData.filter((row) => selectedRows.includes(row.id)))}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
        >
          Submit
        </button>)}
    </div>
  );
};

export default Grid;
