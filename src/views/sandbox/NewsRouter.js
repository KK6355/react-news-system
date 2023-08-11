import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./home/Home";
import UserList from "./user-manage/UserList";
import RoleList from "./right-manage/RoleList";
import RightList from "./right-manage/RightList";
import NoPermission from "../../nopermisson/NoPermission";
import NewsAdd from "./news-manage/NewsAdd";
import NewsDraft from "./news-manage/NewsDraft";
import NewsCategory from "./news-manage/NewsCategory";
import Audit from "./audit-manage/Audit";
import AuditList from "./audit-manage/AuditList";
import Published from "./publish-manage/Published";
import Unpublished from "./publish-manage/Unpublished";
import Sunset from "./publish-manage/Sunset";
import axios from "axios";
import NewsUpdate from "./news-manage/NewsUpdate";
import NewsPreview from "./news-manage/NewsPreview";
const LocalRouterMap = {
  "/home": <Home />,
  "/user-manage/list": <UserList />,
  "/right-manage/role/list": <RoleList />,
  "/right-manage/right/list": <RightList />,
  "/news-manage/add": <NewsAdd />,
  "/news-manage/draft": <NewsDraft />,
  "/news-manage/category": <NewsCategory />,
  "/news-manage/preview/:id": <NewsPreview />,
  "/news-manage/update/:id": <NewsUpdate />,
  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/published": <Published />,
  "/publish-manage/unpublished": <Unpublished />,
  "/publish-manage/sunset": <Sunset />,
};
export default function NewsRouter() {
  const [backRouteList, setBackRouteList] = useState([]);
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/rights"),
      axios.get("http://localhost:8000/children"),
    ]).then((res) => {
      setBackRouteList([...res[0].data, ...res[1].data]);
      console.log([...res[0].data, ...res[1].data]);
    });
  }, []);
  const checkRoute = (item) => {
    return (
      LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    );
  };
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        {backRouteList.map((item) => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return (
              <Route
                path={item.key}
                key={item.key}
                element={LocalRouterMap[item.key]}
              />
            );
          }
          return null;
        })}
        <Route path="*" element={<NoPermission />} />
      </Routes>
    </div>
  );
}
