import React, { useEffect } from "react";
import SideMenu from "../../components/SideMenu";
import TopHeader from "../../components/TopHeader";
import NewsRouter from "./NewsRouter";
import { Layout, theme } from "antd";
import "./NewsSandBox.css";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
const { Content } = Layout;
export default function NewsSandBox() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  nProgress.start();
  useEffect(() => {
    nProgress.done();
  }, []);
  return (
    <Layout className="ant-layout">
      <SideMenu />
      <Layout>
        <TopHeader />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  );
}
