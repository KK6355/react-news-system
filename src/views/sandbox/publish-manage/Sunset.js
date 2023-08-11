import React from "react";
import NewsPublish from "../../../components/publishmanage/NewsPublish";
import usePublish from "../../../components/publishmanage/usePublish";
import { Button } from "antd";
export default function Sunset() {
  const { dataSource, handleDelete } = usePublish(3);
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button
            danger
            onClick={() => {
              handleDelete(id);
            }}
          >
            Delete
          </Button>
        )}
      />
    </div>
  );
}
