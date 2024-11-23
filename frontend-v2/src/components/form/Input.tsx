import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type InputProps = {
  label: string;
  name: string;
  type?: "text" | "password" | "email";
  placeholder?: string;
};

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [isVisible, setIsVisible] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && isVisible ? "text" : type;

  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="ml-0.5 text-sm md:text-base font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          {...register(name)}
          className={cn(
            "w-full px-4 py-2 rounded-md border text-sm",
            "bg-input text-foreground border-border focus:ring-2 focus:ring-primary"
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-3 top-2 text-sm text-muted-foreground"
          >
            {isVisible ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>
      {errors[name] && (
        <p className="ml-1 text-xs text-destructive">
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default Input;
