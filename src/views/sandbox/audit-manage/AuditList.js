import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Tag, notification } from "antd";
import { useNavigate } from "react-router-dom";
export default function AuditList() {
  const navigate = useNavigate();
  const [dataSource, setdataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios
      .get(
        `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
      .then((res) => setdataSource(res.data));
  }, [username]);
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
      title: "Audit Status",
      dataIndex: "auditState",
      key: "auditState",
      render: (auditState) => {
        const colorList = ["", "orange", "green", "red"];
        const auditList = ["Drafe", "Auditing", "Approved", "Declined"];
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (item) => {
        return (
          <div>
            {item.auditState === 1 && (
              <Button
                danger
                shape="square"
                onClick={() => {
                  handleWithdraw(item);
                }}
              >
                Withdraw
              </Button>
            )}
            {item.auditState === 2 && (
              <Button
                style={{ color: "green", borderColor: "green" }}
                shape="square"
                onClick={() => {
                  handlePublish(item);
                }}
              >
                Publish
              </Button>
            )}
            {item.auditState === 3 && (
              <Button
                type="primary"
                ghost
                shape="square"
                onClick={() => {
                  handleEdit(item);
                }}
              >
                Edit
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  const handleWithdraw = (item) => {
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        auditState: 0,
      })
      .then((res) => {
        notification.info({
          message: `Notification`,
          description: `You have withdraw a news, you can still edit it in your draft list`,
          placement: "bottomRight",
        });
      });
  };
  const handleEdit = (item) => {
    navigate(`/news-manage/update/${item.id}`);
  };
  const handlePublish = (item) => {
    axios
      .patch(`/news/${item.id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        navigate("/publish-manage/published");

        notification.info({
          message: `Notification`,
          description: `News Published!`,
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
