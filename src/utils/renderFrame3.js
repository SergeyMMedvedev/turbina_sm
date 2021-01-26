export default function renderFrame(analyser, context2d, freqByteData, analyzerCanvas, audio) {



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
      maxParticle: 100,
      circleRadius: 128,
      showProgress: true,
    },
  };






















  let particles = [];

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

  













  function loop() {

    var dpr = 1;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
  
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context2d.scale(dpr, dpr);

    context2d.globalCompositeOperation = 'lighter';
    analyser.getByteFrequencyData(freqByteData);







    
    var __circlebarOption = option.circlebar;
    var __fadeSide = __circlebarOption.fadeSide;
    var __prettify = __circlebarOption.prettify;
    var __freqByteData = __rebuildData(freqByteData, __circlebarOption.horizontalAlign);
    var __angle = Math.PI * 2 / __freqByteData.length;
    var __maxHeight, __width, __height, __left, __top, __color, __pos;
    var circleRadius = __circlebarOption.circleRadius;
    var __particle = __circlebarOption.particle;

    var __maxParticle = __circlebarOption.maxParticle;
    var __showProgress = __circlebarOption.showProgress;
    var __progress = audio.currentTime / audio.duration;
    var __offsetX = 0;


    if (__circlebarOption.horizontalAlign !== 'center') {
      __fadeSide = false;
      __prettify = false;


    }

    // clear canvas
    context2d.clearRect(0, 0, width, height);
    context2d.save();
    context2d.translate(width / 2 - .5, height / 2 - .5);

    if (__circlebarOption.shadowBlur > 0) {
      context2d.shadowBlur = __circlebarOption.shadowBlur;
      context2d.shadowColor = __circlebarOption.shadowColor;
    }


    // generate and render particles if enabled 
    
      if (__particle) {
        delete particles.find(function (p) { return p.dead });
        if (particles.length > __maxParticle) {
          particles.shift();
        } else {
          const deg = Math.random() * Math.PI * 2;
          particles.push(new Particle({
            x: (circleRadius + 20) * Math.sin(deg),
            y: (circleRadius + 20) * Math.cos(deg),
            vx: .6 * Math.sin(deg) + Math.random() * .5 - .3,
            vy: .6 * Math.cos(deg) + Math.random() * .5 - .3,
            life: Math.random() * 10,
            // type: 'rect'
          }));
        }
        particles.forEach((dot) => { dot.update(context2d); });
      }

    



    __width = (circleRadius * Math.PI - option.accuracy * __circlebarOption.spacing) / option.accuracy;
    __offsetX = -__width / 2;
    __color = __circlebarOption.color;
    // since circlebar use ctx.rotate for each bar, so do NOT support gradient in bar currently.
    var renderStyle = __color instanceof Array ? __color[0] : __color;
    context2d.fillStyle = renderStyle

    context2d.globalAlpha = 1;
    context2d.beginPath();

    // draw circlebar
    // console.warn('__freqBytesData: ', __freqByteData, ' first entry height: ', __freqByteData[1] / 256 * __circlebarOption.maxHeight);
    for (var index = __freqByteData.length - 1; index >= 0; index--) {
      var value = __freqByteData[index];
      __left = index * (__width + __circlebarOption.spacing);
      __circlebarOption.spacing !== 1 && (__left += __circlebarOption.spacing / 2);

      if (false) {
        if (index <= option.accuracy / 2) {
          __maxHeight = (1 - (option.accuracy / 2 - 1 - index) / (option.accuracy / 2)) * __circlebarOption.maxHeight;
        } else {
          __maxHeight = (1 - (index - option.accuracy / 2) / (option.accuracy / 2)) * __circlebarOption.maxHeight;
        }
      } else {
        __maxHeight = __circlebarOption.maxHeight;
      }

      __height = value / 256 * __maxHeight;
      __height = __height < __circlebarOption.minHeight ? __circlebarOption.minHeight : __height;

      if (__fadeSide) {
        if (index <= option.accuracy / 2) {
          context2d.globalAlpha = 1 - (option.accuracy / 2 - 1 - index) / (option.accuracy / 2);
        } else {
          context2d.globalAlpha = 1 - (index - option.accuracy / 2) / (option.accuracy / 2);
        }
      }

      context2d.rotate(__angle);
      context2d.rect(__offsetX, circleRadius, __width, __height);
    }
    context2d.closePath();
    context2d.fill();

    // drawCover(__progress, circleRadius);
    if (__showProgress) { drawProgress(__color, __progress, circleRadius, context2d); }

    // need to restore canvas after translate to center..
    context2d.restore();


    requestAnimationFrame(loop);

  }
  requestAnimationFrame(loop);

  // 















};
