import { useEffect,useState } from 'react';
import React from 'react';
import ClipLoader from 'react-spinners/DotLoader';


interface LoaderProps {
  loading: boolean;
  minDuration?: number; // ms
  message?: string;
  size?: number;       // spinner size
  color?: string;      // spinner color
}

const LoaderOverlay: React.FC<LoaderProps> = ({
  message = 'Loading...',
  size = 50,
  color = '#2563eb',
  loading,
  minDuration=10000,
}) => {
     const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loading) {
      setVisible(true);
    } else if (visible) {
      // ensure minimum visible time
      timer = setTimeout(() => {
        setVisible(false);
      }, minDuration);
    }

    return () => clearTimeout(timer);
  }, [loading, minDuration, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dim background */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Loader card */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 flex flex-col items-center w-64">
        <ClipLoader size={size} color={color} />
        <p className="text-blue-700 text-sm mt-3">{message}</p>
      </div>
    </div>
  );
};

export default LoaderOverlay;
