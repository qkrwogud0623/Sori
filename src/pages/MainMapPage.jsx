// src/pages/MainMapPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { Map, MapMarker, MarkerClusterer, useKakaoLoader } from 'react-kakao-maps-sdk';
import './MainMapPage.css';
import SoundDetailModal from '../components/popup/SoundDetailModal.jsx';
import { useDrag } from '@use-gesture/react';

// --- Icon Definitions ---
const MarkerIcon = `
<svg width="48" height="48" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="softGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A18CD1"/>
      <stop offset="100%" stop-color="#FBC2EB"/>
    </linearGradient>
    <radialGradient id="softGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FBC2EB" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#A18CD1" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="28" cy="28" r="25" fill="url(#softGlow)" />
  <circle cx="28" cy="28" r="12" stroke="url(#softGradient)" stroke-width="2.5" fill="white" />
  <circle cx="28" cy="28" r="4.5" fill="url(#softGradient)" />
  <path d="M20 29 C23 27 25 31 28 28 C31 25 33 29 36 27" stroke="url(#softGradient)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
</svg>
`;

const MyLocationIcon = `
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#4285F4" fill-opacity="0.2"/>
    <circle cx="16" cy="16" r="10" fill="#4285F4" fill-opacity="0.3"/>
    <circle cx="16" cy="16" r="5" fill="#4285F4" stroke="white" stroke-width="2"/>
  </svg>
`;
const CurrentLocationIcon = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" /></svg>`;
const RefreshIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`;

// --- 통합된 하단 UI 컴포넌트 (스와이프 기능 추가) ---
const BottomSheetUI = ({ capsule, onPrev, onNext, onPlay, isPlaying, isExpanded, setIsExpanded }) => {
  const PlayIcon = (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>);
  const PauseIcon = (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>);
  const PrevIcon = (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>);
  const NextIcon = (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zm-3.5 6l-8.5 6V6z" /></svg>);
  const RecordIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 19v4" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const DiaryIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L3 13V4a1 1 0 0 1 1-1h9l7.59 7.59a2 2 0 0 1 0 2.82z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 7h.01" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const DiscoverIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const bind = useDrag(
    ({ down, movement: [, my] }) => {
      if (!down) {
        if (my > 10) setIsExpanded(false); 
        else if (my < -10) setIsExpanded(true);
      }
    },
    { axis: 'y', from: () => [0, 0] }
  );

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    if (action) action();
  };

  return (
    <div className={`bottom-sheet-ui ${isExpanded ? 'expanded' : ''}`}>
      <div className="sheet-handle" {...bind()}>
        <div className="sheet-handle-bar"></div>
      </div>
      
      <div className="sheet-visible-area">
        <div className="player-section">
          {capsule ? (
            <>
              <div className="player-album-art"></div>
              <div className="player-main-content">
                <h3>{capsule.title}</h3>
                <div className="player-sub-content">
                  <div className="player-track-info">
                    <p className="player-author">by {capsule.author}</p>
                    <div className="waveform">
                      {[...Array(5)].map((_, i) => <div key={i} className="waveform-bar"></div>)}
                    </div>
                  </div>
                  <div className="player-controls">
                    <button className="control-btn" onClick={(e) => handleButtonClick(e, onPrev)}>{PrevIcon}</button>
                    <button className="control-btn play-btn" onClick={(e) => handleButtonClick(e, onPlay)}>
                      {isPlaying ? PauseIcon : PlayIcon}
                    </button>
                    <button className="control-btn" onClick={(e) => handleButtonClick(e, onNext)}>{NextIcon}</button>
                  </div>
                </div>
              </div>
            </>
          ) : <div className="player-placeholder">가까운 소리를 찾아보세요.</div> }
        </div>
      </div>

      <div className="sheet-expandable-area">
        <hr className="ui-divider" />
        <div className="action-buttons-section">
          <button className="action-btn" onClick={(e) => handleButtonClick(e)}>
            {RecordIcon}
            <div className="action-btn-text">
              <strong>#오늘의_소리</strong>
              <p>지금 이 순간을 녹음해보세요</p>
            </div>
          </button>
          <button className="action-btn" onClick={(e) => handleButtonClick(e)}>
            {DiaryIcon}
            <div className="action-btn-text">
              <strong>사운드 다이어리</strong>
              <p>내가 기록한 소리 모아보기</p>
            </div>
          </button>
          <button className="action-btn" onClick={(e) => handleButtonClick(e)}>
            {DiscoverIcon}
            <div className="action-btn-text">
              <strong>모두의 소리</strong>
              <p>지금 가장 공감받는 소리</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Map Page Component ---
function MainMapPage() {
  const [loading, error] = useKakaoLoader({ 
    appkey: "5bf50576f7dca94c9423750f9ef291cd",
    libraries: ["clusterer"]
  });

  const [map, setMap] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const [sortedCapsules, setSortedCapsules] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalData, setModalData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const audioRef = useRef(null);
  
  const soundCapsules = [
    { id: 1, title: "아주대 율곡관의 오후", author: "여행자", story: "...", audioSrc: "...", lat: 37.284, lng: 127.045, likes: 98, createdAt: 3 },
    { id: 2, title: "아주대병원 근처 앰뷸런스 소리", author: "의대생", story: "...", audioSrc: "...", lat: 37.279, lng: 127.047, likes: 1204, createdAt: 1 },
    { id: 3, title: "선구자상 앞 학생들의 웃음소리", author: "신입생", story: "...", audioSrc: "...", lat: 37.282, lng: 127.044, likes: 312, createdAt: 2 },
  ];
  
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; const dLat = (lat2 - lat1) * Math.PI / 180; const dLon = (lon2 - lon1) * Math.PI / 180; const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2); const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); return R * c;
  };

  useEffect(() => {
    setSortedCapsules([...soundCapsules].sort((a, b) => a.id - b.id));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
          const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          setMyLocation(userLocation);
          const sortedByDist = [...soundCapsules]
            .map(capsule => ({ ...capsule, distance: getDistance(userLocation.lat, userLocation.lng, capsule.lat, capsule.lng) }))
            .sort((a, b) => a.distance - b.distance);
          setSortedCapsules(sortedByDist);
        }, (err) => { 
          console.error(err);
          alert("위치 정보를 가져오는 데 실패했습니다.");
        }
      );
    }
  }, []);
  
  // ★★★ 빠져있던 함수 추가 ★★★
  const handleMarkerClick = (capsules, clickedId) => {
    const capsulesForModal = [...capsules].sort((a, b) => b.createdAt - a.createdAt);
    const initialIndex = clickedId ? capsulesForModal.findIndex(c => c.id === clickedId) : 0;
    setModalData({
      capsules: capsulesForModal,
      index: initialIndex,
    });
  };

  const handleCurrentLocation = () => { if (map && myLocation) map.panTo(new window.kakao.maps.LatLng(myLocation.lat, myLocation.lng)) };
  const handlePrev = () => { setIsPlaying(false); setCurrentIndex(prev => (prev === 0 ? sortedCapsules.length - 1 : prev - 1)); };
  const handleNext = () => { setIsPlaying(false); setCurrentIndex(prev => (prev === sortedCapsules.length - 1 ? 0 : prev + 1)); };
  
  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); } 
      else { audioRef.current.play(); }
      setIsPlaying(!isPlaying);
    }
  };
  
  const currentAudioSrc = sortedCapsules[currentIndex]?.audioSrc;

  const handleRefresh = () => {
    if (!map) return;
    const currentCenter = map.getCenter();
    const centerLocation = { lat: currentCenter.getLat(), lng: currentCenter.getLng() };
    const sortedByDist = [...soundCapsules]
      .map(capsule => ({ ...capsule, distance: getDistance(centerLocation.lat, centerLocation.lng, capsule.lat, capsule.lng) }))
      .sort((a, b) => a.distance - b.distance);
    setSortedCapsules(sortedByDist);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
        setIsPlaying(false);
    }
  }, [currentIndex]);

  if (loading) return <h3>지도 로딩 중...</h3>;
  if (error) return <h3>지도 로딩 중 에러가 발생했습니다.</h3>;

  return (
    <div className="map-container">
      <Map
        center={myLocation || { lat: 37.2830, lng: 127.0466 }}
        style={{ width: '100%', height: '100%' }}
        level={4}
        onCreate={setMap}
        onClick={() => { setModalData(null); setIsSheetExpanded(false); }}
      >
        {myLocation && <MapMarker position={myLocation} image={{ src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(MyLocationIcon)}`, size: { width: 32, height: 32 } }} />}
        <MarkerClusterer
          averageCenter={true} // 클러스터의 중심 위치를 마커들의 평균 위치로 설정
          minLevel={6} // 클러스터링을 시작할 지도 레벨
          // 클러스터(그룹 핀) 클릭 시 이벤트
          onClusterclick={(cluster) => {
            const clusterMarkers = cluster.getMarkers();
            const clusterCapsules = clusterMarkers.map(marker => 
              soundCapsules.find(c => c.lat === marker.getPosition().getLat() && c.lng === marker.getPosition().getLng())
            );
            handleMarkerClick(clusterCapsules);
          }}
        >
          {soundCapsules.map((capsule) => (
            <MapMarker 
              key={capsule.id} 
              position={{ lat: capsule.lat, lng: capsule.lng }} 
              // 개별 마커 클릭 시에는 자기 자신만 포함된 리스트를 전달
              onClick={() => handleMarkerClick([capsule], capsule.id)}
              image={{ 
                src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(MarkerIcon)}`, 
                size: { width: 56, height: 56 } 
              }} 
            />
          ))}
        </MarkerClusterer>
      </Map>

      <div className="map-buttons-container">
        <button className="map-btn" onClick={handleRefresh} dangerouslySetInnerHTML={{ __html: RefreshIcon.replace('fill="none"', 'fill="currentColor"') }} />
        <button className="map-btn" onClick={handleCurrentLocation} dangerouslySetInnerHTML={{ __html: CurrentLocationIcon }} />
      </div>
      
      <SoundDetailModal modalData={modalData} onClose={() => setModalData(null)} />
      
      <BottomSheetUI 
        capsule={sortedCapsules[currentIndex]} 
        onPrev={handlePrev} onNext={handleNext} onPlay={handlePlay} isPlaying={isPlaying}
        isExpanded={isSheetExpanded} setIsExpanded={setIsSheetExpanded}
      />

      <audio ref={audioRef} src={currentAudioSrc} preload="none" onEnded={() => setIsPlaying(false)} />
    </div>
  );
}

export default MainMapPage;