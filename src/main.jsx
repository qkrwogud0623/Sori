// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

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
    element: <App />,
    children: [
      {
        index: true, 
        element: <MainMapPage />,
      },
      {
        path: "map",
        element: <MainMapPage />,
      },
    ]
  }
], {
  // ★★★ 바로 이 부분이 추가되어야 합니다! ★★★
  basename: "/Sori/"
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)