import { useNavigate } from "react-router-dom";
const SelectModel = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Select Model</h1>
            <div className="flex gap-6">
                <button className="px-6 py-3 rounded-2xl bg-blue-600 text-white text-lg font-semibold shadow-lg hover:bg-blue-700 transition" onClick={() => navigate('/compare-yolo')}>
                    YOLO
                </button>
                <button className="px-6 py-3 rounded-2xl bg-green-600 text-white text-lg font-semibold shadow-lg hover:bg-green-700 transition" onClick={() => navigate('/compare-cnn')}>
                    CNN
                </button>
            </div>
        </div>
    );
};

export default SelectModel;
