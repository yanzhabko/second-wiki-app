import { forwardRef } from "react";
import type { ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
  classNames?: {
    input?: string;
    label?: string;
  };
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...rest }, ref) => {
    return (
      <div className="relative w-full lg:w-[30rem]">
        <input
          ref={ref}
          className="outline-none px-3 py-5 border-2 border-neutral-300 w-full rounded-md peer focus:border-purple-400 disabled:bg-neutral-300 placeholder-transparent"
          {...rest}
        />
        <label className="text-2 absolute top-0 left-2 scale-95 peer-focus-within:text-3 peer-focus-within:scale-103 peer-focus-within:-top-2 peer-focus-within:bg-white peer-focus-within:px-2 px-0 bg-transparent transition-all duration-200">
          {label}
        </label>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    );
  }
);

export default Input;
