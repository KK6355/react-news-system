import axios from "axios";
import { useEffect, useState } from "react";
import { notification } from "antd";
function usePublish(type) {
  const [dataSource, setdataSource] = useState();
  const {
    username,
    role: { roleName },
    region,
  } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    let url = `/news?author=${username}&publishState=${type}&_expand=category`;
    if (roleName === "admin") {
      url = `/news?publishState=${type}&_expand=category`;
    }
    if (roleName === "region-admin") {
      url = `/news?region=${region}publishState=${type}&_expand=category`;
    }
    axios.get(url).then((res) => {
      //console.log(res.data);
      setdataSource(res.data);
    });
  }, [username, region, roleName, type]);
  const handleDelete = (id) => {
    setdataSource(dataSource.filter((data) => data.id !== id));
    axios.delete(`/news/${id}`).then((res) => {
      notification.info({
        message: `Notification`,
        description: `News Deleted!`,
        placement: "bottomRight",
      });
    });
  };
  const handlePublish = (id) => {
    setdataSource(dataSource.filter((data) => data.id !== id));
    setdataSource(dataSource.filter((data) => data.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `Notification`,
          description: `News Published!`,
          placement: "bottomRight",
        });
      });
  };
  const handleWithdraw = (id) => {
    setdataSource(dataSource.filter((data) => data.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 3,
      })
      .then((res) => {
        notification.info({
          message: `Notification`,
          description: `News Off-lined!`,
          placement: "bottomRight",
        });
      });
  };
  return {
    dataSource,
    handleDelete,
    handlePublish,
    handleWithdraw,
  };
}
export default usePublish;
