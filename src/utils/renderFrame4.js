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
      particle: true
    }






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

    var __lightingOption = option.lighting;
    var __freqByteData = __rebuildData(freqByteData, __lightingOption.horizontalAlign);
    var __maxHeight = __lightingOption.maxHeight;
    var __prettify = __lightingOption.prettify;
    var __dottify = __lightingOption.dottify;
    var __maxSize = __lightingOption.maxSize;
    var __color = __lightingOption.color;
    var __isStart = true, __fadeSide = true, __x, __y, __linearGradient;

    if (__lightingOption.horizontalAlign !== 'center') {
      __fadeSide = false;
    }

    // clear canvas
    context2d.clearRect(0, 0, width, height);

    // draw lighting
    context2d.lineWidth = __lightingOption.lineWidth;
    context2d.strokeStyle = 'rgba(200, 200, 200, .2)';
    context2d.fillStyle = 'rgba(200, 200, 200, .2)';
    context2d.globalAlpha = .8;
    context2d.beginPath();

    // render particles with blur effect
    context2d.shadowBlur = 4;
    context2d.shadowColor = context2d.fillStyle;
    __renderMemParticles(null, context2d.shadowColor, 'rect', particles, height, width, context2d);

    if (__color instanceof Array) {

      __linearGradient = context2d.createLinearGradient(
        0,
        height / 2,
        width,
        height / 2
      );

      __color.forEach(function (color, index) {
        var __pos, effectiveColor;
        if (color instanceof Array) {
          effectiveColor = color[1];
        } else {
          effectiveColor = color;
        }
        __pos = index / __color.length;
        __linearGradient.addColorStop(__pos, effectiveColor);
      });

      context2d.fillStyle = __linearGradient;
      context2d.strokeStyle = __linearGradient;

    } else {
      context2d.fillStyle = __color;
      context2d.strokeStyle = __color;
    }

    __freqByteData.forEach(function (value, index) {

      if (__prettify) {
        // prettify for line should be less maxHeight at tail.
        if (index < option.accuracy / 2) {
          __maxHeight = (1 - (option.accuracy / 2 - 1 - index) / (option.accuracy / 2)) * __lightingOption.maxHeight;
        } else {
          __maxHeight = (1 - (index - option.accuracy / 2) / (option.accuracy / 2)) * __lightingOption.maxHeight;
        }
      } else {
        __maxHeight = __lightingOption.maxHeight;
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

      __x = width / option.accuracy * index;
      var __tmpY = value / 256 * __maxHeight;

      if (__lightingOption.verticalAlign === 'middle') {
        __y = (height - __tmpY) / 2;
      } else if (__lightingOption.verticalAlign === 'bottom') {
        __y = height - __tmpY;
      } else if (__lightingOption.verticalAlign === 'top') {
        __y = __tmpY;
      } else {
        __y = (height - __tmpY) / 2;
      }

      if (__dottify && index !== 0 && index % 2 === 0) {
        context2d.beginPath();
        __dotSize[index] = __dotSize[index] !== undefined ? __dotSize[index] : Math.random() * __maxSize + 1;
        // __dotOpacity[index] = __dotOpacity[index] !== undefined ? __dotOpacity[index] : Math.random();
        context2d.arc(__x, __y, __dotSize[index], 0, Math.PI * 2);

        // // make some noise under this x coord
        // if (__lightingOption.verticalAlign !== 'top') {
        //     while(__y < (height / 2 - 10)) {
        //         __y += Math.random() * 2 + 10;
        //         context2d.arc(__x, __y, __dotSize[index], 0, Math.PI * 2);
        //     }
        // }

        context2d.fill();
      } else if (!__dottify) {
        if (__isStart) {
          context2d.moveTo(__x, __y);
          __isStart = false;
        } else {
          context2d.lineTo(__x, __y);
        }
      }

    });
    if (!__dottify) {
      context2d.stroke();
      context2d.globalAlpha = .6;
      context2d.fill();
    }
    // drawBarProgress(__color, audioSrc.currentTime / audioSrc.duration);







    requestAnimationFrame(loop);

  }
  requestAnimationFrame(loop);

  // 















};
