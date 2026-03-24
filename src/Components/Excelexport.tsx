import React from "react";
import * as XLSX from "xlsx";

interface Option {
  value: any;
  label: string;
}

interface Column {
  key: string;
  label: string;
  options?: Option[]; // For combo / dropdown fields
}

interface ExportToExcelProps {
  columns: Column[];
  rows: any[];
  fileName?: string;
  sheetName?: string;
  children?: React.ReactNode;
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({
  columns,
  rows,
  fileName = "Export.xlsx",
  sheetName = "Sheet1",
  children,
}) => {
  const formatCellValue = (value: any, options?: Option[]) => {
    if (value === null || value === undefined) return "";

    // If options exist → map value to label
    if (options) {
      // Multi-select (array of values)
      if (Array.isArray(value)) {
        return value
          .map(
            (val) =>
              options.find((opt) => opt.value === val)?.label ?? val
          )
          .join(", ");
      }

      // Single select
      const found = options.find((opt) => opt.value === value);
      if (found) return found.label;
    }

    // If value is object like { value, label }
    if (typeof value === "object") {
      if ("label" in value) return value.label;
      return JSON.stringify(value);
    }

    return value;
  };

  const handleExport = () => {
    if (!rows || rows.length === 0) {
      alert("No data to export");
      return;
    }

    // Format rows
    const formattedData = rows.map((row) => {
      const newRow: Record<string, any> = {};

      columns.forEach((col) => {
        newRow[col.label] = formatCellValue(
          row[col.key],
          col.options
        );
      });

      return newRow;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Auto column width
    const columnWidths = columns.map((col) => {
      const maxLength = Math.max(
        col.label.length,
        ...formattedData.map((row) =>
          row[col.label] ? row[col.label].toString().length : 0
        )
      );
      return { wch: maxLength + 2 };
    });

    worksheet["!cols"] = columnWidths;

    // Make header bold (basic styling support)
    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true },
      };
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Export file
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <span onClick={handleExport} style={{ cursor: "pointer" }}>
      {children ?? "Export"}
    </span>
  );
};

export default ExportToExcel;
