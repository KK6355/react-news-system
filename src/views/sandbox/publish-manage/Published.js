import React from "react";
import NewsPublish from "../../../components/publishmanage/NewsPublish";
import usePublish from "../../../components/publishmanage/usePublish";
import { Button } from "antd";
export default function Published() {
  const { dataSource, handleWithdraw } = usePublish(2);
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button
            danger
            onClick={() => {
              handleWithdraw(id);
            }}
          >
            Off-line
          </Button>
        )}
      />
    </div>
  );
}
