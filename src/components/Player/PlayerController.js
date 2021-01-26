import { useRef, useEffect, useState } from 'react';
import './PlayerController.css';
import useAudioPlayer from '../../hooks/useAudioPlayer';
import useTicker from '../../hooks/useTicker';
import PlayerTimeline from './PlayerTimeline';
import PlayerTimer from './PlayerTimer';
import ControlBtn from './ControlBtn';
import BackwardBtn from './BackwardBtn';
import ForwardBtn from './ForwardBtn';
import visualize from '../../utils/visualize'
import { useMediaQuery } from 'react-responsive';
window.AudioContext = window.AudioContext || window.webkitAudioContext;

function PlayerController({ isPlayerExtend, isVideoModalOpened, track, onForwardClick, onBackwardClick, onTrackEnd, refanalyzerCanvas }) {
  const trackRef = useRef();
  const audioPlayerRef = useRef();

  const [audioCtx, setAudioCtx] = useState(null);
  const isMobile = useMediaQuery({ query: '(max-width: 480px), (max-height: 600px)' });
  
  useEffect(() => {
    visualize(audioPlayerRef, isMobile, refanalyzerCanvas, setAudioCtx)
  }, [isMobile, refanalyzerCanvas]);

  useTicker({
    elementRef: trackRef,
    containerTickerAddClass: 'player__song-container_masked',
    dependences: [track, isPlayerExtend]
  });

  const {
    isPlaying,
    handlePlayClick,
    isLoaded,
    handleTimeUpdate,
    handleLoadedMetaData,
    setClickedTime,
    handleTrackEnd,
    curTime,
    duration
  } = useAudioPlayer(audioPlayerRef, track, onTrackEnd);

  /* Ставим на паузу трек в аудио-плеере, если открывается модальное окно с youtube-плеером */
  useEffect(() => {
    if (isVideoModalOpened && isPlaying) {
      handlePlayClick();
    }
  }, [isVideoModalOpened]);

  // TODO - когда будет готова новая визуализация, включить
  if (isPlaying && audioCtx) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
  }

  return (
    <>
      <div className="player__controller">
        <audio
          src={track.link}
          preload="auto"
          ref={audioPlayerRef}
          onLoadedMetadata={handleLoadedMetaData}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleTrackEnd}
        >
          <p>Ваш браузер не поддерживает HTML5 аудио.</p>
        </audio>
        <div className="player__controllers">
          <BackwardBtn onBtnClick={onBackwardClick} />
          <ControlBtn
            isPlaying={isPlaying}
            onBtnClick={handlePlayClick}
          />
          <ForwardBtn onBtnClick={onForwardClick} />
        </div>
        <div className="player__song-container">
          <p
            className="player__song"
            ref={trackRef}
          >
            {isLoaded
              ? <>
                {track.trackName} — {track.author}
                <span className="player__song-accent"> feat. </span>
                {track.originalAuthor}
              </>
              : 'Загрузка...'
            }
          </p>
        </div>
        {isLoaded &&
          <PlayerTimer
            duration={duration}
            curTime={curTime}
          />
        }
        <PlayerTimeline
          curTime={curTime}
          duration={duration}
          onTimeUpdate={(time) => setClickedTime(time)}
        />
      </div>
    </>
  )
}

export default PlayerController;
