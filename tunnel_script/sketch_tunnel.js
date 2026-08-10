// sketch_tunnel.js — TUNNEL: texto viajando por un túnel 3D (variante nueva STG)
var font, inp, inpText;
var speedSlider, ringsSlider, radiusSlider, sizeSlider, colorSlider, spinSlider, trailSlider;
var bgColorPicker, textColorPicker;
var tunnelZ = 0;
var letters = [];
var speed, rings, radius, size, spin, trail;

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
  createCanvas(windowWidth, windowHeight, WEBGL);
  smooth();
  textFont(font);
  frameRate(30);

  inp = select("#textfield");

  speedSlider = createSlider(1, 30, 10); labelSlider(speedSlider, "Velocidad"); speedSlider.position(15, 17); speedSlider.style('width', '100px');
  ringsSlider = createSlider(1, 40, 16); labelSlider(ringsSlider, "Anillos"); ringsSlider.position(15, 47); ringsSlider.style('width', '100px');
  radiusSlider = createSlider(50, 500, 250); labelSlider(radiusSlider, "Radio"); radiusSlider.position(15, 77); radiusSlider.style('width', '100px');
  sizeSlider = createSlider(10, 120, 40); labelSlider(sizeSlider, "Tamano"); sizeSlider.position(15, 107); sizeSlider.style('width', '100px');
  spinSlider = createSlider(0, 10, 2); labelSlider(spinSlider, "Giro"); spinSlider.position(15, 137); spinSlider.style('width', '100px');
  trailSlider = createSlider(0, 40, 12); labelSlider(trailSlider, "Estela"); trailSlider.position(15, 167); trailSlider.style('width', '100px');

  bgColorPicker = createColorPicker('#000000'); bgColorPicker.position(15, 200); labelSlider(bgColorPicker, "Fondo"); bgColorPicker.style('height', '20px');
  textColorPicker = createColorPicker('#ffffff'); textColorPicker.position(15, 230); labelSlider(textColorPicker, "Texto"); textColorPicker.style('height', '20px');
}

function textPoints(t) {
  var pts = [];
  var txt = String(t || '');
  if (!txt.length) return pts;
  textSize(size);
  var w = textWidth(txt);
  var step = size * 0.35;
  for (var x = -w / 2; x <= w / 2; x += step) {
    var c = round(map(x, -w / 2, w / 2, 0, txt.length - 1));
    c = constrain(c, 0, txt.length - 1);
    pts.push({ x: x, ch: txt.charAt(c) });
  }
  return pts;
}

function draw() {
  speed = speedSlider.value();
  rings = ringsSlider.value();
  radius = radiusSlider.value();
  size = sizeSlider.value();
  spin = spinSlider.value() * 0.01;
  trail = trailSlider.value();

  // estela con alpha
  var bg = color(bgColorPicker.value());
  bg.setAlpha(255 - trail * 5);
  background(bg);

  inpText = String(inp.value() || 'TRAVEL-THROUGH-THE-TUNNEL.//');
  var pts = textPoints(inpText);
  if (!pts.length) return;

  tunnelZ += speed;

  // anillos del túnel
  push();
  noFill();
  stroke(lerpColor(color(bgColorPicker.value()), color(textColorPicker.value()), 0.4));
  strokeWeight(1);
  for (var i = 0; i < rings; i++) {
    var z = (i * 120 - tunnelZ) % (rings * 120);
    push();
    translate(0, 0, z);
    rotateZ(tunnelZ * spin * 0.05 + i * 0.3);
    ellipse(0, 0, radius * 2, radius * 2);
    pop();
  }
  pop();

  // letras del texto
  push();
  var fg = color(textColorPicker.value());
  fg.setAlpha(255);
  fill(fg);
  noStroke();
  textSize(size);
  textFont(font);
  textAlign(CENTER, CENTER);
  var spacing = 130;
  for (var i = 0; i < pts.length; i++) {
    var z = (i * spacing - tunnelZ) % (pts.length * spacing);
    var ang = map(i, 0, pts.length - 1, 0, TWO_PI);
    push();
    translate(cos(ang) * radius, sin(ang) * radius, z);
    rotateZ(ang + tunnelZ * spin);
    rotateY(ang * 0.5);
    text(pts[i].ch, 0, 0);
    pop();
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
