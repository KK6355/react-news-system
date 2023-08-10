import React, { useEffect, useState } from "react";
import { Descriptions } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment/moment";
export default function NewsPreview(props) {
  let { id } = useParams();
  const [newsInfo, setNewsInfo] = useState(null);
  useEffect(() => {
    axios.get(`/news/${id}?_expand=category&_expand=role`).then((res) => {
      setNewsInfo(res.data);
    });
    // console.log(id);
  }, [id]);
  const auditList = ["Unaudit", "Auditing", "Approved", "Declined"];
  const publishList = ["Unpublish", "Pending", "Published", "Sunset"];
  return (
    <div>
      {newsInfo && (
        <div>
          <h1>
            News Preview---{newsInfo?.title}---{newsInfo?.category.title}
          </h1>
          <br />
          <Descriptions>
            <Descriptions.Item label="Author">
              {newsInfo.author}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {moment(newsInfo.createTime).format("DD/MM/YYYY HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="Publish At">
              {newsInfo.publishTime
                ? moment(newsInfo.publishTime).format("DD/MM/YYYY HH:mm:ss")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Region">
              {newsInfo.region === "" ? "Global" : newsInfo.region}
            </Descriptions.Item>
            <Descriptions.Item label="Audit Status">
              <span style={{ color: "red" }}>
                {auditList[newsInfo.auditState]}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Publish Status">
              <span style={{ color: "red" }}>
                {publishList[newsInfo.publishState]}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Likes">{newsInfo.star}</Descriptions.Item>
            <Descriptions.Item label="Views">{newsInfo.view}</Descriptions.Item>
          </Descriptions>
          <div
            dangerouslySetInnerHTML={{
              __html: newsInfo.content,
            }}
            style={{
              //   border: "1px solid gray",
              padding: "10px",
              background: "lightGray",
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
