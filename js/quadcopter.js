// empty shell for students to do their quadcopter
// exercise

// see other files for explanation of these comments
// @ts-check
/* jshint -W069, esversion:6 */

class Quadcopter {
  constructor(canvas, ctx, x, y) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.propellerDegree = {
      FR: 0,
      FL: 0,
      RR: 0,
      RL: 0
    };

    this.autoRotate = false;
    this.autoRotateRadian = 0;
    this.controlled = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    const { width, height } = this.canvas;
    this.x = ((this.x % width) + width) % width;
    this.y = ((this.y % height) + height) % height;

    if (this.autoRotate && (this.vx !== 0 || this.vy !== 0)) {
      const newRadian = Math.atan2(this.vy, this.vx) % (Math.PI * 2);
      if (
        Math.abs(this.autoRotateRadian - newRadian) <= 0.2 ||
        Math.abs(this.autoRotateRadian - newRadian) >= Math.PI * 2 - 0.2
      ) {
        this.autoRotateRadian = newRadian;
      } else {
        if (
          (this.autoRotateRadian > newRadian && this.autoRotateRadian - newRadian > Math.PI) ||
          (this.autoRotateRadian < newRadian && newRadian - this.autoRotateRadian < Math.PI)
        ) {
          this.autoRotateRadian += 0.2;
        } else {
          this.autoRotateRadian -= 0.2;
        }
        this.autoRotateRadian %= Math.PI * 2;
      }
    }
  }

  draw() {
    if (this.controlled) {
      this.update();
    }

    let ctx = this.ctx;
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.autoRotate) {
      ctx.rotate(this.autoRotateRadian);
    }
    this.propellerDegree.FR += 0.1;
    this.drawArm("FR", 20, (Math.PI / 180) * 45);
    this.propellerDegree.FL += 0.2;
    this.drawArm("FL", 20, (Math.PI / 180) * -45);
    this.propellerDegree.RR += 0.2;
    this.drawArm("RR", 20, (Math.PI / 180) * 135);
    this.propellerDegree.RL += 0.3;
    this.drawArm("RL", 20, (Math.PI / 180) * -135);
    this.drawBody();
    ctx.restore();
  }

  drawBody() {
    let ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.rotate(Math.PI / 2);
    ctx.moveTo(-25, -15);
    ctx.lineTo(-15, -30);
    ctx.lineTo(15, -30);
    ctx.lineTo(25, -15);
    ctx.lineTo(10, 35);
    ctx.lineTo(-10, 35);
    ctx.closePath();
    ctx.fillStyle = "#1e7eba";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // tail
    if (!this.controlled || Math.abs(this.vx) + Math.abs(this.vy) > 0) {
      ctx.beginPath();
      ctx.moveTo(6, 35);
      ctx.lineTo(0, 60);
      ctx.lineTo(-6, 35);
      ctx.fillStyle = "orange";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(3, 35);
      ctx.lineTo(0, 45);
      ctx.lineTo(-3, 35);
      ctx.fillStyle = "red";
      ctx.fill();
    }

    // keroppi
    keroppi(ctx, 0, -5, 30);

    ctx.restore();
  }

  drawArm(name, x, rotate) {
    let ctx = this.ctx;
    ctx.save();
    ctx.rotate(rotate);
    ctx.translate(x, 0);
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(45, -2);
    ctx.lineTo(45, 2);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fillStyle = "#25406b";
    ctx.fill();

    ctx.translate(40, 0);
    this.drawPropeller(name);

    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawPropeller(name) {
    let ctx = this.ctx;
    ctx.save();
    ctx.rotate(this.propellerDegree[name]);
    ctx.fillStyle = "#ff963b";
    roundRect(ctx, -3, -22, 6, 44, 3, true, false);

    ctx.restore();
  }
}

