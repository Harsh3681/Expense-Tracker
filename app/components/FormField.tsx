interface Props {
  id: string;
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  error?: string;
  options?: readonly string[];
}

export default function FormField({
  id,
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  error,
  options,
}: Props) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>

      {options ? (
        <select
          id={id}
          name={name}
          defaultValue={defaultValue}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select a category</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
