function drawCanvasKeroppi() {
  // use type information to make TypeScript happy
  /** @type {HTMLCanvasElement} */
  let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas-keroppi"));

  // the student should fill in the rest...
  //background
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fcd9ec";
  ctx.fillRect(0, 0, 500, 500);

  for (let i = 0; i < 5; ++i) {
    for (let j = 0; j < 5; ++j) {
      //   ctx.fillStyle = 'rgba(255, 0, 0, ' + 0.05 * (i + j) + ')';
      ctx.fillStyle = `rgba(255, 0, 0, ${0.05 * (i + j)})`;
      ctx.fillRect(i * 100, j * 100, 100, 100);
    }
  }

  //face shape
  ctx.beginPath();
  ctx.arc(250, 280, 160, 0, 2 * Math.PI);
  //   ctx.strokeStyle = '#089c1b';
  //   ctx.lineWidth = 7;
  ctx.fillStyle = "#b4eb34";
  ctx.closePath();
  //   ctx.stroke();
  ctx.fill();

  //right eye
  ctx.beginPath();
  ctx.arc(320, 160, 75, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(300, 160, 25, 0, 2 * Math.PI);
  ctx.fillStyle = "#421d04";
  ctx.closePath();
  ctx.fill();

  //left eye
  ctx.beginPath();
  ctx.arc(180, 160, 75, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(200, 160, 25, 0, 2 * Math.PI);
  ctx.fillStyle = "#421d04";
  ctx.closePath();
  ctx.fill();

  //mouth
  ctx.beginPath();
  ctx.arc(250, 220, 80, (28 / 180) * Math.PI, ((180 - 28) / 180) * Math.PI);
  ctx.strokeStyle = "#421d04";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.stroke();

  // shy
  function shy(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.5);
    ctx.beginPath();
    ctx.arc(0, 0, 33, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  //right shy
  shy(366, 270);

  //left shy
  shy(134, 270);
  //   ctx.beginPath();
  //   ctx.arc(134, 270, 33, 0, 2 * Math.PI);
  //   ctx.fillStyle = '#FF000066';
  //   ctx.closePath();
  //   ctx.fill();

  //body shape
  ctx.beginPath();
  ctx.arc(250, 280, 160, (19 / 180) * Math.PI, ((180 - 19) / 180) * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.closePath();
  ctx.fill();

  let clothRed = "#FF0000";
  //cloth middle red
  ctx.beginPath();
  ctx.moveTo(211, 331.8);
  ctx.lineTo(288, 331.8);
  ctx.arc(250, 280, 160, (75.8 / 180) * Math.PI, ((180 - 75.8) / 180) * Math.PI);
  ctx.fillStyle = clothRed;
  ctx.closePath();
  ctx.fill();

  //cloth right red
  ctx.beginPath();
  ctx.moveTo(356, 331.8);
  ctx.lineTo(410, 331.8);
  ctx.arc(250, 280, 160, (19 / 180) * Math.PI, ((180 - 131.8) / 180) * Math.PI);
  ctx.fillStyle = clothRed;
  ctx.closePath();
  ctx.fill();

  //cloth left red
  ctx.beginPath();
  ctx.moveTo(212, 331.8);
  ctx.lineTo(143, 331.8);
  ctx.arc(250, 280, 160, (132 / 180) * Math.PI, ((180 - 19) / 180) * Math.PI);
  ctx.fillStyle = clothRed;
  ctx.closePath();
  ctx.fill();

  // tie
  ctx.save();
  ctx.beginPath();
  ctx.arc(250, 380, 25, 0, Math.PI * 2);
  ctx.fillStyle = "#07badd";
  ctx.fill();
  ctx.beginPath();
  ctx.restore();
  function drawTieSide(angle) {
    ctx.save();
    ctx.translate(250, 380);
    ctx.moveTo(0, 0);
    ctx.rotate(angle);
    ctx.lineTo(20, 50);
    // ctx.lineTo(8, 45);
    // ctx.lineTo(0, 50);
    // ctx.lineTo(-8, 45);
    ctx.lineTo(-20, 50);
    ctx.closePath();
    ctx.fillStyle = "#07badd";
    ctx.fill();
    ctx.restore();
  }
  drawTieSide(Math.PI / 2);
  drawTieSide(-Math.PI / 2);
}

window.addEventListener("DOMContentLoaded", () => {
  drawCanvasKeroppi();
});
