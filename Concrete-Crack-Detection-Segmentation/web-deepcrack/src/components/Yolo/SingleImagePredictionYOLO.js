import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';
import { supabaseConfig } from '../../config/supabaseConfig';

function SingleImagePredictionYOLO({ title, endpoint, onPrediction, supabaseFetch }) {
  const [loading, setLoading] = useState(false);
  const [crackList, setCrackList] = useState([]);
  const [selectedCrack, setSelectedCrack] = useState(null);
  const [dimensions, setDimensions] = useState({ Width: 1, Height: 1 });
  const [unit, setUnit] = useState('mm');
  const [selectedFile, setSelectedFile] = useState(null);
  const [srcUrl, setSrcUrl] = useState(null);

  useEffect(() => {
    if (supabaseFetch) {
      supabase
        .from(supabaseConfig.tableName)
        .select('crack_no, url, Width, Height')
        .order('crack_no')
        .then(({ data, error }) => {
          if (error) throw error;
          setCrackList(data);
          if (data.length) {
            const c = data[0];
            setSelectedCrack(c.crack_no);
            setDimensions({ Width: c.Width, Height: c.Height });
            setSrcUrl(localStorage.getItem(`crack_${c.crack_no}`) || c.url);
          }
        })
        .catch(console.error);
    }
  }, [supabaseFetch]);

  const handleSelectChange = evt => {
    const crackNo = parseInt(evt.target.value, 10);
    const c = crackList.find(x => x.crack_no === crackNo);
    setSelectedCrack(crackNo);
    setDimensions({ Width: c.Width, Height: c.Height });
    const stored = localStorage.getItem(`crack_${crackNo}`) || c.url;
    setSrcUrl(stored);
  };

  const handleFileChange = evt => {
    const f = evt.target.files[0];
    setSelectedFile(f);
    const reader = new FileReader();
    reader.onload = e => setSrcUrl(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      let fileToUpload;
      if (supabaseFetch && selectedCrack) {
        const imgUrl = localStorage.getItem(`crack_${selectedCrack}`) || crackList.find(x => x.crack_no === selectedCrack).url;
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        fileToUpload = new File([blob], `crack_${selectedCrack}.jpg`, { type: blob.type });
      } else if (selectedFile) {
        fileToUpload = selectedFile;
      } else {
        throw new Error('No file selected');
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch(endpoint, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();

      onPrediction({
        image: json.image,
        predictions: json.predictions,
        dimensions: { ...dimensions, unit }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-cyan-300">{title}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {supabaseFetch ? (
          <div>
            <label className="block text-sm mb-1">Select Crack</label>
            <select
              className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-white"
              value={selectedCrack || ''}
              onChange={handleSelectChange}
            >
              {crackList.map(c => (
                <option key={c.crack_no} value={c.crack_no}>
                  Crack {c.crack_no}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Width</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
              value={dimensions.Width}
              onChange={e => setDimensions({ ...dimensions, Width: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Height</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
              value={dimensions.Height}
              onChange={e => setDimensions({ ...dimensions, Height: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Unit</label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
            >
              <option value="mm">mm</option>
              <option value="cm">cm</option>
              <option value="m">m</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded hover:scale-105 transition-transform"
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {srcUrl && (
        <div className="mt-5 text-center">
          <img
            src={srcUrl}
            alt={title}
            className="mx-auto max-h-72 rounded-lg border border-white/20 shadow-md"
          />
        </div>
      )}
    </div>
  );
}

export default SingleImagePredictionYOLO;
