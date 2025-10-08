// src/pages/SignupPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import './SignupPage.css';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSignup = () => {
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    alert(`${nickname}님, 회원가입을 환영합니다!`);
  };

  return (
    <div className="signup-container">
      <div className="main-content">
        <h1 className="welcome-title">Sori에 오신 걸 환영해요</h1>
        <p className="welcome-subtitle">몇 가지만 알려주시면, 바로 시작할 수 있어요.</p>
        
        <div className="input-group">
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bottom-button-group">
        <Button variant="primary" onClick={handleSignup}>
          가입하기
        </Button>
        <p className="login-text">
          이미 계정이 있으신가요? <Link to="/login" className="login-link">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;