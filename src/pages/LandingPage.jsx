import Button from '../components/common/Button.jsx';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="main-content">
        <h1 className="fade-in-1">소리로 기억되는 순간, Sori</h1>
        <p className="fade-in-2">당신의 일상을 소리 캡슐에 담아보세요.</p>
      </div>
      
      <div className="bottom-button-group">
        <Button variant="primary" onClick={() => alert('회원가입 페이지로 이동합니다.')}>
          회원가입
        </Button>
        <Button variant="secondary" onClick={() => alert('로그인 페이지로 이동합니다.')}>
          로그인
        </Button>
      </div>
    </div>
  );
}

export default LandingPage;