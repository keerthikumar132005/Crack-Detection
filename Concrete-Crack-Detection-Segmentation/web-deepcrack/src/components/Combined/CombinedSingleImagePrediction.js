import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';
import { supabaseConfig } from '../../config/supabaseConfig';

function CombinedSingleImagePrediction({ 
  onPrediction, 
  onDimensionsChange, 
  onFileSelect,
  fetchFromSupabase = false ,
  setLocation,
  loading
}) {
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [srcUrl, setSrcUrl] = useState();
  const [Width, setWidth] = useState(1);
  const [Height, setHeight] = useState(1);
  const [unit, setUnit] = useState('mm');
  const [crackList, setCrackList] = useState([]);
  const [selectedCrack, setSelectedCrack] = useState(6);
  const [loadingCracks, setLoadingCracks] = useState(false);

  useEffect(() => {
    if (fetchFromSupabase) {
      const fetchCracks = async () => {
        setLoadingCracks(true);
        try {
          const { data, error } = await supabase
            .from(supabaseConfig.tableName)
            .select('crack_no, url, Width, Height, latitude, longitude')
            .order('crack_no', { ascending: true });

          if (error) throw error;

          setCrackList(data || []);
          if (data.length > 0) {
            const crack = data.find(c => c.crack_no === selectedCrack);
            setSelectedCrack(crack.crack_no);
            setWidth(crack.Width || 1);
            setHeight(crack.Height || 1);
            onDimensionsChange({ 
              Width: crack.Width || 1, 
              Height: crack.Height || 1, 
              unit,
              metrics: crack
            });

            const storedImage = localStorage.getItem(`crack_${crack.crack_no}`);
            setSrcUrl(storedImage || crack.url);
            setIsFilePicked(true);
            setLocation({latitude: crack.latitude, longitude: crack.longitude});
          }
        } catch (err) {
          console.error('Error fetching cracks:', err.message);
        } finally {
          setLoadingCracks(false);
        }
      };

      fetchCracks();
    }
  }, [fetchFromSupabase, unit,selectedCrack]);

  const changeHandler = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setIsFilePicked(true);
    onFileSelect(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setSrcUrl(imageUrl);
        if (fetchFromSupabase && selectedCrack) {
          localStorage.setItem(`crack_${selectedCrack}`, imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrackChange = (event) => {
    const crackNo = parseInt(event.target.value, 10);
    const crack = crackList.find(c => c.crack_no === crackNo);
    if (crack) {
      setSelectedCrack(crackNo);
      setWidth(crack.Width || 1);
      setHeight(crack.Height || 1);
      const storedImage = localStorage.getItem(`crack_${crackNo}`);
      setSrcUrl(storedImage || crack.url);
      onDimensionsChange({ Width: crack.Width || 1, Height: crack.Height || 1, unit, metrics: crack });
      setIsFilePicked(true);
    }
  };

  const handleWidthChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setWidth(value);
    onDimensionsChange({ Width: value, Height, unit });
  };

  const handleHeightChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setHeight(value);
    onDimensionsChange({ Width, Height: value, unit });
  };

  const handleUnitChange = (e) => {
    const value = e.target.value;
    setUnit(value);
    onDimensionsChange({ Width, Height, unit: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (fetchFromSupabase && selectedCrack) {
        const crack = crackList.find(c => c.crack_no === selectedCrack);
        let imageUrl = localStorage.getItem(`crack_${selectedCrack}`) || crack.url;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `crack_${selectedCrack}.jpg`, {
          type: blob.type || 'image/jpeg',
          lastModified: Date.now()
        });
        const formData = new FormData();
        formData.append("file", file);
        onPrediction(formData, { Width, Height, unit, metrics: crack });
      } else if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile, selectedFile.name);
        onPrediction(formData, { Width, Height, unit });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl backdrop-blur-lg border border-white/10">
      <h3 className="text-2xl font-bold text-indigo-300 mb-4">Crack Analysis</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fetchFromSupabase ? (
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Select Crack</label>
            {loadingCracks ? (
              <p className="text-pink-300">Loading cracks...</p>
            ) : (
              <select
                onChange={handleCrackChange}
                value={selectedCrack || ''}
                className="w-full p-2 rounded-lg bg-slate-800 text-white border border-white/20"
              >
                {crackList.map((crack) => (
                  <option key={crack.crack_no} value={crack.crack_no}>
                    Crack - {crack.crack_no}
                  </option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Upload Image</label>
            <input
              type="file"
              onChange={changeHandler}
              accept=".jpeg, .png, .jpg"
              className="w-full p-2 rounded-lg bg-slate-800 text-white border border-white/20"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Real Width</label>
          <input
            type="number"
            value={Width}
            onChange={handleWidthChange}
            placeholder="Enter width"
            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-white/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Real Height</label>
          <input
            type="number"
            value={Height}
            onChange={handleHeightChange}
            placeholder="Enter height"
            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-white/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Measurement Unit</label>
          <select
            value={unit}
            onChange={handleUnitChange}
            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-white/20"
          >
            <option value="mm">Millimeters</option>
            <option value="cm">Centimeters</option>
            <option value="m">Meters</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={fetchFromSupabase ? !selectedCrack : !isFilePicked}
          className="w-full py-2 mt-4 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold hover:opacity-90"
        >
          {loading ? 'Analyzing...' : 'Analyze (CNN + YOLO)'}
        </button>
      </form>

      {srcUrl && (
        <div className="mt-4 text-center">
          <img
            src={srcUrl}
            alt={fetchFromSupabase ? `Crack #${selectedCrack}` : "Uploaded preview"}
            className="max-w-full max-h-72 mx-auto rounded-lg border border-white/20 shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

export default CombinedSingleImagePrediction;