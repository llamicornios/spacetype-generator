// sketch_wave.js — WAVE: texto 2D que ondea con gradiente de color + partículas (variante nueva STG)
var font, inp, inpText;
var speedSlider, ampSlider, freqSlider, sizeSlider, particleSlider;
var bgColorPicker, c1Picker, c2Picker;
var t = 0;
var particles = [];

function labelSlider(slider, txt) {
  var l = createP(txt);
  var pos = slider.position();
  l.position(pos.x, pos.y - 16);
  l.style('font-family', "'IBM Plex Mono', monospace");
  l.style('font-size', '10px');
  l.style('color', '#999999');
  l.style('margin', '0');
  l.style('padding', '1px 3px');
  l.style('line-height', '1');
  l.style('letter-spacing', '1px');
  l.style('pointer-events', 'none');
  l.style('text-transform', 'uppercase');
  l.style('z-index', '5000');
  l.style('background', 'rgba(255,255,255,0.75)');
  l.style('border-radius', '2px');
  return l;
}

function preload() {
  font = loadFont('assets/IBMPlexMono-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  smooth();
  textFont(font);
  frameRate(30);
  textAlign(CENTER, CENTER);

  inp = select("#textfield");

  speedSlider = createSlider(0, 20, 8); labelSlider(speedSlider, "Velocidad"); speedSlider.position(15, 17); speedSlider.style('width', '100px');
  ampSlider = createSlider(0, 200, 60); labelSlider(ampSlider, "Amplitud"); ampSlider.position(15, 47); ampSlider.style('width', '100px');
  freqSlider = createSlider(1, 30, 8); labelSlider(freqSlider, "Frecuencia"); freqSlider.position(15, 77); freqSlider.style('width', '100px');
  sizeSlider = createSlider(16, 140, 60); labelSlider(sizeSlider, "Tamano"); sizeSlider.position(15, 107); sizeSlider.style('width', '100px');
  particleSlider = createSlider(0, 200, 40); labelSlider(particleSlider, "Particulas"); particleSlider.position(15, 137); particleSlider.style('width', '100px');

  bgColorPicker = createColorPicker('#0a0a1a'); bgColorPicker.position(15, 170); labelSlider(bgColorPicker, "Fondo"); bgColorPicker.style('height', '20px');
  c1Picker = createColorPicker('#00e5ff'); c1Picker.position(15, 200); labelSlider(c1Picker, "Color 1"); c1Picker.style('height', '20px');
  c2Picker = createColorPicker('#ff00aa'); c2Picker.position(15, 230); labelSlider(c2Picker, "Color 2"); c2Picker.style('height', '20px');
}

function draw() {
  var sp = speedSlider.value();
  var amp = ampSlider.value();
  var freq = freqSlider.value();
  var sz = sizeSlider.value();
  var pCount = particleSlider.value();
  background(bgColorPicker.value());
  t += sp * 0.01;

  var c1 = color(c1Picker.value());
  var c2 = color(c2Picker.value());

  // partículas
  var target = pCount;
  while (particles.length < target) {
    particles.push({
      x: random(width), y: random(height),
      vx: random(-0.5, 0.5), vy: random(-0.5, 0.5),
      s: random(1, 3)
    });
  }
  if (particles.length > target) particles.length = target;
  noStroke();
  particles.forEach(function (p) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
    var col = lerpColor(c1, c2, (p.x + p.y) / (width + height));
    col.setAlpha(140);
    fill(col);
    ellipse(p.x, p.y, p.s * 2, p.s * 2);
  });

  inpText = String(inp.value() || 'RIDE-THE-WAVE.//');
  textSize(sz);
  textFont(font);
  var w = textWidth(inpText);
  var step = 4;
  var x0 = (width - w) / 2;
  var y0 = height / 2;
  var n = Math.floor(w / step);
  for (var i = 0; i <= n; i++) {
    var x = x0 + i * step;
    var p = i / max(1, n);
    var y = y0 + sin(t + p * freq * TWO_PI / 4) * amp;
    var grad = lerpColor(c1, c2, p);
    fill(grad);
    noStroke();
    textSize(sz);
    var ch = inpText.charAt(Math.floor(p * (inpText.length - 1)));
    text(ch, x, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
