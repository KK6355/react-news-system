import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Button, theme, Dropdown, Space, Avatar, message } from "antd";
import { useNavigate } from "react-router-dom";
const { Header } = Layout;
// const {
//   role: { roleName },
//   username,
// } = JSON.parse(localStorage.getItem("token"));

const items = [
  {
    key: "1",
    // label: roleName,
    label: "admin",
  },

  {
    key: "2",
    danger: true,
    label: "Logout",
  },
];
export default function TopHeader() {
  const navigate = useNavigate();
  const onClick = ({ key }) => {
    if (key === "2") {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <div style={{ float: "right" }}>
        <span>
          welcom back <span style={{ color: "blueviolet" }}>admin</span>
        </span>
        {/* dropdown list here */}
        <Dropdown
          menu={{
            items,
            onClick,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar size="large" icon={<UserOutlined />} />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
    </Header>
  );
}
