import React, { forwardRef, useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
const UserForm = forwardRef((props, ref) => {
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    setDisabled(props.isUpdateDisabled);
  }, [props.isUpdateDisabled]);

  return (
    <Form layout="vertical" ref={ref}>
      <Form.Item
        name="username"
        label="Name"
        rules={[
          {
            required: true,
            message: "Please input the username!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input the password!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="Region"
        initialValue=""
        rules={
          disabled
            ? []
            : [
                {
                  required: true,
                  message: "Please select the region!",
                },
              ]
        }
      >
        <Select
          disabled={disabled}
          options={props.regionList.map((item) => {
            return {
              value: item.value,
              label: item.title,
            };
          })}
        />
      </Form.Item>
      <Form.Item
        name="roleId"
        label="Role"
        rules={[
          {
            required: true,
            message: "Please select the role!",
          },
        ]}
      >
        <Select
          onChange={(value) => {
            if (value === 1) {
              setDisabled(true);
              ref.current.setFieldsValue({
                region: "",
              });
            } else {
              setDisabled(false);
            }
          }}
          options={props.roleList.map((item) => {
            return {
              value: item.id,
              label: item.roleName,
            };
          })}
        />
      </Form.Item>
    </Form>
  );
});
export default UserForm;
