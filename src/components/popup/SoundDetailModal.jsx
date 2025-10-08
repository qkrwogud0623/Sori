// src/components/popup/SoundDetailModal.jsx

import React, { useState, useRef, useEffect } from 'react';
import './SoundDetailModal.css';

const formatLikeCount = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num;
};

function SoundDetailModal({ modalData, onClose }) {
  // --- Carousel Logic ---
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Audio Player Logic ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  // --- Like Feature Logic ---
  const [isLiked, setIsLiked] = useState(false);
  
  // 현재 보여줄 캡슐 데이터 (가장 중요)
  const capsule = modalData?.capsules[currentIndex];
  const [likeCount, setLikeCount] = useState(capsule?.likes || 0);

  // 캡슐이 바뀔 때(넘겨보기)마다 상태 초기화
  useEffect(() => {
    if (modalData) {
      setCurrentIndex(modalData.index);
    }
  }, [modalData]);

  useEffect(() => {
    if (capsule) {
      setIsLiked(false);
      setLikeCount(capsule.likes);
      // 오디오 소스가 바뀌면 재생 정지 및 프로그레스 초기화
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setProgress(0);
      setIsPlaying(false);
    }
  }, [currentIndex, capsule]);

  // Carousel Handlers
  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? modalData.capsules.length - 1 : prev - 1));
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === modalData.capsules.length - 1 ? 0 : prev + 1));
  };

  // Audio Player Handlers
  const togglePlayPause = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  // Like Handler
  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };
  
  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100 || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
    };
  }, [audioRef.current]);


  if (!modalData) return null;

  const PlayIcon = (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>);
  const PauseIcon = (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>);
  const HeartIcon = ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );
  const HeartFilledIcon = ( <svg width="24" height="24" viewBox="0 0 24 24" fill="#E84393" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#E84393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-photo-placeholder">
          사진
          <button className="nav-arrow prev" onClick={handlePrev}>&#8249;</button>
          <button className="nav-arrow next" onClick={handleNext}>&#8250;</button>
          <div className="page-indicator">{currentIndex + 1} / {modalData.capsules.length}</div>
        </div>
        
        <div className="custom-audio-player">
          <button className="player-button" onClick={togglePlayPause}>
            {isPlaying ? PauseIcon : PlayIcon}
          </button>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="modal-body">
          <h2>{capsule.title}</h2>
          <p className="author">by {capsule.author}</p>
          <p className="story">{capsule.story}</p>
          <div className="modal-actions">
            <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLikeClick}>
              {isLiked ? HeartFilledIcon : HeartIcon}
            </button>
            <span className="like-count">{formatLikeCount(likeCount)}</span>
          </div>
        </div>

        <audio ref={audioRef} src={capsule.audioSrc} preload="none" hidden />
      </div>
    </div>
  );
};

export default SoundDetailModal;