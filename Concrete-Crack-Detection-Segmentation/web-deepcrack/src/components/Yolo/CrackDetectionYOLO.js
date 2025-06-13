import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleImagePredictionYOLO from './SingleImagePredictionYOLO';
import { calculateAreaDecreasePercent } from '../../utils/areaCalculation';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function CrackDetectionYOLO() {
  const navigate = useNavigate();
  const [beforeData, setBeforeData] = useState(null);
  const [afterData, setAfterData] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);

  useEffect(() => {
    if (beforeData && afterData) {
      const { Width: w1, Height: h1 } = beforeData.dimensions;
      const { Width: w2, Height: h2 } = afterData.dimensions;
      const pct = calculateAreaDecreasePercent(w1, h1, w2, h2);
      setPercentageChange(pct);
    }
  }, [beforeData, afterData]);

  return (
    <Container fluid>
      <Row className="mt-3">
        <Col>
          <h1 className="text-center">YOLO Crack Detection & Healing Analysis</h1>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <SingleImagePredictionYOLO
            title="Before Healing"
            endpoint="http://127.0.0.1:8000/yolo-predict"
            onPrediction={setBeforeData}
            supabaseFetch={true}
          />
        </Col>
        <Col md={6}>
          <SingleImagePredictionYOLO
            title="After Healing"
            endpoint="http://127.0.0.1:8000/yolo-predict"
            onPrediction={setAfterData}
            supabaseFetch={false}
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
                  Crack count {percentageChange > 0 ? 'decreased' : 'increased'} by {Math.abs(percentageChange).toFixed(2)}%
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
            size="lg"
            onClick={() => navigate('/calculate-decrease')}
          >
            Calculate Decrease
          </Button>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h2 className="text-center">Prediction Results</h2>
          <Row className="mt-3">
            {beforeData && (
              <Col md={6}>
                <Card>
                  <Card.Header>Before Healing</Card.Header>
                  <Card.Body>
                    <img src={`data:image/jpeg;base64,${beforeData.image}`} alt="Before" width="100%" />
                    <p className="text-center">Detected cracks: {beforeData.predictions.length}</p>
                  </Card.Body>
                </Card>
              </Col>
            )}
            {afterData && (
              <Col md={6}>
                <Card>
                  <Card.Header>After Healing</Card.Header>
                  <Card.Body>
                    <img src={`data:image/jpeg;base64,${afterData.image}`} alt="After" width="100%" />
                    <p className="text-center">Detected cracks: {afterData.predictions.length}</p>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default CrackDetectionYOLO;