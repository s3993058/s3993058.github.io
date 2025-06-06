const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 120;

let uploadedImage = null;
let elements = []; 

document.getElementById('imageUpload').addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      uploadedImage = img;
      generateArt();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

function generateArt() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  

    const grayscale = document.getElementById('grayscale').checked;
    const invert = document.getElementById('invert').checked;
    const contrast = document.getElementById('contrast').value;
  
    ctx.filter = `
      ${grayscale ? 'grayscale(1)' : ''}
      ${invert ? 'invert(1)' : ''}
      contrast(${contrast}%)
    `;
  

    drawVerticalStrips();
    drawShapes();
    drawText();
  

    ctx.filter = 'none';
  }
  

function applyFilters() {
  const grayscale = document.getElementById('grayscale').checked;
  const invert = document.getElementById('invert').checked;
  const contrast = document.getElementById('contrast').value;

  ctx.filter = `
    ${grayscale ? 'grayscale(1)' : ''}
    ${invert ? 'invert(1)' : ''}
    contrast(${contrast}%)
  `;
}

function drawVerticalStrips() {
    if (!uploadedImage) return;
  
    const startX = 5; // padding from the left
    const gap = 5; // gap between strips
    let currentX = startX;
  
    while (currentX < canvas.width - 100) {
      const stripWidth = 2 + Math.random() * 35; // random width: 30–80
      const stripHeight = 100 + Math.random() * (canvas.height - 200); // random height
  
      const sx = Math.random() * (uploadedImage.width - stripWidth);
      const sy = Math.random() * (uploadedImage.height - stripHeight);
  
      ctx.drawImage(
        uploadedImage, 
        sx,
        sy,
        stripWidth,
        stripHeight,
        currentX,
        100,
        stripWidth,
        stripHeight
      );
  
      currentX += stripWidth + gap;
    }
  }
  

function drawShapes() {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 0.5;

  for (let i = 0; i < 25; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(150, 110, 80, 0, 2 * Math.PI);
  ctx.stroke();
}



function drawText() {
  const texts = [
    "Labor is not the source of all wealth. Nature is just as much the source of use values (and it is surely of such that material wealth consists!) as labor, which itself is only the manifestation of a force of nature, human labor power. The above phrase is to be found in all children's primers and is correct insofar as it is implied that labor is performed with the appurtenant subjects and instruments. But a socialist program cannot allow such bourgeois phrases to pass over in silence the conditions that lone give them meaning. And insofar as man from the beginning behaves toward nature, the primary source of all instruments and subjects of labor, as an owner, treats her as belonging to him, his labor becomes the source of use values, therefore also of wealth. The bourgeois have very good grounds for falsely ascribing supernatural creative power to labor; since precisely from the fact that labor depends on nature it follows that the man who possesses no other property than his labor power must, in all conditions of society and culture, be the slave of other men who have made themselves the owners of the material conditions of labor. He can only work with their permission, hence live only with their permission.",
    "In present-day society, the instruments of labor are the monopoly of the landowners (the monopoly of property in land is even the basis of the monopoly of capital) and the capitalists. In the passage in question, the Rules of the International do not mention either one or the other class of monopolists. They speak of the monopolizer of the means of labor, that is, the sources of life. The addition, sources of life, makes it sufficiently clear that land is included in the instruments of labor.",
    "What we have to deal with here is a communist society, not as it has developed on its own foundations, but, on the contrary, just as it emerges from capitalist society; which is thus in every respect, economically, morally, and intellectually, still stamped with the birthmarks of the old society from whose womb it emerges. Accordingly, the individual producer receives back from society – after the deductions have been made – exactly what he gives to it. What he has given to it is his individual quantum of labor. For example, the social working day consists of the sum of the individual hours of work; the individual labor time of the individual producer is the part of the social working day contributed by him, his share in it. He receives a certificate from society that he has furnished such-and-such an amount of labor (after deducting his labor for the common funds); and with this certificate, he draws from the social stock of means of consumption as much as the same amount of labor cost. The same amount of labor which he has given to society in one form, he receives back in another.",
    "Any distribution whatever of the means of consumption is only a consequence of the distribution of the conditions of production themselves. The latter distribution, however, is a feature of the mode of production itself. The capitalist mode of production, for example, rests on the fact that the material conditions of production are in the hands of nonworkers in the form of property in capital and land, while the masses are only owners of the personal condition of production, of labor power. If the elements of production are so distributed, then the present-day distribution of the means of consumption results automatically. If the material conditions of production are the co-operative property of the workers themselves, then there likewise results a distribution of the means of consumption different from the present one. Vulgar socialism (and from it in turn a section of the democrats) has taken over from the bourgeois economists the consideration and treatment of distribution as independent of the mode of production and hence the presentation of socialism as turning principally on distribution. After the real relation has long been made clear, why retrogress again?"
  ];

  elements = [];

  texts.forEach((text, i) => {
    const x = 100 + Math.random() * (canvas.width - 300);
    const y = 100 + i * 80;

    ctx.font = '12px Arial';
    ctx.fillStyle = '#111';
    ctx.fillText(text, x, y);

    elements.push({ type: 'text', text, x, y, width: ctx.measureText(text).width, height: 20 });
  });
}

let dragging = null;

canvas.addEventListener('mousedown', function (e) {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  dragging = elements.find(el =>
    el.x <= mouseX &&
    mouseX <= el.x + el.width &&
    el.y - el.height <= mouseY &&
    mouseY <= el.y
  );
});

canvas.addEventListener('mousemove', function (e) {
  if (dragging) {
    dragging.x = e.offsetX;
    dragging.y = e.offsetY;
    redrawCanvas();
  }
});

canvas.addEventListener('mouseup', function () {
  dragging = null;
});

function redrawCanvas() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  applyFilters();
  drawVerticalStrips();
  drawShapes();

  elements.forEach(el => {

    if (el.type === 'text') {
      ctx.font = '14px Courier New';
      ctx.fillStyle = '#111';
      ctx.fillText(el.text, el.x, el.y);
    }
  });
}

function saveArt() {


  const link = document.createElement('a');
  link.download = 'generative-art.png';
  link.href = canvas.toDataURL();
  link.click();
}
