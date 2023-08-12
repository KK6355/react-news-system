import React, { useEffect, useState } from "react";
import { Descriptions } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment/moment";
import { HeartTwoTone } from "@ant-design/icons";
export default function Detail(props) {
  let { id } = useParams();
  const [newsInfo, setNewsInfo] = useState(null);
  useEffect(() => {
    axios
      .get(`/news/${id}?_expand=category&_expand=role`)
      .then((res) => {
        setNewsInfo({
          ...res.data,
          view: res.data.view + 1,
        });
        return res.data;
      })
      .then((res) => {
        axios.patch(`/news/${id}?_expand=category&_expand=role`, {
          view: res.view + 1,
        });
      });
  }, [id]);
  //   console.log(newsInfo?.view);
  const handleLiked = () => {
    setNewsInfo({
      ...newsInfo,
      star: newsInfo.star + 1,
    });
    axios.patch(`/news/${id}?_expand=category&_expand=role`, {
      star: newsInfo.star + 1,
    });
  };
  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      {newsInfo && (
        <div>
          <h3>
            {newsInfo?.title}---{newsInfo?.category.title}
            <span style={{ paddingLeft: "10px" }}>
              <HeartTwoTone twoToneColor="#eb2f96" onClick={handleLiked} />
            </span>
          </h3>

          <br />
          <Descriptions>
            <Descriptions.Item label="Author">
              {newsInfo.author}
            </Descriptions.Item>

            <Descriptions.Item label="Publish At">
              {newsInfo.publishTime
                ? moment(newsInfo.publishTime).format("DD/MM/YYYY HH:mm:ss")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Region">
              {newsInfo.region === "" ? "Global" : newsInfo.region}
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
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
