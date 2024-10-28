import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Container, Row, Col } from 'react-bootstrap';
import api from '../api';

function TradesView() {
  const [trades, setTrades] = useState([]);
  const [capital, setCapital] = useState('');

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = () => {
    api.get('/trades')
      .then(response => setTrades(response.data))
      .catch(error => console.error('Error fetching trades:', error));
  };

  const handleAddTrade = (e) => {
    e.preventDefault();
    api.post('/trades', { capital: parseFloat(capital) })
      .then(() => {
        setCapital('');
        fetchTrades(); // Refresh trades after adding a new one
      })
      .catch(error => console.error('Error adding trade:', error));
  };

  return (
    <Container>
      <h1 className="text-primary mb-4">Trade Details</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Capital</th>
            <th>Profit/Loss</th>
            <th>Percent Gain/loss</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr key={trade.id}>
              <td>{new Date(trade.timestamp).toLocaleString()}</td>
              <td>${trade.capital.toFixed(6)}</td>
              <td>
                {index > 0 ? (
                  `$${(trade.capital - trades[index - 1].capital).toFixed(6)}`
                ) : (
                  '-'
                )}
              </td>
              <td>
              {index > 0 ? (
                  `${(((trade.capital - trades[index - 1].capital)/trades[index - 1].capital) * 100).toFixed(2)}%`
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Form onSubmit={handleAddTrade} className="mt-4">
        <Row className="align-items-center">
          <Col md={6}>
            <Form.Group controlId="capitalInput">
              <Form.Label>Current Capital:</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md="auto">
            <Button variant="primary" type="submit" className="mt-3">
              Add Trade
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default TradesView;
