// src/App.jsx
import { Button, Layout, Menu, Typography, Space } from 'antd';
import { DashboardOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white' }}>
        <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'serif' }}>TASKY</div>
        <Menu mode="horizontal" items={[
          { label: 'Features', key: '1' },
          { label: 'About', key: '2' },
          { label: 'Product', key: '3' },
          { label: 'Contact', key: '4' },
          { label: <Button type="primary">SignUp</Button>, key: '5' }
        ]} style={{ flexGrow: 1, justifyContent: 'flex-end' }} />
      </Header>

      <Content style={{ padding: '60px 100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '60px', alignItems: 'center' }}>
          {/* Left Section */}
          <div style={{ maxWidth: '600px' }}>
            <span style={{ color: '#f97316', fontWeight: 500 }}>• Streamline your workflow</span>
            <Title style={{ marginTop: 10 }}>
              FOR TEAMS AND INDIVIDUALS
            </Title>
            <Paragraph style={{ fontSize: 16, color: '#555' }}>
              A powerful, intuitive task management system designed to help teams collaborate efficiently and track progress seamlessly.
            </Paragraph>

            <Space size="middle" style={{ marginTop: 20 }}>
              <Button type="primary" size="large" style={{ backgroundColor: '#fbbf24', borderColor: '#fbbf24' }}>SignUp</Button>
              <Button size="large">Login</Button>
            </Space>

            <Space style={{ marginTop: 40 }} size="large">
              <div style={{ textAlign: 'center' }}><DashboardOutlined style={{ fontSize: '20px' }} /> <div>Track progress easily</div></div>
              <div style={{ textAlign: 'center' }}><TeamOutlined style={{ fontSize: '20px' }} /> <div>Team collaboration</div></div>
              <div style={{ textAlign: 'center' }}><BarChartOutlined style={{ fontSize: '20px' }} /> <div>Insightful analytics</div></div>
            </Space>
          </div>

          {/* Right Card Section */}
          <div style={{
            flex: 1,
            maxWidth: '600px',
            padding: '50px 30px',
            border: '2px solid #fbbf24',
            borderRadius: '20px',
            backgroundColor: '#fff7ed',
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(251, 191, 36, 0.2)'
          }}>
            <p style={{ color: '#f97316', fontWeight: 600, fontSize: '18px', marginBottom: 10 }}>• Dashboard</p>
            <div style={{ fontFamily: 'cursive', fontSize: '72px', color: '#f59e0b', lineHeight: 1 }}>𝒯</div>
            <Title level={2} style={{ marginTop: 10, fontSize: '36px', color: '#333' }}>TASKY</Title>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
