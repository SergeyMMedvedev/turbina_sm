export default function renderFrame(analyser, context2d, freqByteData, analyzerCanvas, audio) {

  console.log('analyser', analyser)
  console.log('context2d', context2d)
  console.log('freqByteData', freqByteData)
  console.log('analyzerCanvas', analyzerCanvas)

  console.log('audio', audio)



  function Particle(opt) {
    this.x = opt.x || 0;
    this.y = opt.y || 0;
    this.vx = opt.vx || Math.random() - .5;
    this.vy = opt.vy || Math.random() - .5;
    this.size = opt.size || Math.random() * 3;
    this.life = opt.life || Math.random() * 5;

    this.dead = false;

    this.alpha = 1;
    this.rotate = 0;
    this.color = opt.color || 'rgba(244,244,244,.9)';
    this.type = opt.type || 'circle';

    this.update = update;
    this.render = render;
    // return this;
  }

  function update(ctx) {
    this.x += this.vx;
    this.y += this.vy;

    this.life -= .01;
    this.alpha -= .003;
    this.rotate += Math.random() * .01;
    if (this.life < 0) {
      this.dead = true;
      this.alpha = 0;
      return;
    }
    this.render(ctx);
  }

  function render(ctx) {
    var dot = this, gA = ctx.globalAlpha;
    // ctx.shadowBlur = dot.size / 2;
    // ctx.shadowColor = 'rgba(244,244,244,.2)';
    ctx.fillStyle = dot.color;
    if (dot.type === 'circle') {
      ctx.beginPath();
      ctx.globalAlpha = dot.alpha;
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.save();
      ctx.translate(dot.x, dot.y);
      ctx.rotate(dot.rotate);
      ctx.rect(0, 0, dot.size, dot.size);
      ctx.restore();
      ctx.fill();
    }
    ctx.globalAlpha = gA;
  }

















  var option = {
    effect: 'circlewave',
    accuracy: 128,

    circlewave: {
      maxHeight: 20,
      minHeight: -5,
      spacing: 1,
      // color: 'rgba(255, 204, 204, 0.5)',
      color: ['rgba(0, 102, 255, .5)', 'rgba(0, 153, 255, .5)', 'rgb(0, 204, 255, .5)', 'rgba(0, 255, 255, .5)'],
      shadowBlur: 2,
      shadowColor: 'rgba(255, 204, 204, 1)',
      fadeSide: true,
      prettify: true,
      particle: true,
      maxParticle: 500,
      circleRadius: 128,
      showProgress: true,

    },

    circlebar: {
      maxHeight: 40,
      fadeSide: true,
      particle: true,
      shadowBlur: 4,
      shadowColor: 'rgba(244,244,244, 1)',
      minHeight: 1,
      spacing: 1,
      color: [
        'rgba(50, 102, 255, .8)',
        'rgba(50, 153, 255, .8)',
        'rgba(50, 204, 255, .8)',
        'rgba(50, 255, 255, .8)'],
      prettify: true,
      maxParticle: 300,
      circleRadius: 128,
      showProgress: true,
    },

    lighting: {
      lineWidth: 1,
      maxSize: 12,
      dottify: true,
      fadeSide: true,
      prettify: false,
      color: [
        'rgba(50, 102, 255, .8)',
        'rgba(50, 153, 255, .8)',
        'rgba(50, 204, 255, .8)',
        'rgba(50, 255, 255, .8)'],
      shadowBlur: 4,
      shadowColor: 'rgba(244,244,244,.5)',
      maxHeight: 40,
      horizontalAlign: 'center',
      verticalAlign: 'bottom',
      particle: false
    },

    waveform: {
      maxHeight: 60,
      spacing: 1,
      shadowBlur: 6,
      shadowColor: 'rgba(255,21,10,0.6)',
      prettify: true,
      fadeSide: true,
      color: [
        'rgba(50, 102, 255, .6)',
        'rgba(50, 153, 255, .6)',
        'rgba(50, 204, 255, .6)',
        'rgba(50, 255, 255, .6)'],
      minHeight: 1,
      horizontalAlign: 'center',
      verticalAlign: 'bottom',
    },








  };






















  let particles = [];
  let __dotSize = [];

  function drawProgress(__color, __progress, circleRadius, context2d) {
    // draw progress circular.

    context2d.beginPath();
    if (__color) {
      // цвет полосы програсса
      context2d.strokeStyle = __color;
      context2d.lineWidth = 4;
      context2d.lineCap = 'round';
    }
    context2d.arc(0, 0, circleRadius - 10, -Math.PI / 2, Math.PI * 2 * __progress - Math.PI / 2);
    context2d.stroke();
  }

  function __rebuildData(freqByteData, horizontalAlign) {

    var __freqByteData;

    if (horizontalAlign === 'left') {
      __freqByteData = freqByteData;
    } else if (horizontalAlign === 'right') {
      __freqByteData = Array.from(freqByteData).reverse();
    } else {
      __freqByteData = [].concat(
        Array.from(freqByteData).reverse().slice(option.accuracy / 2, option.accuracy),
        Array.from(freqByteData).slice(0, option.accuracy / 2)
      );
    }
    return __freqByteData;
  }

  const canvas = analyzerCanvas.current;

  function __renderMemParticles(strokStyle, fillStyle, type, particles, height, width, context2d) {
    // // generate and render particles if enabled 
    if (option.lighting.particle) {
      // should clean dead particle before render, remove the first particle if full.
      delete particles.find(function (p) { return p.dead });
      if (particles.length > 50) {
        particles.shift();
      } else {
        particles.push(new Particle({
          x: Math.random() * width,
          y: Math.random() * 100 - 50 + height / 2,
          vx: Math.random() * .2 - .3,
          vy: Math.random() * .3 - .4,
          size: Math.random() * 5,
          life: Math.random() * 50,
          type: type,
          color: fillStyle,
        }));
      }
      particles.forEach((dot) => { dot.update(context2d); });
    }
  }















  function loop() {



    var dpr = 1;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context2d.scale(dpr, dpr);
    context2d.globalCompositeOperation = 'lighter';
    analyser.getByteFrequencyData(freqByteData);








    var __waveformOption = option.waveform;
    var __fadeSide = __waveformOption.fadeSide;
    var __prettify = __waveformOption.prettify;
    var __freqByteData = __rebuildData(freqByteData, __waveformOption.horizontalAlign);
    var __maxHeight, __width, __height, __left, __top, __color, __linearGradient, __pos;

    if (__waveformOption.horizontalAlign !== 'center') {
      __fadeSide = false;
      __prettify = false;
    }

    // clear canvas
    context2d.clearRect(0, 0, width, height);

    // draw waveform
    __freqByteData.forEach(function (value, index) {

      __width = (width - option.accuracy * __waveformOption.spacing) / option.accuracy;
      __left = index * (__width + __waveformOption.spacing);
      __waveformOption.spacing !== 1 && (__left += __waveformOption.spacing / 2);

      if (__prettify) {
        // enable soft slope along side frequency axes
        if (index <= option.accuracy / 2) {
          __maxHeight = (1 - (option.accuracy / 2 - 1 - index) / (option.accuracy / 2)) * __waveformOption.maxHeight;
        } else {
          __maxHeight = (1 - (index - option.accuracy / 2) / (option.accuracy / 2)) * __waveformOption.maxHeight;
        }
      } else {
        __maxHeight = __waveformOption.maxHeight;
      }

      __height = value / 256 * __maxHeight;
      __height = __height < __waveformOption.minHeight ? __waveformOption.minHeight : __height;

      if (__waveformOption.verticalAlign === 'middle') {
        __top = (height - __height) / 2;
      } else if (__waveformOption.verticalAlign === 'top') {
        __top = 0;
      } else if (__waveformOption.verticalAlign === 'bottom') {
        __top = height - __height;
      } else {
        __top = (height - __height) / 2;
      }

      __color = __waveformOption.color;

      if (__color instanceof Array) {

        __linearGradient = context2d.createLinearGradient(
          __left,
          __top,
          __left,
          __top + __height
        );

        __color.forEach(function (color, index) {
          if (color instanceof Array) {
            __pos = color[0];
            color = color[1];
          } else if (index === 0 || index === __color.length - 1) {
            __pos = index / (__color.length - 1);
          } else {
            __pos = index / __color.length + 0.5 / __color.length;
          }
          __linearGradient.addColorStop(__pos, color);
        });

        context2d.fillStyle = __linearGradient;

      } else {
        context2d.fillStyle = __color;
      }

      if (__waveformOption.shadowBlur > 0) {
        context2d.shadowBlur = __waveformOption.shadowBlur;
        context2d.shadowColor = __waveformOption.shadowColor;
      }

      if (__fadeSide) {
        if (index <= option.accuracy / 2) {
          context2d.globalAlpha = 1 - (option.accuracy / 2 - 1 - index) / (option.accuracy / 2);
        } else {
          context2d.globalAlpha = 1 - (index - option.accuracy / 2) / (option.accuracy / 2);
        }
      } else {
        context2d.globalAlpha = 1;
      }

      context2d.fillRect(__left, __top, __width, __height);

    });

    // drawBarProgress(__color, audioSrc.currentTime / audioSrc.duration);








    requestAnimationFrame(loop);

  }
  requestAnimationFrame(loop);

  // 















};
