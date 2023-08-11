import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, notification } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
export default function Audit() {
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );
  const [dataSource, setdataSource] = useState([]);

  useEffect(() => {
    const roleObj = {
      1: "superadmin",
      2: "admin",
      3: "editor",
    };
    axios.get(`/news?&auditState=1&_expand=category`).then((res) => {
      const list = res.data;
      setdataSource(
        roleObj[roleId] === "superadmin"
          ? list
          : [
              ...list.filter((item) => item.author === username),
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === "editor"
              ),
            ]
      );
    });
  }, [roleId, region, username]);
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        return <div>{category.title}</div>;
      },
    },

    {
      title: "Action",
      key: "action",
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              onClick={() => {
                handleAudit(item, 3, 0);
              }}
              icon={<CloseOutlined />}
            />

            <Button
              style={{ color: "green", borderColor: "green", margin: "10px" }}
              shape="circle"
              onClick={() => {
                handleAudit(item, 2, 1);
              }}
              icon={<CheckOutlined />}
            />
          </div>
        );
      },
    },
  ];
  const handleAudit = (item, auState, pubState) => {
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        auditState: auState,
        pubState: pubState,
      })
      .then((res) => {
        notification.info({
          message: `Notification`,
          description: `You have audited a news`,
          placement: "bottomRight",
        });
      });
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
