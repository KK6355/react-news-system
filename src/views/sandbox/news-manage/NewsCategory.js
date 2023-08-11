import React, { useEffect, useState, useRef, useContext } from "react";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import axios from "axios";
export default function NewsCategory() {
  const { confirm } = Modal;
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get("/categories").then((res) => {
      const list = res.data;
      setDataSource(list);
    });
  }, []);
  const handleSave = (data) => {
    console.log(data);
    setDataSource(
      dataSource.map((item) => {
        if (item.id === data.id) {
          return {
            id: item.id,
            title: data.title,
            value: item.value,
          };
        }
        return item;
      })
    );
    axios
      .patch(`/categories/${data.id}`, {
        title: data.title,
      })
      .then((res) => {
        notification.info({
          message: `Notification`,
          description: `You have updated categories`,
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "Title",
        handleSave: handleSave,
      }),
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
          </div>
        );
      },
    },
  ];
  const confirmMethod = (item) => {
    confirm({
      title: "Do you Want to delete the category?",
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
    axios.delete(`http://localhost:8000/categories/${item.id}`);
  };
  const EditableContext = React.createContext(null);
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
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
        components={components}
      />
    </div>
  );
}
