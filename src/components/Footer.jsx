import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-white py-3 mt-auto border-top" style={{ width: "100%" }}>
      <Container className="text-center">
        &copy; {new Date().getFullYear()} BTC Price Prediction
      </Container>
    </footer>
  );
}

export default Footer;
