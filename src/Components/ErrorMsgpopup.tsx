import React, { useEffect } from 'react';

interface ErrorPopupProps {
    message: string;
    onClose: () => void;
    isopen: boolean;
    duration?: number;
    autoclose?: boolean;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({
    message,
    onClose,
    isopen,
    duration = 10000,
    autoclose = true,
}) => {
    useEffect(() => {
        if (isopen && autoclose) {
            const timer = setTimeout(() => onClose(), duration);
            return () => clearTimeout(timer);
        }
    }, [isopen, autoclose, duration, onClose]);

    if (!isopen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96 text-center animate-scaleIn">
                <h2 className="text-lg font-semibold text-red-600 mb-2">
                    Error
                </h2>

                <p className="text-gray-700 dark:text-gray-200 mb-4">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default ErrorPopup;
