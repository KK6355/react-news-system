import React from "react";
import NewsPublish from "../../../components/publishmanage/NewsPublish";
import usePublish from "../../../components/publishmanage/usePublish";
import { Button } from "antd";
export default function Unpublished() {
  const { dataSource, handlePublish } = usePublish(1);
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button
            style={{ color: "green", borderColor: "green" }}
            onClick={() => {
              handlePublish(id);
            }}
          >
            Publish
          </Button>
        )}
      />
    </div>
  );
}
