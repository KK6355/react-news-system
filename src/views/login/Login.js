import React, { useCallback } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import "./Login.css";
import Particles from "react-tsparticles";

import { loadBubblesPreset } from "tsparticles-preset-bubbles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    axios
      .get(
        `http://localhost:8000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.length === 0) {
          message.error("Invalid username or incorrect password");
        } else {
          localStorage.setItem("token", JSON.stringify(res.data[0]));
          navigate("/home");
        }
      });
  };
  const customInit = useCallback(async (engine) => {
    await loadBubblesPreset(engine);
  }, []);
  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);
  const options = {
    preset: "bubbles",
  };
  return (
    <div style={{ background: "rgb(35,39,65)", height: "100%" }}>
      <Particles options={options} init={customInit} loaded={particlesLoaded} />
      ;
      <div className="formContainer">
        <div className="logintitle">Global News System</div>
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
