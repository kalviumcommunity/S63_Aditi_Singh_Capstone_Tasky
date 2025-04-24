import React from 'react';
import { Typography, Input, Button, Card } from 'antd';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Subscribe = () => {
    const { isDark } = useTheme();

    return (
        <div style={{ 
            padding: '60px 0',
            background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center', marginBottom: 40 }}
            >
                <Title level={2} style={{ 
                    color: 'var(--text-primary)',
                    marginBottom: 20 
                }}>
                    Stay Updated
                </Title>
                <Text style={{ 
                    fontSize: 18,
                    color: 'var(--text-secondary)'
                }}>
                    Subscribe to our newsletter for the latest updates and features
                </Text>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                style={{ maxWidth: 600, margin: '0 auto' }}
            >
                <Card
                    style={{
                        background: isDark ? 'var(--card-bg)' : 'var(--bg-secondary)',
                        border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Input
                            prefix={<MailOutlined style={{ color: 'var(--text-secondary)' }} />}
                            placeholder="Enter your email"
                            size="large"
                            style={{
                                flex: 1,
                                background: isDark ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                                border: `1px solid ${isDark ? 'var(--card-border)' : 'rgba(0, 0, 0, 0.1)'}`,
                                color: 'var(--text-primary)',
                            }}
                        />
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                backgroundColor: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                borderColor: isDark ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                boxShadow: `0 4px 14px 0 ${isDark ? 'rgba(251, 191, 36, 0.39)' : 'rgba(245, 158, 11, 0.39)'}`
                            }}
                        >
                            Subscribe
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Subscribe;
