import { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';
import { supabaseConfig } from '../config/supabaseConfig';
import { v4 as uuidv4 } from 'uuid';

const ConcreteCrackUpload = () => {
  const [formData, setFormData] = useState({
    image: null,
    Width: '',
    Height: '',
  });
  const [nextCrackNo, setNextCrackNo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNextCrackNo = async () => {
      try {
        const { data, error } = await supabase
          .from(supabaseConfig.tableName)
          .select('crack_no')
          .order('crack_no', { ascending: false })
          .limit(1);

        if (error) throw error;

        setNextCrackNo(data.length ? data[0].crack_no + 1 : 1);
      } catch (err) {
        console.error('Error fetching crack number:', err.message);
        setNextCrackNo(1);
      }
    };

    fetchNextCrackNo();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadImageToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(supabaseConfig.bucketName)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(supabaseConfig.bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const createImageRecord = async (url, width, height) => {
    const payload = {
      crack_no: nextCrackNo,
      url,
      Width: width || null,
      Height: height || null,
    };

    const { data, error } = await supabase
      .from(supabaseConfig.tableName)
      .insert([payload])
      .select();

    if (error) throw error;

    return data[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      if (!formData.image) {
        throw new Error('Please select an image');
      }
      if (!nextCrackNo) {
        throw new Error('Failed to generate crack number');
      }

      const imageUrl = await uploadImageToSupabase(formData.image);
      await createImageRecord(imageUrl, formData.Width, formData.Height);

      setUploadSuccess(true);
      setFormData({ image: null, Width: '', Height: '' });
      setNextCrackNo(nextCrackNo + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl shadow-lg bg-slate-800/70 backdrop-blur-md border border-white/10 text-white">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 text-transparent bg-clip-text">
        Concrete Crack Image Upload
      </h2>

      {nextCrackNo && (
        <div className="mb-4 p-3 rounded bg-gradient-to-r from-indigo-700 to-purple-600 text-white font-semibold shadow-inner">
          Next Crack Number: <span className="text-cyan-300">{nextCrackNo}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-cyan-300 mb-1">
            Crack Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            className="block w-full text-sm text-white bg-slate-900/60 rounded-md border border-cyan-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-slate-900 hover:file:bg-cyan-400"
          />
        </div>

        <div>
          <label htmlFor="width" className="block text-sm font-semibold text-purple-300 mb-1">
            Width (mm)
          </label>
          <input
            type="number"
            step="0.01"
            name="Width"
            id="Width"
            value={formData.Width}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-slate-900/60 text-white border border-purple-500 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-semibold text-pink-300 mb-1">
            Height (mm)
          </label>
          <input
            type="number"
            step="0.01"
            name="Height"
            id="Height"
            value={formData.Height}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-slate-900/60 text-white border border-pink-400 rounded-md shadow-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={uploading || !nextCrackNo}
            className={`w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white transition duration-200 ${
              uploading || !nextCrackNo
                ? 'bg-gradient-to-r from-slate-500 to-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Crack Image'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-400 text-red-300 rounded shadow">
            {error}
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3 bg-green-500/20 border border-emerald-400 text-emerald-300 rounded shadow">
            Image uploaded successfully! Next crack number: {nextCrackNo}
          </div>
        )}
      </form>
    </div>
  );
};

export default ConcreteCrackUpload;
