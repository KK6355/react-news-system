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
import { connect } from "react-redux";
const { Sider } = Layout;

function SideMenu(props) {
  const navigate = useNavigate();
  const toPage = (e) => {
    console.log(e.key);
    navigate(e.key);
  };
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  console.log(rights);
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then((res) => {
      console.log(res.data);
      setMenu(res.data);
    });
  }, []);
  const [menu, setMenu] = useState([]);
  console.log(menu);
  const iconList = {
    "/home": <AppstoreOutlined />,
    "/user-manage": <UserSwitchOutlined />,
    "/right-manage": <ApartmentOutlined />,
    "/news-manage": <NotificationOutlined />,
    "/audit-manage": <EditOutlined />,
    "/publish-manage": <CarryOutOutlined />,
  };

  const items = [];
  menu.map((item) =>
    item.children.length === 0 && rights.includes(item.key)
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
            if (data.pagepermisson === 1 && rights.includes(data.key)) {
              return { key: data.key, label: data.title };
            } else {
              return "";
            }
          }),
        })
  );
  console.log(items);
  const selectedKeys = [useLocation().pathname];
  const defaultOpenKeys = ["/" + useLocation().pathname.split("/")[1]];
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div
        style={{ display: "flex", height: "100vh", flexDirection: "column" }}
      >
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
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed,
  };
};

export default connect(mapStateToProps)(SideMenu);
