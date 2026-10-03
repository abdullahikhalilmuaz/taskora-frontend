import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Taskora</h3>
          <p>
            Smart Task Management System for Umaru Musa Yar'adua University
            Katsina
          </p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>
            <i className="fas fa-envelope"></i> support@sumaila.edu
          </p>
          <p>
            <i className="fas fa-phone"></i> +234 123 456 789
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; 2026 Umaru Musa Yar'adua University Katsina. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
