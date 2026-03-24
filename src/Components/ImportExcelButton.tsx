import React from "react";
import * as XLSX from "xlsx";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";
import { GridColumn, GridRow } from "../types/Gridtypes";

interface ImportFromExcelProps {
  columns: GridColumn[];
  onImport: (rows: GridRow[]) => void;
  onClick?: () => void;
}

const ImportFromExcel: React.FC<ImportFromExcelProps> = ({
  columns,
  onImport,
  onClick,
}) => {
  const convertLabelToValue = (
    value: any,
    column: GridColumn
  ) => {
    if (!column.options) return value;
    if (!value) return column.isMulti ? [] : "";

    const options =
      typeof column.options === "function"
        ? column.options({} as GridRow)
        : column.options;

    // 🔹 MULTI SELECT
    if (column.isMulti) {
      const labels = value
        .toString()
        .split(",")
        .map((v: string) => v.trim());

      const selectedOptions = labels
        .map((label: string) =>
          options.find(
            (opt) =>
              opt.label.toLowerCase() === label.toLowerCase()
          )
        )
        .filter(Boolean);

      // ✅ return array of objects
      return selectedOptions.map((opt: any) => ({
        value: opt!.value,
        label: opt!.label
      }));
    }

    // 🔹 SINGLE SELECT
    const found = options.find(
      (opt) =>
        opt.label.toLowerCase() === value.toString().toLowerCase()
    );

    return found
      ? { value: found.value, label: found.label }
      : "";
  };


  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rawRows: any[] = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
      });

      const mappedRows: GridRow[] = rawRows.map(
        (row, index) => {
          const mapped: GridRow = {
            id: row.id ?? `${Date.now()}-${index}`,
          };

          columns.forEach((col) => {
            const excelValue =
              row[col.label] ?? row[col.key] ?? "";

            mapped[col.key] = convertLabelToValue(
              excelValue,
              col
            );
          });

          return mapped;
        }
      );

      onImport(mappedRows);
      console.log("Imported Rows:", mappedRows);
    };

    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  return (
    <label
      title="Import From Excel"
      className="flex items-center cursor-pointer"
    >
      <ArrowDownOnSquareIcon className="h-8 w-8 text-purple-600" />
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        onClick={() => onClick?.()}
        className="hidden"
      />
    </label>
  );
};

export default ImportFromExcel;
