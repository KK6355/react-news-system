import { Table, Button, Modal, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
export default function NewsDraft() {
  const navigate = useNavigate();
  const { confirm } = Modal;
  const [dataSource, setDataSource] = useState([]);

  const { username } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios
      .get(`/news?author=${username}&auditState=0&_expand=category`)
      .then((res) => setDataSource(res.data));
  }, [username]);

  const handleCheck = (id) => {
    axios
      .patch(`/news/${id}`, {
        auditState: 1,
        //publishTime: 0,
      })
      .then((res) => {
        navigate("/audit-manage/list");
        notification.info({
          message: `Notification`,
          description: `News Submitted!`,
          placement: "bottomRight",
        });
      });
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "News Title",
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
        return category.title;
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
              icon={<DeleteOutlined />}
              onClick={() => {
                confirmMethod(item);
              }}
            />

            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                navigate(`/news-manage/update/${item.id}`);
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<VerticalAlignTopOutlined />}
              onClick={() => {
                handleCheck(item.id);
              }}
            />
          </div>
        );
      },
    },
  ];
  const confirmMethod = (item) => {
    confirm({
      title: "Do you Want to delete the draft?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const deleteMethod = (item) => {
    // console.log(item);
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/news/${item.id}`);
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
