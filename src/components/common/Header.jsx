// src/components/common/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // 메뉴 아이콘 SVG
  const MenuIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20M4 12H20M4 18H20" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // 메뉴 바깥쪽 클릭 감지 로직
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="app-header">
      <div className="header-title">Sori</div>
      
      {/* 메뉴 버튼과 드롭다운 */}
      <div className="header-menu-container" ref={menuRef}>
        <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {MenuIcon}
        </button>

        {isMenuOpen && (
          <div className="dropdown-menu">
            <a href="/mypage">마이페이지</a>
            <a href="/settings">설정</a>
            <a href="/logout">로그아웃</a>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;