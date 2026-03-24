import React from "react";

interface DateProps {
  Input_date: string;
  setInput_date: (date: string) => void;
  label: string;
  width?: string; // Tailwind uses string-based classes
}

const DateInput: React.FC<DateProps> = ({
  Input_date,
  setInput_date,
  label,
  width = "w-full",
}) => {
  return (
    <div className={`flex flex-col gap-1 mt-2 ${width}`}>
      {/* Label */}
      <label className="text-xs font-medium text-gray-700">
        {label}
      </label>

      {/* Date Input */}
      <input
        type="date"
        value={Input_date}
        onChange={(e) => setInput_date(e.target.value)}
        className="
          text-xs
          px-3 py-2
          border border-gray-300
          rounded-md
          outline-none
          transition-all duration-200 ease-in-out
          focus:scale-105
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-400
          hover:scale-[1.02]
        "
      />
    </div>
  );
};

export default DateInput;
