import { useNavigate } from "react-router-dom";

const SelectModel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-cyan-300 mb-8">Select Model</h1>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-200 hover:shadow-purple-500/50"
            onClick={() => navigate("/compare-yolo")}
          >
            YOLO
          </button>
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-200 hover:shadow-emerald-400/50"
            onClick={() => navigate("/compare-cnn")}
          >
            CNN
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectModel;
