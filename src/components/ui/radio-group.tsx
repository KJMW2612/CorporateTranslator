import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  name: string;
}

// 1. 자식 요소가 가져야 할 구조 사양 정의
interface RadioChildProps {
  value: string;
  checked?: boolean;
  name?: string;
  onChange?: () => void;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, name, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn("grid gap-2", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // 2. child를 사전에 정의한 RadioChildProps 사양의 element 변수로 변환합니다. (unknown 에러 해결)
            const element = child as React.ReactElement<RadioChildProps>;

            // 3. 이제 any 없이 element.props에 안전하게 접근하여 클론을 생성합니다. (any 및 unknown 에러 완벽 해결)
            return React.cloneElement(element, {
              checked: element.props.value === value,
              name,
              onChange: () => onValueChange(element.props.value),
            });
          }
          return child;
        })}
      </div>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  id: string;
}

export const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  RadioGroupItemProps
>(
  (
    { className, id, checked, onChange, name, value, children, ...props },
    ref,
  ) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          "flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-800 p-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors",
          checked &&
            "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 ring-1 ring-blue-500 text-blue-900 dark:text-blue-300",
          className,
        )}
      >
        <input
          type="radio"
          ref={ref}
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center",
            checked && "border-blue-600 dark:border-blue-500",
          )}
        >
          {checked && (
            <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
          )}
        </div>
        <span className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
          {children}
        </span>
      </label>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";
