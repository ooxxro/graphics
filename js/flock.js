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
  function shy(xx, yy) {
    ctx.save();
    ctx.translate(xx, yy);
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

let speed = 5;
let alignWeight = 0.05;
let separationWeight = 0.03;
let cohesionWeight = 0.01;
let mouse;
const NEIGHBOR_DIST = 300;

const dist = (b1, b2) => Math.sqrt((b1.x - b2.x) * (b1.x - b2.x) + (b1.y - b2.y) * (b1.y - b2.y));

const willCollide = (b1, b2) => {
  const newB1 = {
    x: b1.x + b1.vx * speed,
    y: b1.y + b1.vy * speed
  };
  const newB2 = {
    x: b2.x + b2.vx * speed,
    y: b2.y + b2.vy * speed
  };
  return dist(newB1, newB2) < b1.size + b2.size;
};

class Boid {
  /**
   *
   * @param {number} x    - initial X position
   * @param {number} y    - initial Y position
   * @param {number} vx   - initial X velocity
   * @param {number} vy   - initial Y velocity
   */
  constructor(x, y, vx = 1, vy = 0, target = null) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;

    this.target = target;
    this.COLOR = "#ffac70";
    this.CHASE_COLOR = "#f05151";
    this.BOUNCE_COLOR = "#07badd";
    this.CHASE_BOUNCE_COLOR = "#309e26";
    this.size = 15;
    this.bounceCount = 0;
    this.bounced = false;
  }

  getColor() {
    if (this.isFollowed) {
      return "pink";
    }
    if (this.target) {
      return this.bounced ? this.CHASE_BOUNCE_COLOR : this.CHASE_COLOR;
    }
    return this.bounced ? this.BOUNCE_COLOR : this.COLOR;
  }
  /**
   * Draw the Boid
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(this.vy, this.vx));

    // fish body
    ctx.save();
    ctx.beginPath();
    ctx.scale(1, 0.7);
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fillStyle = this.getColor();
    ctx.fill();
    // fish tail
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(-24, -15);
    ctx.lineTo(-24, 15);
    ctx.closePath();
    ctx.fillStyle = this.getColor();
    ctx.fill();
    ctx.restore();

    // eye
    ctx.beginPath();
    ctx.arc(7, -2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7.75, -2.5, 0.75, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    ctx.restore();
  }
  /**
   * Perform the "steering" behavior -
   * This function should update the velocity based on the other
   * members of the flock.
   * It is passed the entire flock (an array of Boids) - that includes
   * "this"!
   * Note: dealing with the boundaries does not need to be handled here
   * (in fact it can't be, since there is no awareness of the canvas)
   * *
   * And remember, (vx,vy) should always be a unit vector!
   * @param {Array<Boid>} flock
   */
  steer(flock) {
    /*
		// Note - this sample behavior is just to help you understand
		// what a steering function might  do
		// all this one does is have things go in circles, rather than
		// straight lines
		// Something this simple would not count for the bonus points:
		// a "real" steering behavior must consider other boids,
		// or at least obstacles.
		
        // a simple steering behavior: 
        // create a rotation matrix that turns by a small amount
        // 2 degrees per time step
        const angle = 2 * Math.PI / 180;
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        let ovx = this.vx;
        let ovy = this.vy;

        this.vx =  ovx * c + ovy * s;
        this.vy = -ovx * s + ovy * c;
    */

    // detect collision with other fishes
    for (let f of flock) {
      if (this !== f && willCollide(this, f)) {
        [this.vx, f.vx] = [f.vx, this.vx];
        [this.vy, f.vy] = [f.vy, this.vy];
        this.bounce();
        f.bounce();
      }
    }

    // flocking
    let [alignmentVX, alignmentVY] = this.alignment(flock);
    let [separationVX, separationVY] = this.separation(flock);
    let [cohesionVX, cohesionVY] = this.cohesion(flock);
    let vx =
      this.vx +
      alignmentVX * alignWeight +
      cohesionVX * cohesionWeight +
      separationVX * separationWeight;
    let vy = this.vy + alignmentVY * alignWeight;
    +cohesionVY * cohesionWeight + separationVY * separationWeight;

    // normalize vx, vy to 1
    let v = Math.sqrt(vx * vx + vy * vy);
    vx /= v;
    vy /= v;
    this.vx = vx;
    this.vy = vy;

    if (this.target) {
      const targetDirection = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      let currentDirection = Math.atan2(this.vy, this.vx);

      const turnLimit = 0.1;
      if (
        Math.abs(currentDirection - targetDirection) <= turnLimit ||
        Math.abs(currentDirection - targetDirection) >= Math.PI * 2 - turnLimit
      ) {
        currentDirection = targetDirection;
      } else {
        // to rotate gradually, need to first know which direction
        if (
          (currentDirection > targetDirection && currentDirection - targetDirection > Math.PI) ||
          (currentDirection < targetDirection && targetDirection - currentDirection < Math.PI)
        ) {
          currentDirection += turnLimit;
        } else {
          currentDirection -= turnLimit;
        }
      }
      this.vx = Math.cos(currentDirection);
      this.vy = Math.sin(currentDirection);
      if (dist(this.target, this) < this.size * 2) {
        if (this.target instanceof Boid) {
          // fish got fish
          this.target.isFollowed = false;
        } else {
          // fish got mouse
          let rand = Math.floor(Math.random() * flock.length);
          if (flock[rand] == this) rand = (rand + 1) % flock.length;

          if (flock[rand].target && flock[rand].target instanceof Boid) {
            flock[rand].target.isFollowed = false;
          }
          flock[rand].target = this;
          this.isFollowed = true;
        }
        this.target = null;
        this.bounceCount = 0;
      }
    }
  }

  alignment(flock) {
    let vx = 0;
    let vy = 0;
    let neighborCount = 0;
    for (let f of flock) {
      if (f !== this) {
        let d = dist(this, f);
        if (d < NEIGHBOR_DIST) {
          // calculate the avg of direction
          vx += (f.vx * 1000) / d;
          vy += (f.vy * 1000) / d;
          ++neighborCount;
        }
      }
    }
    if (!neighborCount) return [0, 0];

    let v = Math.sqrt(vx * vx + vy * vy);
    vx /= v;
    vy /= v;
    return [vx, vy];
  }

  separation(flock) {
    let vx = 0;
    let vy = 0;
    let neighborCount = 0;
    for (let f of flock) {
      if (f !== this) {
        let d = dist(this, f);
        if (d < NEIGHBOR_DIST / 3) {
          // avg of distance
          vx += ((this.x - f.x) * 1000) / d;
          vy += ((this.y - f.y) * 1000) / d;
          ++neighborCount;
        }
      }
    }
    if (!neighborCount) return [0, 0];

    let v = Math.sqrt(vx * vx + vy * vy);
    vx /= v;
    vy /= v;
    return [vx, vy];
  }

  cohesion(flock) {
    let x = 0;
    let y = 0;
    let neighborCount = 0;
    for (let f of flock) {
      if (f !== this) {
        let d = dist(this, f);
        if (d < NEIGHBOR_DIST) {
          x += (f.x * 1000) / d;
          y += (f.y * 1000) / d;
          ++neighborCount;
        }
      }
    }
    if (!neighborCount) return [0, 0];

    // this is the avg position of neighbors
    x /= neighborCount;
    y /= neighborCount;

    let vx = x - this.x;
    let vy = y - this.y;

    let v = Math.sqrt(vx * vx + vy * vy);
    vx /= v;
    vy /= v;
    return [vx, vy];
  }

  bounce() {
    if (++this.bounceCount > 50 && !this.target) {
      this.bounceCount = 0;
      this.target = mouse;
      this.targetTimeout = setTimeout(() => {
        if (this.target instanceof Boid) {
          this.target.isFollowed = false;
        }
        this.target = null;
        this.bounceCount = 0;
        this.targetTimeout = null;
      }, 7000);
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    } else {
      this.bounced = true;
    }

    this.timeout = setTimeout(() => {
      this.bounced = false;
      this.timeout = null;
    }, 250);
  }
}

