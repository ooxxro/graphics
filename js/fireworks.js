function firework() {
  /** @type {HTMLCanvasElement} */
  let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("fireworks"));
  let ctx = canvas.getContext("2d");

  let fireworks = [];
  let autoFire = 0;

  canvas.addEventListener("click", function(e) {
    let x = e.clientX;
    let y = e.clientY;
    let box = canvas.getBoundingClientRect();
    x -= box.left;
    y -= box.top;

    fireworks.push({
      target: {
        x: x,
        y: y
      },
      x: Math.random() * canvas.width,
      y: canvas.height,
      v: 10,
      state: "fly",
      hue: Math.random() * 360,
      keroppi: Math.random() < 0.1
    });
  });

  function calcDist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  function loop() {
    ctx.fillStyle = "#00000022";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < fireworks.length; ++i) {
      let firework = fireworks[i];

      if (firework.state === "fly") {
        let dist = calcDist(firework.x, firework.y, firework.target.x, firework.target.y);
        if (dist <= firework.v) {
          firework.x = firework.target.x;
          firework.y = firework.target.y;
          firework.state = "explode";
          firework.lifetime = Math.random() * 60 + 30;
          if (!firework.keroppi) {
            firework.particles = [];
            let x = 0;
            // inner circle
            for (let j = 0; j < 20; ++j) {
              firework.particles.push({
                x: firework.x,
                y: firework.y,
                dir: x,
                v: 0.4,
                circle: "inner"
              });
              x += (Math.PI * 2) / 20;
            }
            // middle circle
            for (let j = 0; j < 30; ++j) {
              firework.particles.push({
                x: firework.x,
                y: firework.y,
                dir: x,
                v: 1,
                circle: "middle"
              });
              x += (Math.PI * 2) / 30;
            }
            // middle circle
            for (let j = 0; j < 30; ++j) {
              firework.particles.push({
                x: firework.x,
                y: firework.y,
                dir: x,
                v: 2,
                circle: "outer"
              });
              x += (Math.PI * 2) / 30;
            }
          }
        } else {
          firework.x += ((firework.target.x - firework.x) * firework.v) / dist;
          firework.y += ((firework.target.y - firework.y) * firework.v) / dist;
        }

        ctx.beginPath();
        ctx.arc(firework.x, firework.y, 5, 0, 2 * Math.PI);
        // ctx.fillStyle = '#55e6c4';
        ctx.fillStyle = `hsl(${firework.hue}, 60%, 67%)`;
        ctx.fill();
      } else if (firework.state === "explode") {
        firework.lifetime--;
        if (firework.lifetime <= 0) {
          fireworks.splice(i, 1);
          --i;
        } else {
          if (firework.keroppi) {
            ctx.save();
            ctx.translate(firework.x, firework.y);
            // ctx.rotate(firework.lifetime);
            keroppi(ctx, 0, 0, 90 - firework.lifetime);
            ctx.translate(-firework.x, -firework.y);
            ctx.restore();
          } else {
            for (let j = 0; j < firework.particles.length; ++j) {
              let p = firework.particles[j];
              p.x += p.v * Math.cos(p.dir);
              p.y += p.v * Math.sin(p.dir);

              ctx.beginPath();
              let l = 67;
              let r = 3;
              if (p.circle === "inner") {
                l = 80;
                r = 2;
              } else if (p.circle === "outer") {
                l = 50;
              }

              ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
              ctx.fillStyle = `hsla(${firework.hue}, 100%, ${l}%, ${firework.lifetime / 5})`;
              ctx.fill();
            }
          }
        }
      }
    }

    // auto fire
    if (autoFire++ % 120 === 0) {
      fireworks.push({
        target: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.4
        },
        x: Math.random() * canvas.width,
        y: canvas.height,
        v: 10,
        state: "fly",
        hue: Math.random() * 360,
        keroppi: Math.random() < 0.1
      });
    }
    // console.log(fireworks.length);

    window.requestAnimationFrame(loop);
  }
  loop();
}

function keroppi(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 360, size / 360);
  ctx.translate(-250, -280);
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
  ctx.restore();
}

window.addEventListener("DOMContentLoaded", () => {
  firework();
});
