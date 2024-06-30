export const ValuationInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder: string;
}> = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="ml-4">
    <p className="text-2sm font-thin mb-2 mt-5">{label} :</p>
    <input
      className="w-full pl-2 py-2 rounded-lg placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  </div>
);
