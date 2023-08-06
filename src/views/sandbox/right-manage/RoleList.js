import { Table, Button, Modal, Tree } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
export default function RoleList() {
  const { confirm } = Modal;
  const [dataSource, setDataSource] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [currentRight, setCurrentRight] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:8000/roles")
      .then((res) => setDataSource(res.data));
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:8000/rights?_embed=children")
      .then((res) => setRightList(res.data));
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
      title: "Role Name",
      dataIndex: "roleName",
      key: "roleName",
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
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setIsModalOpen(true);
                setCurrentRight(item.rights);
                setCurrentId(item.id);
              }}
            />
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
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`http://localhost:8000/roles/${item.id}`);
  };

  const handleOk = () => {
    console.log(currentRight);
    setIsModalOpen(false);
    setDataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          return {
            ...item,
            rights: currentRight,
          };
        }
        return item;
      })
    );
    axios.patch(`http://localhost:8000/roles/${currentId}`, {
      rights: currentRight,
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCheck = (checkedKeys) => {
    setCurrentRight(checkedKeys.checked);
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      />
      <Modal
        title="Right manage Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          treeData={rightList}
          checkedKeys={currentRight}
          onCheck={onCheck}
          checkStrictly={true}
        />
      </Modal>
    </div>
  );
}
