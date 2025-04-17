import React from "react";
import { Row, Col, Typography, Card, Button } from "antd";
import {
  Paintbrush,
  LayoutDashboard,
  MousePointerClick,
  Puzzle,
  Leaf,
  SlidersHorizontal,
} from "lucide-react";
import "./Features.css";

const { Title, Paragraph, Text } = Typography;

const featuresData = [
  {
    icon: <Paintbrush size={36} />,
    title: "Premium Design",
    description: (
      <>
        A <Text strong>powerful</Text>, intuitive task management system designed to help
        teams <Text strong>collaborate efficiently</Text> and track progress seamlessly.
      </>
    ),
  },
  {
    icon: <LayoutDashboard size={36} />,
    title: "Minimalist Design",
    description: (
      <>
        <Text strong>Clean aesthetics</Text> focused on simplicity and function without
        unnecessary elements.
      </>
    ),
  },
  {
    icon: <MousePointerClick size={36} />,
    title: "Intuitive Experience",
    description: (
      <>
        Thoughtfully designed interfaces that feel <Text strong>natural</Text> and
        effortlessly <Text strong>guide users</Text>.
      </>
    ),
  },
  {
    icon: <Puzzle size={36} />,
    title: "Seamless Integration",
    description: (
      <>
        All elements <Text strong>work together</Text> harmoniously across devices and
        platforms.
      </>
    ),
  },
  {
    icon: <Leaf size={36} />,
    title: "Sustainable Design",
    description: (
      <>
        Created with <Text strong>longevity</Text> in mind, avoiding trends that quickly
        become outdated.
      </>
    ),
  },
  {
    icon: <SlidersHorizontal size={36} />,
    title: "Functional Focus",
    description: (
      <>
        Every element is crafted with <Text strong>purpose</Text>—avoiding clutter while
        enhancing the <Text strong>user journey</Text>.
      </>
    ),
  },
];

const Features = () => {
  return (
    <div className="features-page">
      <div className="features-header">
        <Title level={1}>
          Designed with <span className="highlight">Purpose</span>, <br /> Built with{" "}
          <span className="highlight">Precision</span>
        </Title>
        <Paragraph className="features-subtext">
          Every element on this page was crafted to deliver not just visual appeal, but
          <Text strong> clear functionality </Text>
          with a seamless experience across devices.
        </Paragraph>
      </div>

      <Row gutter={[32, 48]} justify="center" className="features-grid">
        {featuresData.map((feature, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card className="feature-card" hoverable>
              <div className="icon-container">{feature.icon}</div>
              <Title level={4}>{feature.title}</Title>
              <Paragraph>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="cta-wrapper">
        <Button type="primary" size="large" className="cta-button">
          Start Free Trial
        </Button>
      </div>
    </div>
  );
};

export default Features;
