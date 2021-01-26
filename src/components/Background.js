import './Background.css';
import { animated, Transition } from 'react-spring';
import { useEffect, useRef } from 'react';
import transformElement from '../utils/transformElement';
import throttle from '../utils/simpleThrottle';

function Background({ isPlayerExtend, isMobile, currentTrack }) {
  const bgElementRef = useRef();

  useEffect(() => {
    const throttlingTransform = throttle((e) => transformElement(e, bgElementRef.current, 'position'), 25);
    window.addEventListener('mousemove', throttlingTransform);
    return () => window.removeEventListener('mousemove', throttlingTransform);
  }, []);

  return (
    <div>
    <Transition
      items={currentTrack}
      from={{ opacity: 0 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}
      initial={{ opacity: 1 }}
      config={{ mass: 1, tension: 280, friction: 120 }}
      keys={() => currentTrack}
    > 
      {(values, item) => (
        <animated.div
          ref={bgElementRef}
            className="background"
            style={{ backgroundImage: `${item.theme.backgroundImage}`, ...values}}
        >
{/*       <canvas className="canvas" ref={canvasRef}>
            <img ref={bgElementRef} src={templateImg} alt="тема офрмления трека сайта ТурбинА"/>
          </canvas> */}
        </animated.div>
      )}
    </Transition>
    </div>
  )
}

export default Background;
