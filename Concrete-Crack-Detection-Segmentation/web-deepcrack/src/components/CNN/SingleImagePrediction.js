import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Card } from 'react-bootstrap';
import supabase from '../../utils/supabaseClient';
import { supabaseConfig } from '../../config/supabaseConfig';

function SingleImagePrediction({ title, onPrediction, onDimensionsChange, fetchFromSupabase = false }) {
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [srcUrl, setSrcUrl] = useState();
  const [Width, setWidth] = useState(1);
  const [Height, setHeight] = useState(1);
  const [unit, setUnit] = useState('mm');
  const [crackList, setCrackList] = useState([]);
  const [selectedCrack, setSelectedCrack] = useState(null);
  const [loadingCracks, setLoadingCracks] = useState(false);

  useEffect(() => {
    if (fetchFromSupabase) {
      const fetchCracks = async () => {
        setLoadingCracks(true);
        try {
          const { data, error } = await supabase
            .from(supabaseConfig.tableName)
            .select('crack_no, url, Width, Height')
            .order('crack_no', { ascending: true });

          if (error) throw error;
          
          setCrackList(data || []);
          if (data.length > 0) {
            setSelectedCrack(data[0].crack_no);
            setWidth(data[0].Width || 1);
            setHeight(data[0].Height || 1);
            onDimensionsChange({ 
              Width: data[0].Width || 1, 
              Height: data[0].Height || 1, 
              unit 
            });
            
            // Check if we have this image in localStorage
            const storedImage = localStorage.getItem(`crack_${data[0].crack_no}`);
            if (storedImage) {
              setSrcUrl(storedImage);
            } else {
              setSrcUrl(data[0].url);
            }
            
            setIsFilePicked(true);
          }
        } catch (err) {
          console.error('Error fetching cracks:', err.message);
        } finally {
          setLoadingCracks(false);
        }
      };

      fetchCracks();
    }
  }, [fetchFromSupabase, unit]);

  const changeHandler = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setIsFilePicked(true);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setSrcUrl(imageUrl);
        // Store in localStorage if this is the "Before Healing" image
        if (fetchFromSupabase && selectedCrack) {
          localStorage.setItem(`crack_${selectedCrack}`, imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrackChange = (event) => {
    const crackNo = parseInt(event.target.value);
    const crack = crackList.find(c => c.crack_no === crackNo);
    if (crack) {
      setSelectedCrack(crackNo);
      setWidth(crack.Width || 1);
      setHeight(crack.Height || 1);
      
      // Check localStorage first
      const storedImage = localStorage.getItem(`crack_${crackNo}`);
      if (storedImage) {
        setSrcUrl(storedImage);
      } else {
        setSrcUrl(crack.url);
      }
      
      onDimensionsChange({ 
        Width: crack.Width || 1, 
        Height: crack.Height || 1, 
        unit 
      });
      setIsFilePicked(true);
    }
  };

  const handleWidthChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setWidth(value);
    onDimensionsChange({ Width: value, Height, unit });
  };

  const handleHeightChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setHeight(value);
    onDimensionsChange({ Width, Height: value, unit });
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
    onDimensionsChange({ Width, Height, unit: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      if (fetchFromSupabase && selectedCrack) {
        const crack = crackList.find(c => c.crack_no === selectedCrack);
        if (crack) {
          // Get image from localStorage or original URL
          let imageUrl = localStorage.getItem(`crack_${selectedCrack}`) || crack.url;
          
          // Convert data URL to blob
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          
          // Create a File object with proper metadata
          const file = new File([blob], `crack_${selectedCrack}.jpg`, {
            type: blob.type || 'image/jpeg',
            lastModified: Date.now()
          });
          
          // Verify file exists before proceeding
          if (!file) {
            throw new Error('Failed to create file object');
          }
  
          const formData = new FormData();
          formData.append("file", file);
          onPrediction(formData, { Width, Height, unit });
        }
      } else if (selectedFile) {
        // For regular file uploads (After Healing)
        const formData = new FormData();
        formData.append("file", selectedFile, selectedFile.name);
        onPrediction(formData, { Width, Height, unit });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // You might want to add error state handling here
    }
  };

  return (
    <Card>
      <Card.Header>
        <h3>{title}</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {fetchFromSupabase ? (
            <Form.Group className="mb-3">
              <Form.Label>Select Crack</Form.Label>
              {loadingCracks ? (
                <div className="text-center">
                  <Spinner animation="border" />
                  <p>Loading cracks...</p>
                </div>
              ) : (
                <Form.Select 
                  onChange={handleCrackChange}
                  value={selectedCrack || ''}
                >
                  {crackList.map((crack) => (
                    <option key={crack.crack_no} value={crack.crack_no}>
                      Crack - {crack.crack_no}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control 
                type="file" 
                onChange={changeHandler} 
                accept=".jpeg, .png, .jpg"
              />
            </Form.Group>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Real width</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter width"
              value={Width}
              onChange={handleWidthChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Real height</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter height"
              value={Height}
              onChange={handleHeightChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Measurement unit</Form.Label>
            <Form.Select
              value={unit}
              onChange={handleUnitChange}
            >
              <option value="mm">Millimeters</option>
              <option value="m">Meters</option>
              <option value="cm">Centimeters</option>
            </Form.Select>
          </Form.Group>
          
          <Button
            variant="primary"
            type="submit"
            disabled={fetchFromSupabase ? !selectedCrack : !isFilePicked}
            className="w-100"
          >
            Predict
          </Button>
        </Form>
        
        {srcUrl && (
          <div className="mt-3 text-center">
            <img 
              src={srcUrl} 
              style={{ maxWidth: '100%', maxHeight: '300px' }}
              alt={fetchFromSupabase ? `Crack #${selectedCrack}` : "Uploaded preview"} 
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default SingleImagePrediction;