import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Card, Col, List } from "antd";
import _ from "lodash";
export default function News() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then((res) => {
      //   console.log(res.data);
      setDataSource(
        Object.entries(_.groupBy(res.data, (item) => item.category.title))
      );
    });
  }, []);
  console.log(dataSource);
  return (
    <div>
      <div style={{ width: "80%", margin: "0 auto" }}>
        <h1 style={{ color: "gray" }}>Global News Center</h1>
        <br />
        <Row gutter={[16, 16]}>
          {dataSource.map((item) => (
            <Col span={8} key={item[0]}>
              <Card
                title={item[0]}
                bordered={true}
                hoverable={true}
                style={{ backgroundColor: "whitesmoke" }}
              >
                <List
                  dataSource={item[1]}
                  pagination={{
                    pageSize: 3,
                  }}
                  renderItem={(data) => (
                    <List.Item>
                      <a href={`#/detail/${data.id}`}>{data.title}</a>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
