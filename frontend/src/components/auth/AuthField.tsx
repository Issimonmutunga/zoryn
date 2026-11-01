import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: string;
  error?: string[];
  optional?: boolean;
}

export default function AuthField({
  label,
  hint,
  error = [],
  optional = false,
  type = "text",
  ...inputProps
}: AuthFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const invalid = error.length > 0;

  const describedBy =
    [invalid && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;
  const [revealed, setRevealed] = useState(false);

  const isPassword = type === "password";

  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between text-sm font-medium text-[#1A1A1A]"
      >
        {label}
        {optional && (
          <span className="text-xs font-normal text-[#8A8A8A]">Optional</span>
        )}
      </label>

      <div className="relative mt-1.5">
        <input
          id={id}
          type={isPassword && revealed ? "text" : type}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={`h-11 w-full rounded-lg border bg-white px-3.5 text-base text-[#1A1A1A] placeholder:text-[#A3A3A3] sm:text-sm transition-colors duration-200 focus:outline-none focus:ring-2 disabled:bg-[#F5F5F5] ${
            invalid
              ? "border-[#D9534F] focus:border-[#9B2C20] focus:ring-[#9B2C20]/10"
              : "border-[#E5E5E5] hover:border-[#D4D4D4] focus:border-[#1A1A1A] focus:ring-[#1A1A1A]/10"
          } ${isPassword ? "pr-11" : ""}`}
          {...inputProps}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-[#8A8A8A] transition-colors duration-200 hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20"
            aria-label={revealed ? "Hide password" : "Show password"}
          >
            {revealed ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>

      {invalid && (
        <ul id={errorId} className="mt-1.5 space-y-0.5 text-xs leading-relaxed text-[#9B2C20]">
          {error.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      {hint && (
        <p id={hintId} className="mt-1.5 text-xs leading-relaxed text-[#8A8A8A]">
          {hint}
        </p>
      )}
    </div>
  );
}
