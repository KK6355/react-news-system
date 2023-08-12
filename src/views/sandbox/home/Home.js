import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row, List, Avatar } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as echarts from "echarts";
import _ from "lodash";
const { Meta } = Card;
export default function Home() {
  const [viewList, setViewList] = useState([]);
  const [starList, setStarList] = useState([]);
  const bar = useRef();
  let {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));
  //publishState=2&_expand=category&_sort=view&_order=desc&_limit=6
  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6"
      )
      .then((res) => {
        setViewList(res.data);
        //console.log(res.data);
      });
    return () => {
      window.onresize = null;
    };
  }, []);
  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6"
      )
      .then((res) => {
        setStarList(res.data);
      });
  }, []);
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then((res) => {
      console.log(_.groupBy(res.data, (item) => item.category.title));
      renderBarChart(_.groupBy(res.data, (item) => item.category.title));
    });
  }, []);
  const renderBarChart = (data) => {
    var myChart = echarts.init(bar.current);
    var option;

    option = {
      title: {
        text: "News Category",
      },
      legend: {},
      xAxis: {
        type: "category",
        data: Object.keys(data),
      },
      yAxis: {
        type: "value",
        minInterval: 1,
      },
      series: [
        {
          name: "Amount",
          data: Object.values(data).map((item) => item.length),
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };

    option && myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    };
  };
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Most Viewed News" bordered={true}>
            <List
              size="large"
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Most Liked News" bordered={true}>
            <List
              size="large"
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={
                <Avatar
                  src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                  size={"large"}
                />
              }
              title={username}
              description={
                <div>
                  <b>{region ? region : "Global"}</b>
                  <span style={{ paddingLeft: "10px" }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <div ref={bar} style={{ width: "100%", height: "300px" }}></div>
    </div>
  );
}
