import React from "react";
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from "antd";

const { Header } = Layout;

const Navbar = () => {
    const navigate  = useNavigate();
  return (
    <Header
      style={{
        position: "sticky",      // Sticky on scroll
        top: 0,                  // Stick to top
        zIndex: 1000, 
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "0 40px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 600,
          fontFamily: "serif",
          color: "#000",
        }}
      >
        TASKY
      </div>

      <Menu
        mode="horizontal"
        selectable={false}
        style={{
          flexGrow: 1,
          justifyContent: "flex-end",
          fontWeight: 500,
          borderBottom: "none",
          backgroundColor: "transparent",
        }}
        items={[
          { label: "Features", key: "features" },
          { label: "About", key: "about" },
          { label: "Product", key: "product" },
          { label: "Contact", key: "contact" },
          {
            label: (
              <Button type="primary" shape="round" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            ),
            key: "signup",
          },
        ]}
      />
    </Header>
  );
};

export default Navbar;
