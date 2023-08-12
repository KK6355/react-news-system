import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";
import News from "../views/news/News";
import Detail from "../views/news/Detail";
export default function IndexRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/news" Component={News} />
        <Route path="/Detail/:id" Component={Detail} />
        {/* <Route path="/" Component={NewsSandBox} /> */}
        <Route
          path="*"
          element={localStorage.getItem("token") ? <NewsSandBox /> : <Login />}
        />
      </Routes>
    </HashRouter>
  );
}
