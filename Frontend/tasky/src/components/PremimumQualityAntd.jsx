import React from 'react';
import { Badge, Typography, List, Row, Col } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import './PremiumQualityAntd.css';

const { Title, Paragraph, Text } = Typography;

const features = [
  'Crafted with premium materials',
  'Intuitive user interface',
  'Sustainable and long-lasting design',
];

export default function PremiumPage() {
  return (
    <div className="premium-fullpage">
      <div className="premium-container">
        <Row gutter={[64, 64]} align="middle" justify="center">
          <Col xs={24} md={10} className="illustration-col">
            <div className="fake-card">
              <div className="image-block" />
              <div className="text-line long" />
              <div className="text-line short" />
            </div>
          </Col>

          <Col xs={24} md={12} className="content-col">
            <Badge.Ribbon text="Premium Quality" color="#fde68a">
              <div className="text-content">
                <Title level={1} style={{ marginBottom: 0 }}>
                  Designed with purpose <br /> Built with <span className="highlight">precision</span>
                </Title>

                <Paragraph style={{ marginTop: 24, fontSize: '18px' }}>
                  Our product embodies the principle that <Text strong>“less is more”</Text>, focusing on essential
                  elements that enhance functionality while maintaining a clean aesthetic.
                  Every aspect has been thoughtfully considered to create an intuitive and seamless experience.
                </Paragraph>

                <List
                  dataSource={features}
                  renderItem={(item) => (
                    <List.Item className="feature-item">
                      <CheckCircleFilled style={{ color: '#f59e0b', fontSize: '20px' }} />
                      <span>{item}</span>
                    </List.Item>
                  )}
                />
              </div>
            </Badge.Ribbon>
          </Col>
        </Row>
      </div>
    </div>
  );
}
