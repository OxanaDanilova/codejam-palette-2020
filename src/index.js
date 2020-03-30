import fillUnit from './fillUnit';

const main = () => {
  let mode;
  let prevColor;
  let currentColor;
  let matrix = 4;

  const canv = document.getElementsByClassName('myCanvas')[0];
  const ctx = canv.getContext('2d');

  // Clear Canvas/////////////////
  const clear = document.getElementsByClassName('clear')[0];
  const clearCanvas = () => {
    ctx.clearRect(0, 0, 512, 512);
  };
  clear.addEventListener('click', clearCanvas);
  // //////////////////////
  function getData() {
    const myData = this.response;
    const myObj = JSON.parse(myData);
    const arr = Object.values(myObj);
    let color;
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        color = `#${arr[i][j]}`;
        ctx.fillStyle = color;
        ctx.fillRect(i * 128, j * 128, 128, 128);
      }
    }
  }

  const size4 = document.getElementsByClassName('size4')[0];
  size4.addEventListener('click', () => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', getData);
    xmlhttp.open('GET', './src/data/4x4.json');
    xmlhttp.send();
  });

  function getData32() {
    const myData = this.response;
    const myObj = JSON.parse(myData);
    const arr = Object.values(myObj);
    let color;
    for (let i = 0; i < 32; i += 1) {
      for (let j = 0; j < 32; j += 1) {
        color = `RGBA(${arr[i][j]})`;
        ctx.fillStyle = color;
        ctx.fillRect(i * 16, j * 16, 16, 16);
      }
    }
  }

  const size32 = document.getElementsByClassName('size32')[0];
  size32.addEventListener('click', () => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', getData32);

    xmlhttp.open('GET', './src/data/32x32.json');
    xmlhttp.send();
  });

  const image = document.getElementsByClassName('image')[0];
  image.addEventListener('click', () => {
    const myImg = new Image();
    myImg.onload = function load() {
      ctx.drawImage(myImg, 0, 0, 512, 512);
    };
    myImg.src = './src/images/image.png';
  });

  // //////////////Work with tools//////////////
  const paintBtn = document.getElementsByClassName('paint-btn')[0];
  const pickBtn = document.getElementsByClassName('pick-btn')[0];
  const penBtn = document.getElementsByClassName('pen-btn')[0];

  if (localStorage.getItem('mode')) {
    mode = localStorage.getItem('mode');
    if (localStorage.getItem('selected')) {
      const cl = localStorage.getItem('selected');
      document.getElementsByClassName('clicked')[0].classList.toggle('clicked');
      document
        .getElementsByClassName(cl)[0]
        .parentElement.classList.toggle('clicked');
    }
  } else {
    mode = 'pen';
    penBtn.classList.add('clicked');
  }

  if (localStorage.getItem('canvas')) {
    // get Canvas image from local Storage
    const dataURL = localStorage.getItem('canvas');
    const img = new Image();
    img.src = dataURL;
    img.onload = function load() {
      ctx.drawImage(img, 0, 0);
    };
  }

  const paintMode = () => {
    mode = 'paint';
    document.getElementsByClassName('clicked')[0].classList.toggle('clicked');
    paintBtn.parentElement.classList.add('clicked');
    localStorage.setItem('mode', 'paint');
    localStorage.setItem('selected', 'paint-btn');
  };

  const colPickerMode = (event) => {
    mode = 'colPicker';
    document.getElementsByClassName('clicked')[0].classList.toggle('clicked');
    pickBtn.parentElement.classList.add('clicked');
    event.stopPropagation(); // for correct displaying current color
    localStorage.setItem('mode', 'colPicker');
    localStorage.setItem('selected', 'pick-btn');
  };

  const penMode = () => {
    mode = 'pen';
    document.getElementsByClassName('clicked')[0].classList.toggle('clicked');
    penBtn.parentElement.classList.add('clicked');
    localStorage.setItem('mode', 'pen');
    localStorage.setItem('selected', 'pen-btn');
  };

  pickBtn.addEventListener('click', colPickerMode);
  penBtn.addEventListener('click', penMode);
  paintBtn.addEventListener('click', paintMode);

  // ///////////Colors////////////////////////
  const curColorBtn = document.getElementsByClassName('cur-col-btn')[0];

  if (localStorage.getItem('currentColor')) {
    // take current color from Local storage
    currentColor = localStorage.getItem('currentColor');
    curColorBtn.style.backgroundColor = currentColor;
  } else {
    currentColor = getComputedStyle(curColorBtn).backgroundColor;
  }

  const prevColorBtn = document.getElementsByClassName('prev-col-btn')[0];

  function getColor() {
    const temp = currentColor;
    currentColor = this.value;
    curColorBtn.style.backgroundColor = currentColor;
    prevColorBtn.style.backgroundColor = temp;
    prevColor = temp;
    localStorage.setItem('currentColor', currentColor);
    localStorage.setItem('prevColor', prevColor);
  }

  curColorBtn.addEventListener('input', getColor);

  if (localStorage.getItem('prevColor')) {
    // take prev color from Local storage
    prevColor = localStorage.getItem('prevColor');
    prevColorBtn.style.backgroundColor = prevColor;
  } else {
    prevColor = getComputedStyle(prevColorBtn).backgroundColor;
  }

  const redBtn = document.getElementsByClassName('red-btn')[0];
  const getRed = () => {
    if (mode === 'colPicker') {
      return;
    }
    const temp = currentColor;
    currentColor = '#ff0000';
    curColorBtn.style.backgroundColor = currentColor;
    prevColor = temp;
    prevColorBtn.style.backgroundColor = temp;
    localStorage.setItem('currentColor', currentColor);
    localStorage.setItem('prevColor', prevColor);
  };
  redBtn.addEventListener('click', getRed);

  const blueBtn = document.getElementsByClassName('blue-btn')[0];
  const getBlue = () => {
    if (mode === 'colPicker') {
      return;
    }
    const temp = currentColor;
    currentColor = '#41b6f7';
    curColorBtn.style.backgroundColor = currentColor;
    prevColorBtn.style.backgroundColor = temp;
    prevColor = temp;
    localStorage.setItem('currentColor', currentColor);
    localStorage.setItem('prevColor', prevColor);
  };
  blueBtn.addEventListener('click', getBlue);

  // /Pick color from canvas//////

  function pickColor(event) {
    const temp = currentColor;
    if (mode === 'colPicker') {
      const x0 = event.pageX - canv.offsetLeft;
      const y0 = event.pageY - canv.offsetTop;
      const imageData = ctx.getImageData(x0, y0, 1, 1);
      const pixel = imageData.data;
      const red = pixel[0];
      const green = pixel[1];
      const blue = pixel[2];
      if (pixel[3] === 0) {
        // define pixel color from not-colored area
        currentColor = 'RGBA(245,245,220,1)'; // canvas.backgroundColor
        curColorBtn.style.backgroundColor = currentColor;
        prevColorBtn.style.backgroundColor = temp;
        prevColor = temp;
        localStorage.setItem('currentColor', currentColor);
        localStorage.setItem('prevColor', prevColor);
      } else {
        currentColor = `RGB(${red},${green},${blue})`;
        curColorBtn.style.backgroundColor = currentColor;
        prevColorBtn.style.backgroundColor = temp;
        prevColor = temp;
        localStorage.setItem('currentColor', currentColor);
        localStorage.setItem('prevColor', prevColor);
      }
    }
  }

  // / Pick color from all Document except Canvas  ///////////////////////
  const clickEvent = (event) => {
    if (mode === 'colPicker' && event.target !== canv) {
      const temp = currentColor;
      const computedStyle = window.getComputedStyle(event.target);
      currentColor = computedStyle.backgroundColor;
      curColorBtn.style.backgroundColor = currentColor;
      prevColorBtn.style.backgroundColor = temp;
      prevColor = temp;
      localStorage.setItem('currentColor', currentColor);
      localStorage.setItem('prevColor', prevColor);
    }
  };

  document.addEventListener('click', clickEvent);

  // ///////////Matrix//////////////////////
  const mat4Btn = document.getElementsByClassName('matrix4')[0];
  const mat32Btn = document.getElementsByClassName('matrix32')[0];

  const setMatrix = (event) => {
    if (event.target === mat4Btn) {
      matrix = 4;
      document
        .getElementsByClassName('selected')[0]
        .classList.toggle('selected');
      mat4Btn.classList.add('selected');
    }
    if (event.target === mat32Btn) {
      matrix = 32;
      document
        .getElementsByClassName('selected')[0]
        .classList.toggle('selected');
      mat32Btn.classList.add('selected');
    }
  };

  mat4Btn.addEventListener('click', setMatrix);

  mat32Btn.addEventListener('click', setMatrix);

  // ///////////Drawing////////////////////////////
  let drawing = false;
  let userUnitX;
  let userUnitY;
  let x0;
  let y0;
  let x1;
  let y1;
  const startDrawing = () => {
    ctx.fillStyle = currentColor;
    if (mode === 'paint') {
      drawing = true;
      ctx.fillRect(0, 0, 512, 512);
      localStorage.setItem('canvas', canv.toDataURL());
    }

    if (mode === 'pen') {
      drawing = true;
      x0 = undefined;
      y0 = undefined;
    }
  };

  const defineUserUnit = (coordX, coordY, mat) => {
    // define part matrix based on cursor position
    let x;
    let y;

    if (coordX > 512) {
      x = 512;
    } else {
      x = coordX;
    }
    if (coordY > 512) {
      y = 512;
    } else {
      y = coordY;
    }
    if (mat === 4) {
      userUnitX = Math.ceil(x / 128);
      userUnitY = Math.ceil(y / 128);
    }
    if (mat === 32) {
      userUnitX = Math.ceil(x / 16);
      userUnitY = Math.ceil(y / 16);
    }
  };

  function stopDrawing() {
    if (mode === 'pen') {
      drawing = false;
      x0 = undefined;
      x1 = undefined;
      y0 = undefined;
      y1 = undefined;
      localStorage.setItem('canvas', canv.toDataURL());
    }
  }

  // BrezAlg/////////////////////

  function BrezAlg(startx, endx, starty, endy, canvas) {
    const deltax = Math.abs(endx - startx);
    const deltay = Math.abs(endy - starty);
    let error = 0;
    let deltaerr = deltay / deltax;
    let missedY = starty;
    let diry = endy - starty;
    if (diry > 0) {
      diry = 1;
    }
    if (diry < 0) {
      diry = -1;
    }
    if (startx < endx) {
      for (let missedX = startx; missedX <= endx; missedX += 1) {
        defineUserUnit(missedX, missedY, matrix);
        fillUnit(userUnitX, userUnitY, canvas, matrix);
        error += deltaerr;
        if (error >= 0.5) {
          missedY += diry;
          error -= 1;
        }
      }
    } else if (startx > endx) {
      for (let missedX = startx; missedX >= endx; missedX -= 1) {
        defineUserUnit(missedX, missedY, matrix);
        fillUnit(userUnitX, userUnitY, canvas, matrix);
        error += deltaerr;
        if (error >= 0.5) {
          missedY += diry;
          error -= 1;
        }
      }
    }

    if (deltay > deltax) {
      deltaerr = deltax / deltay;
      let missedX = startx;
      let dirx = endx - startx;
      if (dirx > 0) {
        dirx = 1;
      }
      if (dirx < 0) {
        dirx = -1;
      }
      if (starty < endy) {
        for (missedY = starty; missedY <= endy; missedY += 1) {
          defineUserUnit(missedX, missedY, matrix);
          fillUnit(userUnitX, userUnitY, ctx, matrix);
          error += deltaerr;
          if (error >= 0.5) {
            missedX += dirx;
            error -= 1;
          }
        }
      } else if (starty > endy) {
        for (missedY = starty; missedY >= endy; missedY -= 1) {
          defineUserUnit(missedX, missedY, matrix);
          fillUnit(userUnitX, userUnitY, ctx, matrix);
          error += deltaerr;
          if (error >= 0.5) {
            missedX += dirx;
            error -= 1;
          }
        }
      }
    }
  }

  const drawingProcess = (event) => {
    if (mode === 'pen' && drawing === true) {
      x1 = event.pageX - canv.offsetLeft;
      y1 = event.pageY - canv.offsetTop;
      defineUserUnit(x1, y1, matrix);
      fillUnit(userUnitX, userUnitY, ctx, matrix);
      if (x0 && y0) {
        BrezAlg(x0, x1, y0, y1, ctx);
      }
      x0 = x1;
      y0 = y1;
    }
  };

  canv.addEventListener('mousedown', startDrawing);
  canv.addEventListener('mouseup', stopDrawing);
  canv.addEventListener('mousemove', drawingProcess);
  canv.addEventListener('mousedown', pickColor);

  // / Hot keys///////////////

  const hotKeys = (event) => {
    if (event.key === 'b') {
      paintMode();
    }
    if (event.key === 'p') {
      penMode();
    }
    if (event.key === 'c') {
      colPickerMode();
    }
  };

  const body = document.getElementById('body');
  body.addEventListener('keyup', hotKeys);
};

main();
