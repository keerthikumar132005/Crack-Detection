import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Card, Row, Col } from 'react-bootstrap';
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
    <Card>
      <Card.Header><h3>{title}</h3></Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {supabaseFetch ? (
            <Form.Group className="mb-3">
              <Form.Label>Select Crack</Form.Label>
              <Form.Select value={selectedCrack || ''} onChange={handleSelectChange}>
                {crackList.map(c => (
                  <option key={c.crack_no} value={c.crack_no}>
                    Crack {c.crack_no}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>
          )}

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formWidth">
              <Form.Label>Width</Form.Label>
              <Form.Control
                type="number"
                value={dimensions.Width}
                onChange={e => setDimensions({ ...dimensions, Width: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formHeight">
              <Form.Label>Height</Form.Label>
              <Form.Control
                type="number"
                value={dimensions.Height}
                onChange={e => setDimensions({ ...dimensions, Height: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formUnit">
              <Form.Label>Unit</Form.Label>
              <Form.Select value={unit} onChange={e => setUnit(e.target.value)}>
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="m">m</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? 'Predicting...' : 'Predict'}
          </Button>
        </Form>

        {srcUrl && (
          <div className="mt-3 text-center">
            <img src={srcUrl} alt={title} style={{ maxWidth: '100%', maxHeight: 300 }} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default SingleImagePredictionYOLO;