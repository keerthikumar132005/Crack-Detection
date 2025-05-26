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

  // Fetch next crack number on component mount
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
        setNextCrackNo(1); // Fallback to 1 if error occurs
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

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(supabaseConfig.bucketName)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
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
      Height: height || null
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

      // Step 1: Upload image
      const imageUrl = await uploadImageToSupabase(formData.image);
      
      // Step 2: Create record
      await createImageRecord(
        imageUrl,
        formData.Width,
        formData.Height
      );

      setUploadSuccess(true);
      // Reset form and get next crack number
      setFormData({
        image: null,
        Width: '',
        Height: '',
      });
      setNextCrackNo(nextCrackNo + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Concrete Crack Image Upload</h2>
      
      {nextCrackNo && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-800 rounded">
          Next Crack Number: <span className="font-bold">{nextCrackNo}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Crack Image
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Width */}
        <div>
          <label htmlFor="width" className="block text-sm font-medium text-gray-700">
            Width (mm)
          </label>
          <input
            type="number"
            step="0.01"
            name="Width"
            id="Width"
            value={formData.Width}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Height */}
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            Height (mm)
          </label>
          <input
            type="number"
            step="0.01"
            name="Height"
            id="Height"
            value={formData.Height}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={uploading || !nextCrackNo}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${uploading || !nextCrackNo ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {uploading ? 'Uploading...' : 'Upload Crack Image'}
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Image uploaded successfully! Next crack number: {nextCrackNo}
          </div>
        )}
      </form>
    </div>
  );
};

export default ConcreteCrackUpload;