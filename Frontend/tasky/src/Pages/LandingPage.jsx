// src/App.jsx
import { Button, Layout, Menu, Typography, Space } from 'antd';
import { DashboardOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import logo from '../assets/logo.png'; // Adjust the path if needed
import Features from '../components/Features'; // ✅ Import Features here
import PremiumQualityAntd from '../components/PremimumQualityAntd';
import Subscribe from '../components/Subscribe';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
import Navbar from '../components/Navbar';

export default function LandingPage() {
    const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '50vh', backgroundColor: '#000' }}>
      <Navbar />

      <Content style={{ padding: '60px 100px' }}>
        <div style={{ display: 'flex', gap: '50px', alignItems: 'stretch' }}>
          {/* Left Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>• Streamline your workflow</span>
            <Title style={{ marginTop: 10, fontSize: 46, color: '#fff'}}>
              FOR TEAMS AND INDIVIDUALS
            </Title>
            <Paragraph style={{ fontSize: 26, color: '#555' }}>
              A powerful, intuitive task management system
              designed to help teams collaborate efficiently and track progress seamlessly.
            </Paragraph>

            <Space size="middle" style={{ marginTop: 20 }}>
              
              <Button type="primary" size="large" onClick={() => navigate('/signup')} style={{ backgroundColor: '#fbbf24', borderColor: '#fbbf24' }}>SignUp</Button>
              <Button size="large"   onClick={() => navigate('/login')}>Login</Button>
            </Space>

            <Space style={{ marginTop: 40 }} size="large">
              <div style={{ textAlign: 'center' }}><DashboardOutlined style={{ fontSize: '20px' }} /> <div>Track progress easily</div></div>
              <div style={{ textAlign: 'center' }}><TeamOutlined style={{ fontSize: '20px' }} /> <div>Team collaboration</div></div>
              <div style={{ textAlign: 'center' }}><BarChartOutlined style={{ fontSize: '20px' }} /> <div>Insightful analytics</div></div>
            </Space>
          </div>

          {/* Right Section (Dashboard Card with Logo) */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 30px',
            border: '2px solid #fbbf24',
            borderRadius: '20px',
            backgroundColor: '#fff7ed',
            boxShadow: '0 6px 20px rgba(251, 191, 36, 0.2)',
            minHeight: '400px'
          }}>
            <p style={{ color: '#f97316', fontWeight: 600, fontSize: '20px', marginBottom: 10 }}>• Dashboard</p>

            <img
              src={logo}
              alt="Tasky Logo"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'contain',
                marginBottom: 10,
                filter: 'drop-shadow(0 0 10px #facc15)'
              }}
            />

            <Title level={1} style={{ marginTop: 10, fontSize: '40px', color: '#333', letterSpacing: 2 }}>TASKY</Title>
          </div>
        </div>

        {/* ✅ Features Section */}
        <div style={{ marginTop: '0px' }}>
          <Features />
        </div>

      </Content>
        <div style={{ padding: '0px' }}>
      <PremiumQualityAntd />
    </div>
    
      <Subscribe />
    
    <Footer/>
    </Layout>
  );
}
