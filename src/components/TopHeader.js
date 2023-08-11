import React from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Button, theme, Dropdown, Space, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
const { Header } = Layout;
const {
  role: { roleName },
  username,
} = JSON.parse(localStorage.getItem("token"));

const items = [
  {
    key: "1",
    label: roleName,
    // label: "admin",
  },

  {
    key: "2",
    danger: true,
    label: "Logout",
  },
];
function TopHeader(props) {
  console.log(props.isCollapsed);
  const navigate = useNavigate();
  const onClick = ({ key }) => {
    if (key === "2") {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  //const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const changeCollapsed = () => {
    props.changeCollapsed();
  };
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <div style={{ float: "right" }}>
        <span>
          welcom back <span style={{ color: "blueviolet" }}>{username}</span>
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
        icon={props.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => changeCollapsed()}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
    </Header>
  );
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed,
  };
};
const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed",
    };
  },
};
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);
