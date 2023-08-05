import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  ApartmentOutlined,
  UserSwitchOutlined,
  NotificationOutlined,
  EditOutlined,
  CarryOutOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import "../views/sandbox/index.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const { Sider } = Layout;
export default function SideMenu(props) {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const toPage = (e) => {
    console.log(e.key);
    navigate(e.key);
  };

  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then((res) => {
      console.log(res.data);
      setMenu(res.data);
    });
  }, []);
  const [menu, setMenu] = useState([]);

  const items = [];
  const iconList = {
    "/home": <AppstoreOutlined />,
    "/user-manage": <UserSwitchOutlined />,
    "/right-manage": <ApartmentOutlined />,
    "/news-manage": <NotificationOutlined />,
    "/audit-manage": <EditOutlined />,
    "/publish-manage": <CarryOutOutlined />,
  };
  menu.map((item) =>
    item.children.length === 0
      ? items.push({
          key: item.key,
          label: item.title,
          icon: iconList[item.key],
        })
      : items.push({
          key: item.key,
          label: item.title,
          icon: iconList[item.key],
          children: item.children.map((data) => {
            if (data.pagepermisson === 1) {
              return { key: data.key, label: data.title };
            } else {
              return "";
            }
          }),
        })
  );
  const selectedKeys = [useLocation().pathname];
  const defaultOpenKeys = ["/" + useLocation().pathname.split("/")[1]];
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">Global News System</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            onClick={toPage}
            selectedKeys={selectedKeys}
            mode="inline"
            items={items}
            theme="dark"
            defaultOpenKeys={defaultOpenKeys}
          />
        </div>
      </div>
    </Sider>
  );
}
