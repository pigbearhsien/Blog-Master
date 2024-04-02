import * as React from "react";

import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="h-9 w-full rounded-md bg-white bg-opacity-85 border border-input  px-3 flex flex-row items-center gap-2  shadow-sm ">
        <label htmlFor="inputId">
          <MagnifyingGlassIcon className=" opacity-40" />
        </label>
        <input
          id="inputId"
          type={type}
          className={cn(
            " outline-none  border-none w-full flex  bg-transparent  py-3 text-xs font-light transition-colors  placeholder:text-muted-foreground focus-visible:outline-none",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