class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(ctx) {
    // ctx.save();
    // ctx.beginPath();
    // ctx.translate(this.x, this.y);
    // ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    // ctx.fillStyle = 'pink';
    // ctx.strokeStyle = '#fff';
    // ctx.lineWidth = 3;
    // ctx.fill();
    // ctx.stroke();

    // ctx.restore();

    ctx.fillStyle = "#ffffffaa";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = "#d4ebff";
    ctx.fillRect(this.x + 4, this.y + 4, this.w - 8, this.h - 8);
    keroppi(ctx, this.x + this.w / 2, this.y + this.h * 0.52, Math.min(this.w, this.h) * 0.8);
    ctx.fillStyle = "#ffffff55";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#db541a";
    ctx.translate(this.x, this.y);
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  /** @type Array<Boid> */
  let theBoids = [];
  let obstacles = [];

  let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("flock"));
  let context = canvas.getContext("2d");

  let speedSlider = /** @type {HTMLInputElement} */ (document.getElementById("speed"));
  let alignSlider = /** @type {HTMLInputElement} */ (document.getElementById("alignment"));
  let separationSlider = /** @type {HTMLInputElement} */ (document.getElementById("separation"));
  let cohesionSlider = /** @type {HTMLInputElement} */ (document.getElementById("cohesion"));

  let canvasBox = canvas.getBoundingClientRect();
  let density = 2;
  setInterval(() => {
    canvasBox = canvas.getBoundingClientRect();
  }, 1000);
  mouse = new Mouse();
  mouse.x = canvas.height / 2;
  mouse.y = canvas.width / 2;
  window.addEventListener("mousemove", e => {
    mouse.x = (e.clientX - canvasBox.left) * density;
    mouse.y = (e.clientY - canvasBox.top) * density;
  });
  window.addEventListener("touchmove", e => {
    mouse.x = (e.touches[0].clientX - canvasBox.left) * density;
    mouse.y = (e.touches[0].clientY - canvasBox.top) * density;
  });

  function draw() {
    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#d4ebff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    theBoids.forEach(boid => boid.draw(context));
    obstacles.forEach(obstacle => obstacle.draw(context));
    mouse.draw(context);
  }

  /**
   * Create some initial boids
   * STUDENT: may want to replace this
   */
  theBoids.push(new Boid(100, 100));
  theBoids.push(new Boid(200, 200, -1, 0));
  theBoids.push(new Boid(300, 300, 0, -1));
  theBoids.push(new Boid(400, 400, 0, 1, mouse));

  obstacles.push(new Obstacle(200, 200, 100, 200));
  obstacles.push(new Obstacle(500, 700, 300, 200));

  /**
   * Handle the buttons
   */
  document.getElementById("add").onclick = function() {
    // Students Fill This In
    [...Array(10)].forEach(() => {
      let vr = Math.random() * Math.PI * 2;
      let vx = Math.cos(vr);
      let vy = Math.sin(vr);
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      for (let o of obstacles) {
        if (x > o.x && x < o.x + o.w && y > o.y && y < o.y + o.h) {
          x = o.x - 1;
          y = o.y - 1;
          break;
        }
      }
      theBoids.push(new Boid(x, y, vx, vy));
    });
  };
  document.getElementById("clear").onclick = function() {
    // Student Fill This In
    theBoids = [];
  };

  /**
   * The Actual Execution
   */
  function loop() {
    // change directions
    theBoids.forEach(boid => boid.steer(theBoids));
    // move forward
    speed = Number(speedSlider.value);
    alignWeight = Number(alignSlider.value);
    separationWeight = Number(separationSlider.value);
    cohesionWeight = Number(cohesionSlider.value);

    theBoids.forEach(function(boid) {
      /**
       * Students should replace this with collision code
       */

      let origx = boid.x;
      let origy = boid.y;
      boid.x += boid.vx * speed;
      boid.y += boid.vy * speed;
      if (boid.target) {
        boid.x += boid.vx * speed * 0.5;
        boid.y += boid.vy * speed * 0.5;
      }

      // make sure that we stay on the screen
      if (boid.x >= canvas.width - boid.size) {
        boid.x = canvas.width - boid.size - (boid.size - (canvas.width - boid.x));
        boid.vx = -boid.vx;
        boid.bounce();
      } else if (boid.x <= boid.size) {
        boid.x = boid.size + boid.size - boid.x;
        boid.vx = -boid.vx;
        boid.bounce();
      }
      if (boid.y >= canvas.height - boid.size) {
        boid.y = canvas.height - boid.size - (boid.size - (canvas.height - boid.y));
        boid.vy = -boid.vy;
        boid.bounce();
      } else if (boid.y <= boid.size) {
        boid.y = boid.size + boid.size - boid.y;
        boid.vy = -boid.vy;
        boid.bounce();
      }

      // collision with obstacles
      obstacles.forEach(o => {
        let minX = o.x - boid.size;
        let minY = o.y - boid.size;
        let maxX = o.x + o.w + boid.size;
        let maxY = o.y + o.h + boid.size;
        if (boid.x > minX && boid.x < maxX && boid.y > minY && boid.y < maxY) {
          if (origx < minX || origx > maxX) {
            boid.vx = -boid.vx;
          } else if (origy < minY || origy > maxY) {
            boid.vy = -boid.vy;
          } else {
            if (Math.abs(boid.x - minX) < boid.size) {
              boid.x = minX - 1;
            } else if (Math.abs(boid.x - o.x - o.w) < boid.size) {
              boid.x = maxX + 1;
            } else if (Math.abs(boid.y - minY) < boid.size) {
              boid.y = minY - 1;
            } else if (Math.abs(boid.y - o.y - o.h) < boid.size) {
              boid.y = maxY + 1;
            } else {
              boid.x = minX - boid.size;
              boid.y = minY - boid.size;
            }
            boid.vx = -boid.vx;
            boid.vy = -boid.vy;
          }
          boid.bounce();
        }
      });
    });
    // now we can draw
    draw();
    // and loop
    window.requestAnimationFrame(loop);
  }
  loop();
});
