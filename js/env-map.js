/*jshint esversion: 6 */
// @ts-check

// get things we may need
import { GrWorld } from "./Framework/GrWorld.js";
import { GrObject } from "./Framework/GrObject.js";
import * as InputHelpers from "./Libs/inputHelpers.js";
import * as Helpers from "./Libs/helpers.js";
import * as T from "./THREE/src/Three.js";

class Ball extends GrObject {
  constructor() {
    const geo = new T.SphereGeometry(2, 32, 32);
    const texture = new T.CubeTextureLoader().load([
      "/js/theater/Right.png",
      "/js/theater/Left.png",
      "/js/theater/Top.png",
      "/js/theater/Bottom.png",
      "/js/theater/Front.png",
      "/js/theater/Back.png"
    ]);
    const mat = new T.MeshStandardMaterial({
      envMap: texture,
      metalness: 1,
      roughness: 0
    });
    const mesh = new T.Mesh(geo, mat);
    mesh.position.y = 2;
    super("Ball", mesh);
    this.mesh = mesh;
  }
}

function test() {
  let parentOfCanvas = document.getElementById("env-map-container");
  let world = new GrWorld({ groundplane: false, where: parentOfCanvas });

  const texture = new T.CubeTextureLoader().load([
    "/js/theater/Right.png",
    "/js/theater/Left.png",
    "/js/theater/Top.png",
    "/js/theater/Bottom.png",
    "/js/theater/Front.png",
    "/js/theater/Back.png"
  ]);
  world.scene.background = texture;

  const ball = new Ball();
  world.add(ball);

  world.go();
}
Helpers.onWindowOnload(test);
