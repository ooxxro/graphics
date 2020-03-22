/* jshint esversion: 6 */
// @ts-check

import { draggablePoints } from "./dragPoints.js";
import { RunCanvas } from "./runCanvas.js";

let scale = 0.5;
let simpleTrack = false;
let arcLength = true;
let numCarts = 6;

/**
 * Have the array of control points for the track be a
 * "global" (to the module) variable
 *
 * Note: the control points are stored as Arrays of 2 numbers, rather than
 * as "objects" with an x,y. Because we require a Cardinal Spline (interpolating)
 * the track is defined by a list of points.
 *
 * things are set up with an initial track
 */
/** @type Array<number[]> */
let thePoints = [
  [46, 75],
  [49, 536],
  [96, 542],
  [100, 328],
  [187, 331],
  [225, 552],
  [491, 525],
  [510, 79],
  [462, 75],
  [448, 512],
  [258, 507],
  [246, 60],
  [200, 60],
  [187, 240],
  [94, 247],
  [91, 58]
];

const calculateTangentsFromNeighbors = points => {
  const s = points.length;
  const ret = [];
  for (let i = 0; i < s; ++i) {
    const prev = points[(i - 1 + s) % s];
    const next = points[(i + 1) % s];
    ret.push([(next[0] - prev[0]) * scale, (next[1] - prev[1]) * scale]);
  }
  return ret;
};

const getBezierEquation = (p0, p1, p2, p3) =>
  p0.map((u0, i) => {
    // map will go thru (x, y) separately
    const u1 = p1[i];
    const u2 = p2[i];
    const u3 = p3[i];
    return [
      u0, // u^0
      -3 * u0 + 3 * u1, // u ^ 1
      3 * u0 - 6 * u1 + 3 * u2, // u ^ 2
      -u0 + 3 * u1 - 3 * u2 + u3 // u ^ 3
    ];
  });

const substitutePoly = (poly, x) =>
  poly.reduce((prev, curr, i) => (prev += curr * Math.pow(x, i)), 0);

const derivative = poly => {
  const ret = [];
  for (let i = 1; i < poly.length; ++i) {
    ret.push(poly[i] * i);
  }
  return ret;
};

/**
 * this actually returns an array of 11 elements
 */
const SAMPLE_POINTS = 10;
const getArcLength = equation => {
  const ret = [0];
  for (let i = 0; i < SAMPLE_POINTS; ++i) {
    const start = i / SAMPLE_POINTS;
    const end = (i + 1) / SAMPLE_POINTS;
    const dx = substitutePoly(equation[0], end) - substitutePoly(equation[0], start);
    const dy = substitutePoly(equation[1], end) - substitutePoly(equation[1], start);
    // accumulated
    ret.push(Math.sqrt(dx * dx + dy * dy) + ret[i]);
  }
  return ret;
};

const getPosFromPercent = percent => {
  let eqIdx;
  let u;
  if (!arcLength) {
    const param = percent * thePoints.length;
    eqIdx = Math.floor(param);
    u = param - eqIdx;
    return [eqIdx, u];
  }

  const posArcLength = percent * totalArcLength;
  for (let i = 0; i < arcLengthAccumulated.length; ++i) {
    if (arcLengthAccumulated[i] > posArcLength) {
      eqIdx = i;
      break;
    }
  }
  u = posArcLength - (eqIdx > 0 ? arcLengthAccumulated[eqIdx - 1] : 0);
  for (let i = 0; i < arcLengths[eqIdx].length; ++i) {
    if (arcLengths[eqIdx][i] > u) {
      // it's between i and i - 1
      // do linear interpolation
      let x = (u - arcLengths[eqIdx][i - 1]) / (arcLengths[eqIdx][i] - arcLengths[eqIdx][i - 1]);
      const stepSize = 1 / SAMPLE_POINTS;
      u = x * stepSize + (i - 1) * stepSize;
      break;
    }
  }
  return [eqIdx, u];
};

