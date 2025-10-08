// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    alert(`이메일: ${email}\n비밀번호: ${password}\n로그인을 시도합니다!`);
  };

  return (
    <div className="login-container">
      <div className="main-content">
        <h1 className="welcome-title">다시 만나서 반가워요</h1>
        <p className="welcome-subtitle">당신의 소리 기록을 이어가 보세요.</p>
        
        <div className="input-group">
          <Input
            // label 삭제
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            // label 삭제
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bottom-button-group">
        <Button variant="primary" onClick={handleLogin}>
          로그인
        </Button>
        <p className="signup-text">
          아직 회원이 아니신가요? <Link to="/signup" className="signup-link">회원가입</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;