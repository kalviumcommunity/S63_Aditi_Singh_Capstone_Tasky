import React from "react";
import { Row, Col, Typography } from "antd";
import { Facebook, Twitter, Instagram } from "lucide-react";
import "./Footer.css";

const { Text } = Typography;

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer-inner">
        <Row gutter={[32, 32]} justify="space-between" align="top">
          <Col xs={24} sm={12} md={8}>
            <Text className="footer-logo">Tasky</Text>
            <Text className="footer-description">
              Designing clean, sustainable user experiences for modern products.
            </Text>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Text className="footer-heading">Quick Links</Text>
            <ul className="footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#subscribe">Subscribe</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Text className="footer-heading">Connect with Us</Text>
            <div className="footer-icons">
              <a href="#"><Facebook size={20} /></a>
              <a href="#"><Twitter size={20} /></a>
              <a href="#"><Instagram size={20} /></a>
            </div>
          </Col>
        </Row>

        <div className="footer-bottom">
          <Text type="secondary">
            © {new Date().getFullYear()} Tasky. All rights reserved.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Footer;
