
import { NavLink } from 'react-router-dom';

interface ItemDashboardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  unit: string;
  path: string;
}

const ItemDashboard = ({ title, value, icon, color, unit, path }: ItemDashboardProps) => {
    return (
      <NavLink
        to={path}
        style={{ borderColor: color, color: "#000"}}
        className="relative flex flex-col items-center justify-between gap-3 px-5 py-3 border-[2px] rounded-lg bg-white hover:bg-hover "
      >
        <span className="text-lg font-medium">{title}</span>
        <div className="flex gap-2">
          <span className="text-xl font-medium">{value}</span>
          <span className="text-xl font-medium">{unit}</span>
        </div>
        <div
          style={{ backgroundColor: color }}
          className="flex items-center justify-center p-3 rounded-full"
        >
          {icon}
        </div>
        <div
          style={{ borderRightColor: color }}
          className="absolute bottom-5 right-5 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-transparent border-r-[20px] rounded-sm"
        ></div>
      </NavLink>
    );
  };

export default ItemDashboard