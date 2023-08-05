import { Button } from "antd";
import React from "react";
import axios from "axios";

export default function Home() {
  const ajax = () => {
    //
  };
  return (
    <div>
      <Button type="primary" onClick={ajax}>
        Button
      </Button>
    </div>
  );
}