function drawTrain(ctx, [x, y], direction) {
  // Note: we want to be facing right before rotate
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(direction);
  // front nose
  ctx.fillStyle = "#dba047";
  ctx.fillRect(0, -12, 30, 24);
  ctx.fillStyle = "#da5859";
  ctx.fillRect(0, -8, 28, 16);
  // wheels
  ctx.fillStyle = "#43515f";
  ctx.fillRect(2, -13, 10, 3);
  ctx.fillRect(20, -13, 10, 3);
  ctx.fillRect(2, 10, 10, 3);
  ctx.fillRect(20, 10, 10, 3);
  // front triangle
  ctx.beginPath();
  ctx.moveTo(30, -10);
  ctx.lineTo(40, 0);
  ctx.lineTo(30, 10);
  ctx.closePath();
  ctx.fillStyle = "#dba047";
  ctx.fill();
  // chimney
  ctx.beginPath();
  ctx.arc(20, 0, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#6b6a32";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(20, 0, 9, 0, Math.PI * 2);
  ctx.fillStyle = "#dba047";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(20, 0, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#cfe86f";
  ctx.fill();
  // back box
  ctx.fillStyle = "#fb5254";
  ctx.fillRect(-30, -15, 30, 30);
  ctx.restore();
}

function drawCart(ctx, [x, y], dir, hue) {
  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(dir);

  ctx.fillStyle = `hsl(${hue}, 80%, 70%)`;
  ctx.fillRect(-25, -10, 50, 20);

  // wheels
  ctx.fillStyle = "#43515f";
  ctx.fillRect(-20, -12, 12, 4);
  ctx.fillRect(8, -12, 12, 4);
  ctx.fillRect(-20, 8, 12, 4);
  ctx.fillRect(8, 8, 12, 4);

  // inner
  ctx.fillStyle = `hsl(${hue}, 60%, 60%)`;
  ctx.fillRect(-23, -8, 46, 16);

  ctx.restore();
}

function drawCarts(ctx, headPercent) {
  const offset = 60;

  for (let i = 1; i <= numCarts; ++i) {
    let [eqIdx, u] = getPosFromPercent(
      ((headPercent * totalArcLength - i * offset + totalArcLength) % totalArcLength) /
        totalArcLength
    );
    const pos = bezierEquations[eqIdx].map(poly => substitutePoly(poly, u));
    const dir = Math.atan2.apply(
      null,
      velocityEquations[eqIdx].map(poly => substitutePoly(poly, u)).reverse()
    );
    drawCart(ctx, pos, dir, 45 + ((i * 60) % 360));
  }
}

const TIE_SPACE = 15;
function drawTies(ctx) {
  ctx.save();
  ctx.fillStyle = "saddlebrown";
  const tiesCount = totalArcLength / TIE_SPACE;
  for (let i = 0; i < tiesCount; ++i) {
    const [eqIdx, u] = getPosFromPercent(i / tiesCount);
    const pos = bezierEquations[eqIdx].map(poly => substitutePoly(poly, u));
    const direction = Math.atan2.apply(
      null,
      velocityEquations[eqIdx].map(poly => substitutePoly(poly, u)).reverse()
    );
    // draw
    ctx.save();
    ctx.translate(pos[0], pos[1]);
    ctx.rotate(direction);
    ctx.fillRect(-3, -10, 6, 20);
    ctx.restore();
  }
  ctx.restore();
}

function drawNiceTracks(ctx) {
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#424343";
  const offset = 6;

  const count = totalArcLength / 3;

  // track one
  ctx.beginPath();
  for (let i = 0; i < count; ++i) {
    const [eqIdx, u] = getPosFromPercent(i / count);
    const pos = bezierEquations[eqIdx].map(poly => substitutePoly(poly, u));
    let [vx, vy] = velocityEquations[eqIdx].map(poly => substitutePoly(poly, u));
    const v = Math.sqrt(vx * vx + vy * vy);
    vx = (vx / v) * offset;
    vy = (vy / v) * offset;
    pos[0] += -vy;
    pos[1] += vx;

    // draw
    if (i === 0) {
      ctx.moveTo(pos[0], pos[1]);
    } else {
      ctx.lineTo(pos[0], pos[1]);
    }
  }
  ctx.closePath();
  ctx.stroke();

  // track two
  ctx.beginPath();
  for (let i = 0; i < count; ++i) {
    const [eqIdx, u] = getPosFromPercent(i / count);
    const pos = bezierEquations[eqIdx].map(poly => substitutePoly(poly, u));
    let [vx, vy] = velocityEquations[eqIdx].map(poly => substitutePoly(poly, u));
    const v = Math.sqrt(vx * vx + vy * vy);
    vx = (vx / v) * offset;
    vy = (vy / v) * offset;
    pos[0] += vy;
    pos[1] += -vx;

    // draw
    if (i === 0) {
      ctx.moveTo(pos[0], pos[1]);
    } else {
      ctx.lineTo(pos[0], pos[1]);
    }
  }
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

/**
 * Because only draggablePoints changes the points, and runCanvas don't.
 * So recalculating the whole bezier thing in draw is wasteful.
 * Just store shared variables as globals for now
 */
let tangentVectors;
let bezierEquations;
let velocityEquations;
let arcLengths;
let totalArcLength;
let arcLengthAccumulated;
function pointsChanged() {
  tangentVectors = calculateTangentsFromNeighbors(thePoints);
  bezierEquations = [];
  for (let i = 0; i < thePoints.length; ++i) {
    const p0 = thePoints[i];
    const p1 = [p0[0] + tangentVectors[i][0] / 3, p0[1] + tangentVectors[i][1] / 3];
    const ii = (i + 1) % thePoints.length;
    const p3 = thePoints[ii];
    const p2 = [p3[0] - tangentVectors[ii][0] / 3, p3[1] - tangentVectors[ii][1] / 3];
    bezierEquations.push(getBezierEquation(p0, p1, p2, p3));
  }
  // we also need train direction, so calculate derivative
  velocityEquations = bezierEquations.map(equation => equation.map(poly => derivative(poly)));

  // build arc-length parameterization table
  arcLengths = bezierEquations.map(getArcLength);
  totalArcLength = arcLengths.reduce((p, c) => p + c[SAMPLE_POINTS], 0);
  // make a pre-sum array
  arcLengthAccumulated = [arcLengths[0][SAMPLE_POINTS]];
  for (let i = 1; i < arcLengths.length; ++i) {
    arcLengthAccumulated.push(arcLengths[i][SAMPLE_POINTS] + arcLengthAccumulated[i - 1]);
  }
}
// need to initialize so call it once here
pointsChanged();

/**
 * Draw function - this is the meat of the operation
 *
 * It's the main thing that needs to be changed
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} param
 */
function draw(canvas, param) {
  const ctx = canvas.getContext("2d");
  // clear the screen
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#87CEFA";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // now, the student should add code to draw the track and train
  if (simpleTrack) {
    ctx.save();
    ctx.moveTo(thePoints[0][0], thePoints[0][1]);
    for (let i = 0; i < thePoints.length; ++i) {
      const p0 = thePoints[i];
      const p1 = [p0[0] + tangentVectors[i][0] / 3, p0[1] + tangentVectors[i][1] / 3];
      const ii = (i + 1) % thePoints.length;
      const p3 = thePoints[ii];
      const p2 = [p3[0] - tangentVectors[ii][0] / 3, p3[1] - tangentVectors[ii][1] / 3];
      ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  } else {
    drawTies(ctx);
    drawNiceTracks(ctx);
  }

  // draw the control points
  ctx.save();
  thePoints.forEach(pt => {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(pt[0], pt[1], 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // draw train
  // first get train position
  let [eqIdx, u] = getPosFromPercent(param / thePoints.length);
  // map will map thru (x, y) separately
  // and the `poly` we get is a 4-element 1d array which is a polynomial
  // and substitutePoly will substitute value into polynomial
  const trainPos = bezierEquations[eqIdx].map(poly => substitutePoly(poly, u));
  const trainDirection = Math.atan2.apply(
    null,
    velocityEquations[eqIdx].map(poly => substitutePoly(poly, u)).reverse()
  );

  drawTrain(ctx, trainPos, trainDirection);
  drawCarts(ctx, param / thePoints.length);
}

/**
 * Setup stuff - make a "window.onload" that sets up the UI and starts
 * the train
 */
window.addEventListener("DOMContentLoaded", () => {
  let theCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("train"));
  // we need the slider for the draw function, but we need the draw function
  // to create the slider - so create a variable and we'll change it later
  let theSlider; // = undefined;

  // note: we wrap the draw call so we can pass the right arguments
  function wrapDraw() {
    // do modular arithmetic since the end of the track should be the beginning
    draw(theCanvas, Number(theSlider.value) % thePoints.length);
  }
  // create a UI
  let runcavas = new RunCanvas(
    theCanvas,
    wrapDraw,
    false,
    document.getElementById("train-controls")
  );
  // now we can connect the draw function correctly
  theSlider = runcavas.range;

  function addCheckbox(name, initial = false, callback) {
    let div = document.createElement("div");
    div.classList.add("control-checkbox");
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    div.appendChild(checkbox);
    checkbox.id = name;
    checkbox.onchange = wrapDraw;
    checkbox.checked = initial;
    let checklabel = document.createElement("label");
    checklabel.setAttribute("for", name);
    checklabel.innerText = name;
    div.appendChild(checklabel);
    document.getElementById("train-controls").appendChild(div);
    checkbox.addEventListener("change", callback);
  }
  // note: if you add these features, uncomment the lines for the checkboxes
  // in your code, you can test if the checkbox is checked by something like:
  // document.getElementById("simple-track").checked
  // in your drawing code
  //
  // lines to uncomment to make checkboxes
  addCheckbox("simple-track", false, e => {
    simpleTrack = e.target.checked;
    wrapDraw();
  });
  addCheckbox("arc-length", true, e => {
    arcLength = e.target.checked;
    wrapDraw();
  });
  // addCheckbox("bspline",false);

  const numCartsLabel = document.querySelector("#train-num-carts");
  document.querySelector("#train-add-cart").addEventListener("click", () => {
    numCartsLabel.innerText = ++numCarts;
    wrapDraw();
  });
  document.querySelector("#train-minus-cart").addEventListener("click", () => {
    numCarts = Math.max(--numCarts, 0);
    numCartsLabel.innerText = numCarts;
    wrapDraw();
  });

  // helper function - set the slider to have max = # of control points
  function setNumPoints() {
    runcavas.setupSlider(0, thePoints.length, 0.05);
  }

  setNumPoints();
  runcavas.setValue(0);

  function updatePointsAndDraw() {
    pointsChanged();
    wrapDraw();
  }
  // add the point dragging UI
  draggablePoints(theCanvas, thePoints, updatePointsAndDraw, 10, setNumPoints);
});
