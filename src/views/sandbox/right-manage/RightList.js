import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Popover, Switch } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import axios from "axios";
export default function RightList() {
  const { confirm } = Modal;
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then((res) => {
      const list = res.data;
      list.forEach((element) => {
        if (element.children.length === 0) {
          element.children = "";
        }
      });
      setDataSource(list);
    });
  }, []);
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
      title: "Right",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Route",
      dataIndex: "key",
      key: "key",
      render: (key) => {
        return <Tag color="orange">{key}</Tag>;
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
            <Popover
              title="Switch"
              trigger={item.pagepermisson === undefined ? "" : "click"}
              content={
                <div>
                  <Switch
                    checked={item.pagepermisson}
                    onChange={() => swithMethod(item)}
                  />
                </div>
              }
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              />
            </Popover>
          </div>
        );
      },
    },
  ];
  const confirmMethod = (item) => {
    confirm({
      title: "Do you Want to delete the right?",
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
    console.log(item);
    if (item.grade === 1) {
      setDataSource(dataSource.filter((data) => data.id !== item.id));
      axios.delete(`http://localhost:8000/rights/${item.id}`);
    } else {
      let list = dataSource.filter((data) => data.id === item.rightId);
      list[0].children = list[0].children.filter((data) => data.id !== item.id);
      setDataSource([...dataSource]);
      axios.delete(`http://localhost:8000/children/${item.id}`);
    }
  };
  const swithMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource]);

    if (item.grade === 1) {
      axios.patch(`http://localhost:8000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.patch(`http://localhost:8000/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
      />
    </div>
  );
}
