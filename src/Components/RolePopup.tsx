import React, { useEffect, useRef, useState } from "react";

interface RolePopupProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ComboOption {
    value: string;
    label: string;
}
interface ActiveUserInfo {
    role: ComboOption;
    ou: ComboOption;
}

const RolePopup: React.FC<RolePopupProps> = ({ isOpen, onClose }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    const [roles, setRoles] = useState<ComboOption[]>([]);
    const [ous, setOus] = useState<ComboOption[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [selectedOU, setSelectedOU] = useState<string>("");

    // 🔹 Load data from localStorage safely
    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        const storedActiveUser = localStorage.getItem("activeUserInfo");

        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const parsedActiveUser = storedActiveUser
            ? JSON.parse(storedActiveUser)
            : null;

        // set ou which matches the role with default role parsedActiveUser  and ouAccess in parsedUser

        const roleOuMapping = parsedUser?.roleOuMapping || [];
        const availableOUs = roleOuMapping
            .filter(
                (mapping: any) => mapping.role === parsedActiveUser?.role?.value
            )
            .map((mapping: any) => ({
                value: mapping.value,
                label: mapping.label,
            }));


        setRoles(parsedUser?.roles || []);
        setOus(availableOUs);
        setSelectedRole(parsedActiveUser?.role?.value || "");
        setSelectedOU(parsedActiveUser?.ouAccess?.value || "");

    }, []);

    // 🔹 Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOk = () => {
        const selectedRoleObj = roles.find(
            (r) => r.value === selectedRole
        );

        const selectedOuObj = ous.find(
            (o) => o.value === selectedOU
        );


        if (!selectedRoleObj || !selectedOuObj) {
            console.warn("Role or OU not selected properly");
            return;
        }

        const updatedActiveUser: ActiveUserInfo = {
            role: selectedRoleObj,
            ou: selectedOuObj,
        };

        localStorage.setItem(
            "activeUserInfo",
            JSON.stringify(updatedActiveUser)
        );

        console.log("Updated Active User:", updatedActiveUser);

        onClose();
    };



    const handlesetSelectedRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;
        setSelectedRole(newRole);
        // Update OU options based on the new role
        const storedUser = localStorage.getItem("userInfo");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const roleOuMapping = parsedUser?.roleOuMapping || [];
        const availableOUs = roleOuMapping
            .filter(
                (mapping: any) => mapping.role === newRole
            )
            .map((mapping: any) => ({
                value: mapping.value,
                label: mapping.label,
            }));
        setOus(availableOUs);
        setSelectedOU(availableOUs.length > 0 ? availableOUs[0].value : "");


    };
    return (
        <div
            ref={popupRef}
            className="absolute right-0 mt-20 w-80 bg-white border rounded-lg shadow-xl p-5 z-50"
        >
            <h2 className="text-sm font-semibold mb-4">User Settings</h2>

            <div className="space-y-4">
                {/* Role Dropdown */}
                <div>
                    <label className="block text-xs mb-1">Role</label>
                    <select
                        value={selectedRole}
                        onChange={handlesetSelectedRole}
                        className="w-full px-3 py-2 text-sm border rounded-md"
                    >
                        {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* OU Dropdown */}
                <div>
                    <label className="block text-xs mb-1">OU</label>
                    <select
                        value={selectedOU}
                        onChange={(e) => setSelectedOU(e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-md"
                    >
                        {ous.map((ou) => (
                            <option key={ou.value} value={ou.value}>
                                {ou.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleOk}
                    className="w-full mt-3 bg-blue-600 text-white text-sm py-2 rounded-md"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default RolePopup;
