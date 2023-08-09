import React, { useEffect, useRef, useState } from "react";
import { Table, Button, Modal, Switch } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import axios from "axios";
import UserForm from "../../../components/usermanage/UserForm";
export default function UserList() {
  const { confirm } = Modal;
  // const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [regionList, setRegionList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const [current, setCurrent] = useState();
  const addForm = useRef(null);
  const updateForm = useRef(null);
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );

  useEffect(() => {
    const roleObj = {
      1: "superadmin",
      2: "admin",
      3: "editor",
    };
    axios.get("http://localhost:8000/users?_expand=role").then((res) => {
      const list = res.data;
      setDataSource(
        roleObj[roleId] === "superadmin"
          ? list
          : [
              ...list.filter((item) => item.username === username),
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === "editor"
              ),
            ]
      );
    });
  }, [roleId, region, username]);
  useEffect(() => {
    axios.get("http://localhost:8000/regions").then((res) => {
      const list = res.data;
      setRegionList(list);
      console.log(list);
    });
  }, []);
  useEffect(() => {
    axios.get("http://localhost:8000/roles").then((res) => {
      const list = res.data;
      setRoleList(list);
    });
  }, []);

  const columns = [
    {
      title: "Region",
      dataIndex: "region",
      filters: [
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
        {
          text: "global",
          value: "",
        },
      ],
      key: "region",
      onFilter: (value, item) => item.region === value,
      render: (region) => {
        return <b>{region === "" ? "Global" : region}</b>;
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        return role?.roleName;
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role State",
      dataIndex: "roleState",
      key: "roleState",
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => swithMethod(item)}
          />
        );
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
              disabled={item.default}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => {
                updateMethod(item);
              }}
            />
          </div>
        );
      },
    },
  ];
  const confirmMethod = (item) => {
    confirm({
      title: "Do you want to delete the user?",
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
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`http://localhost:8000/users/${item.id}`);
  };
  const swithMethod = (item) => {
    console.log(item);
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);
    axios.patch(`http://localhost:8000/users/${item.id}`, {
      roleState: item.roleState,
    });
  };
  const addFormOK = () => {
    addForm.current
      .validateFields()
      .then((value) => {
        setOpen(false);
        addForm.current.resetFields();
        axios
          .post(`http://localhost:8000/users`, {
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            setDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === res.data.roleId)[0],
              },
            ]);
          });
      })
      .catch((err) => console.log(err));
  };
  const updateMethod = (item) => {
    setIsUpdateOpen(true);
    setCurrent(item);
    updateForm.current?.setFieldsValue(item);

    //console.log(updateForm.current);
    if (item.roleId === 1) {
      setIsUpdateDisabled(true);
    } else {
      setIsUpdateDisabled(false);
    }
  };
  const updateFormOK = () => {
    updateForm.current.validateFields().then((value) => {
      setIsUpdateOpen(false);
      console.log(value);
      setDataSource(
        dataSource.map((item) => {
          if (item.id === current.id) {
            return {
              ...item,
              ...value,
              role: roleList.filter((data) => data.id === value.roleId)[0],
            };
          }
          return item;
        })
      );
      setIsUpdateDisabled(!isUpdateDisabled);
      axios.patch(`http://localhost:8000/users/${current.id}`, value);
    });
  };
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Add User
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
      <Modal
        open={open}
        title="Create a new user"
        okText="Create"
        cancelText="Cancel"
        onCancel={() => setOpen(false)}
        onOk={() => {
          addFormOK();
        }}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm} />
      </Modal>
      <Modal
        open={isUpdateOpen}
        title="Update user"
        okText="Update"
        cancelText="Cancel"
        onCancel={() => {
          setIsUpdateOpen(false);
          setIsUpdateDisabled(!isUpdateDisabled);
        }}
        onOk={() => {
          updateFormOK();
        }}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
        />
      </Modal>
    </div>
  );
}
