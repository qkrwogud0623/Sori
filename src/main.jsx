// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

// 레이아웃 및 페이지 컴포넌트 불러오기
import App from './App.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import MainMapPage from './pages/MainMapPage.jsx';

const router = createBrowserRouter([
  // 그룹 1: 헤더가 없는 페이지들
  { path: "/welcome", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  
  // 그룹 2: 헤더가 있는 메인 앱 페이지들
  {
    path: "/",
    element: <App />, // App 레이아웃을 먼저 렌더링
    children: [ // 그 안에 자식 페이지들을 렌더링
      {
        path: "map", // "/map" 주소로 접속하면
        element: <MainMapPage />, // MainMapPage를 보여준다.
      },
      // 앞으로 /profile, /settings 등 다른 페이지 추가 가능
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)