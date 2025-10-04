import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "@/components/common/CustomButton";

const ScanResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const scannedCode = location.state?.scannedCode;
  const timestamp = location.state?.timestamp;

  const handleScanAgain = () => {
    // Navigate back to scanner - this will reset the camera state
    navigate('/inventory');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!scannedCode) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4">
        <h1 className="text-2xl font-bold mb-4">No Scan Data</h1>
        <p className="text-gray-400 mb-8">No scanned code found.</p>
        <div className="flex flex-col gap-4">
          <CustomButton onClick={handleScanAgain} title="Scan Again" />
          <CustomButton onClick={handleGoHome} title="Go Home" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-green-400">Scan Successful!</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Scanned Code:</h2>
          <div className="bg-gray-900 p-4 rounded border break-all text-green-300 font-mono">
            {scannedCode}
          </div>
        </div>

        {timestamp && (
          <div className="text-gray-400 text-sm mb-6">
            Scanned at: {new Date(timestamp).toLocaleString()}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <CustomButton onClick={handleScanAgain} title="Scan Another Code" />
          <CustomButton onClick={handleGoHome} title="Go Home" />
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
