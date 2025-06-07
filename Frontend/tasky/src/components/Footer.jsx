import React from 'react';
import { Layout, Typography, Row, Col, Space } from 'antd';
import {
    GithubOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    MailOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Title } = Typography;

const Footer = () => {
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

    const socialLinks = [
        { icon: <GithubOutlined />, href: '#' },
        { icon: <TwitterOutlined />, href: '#' },
        { icon: <LinkedinOutlined />, href: '#' },
        { icon: <MailOutlined />, href: '#' },
    ];

    return (
        <AntFooter style={{
            background: '#f9f9f9',
            padding: '40px 0',
            textAlign: 'center',
        }}>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} md={6}>
                    <Title level={4} style={{ color: '#333', marginBottom: '16px' }}>TASKY</Title>
                    <Text style={{ color: '#555' }}>
                        Your ultimate task management solution.
                    </Text>
                </Col>
                 {footerLinks.map((section, index) => (
                    <Col xs={12} md={4} key={index}>
                        <Title level={5} style={{ color: '#333', marginBottom: '12px' }}>{section.title}</Title>
                        <Space direction="vertical" size={8} style={{ alignItems: 'flex-start' }}>
                            {section.links.map((link, linkIndex) => (
                                <Text key={linkIndex} style={{ color: '#555', cursor: 'pointer' }} hoverable>{link}</Text>
                            ))}
                        </Space>
                    </Col>
                ))}
                <Col xs={24} md={4}>
                     <Title level={5} style={{ color: '#333', marginBottom: '16px' }}>Connect</Title>
                     <Space size="middle">
                        {socialLinks.map((link, index) => (
                            <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>
                                {link.icon}
                            </a>
                        ))}
                    </Space>
                </Col>
            </Row>
            <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <Text style={{ color: '#777' }}>© {new Date().getFullYear()} TASKY. All rights reserved.</Text>
            </div>
        </AntFooter>
    );
};

export default Footer;
