export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled = false,
  error,
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block font-roboto text-[13px] font-semibold text-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`w-full rounded-lg border bg-bg-surface px-4 py-3 font-roboto text-[15px] text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-purple-primary disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? 'border-red-500' : 'border-bg-card'
        }`}
      />
    </div>
  )
}
