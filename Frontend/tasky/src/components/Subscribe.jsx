import React from "react";
import { Input, Button, Typography } from "antd";
import { ArrowUp } from "lucide-react";
import "./Subscribe.css";

const { Title, Paragraph, Text } = Typography;

const Subscribe = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="subscribe-section">
      <Button className="up-button" onClick={scrollToTop}>
        UP
      </Button>

      <div className="subscribe-box" >
        <Title level={2} style={{ color: '#fff' }}>STAY UPDATED!</Title>
        <Paragraph className="subtext">
          Subscribe to our newsletter to receive product updates, design insights,
          and exclusive offers.
        </Paragraph>

        <div className="subscribe-input-group">
          <Input
            type="email"
            placeholder="Enter email -"
            className="email-input"
          />
          <Button type="primary" className="subscribe-button">
            Subscribe
          </Button>
        </div>

        <Paragraph className="privacy-note">
          By subscribing, you agree to our{" "}
          <Text underline>Privacy Policy</Text> and consent to receive updates.
        </Paragraph>
      </div>
    </div>
  );
};

export default Subscribe;