let up = false;
let down = false;
let left = false;
let right = false;
window.addEventListener("keydown", e => {
  // space and arrow keys
  if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
  switch (e.keyCode) {
    case 38:
    case 87:
      up = true;
      break;
    case 40:
    case 83:
      down = true;
      break;
    case 37:
    case 65:
      left = true;
      break;
    case 39:
    case 68:
      right = true;
      break;
  }
});
window.addEventListener("keyup", e => {
  switch (e.keyCode) {
    case 38:
    case 87:
      up = false;
      break;
    case 40:
    case 83:
      down = false;
      break;
    case 37:
    case 65:
      left = false;
      break;
    case 39:
    case 68:
      right = false;
      break;
  }
});

window.addEventListener("DOMContentLoaded", () => {
  // somewhere in your program (maybe not here) you'll want a line
  // that looks like:
  let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("quadcopter"));
  let ctx = canvas.getContext("2d");
  // q1 goes in circle
  let q1 = new Quadcopter(canvas, ctx, 0, -100);
  // q2 is controlled by arrow keys (or WASD)
  let q2 = new Quadcopter(canvas, ctx, 300, 300);
  q2.autoRotate = true;
  q2.controlled = true;
  // q3 is controlled mouse click target
  let q3 = new Quadcopter(canvas, ctx, 200, 200);
  q3.autoRotate = true;
  q3.controlled = true;

  let q1Rotation = 0;
  let keroX = Math.random() * canvas.width;
  let keroY = Math.random() * canvas.height;

  function randomKero() {}
  randomKero();

  function loop() {
    let skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, "rgb(255, 250, 214)");
    skyGradient.addColorStop(1, "rgb(209, 255, 236)");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.fillText("←↑↓→ to control q2", canvas.width / 2, 30);
    ctx.fillText("Mouse click to set target for q3", canvas.width / 2, 70);

    if (keroX && keroY) {
      ctx.beginPath();
      ctx.arc(keroX, keroY, 21, 0, Math.PI * 2);
      ctx.fillStyle = "#cf2971";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(keroX - 8, keroY - 14, 21 / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(keroX + 8, keroY - 14, 21 / 2, 0, Math.PI * 2);
      ctx.fill();
      keroppi(ctx, keroX, keroY, 40);
    }

    // q1
    ctx.save();
    ctx.translate(100, 100);
    ctx.rotate(q1Rotation);
    q1Rotation += 0.03;
    ctx.scale(0.5, 0.5);
    q1.draw();
    ctx.restore();

    // q2
    if (up) {
      q2.vy = -3;
    } else if (down) {
      q2.vy = 3;
    } else {
      q2.vy = 0;
    }
    if (left) {
      q2.vx = -3;
    } else if (right) {
      q2.vx = 3;
    } else {
      q2.vx = 0;
    }
    q2.draw();

    // q3
    if (keroX && keroY) {
      q3.x;
      q3.y;
      keroX;
      keroY;
      let dist = Math.sqrt(Math.pow(keroX - q3.x, 2) + Math.pow(keroY - q3.y, 2));
      if (dist < 2) {
        q3.vx = 0;
        q3.vy = 0;
        keroX = null;
        keroY = null;
      } else {
        q3.vx = ((keroX - q3.x) / dist) * 2;
        q3.vy = ((keroY - q3.y) / dist) * 2;
      }
    }
    q3.draw();

    window.requestAnimationFrame(loop);
  }
  loop();

  canvas.addEventListener("click", e => {
    let box = canvas.getBoundingClientRect();
    let mouseX = e.clientX - box.left;
    let mouseY = e.clientY - box.top;

    keroX = mouseX;
    keroY = mouseY;
  });
  canvas.addEventListener("touchend", e => {
    let box = canvas.getBoundingClientRect();
    let mouseX = e.touches[0].clientX - box.left;
    let mouseY = e.touches[0].clientY - box.top;

    keroX = mouseX;
    keroY = mouseY;
  });
});

/**
 * https://stackoverflow.com/a/3368118/12017013
 *
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

/**
 * from my workbook 2
 */
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
