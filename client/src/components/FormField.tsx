import { Controller, Control, FieldValues, FieldError, Path } from "react-hook-form";
import { LucideIcon } from "lucide-react";

interface FormFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  placeholder?: string;
  type?: string;
  error?: FieldError;
  className?: string;
  Icon: LucideIcon;
  name: Path<T>;
}

const FormField = <T extends FieldValues>({
  control,
  Icon,
  error,
  className,
  name,
  type,
  placeholder,
}: FormFieldProps<T>) => {
  return (
    <div className={`${className} w-full h-14`}>
      <div className="relative w-full h-12">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className="w-full px-4 py-3 pl-10 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          )}
        />
        <span className="absolute left-2 top-3 text-gray-400 ">
          <Icon />
        </span>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormField;
