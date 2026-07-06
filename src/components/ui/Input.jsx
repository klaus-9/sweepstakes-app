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
          className="mb-1.5 block font-body text-[13px] font-medium text-txt-sub"
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
        className={`w-full rounded-lg border bg-surface-1 px-4 py-3 font-body text-[15px] text-txt outline-none transition-colors placeholder:text-txt-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(108,92,231,0.25)] disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? 'border-danger' : 'border-border'
        }`}
      />
    </div>
  )
}
