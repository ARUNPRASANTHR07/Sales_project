import * as XLSX from "xlsx";

export const importFromExcel = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target) return reject("File reading failed");

      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Take the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      resolve(jsonData);
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};
