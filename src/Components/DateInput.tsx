interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const DateInput: React.FC<Props> = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-xs border rounded-md
                 transition-all duration-200
                 hover:scale-[1.02]
                 focus:scale-105 focus:ring-2 focus:ring-blue-400 outline-none"
    />
  </div>
);

export default DateInput;
