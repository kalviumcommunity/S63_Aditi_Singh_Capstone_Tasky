import React from 'react';
import { Layout, Typography, Row, Col, Space } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import {
    GithubOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    MailOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Title } = Typography;

const Footer = () => {
    const { isDark } = useTheme();

    const footerLinks = [
        {
            title: "Product",
            links: ["Features", "Pricing", "Security", "Roadmap"]
        },
        {
            title: "Company",
            links: ["About", "Blog", "Careers", "Contact"]
        },
        {
            title: "Resources",
            links: ["Documentation", "Help Center", "API", "Status"]
        },
        {
            title: "Legal",
            links: ["Privacy", "Terms", "Cookie Policy", "License"]
        }
    ];

    return (
        <AntFooter style={{
            background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
            borderTop: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
            padding: '60px 0',
            marginTop: 'auto'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                <Row gutter={[48, 48]}>
                    <Col xs={24} md={8}>
                        <Title level={4} style={{ 
                            color: 'var(--text-primary)',
                            marginBottom: 24
                        }}>
                            Tasky
                        </Title>
                        <Text style={{ 
                            color: 'var(--text-secondary)',
                            display: 'block',
                            marginBottom: 24
                        }}>
                            A powerful task management system designed to help teams collaborate efficiently and track progress seamlessly.
                        </Text>
                        <Space size="large">
                            <a href="#" style={{ color: 'var(--text-secondary)' }}>
                                <GithubOutlined style={{ fontSize: 24 }} />
                            </a>
                            <a href="#" style={{ color: 'var(--text-secondary)' }}>
                                <TwitterOutlined style={{ fontSize: 24 }} />
                            </a>
                            <a href="#" style={{ color: 'var(--text-secondary)' }}>
                                <LinkedinOutlined style={{ fontSize: 24 }} />
                            </a>
                            <a href="#" style={{ color: 'var(--text-secondary)' }}>
                                <MailOutlined style={{ fontSize: 24 }} />
                            </a>
                        </Space>
                    </Col>
                    {footerLinks.map((section, index) => (
                        <Col xs={12} sm={8} md={4} key={index}>
                            <Title level={5} style={{ 
                                color: 'var(--text-primary)',
                                marginBottom: 24
                            }}>
                                {section.title}
                            </Title>
                            <Space direction="vertical" size="small">
                                {section.links.map((link, linkIndex) => (
                                    <a
                                        key={linkIndex}
                                        href="#"
                                        style={{
                                            color: 'var(--text-secondary)',
                                            display: 'block',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        {link}
                                    </a>
                                ))}
                            </Space>
                        </Col>
                    ))}
                </Row>
                <div style={{
                    marginTop: 48,
                    paddingTop: 24,
                    borderTop: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                    textAlign: 'center'
                }}>
                    <Text style={{ color: 'var(--text-secondary)' }}>
                        © {new Date().getFullYear()} Tasky. All rights reserved.
                    </Text>
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;
