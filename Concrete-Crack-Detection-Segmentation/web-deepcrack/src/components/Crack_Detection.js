import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleImagePrediction from './SingleImagePrediction';
import { calculateAreaDecreasePercent } from '../utils/areaCalculation';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

// Utility function to convert dataURL to File
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function Crack_Detection() {
  const navigate = useNavigate();
  const [beforeData, setBeforeData] = useState(null);
  const [afterData, setAfterData] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [showBeforeData, setShowBeforeData] = useState(false);
  const [beforeFile, setBeforeFile] = useState(null);

  // Store image in localStorage
  const storeBeforeImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      localStorage.setItem('beforeHealingImage', e.target.result);
    };
    reader.readAsDataURL(file);
    setBeforeFile(file);
  };

  const handleBeforePrediction = async (formData, dimensions) => {
    try {
      // Verify formData contains the file
      const file = formData.get("file");
      if (!file) {
        throw new Error('No file found in form data');
      }
  
      const response = await fetch(
        `http://127.0.0.1:8000/predict/${dimensions.Width}-${dimensions.Height}/${dimensions.unit}`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBeforeData({
        dimensions,
        prediction: "data:image/png;base64," + data[0],
        fused: "data:image/png;base64," + data[1],
        sides: data.slice(2, 7).map(side => "data:image/png;base64," + side),
      });
      calculatePercentageChange();
    } catch (err) {
      console.error('Error in handleBeforePrediction:', err);
      // Add error state handling here if needed
    }
  };

  const handleAfterPrediction = async (formData, dimensions) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/predict/${dimensions.Width}-${dimensions.Height}/${dimensions.unit}`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      setAfterData({
        dimensions,
        prediction: "data:image/png;base64," + data[0],
        fused: "data:image/png;base64," + data[1],
        sides: data.slice(2, 7).map(side => "data:image/png;base64," + side),
      });
      calculatePercentageChange();
    } catch (err) {
      console.error(err);
    }
  };

  const calculatePercentageChange = () => {
    if (beforeData && afterData) {
      try {
        const { Width: w1, Height: h1 } = beforeData.dimensions;
        const { Width: w2, Height: h2 } = afterData.dimensions;
        const pct = calculateAreaDecreasePercent(w1, h1, w2, h2);
        setPercentageChange(pct);
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  return (
    <Container fluid>
      <Row className="mt-3">
        <Col>
          <h1 className="text-center">Crack Healing Progress Analysis</h1>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <SingleImagePrediction
            title="Before Healing"
            onPrediction={handleBeforePrediction}
            onDimensionsChange={(dim) => setBeforeData(prev => ({ ...prev, dimensions: dim }))}
            onFileSelect={storeBeforeImage}
            fetchFromSupabase={true}
          />
        </Col>
        <Col md={6}>
          <SingleImagePrediction
            title="After Healing"
            onPrediction={handleAfterPrediction}
            onDimensionsChange={(dim) => setAfterData(prev => ({ ...prev, dimensions: dim }))}
          />
        </Col>
      </Row>

      {percentageChange !== null && (
        <Row className="mt-4">
          <Col>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Healing Progress</Card.Title>
                <Card.Text className={`fs-3 ${percentageChange > 0 ? 'text-success' : 'text-danger'}`}>
                  Crack area {percentageChange > 0 ? 'decreased' : 'increased'} by {Math.abs(percentageChange).toFixed(2)}%
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="mt-4 mb-4">
        <Col className="text-center">
          <Button 
            variant="primary" 
            onClick={() => navigate('/calculate-decrease')}
            size="lg"
          >
            Calculate Decrease
          </Button>
        </Col>
      </Row>

      {beforeData && (
        <Row className="mt-4">
          <Col>
            <h2 className="text-center">Prediction Results</h2>
            <Row className="mt-3">
              {beforeData && (
                <Col md={6}>
                  <Card>
                    <Card.Header>Before Healing Results</Card.Header>
                    <Card.Body>
                      <Row>
                        <Col>
                          <img src={beforeData.prediction} width="100%" alt="Before Prediction" />
                          <p className="text-center">Prediction Visualization</p>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col>
                          <img src={beforeData.fused} width="100%" alt="Before Fused" />
                          <p className="text-center">Fused Prediction</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              )}
              {afterData && (
                <Col md={6}>
                  <Card>
                    <Card.Header>After Healing Results</Card.Header>
                    <Card.Body>
                      <Row>
                        <Col>
                          <img src={afterData.prediction} width="100%" alt="After Prediction" />
                          <p className="text-center">Prediction Visualization</p>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col>
                          <img src={afterData.fused} width="100%" alt="After Fused" />
                          <p className="text-center">Fused Prediction</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Crack_Detection;