import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Steps,
  Form,
  Input,
  Select,
  message,
  notification,
} from "antd";
import style from "./News.module.css";
import axios from "axios";
import NewsEditor from "../../../components/newsmanage/NewsEditor";
import { useNavigate } from "react-router-dom";

export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [formInfo, setFormInfo] = useState({});
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          setFormInfo(res);
          console.log(res);
          setCurrent(current + 1);
        })
        .catch((err) => console.log(err));
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("news content can not be empty1");
      } else {
        setCurrent(current + 1);
      }
    }
  };
  const handlePrevious = () => {
    setCurrent(current - 1);
  };
  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategoryList(res.data);
    });
  }, []);
  const NewsForm = useRef(null);
  const user = JSON.parse(localStorage.getItem("token"));
  const handleSave = (auditState) => {
    axios
      .post("/news", {
        ...formInfo,
        content: content,
        region: user.region,
        author: user.username,
        roleId: user.roleId,
        auditState: auditState,
        publishState: 0,
        createTime: Date.now(),
        star: 0,
        view: 0,
        //publishTime: 0,
      })
      .then((res) => {
        auditState === 0
          ? navigate("/news-manage/draft")
          : navigate("/audit-manage/audit");
        notification.info({
          message: `Notification`,
          description: `News ${auditState === 0 ? "Saved" : "Submitted"}`,
          placement: "bottomRight",
        });
      });
  };

  return (
    <div>
      <h1>Add News</h1>

      <Steps
        current={current}
        items={[
          {
            title: "News Info",
            description: "Title and category",
          },
          {
            title: "News Content",
            description: "Edit news content",
          },
          {
            title: "News Submit",
            description: "Save draft or submit for auditing",
          },
        ]}
      />
      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form
            name="newsinfo"
            ref={NewsForm}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            style={{
              maxWidth: 1000,
            }}
            initialValues={{
              remember: true,
            }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="News Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input news title!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="News Category"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Select
                // onChange={handleChange}
                options={categoryList.map((item) => {
                  return { value: item.id, label: item.title };
                })}
              />
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.active}>
          <NewsEditor
            getContent={(value) => {
              setContent(value);
              console.log(value);
            }}
          />
        </div>
        <div className={current === 2 ? "" : style.active}></div>
      </div>

      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button
              type="primary"
              onClick={() => {
                handleSave(0);
              }}
            >
              Save Draft
            </Button>
            <Button
              type="primary"
              onClick={() => {
                handleSave(1);
              }}
            >
              Submit
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            Next Step
          </Button>
        )}
        {current > 0 && (
          <Button type="primary" onClick={handlePrevious}>
            Previous Step
          </Button>
        )}
      </div>
    </div>
  );
}
