import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import StatsView from './components/StatsView';
import TradesView from './components/TradesView';
import { Navbar, Container, Nav } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">Profit-Loss Tracker</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">Stats Overview</Nav.Link>
            <Nav.Link as={Link} to="/trades">Trade Details</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" element={<StatsView />} />
          <Route path="/trades" element={<TradesView />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
