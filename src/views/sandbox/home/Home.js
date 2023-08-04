import { Button } from "antd";
import React from "react";
import axios from "axios";

export default function Home() {
  const ajax = () => {
    // axios.get("http://localhost:8000/posts").then((res) => {
    //   console.log(res.data);
    // });
    // axios.post("http://localhost:8000/posts", {
    //   title: "44444",
    //   author: "xiaoming",
    // });
    // axios.put("http://localhost:8000/posts/1", {
    //   title: "111-update",
    //   author: "xiaoming",
    // });
    // axios.patch("http://localhost:8000/posts/1", {
    //   title: "111-patch",
    // });
    // axios.delete("http://localhost:8000/posts/4");
    // axios.get("http://localhost:8000/posts?_embed=comments").then((res) => {
    //   console.log(res.data);
    // });
    // axios
    //   .get(
    //     "http://localhost:8000/commentsd:BaiduNetdiskDownload千锋2022版React全家桶教程_react零基础入门到项目实战完整版（资料）项目部分代码资料material\3-��Ŀʵս\014-���SideMenudb.json?_expend=post"
    //   )
    //   .then((res) => {
    //     console.log(res.data);
    //   });
  };
  return (
    <div>
      <Button type="primary" onClick={ajax}>
        Button
      </Button>
    </div>
  );
}
