import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom" style={{ width: "100%" }}>
      <Container>
        <Navbar.Brand href="#">BTC Price Prediction</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
