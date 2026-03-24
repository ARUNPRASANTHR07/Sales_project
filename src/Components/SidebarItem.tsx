import { ReactNode } from "react";

interface SidebarItemProps {
    label: string;
    icon: ReactNode;
    expanded: boolean;
    active?: boolean;
    onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    label,
    icon,
    expanded,
    active,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            title={!expanded ? label : ""}
            className={`
        flex items-center gap-3 px-4 py-3 cursor-pointer
        text-gray-900 dark:text-gray-100
        transition-colors duration-200
        select-none

        ${active
                    ? "bg-blue-200 dark:bg-gray-600"
                    : "hover:bg-blue-100 dark:hover:bg-gray-600"
                }
      `}
        >
            <div className="w-6 h-6 flex items-center justify-center">
                {icon}
            </div>

            <span
                className={`
          whitespace-nowrap
          transition-all duration-200
          ${expanded ? "opacity-100 ml-1" : "opacity-0 w-0 overflow-hidden"}
        `}
            >
                {label}
            </span>
        </div>
    );
};

export default SidebarItem;
