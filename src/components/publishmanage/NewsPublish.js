import React from "react";
import { Table, Tag } from "antd";

export default function NewsPublish(props) {
  const columns = [
    {
      title: "Title",
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
        return <Tag color="orange">{category.title}</Tag>;
      },
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      render: (region) => {
        return <Tag color="cyan">{region === "" ? "global" : region}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (item) => {
        return <div>{props.button(item.id)}</div>;
      },
    },
  ];

  return (
    <div>
      <Table
        dataSource={props.dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
