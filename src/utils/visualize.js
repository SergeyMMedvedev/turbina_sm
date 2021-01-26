import renderFrame from './renderFrame3'

function visualize(audioPlayerRef, isMobile, analyzerCanvas, setAudioCtx) {
  try {

    if (!audioPlayerRef.current.src.startsWith(window.location.href)) {
      throw new Error('AudioContext отключен',
        'текущий адрес: ', window.location.href,
        'адрес трека: ', audioPlayerRef.current.src);
    }

    if (!isMobile) {
      const context = new AudioContext();
      const audio = audioPlayerRef.current;
      const audioSrc = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();
      const canvas = analyzerCanvas.current;
      const context2d = canvas.getContext('2d');
      analyser.fftSize = 256;
      const freqByteData = new Uint8Array(analyser.frequencyBinCount);
      audioSrc
        .connect(analyser)
        .connect(context.destination);
      analyser.connect(context.destination);
      setAudioCtx(context);
      renderFrame(analyser, context2d, freqByteData, analyzerCanvas, audio);
    }
  } catch (e) {
    console.log(e)
    return
  }
}

export default visualize;