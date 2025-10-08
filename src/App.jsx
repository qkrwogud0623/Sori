// src/App.jsx

import { Outlet } from 'react-router-dom';
import Header from './components/common/Header.jsx';
import './App.css'; // App.css를 import하는 줄이 꼭 있어야 합니다.

function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default App;