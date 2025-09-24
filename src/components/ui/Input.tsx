interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sda-blue ${className}`}
    />
  );
}