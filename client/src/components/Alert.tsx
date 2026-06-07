import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/alert-dialog";
import { LucideIcon } from "lucide-react";

const Alert = ({
  Icon,
  title,
  description,
  btn1,
  btn2,
  handleBtn1,
  handleBtn2,
  open,
  disabled = false,
  className,
  hover
}: {
  Icon?: LucideIcon;
  open?: string;
  description?: string;
  title: string;
  btn1: string;
  btn2: string;
  handleBtn1: () => void;
  handleBtn2: () => void;
  disabled?: boolean;
  className?: string;
  hover?: string;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={`flex gap-1 w-full justify-center ${className}`}
        disabled={disabled}
        title={hover}
      >
        {Icon && <Icon size={16} />}
        {open}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleBtn1}>{btn1}</AlertDialogCancel>
          <AlertDialogAction onClick={handleBtn2}>{btn2}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
