/*jshint esversion: 6 */
// @ts-check

/**
 * Minimal Starter Code for the QuadCopter assignment
 */

import * as T from "./THREE/src/Three.js";
import { OrbitControls } from "./THREE/examples/jsm/controls/OrbitControls.js";
import { onWindowOnload } from "../Libs/helpers.js";
import drawAirplane from "./airplane.js";
import drawRadar from "./radar.js";
import drawHuman from "./human.js";

let renderer;
let camera;
function quadcopter() {
  renderer = new T.WebGLRenderer();
  renderer.setSize(800, 600);
  renderer.shadowMap.enabled = true;
  document.getElementById("parachute").appendChild(renderer.domElement);

  let scene = new T.Scene();
  scene.background = new T.Color("skyblue");
  camera = new T.PerspectiveCamera(
    40,
    renderer.domElement.width / renderer.domElement.height,
    1,
    1000
  );

  camera.position.z = 10;
  camera.position.y = 5;
  camera.position.x = 5;
  camera.lookAt(0, 0, 0);

  // since we're animating, add OrbitControls
  new OrbitControls(camera, renderer.domElement);

  scene.add(new T.AmbientLight("white", 0.2));

  // two lights - both a little off white to give some contrast
  let dirLight1 = new T.DirectionalLight(0xf0e0d0, 1);
  dirLight1.position.set(10, 10, 0);
  dirLight1.castShadow = true;
  // const d = 10;
  // dirLight1.shadow.camera.left = -d;
  // dirLight1.shadow.camera.right = d;
  // dirLight1.shadow.camera.top = d;
  // dirLight1.shadow.camera.bottom = -d;
  // scene.add(new T.CameraHelper(dirLight1.shadow.camera));
  scene.add(dirLight1);

  let dirLight2 = new T.DirectionalLight(0xd0e0f0, 1);
  dirLight2.position.set(-1, 1, -0.2);
  scene.add(dirLight2);

  // make a ground plane
  let groundBox = new T.BoxGeometry(10, 0.1, 10);
  let groundMesh = new T.Mesh(
    groundBox,
    new T.MeshStandardMaterial({ color: 0x88b888, roughness: 0.9 })
  );
  // put the top of the box at the ground level (0)
  groundMesh.position.y = -0.05;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // this is the part the student should change
  let _airplane1 = drawAirplane(T, { color: "pink" });
  _airplane1.rotateY(-Math.PI / 2);
  _airplane1.rotateX(0.3);
  const airplane1 = new T.Group();
  airplane1.add(_airplane1);
  airplane1.position.x = 3;
  airplane1.position.y = 3;
  scene.add(airplane1);

  const radar1 = drawRadar(T, { color: "pink" });
  radar1.scale.set(0.3, 0.3, 0.3);
  radar1.position.x = 3;
  radar1.position.z = 1;
  scene.add(radar1);

  let _airplane2 = drawAirplane(T, { color: "aqua" });
  _airplane2.rotateY(-Math.PI / 2);
  _airplane2.position.y = 0.2;
  const airplane2 = new T.Group();
  airplane2.add(_airplane2);
  airplane2.position.set(-3, 0, 3);
  airplane2.rotation.y = Math.PI / 2;
  scene.add(airplane2);

  const radar2 = drawRadar(T, { color: "aqua" });
  radar2.scale.set(0.3, 0.3, 0.3);
  radar2.position.x = 3;
  radar2.position.z = -1;
  scene.add(radar2);

  // runway
  const runway = new T.Mesh(
    new T.BoxBufferGeometry(8, 0.001, 1),
    new T.MeshStandardMaterial({ color: "#888", roughness: 1 })
  );
  runway.receiveShadow = true;
  runway.position.set(0, 0, 3);
  scene.add(runway);
  const runwayLineGeo = new T.BoxBufferGeometry(0.5, 0.001, 0.05);
  const runwayLineMat = new T.MeshStandardMaterial({
    color: "#fff",
    roughness: 1
  });
  for (let i = 0; i < 8; ++i) {
    const line = new T.Mesh(runwayLineGeo, runwayLineMat);
    line.receiveShadow = true;
    line.position.set(-3.5 + i, 0.0001, 3);
    scene.add(line);
  }

  const human1 = drawHuman(T);
  human1.visible = false;
  scene.add(human1);

  // states
  let planeState = "move";
  let humansState = "wait";
  let human1State = "";
  let humans = [...Array(5)].map(() => drawHuman(T));
  humans.forEach((human, i) => {
    human.position.set(0, 0, 4 + 0.2 * i);
    scene.add(human);
  });

  function animateHuman1() {
    switch (human1State) {
      case "dive":
        if (human1.position.y >= 1.5) {
          human1.v += 0.001;
          human1.position.y -= human1.v;
        } else if (human1.position.y > 0) {
          human1.parachute.visible = true;
          human1.position.y -= 0.01;
        } else {
          human1.parachute.visible = false;
          human1.position.y = 0;
          human1State = "walkBackHome";
        }
        break;
      case "walkBackHome":
        if (human1.position.z < 4.6) {
          human1.position.z += 0.012;
          if (human1.position.z < 4 && human1.position.x < 0.8) {
            human1.position.x += 0.006;
          }
        } else if (human1.position.x > 0) {
          human1.position.x -= 0.012;
        } else {
          human1.position.x = 0;
          human1.visible = false;
          humans[humans.length - 2].visible = true;
          humansState = "wait";
        }
        break;
    }
  }
  function animateHumans() {
    switch (humansState) {
      case "wait":
        break;
      case "startBoarding":
        // human1.visible = true;
        // humans[0].visible = false;
        // human1.position.set(0, 0, 4);
        humansState = "boarding";
        break;
      case "boarding":
        // human1.position.z -= 0.005;
        humans.forEach(human => (human.position.z -= 0.005));
        if (humans[1].position.z <= 4) {
          humansState = "wait";
          planeState = "startTakeoff";
        }
        break;
      default:
    }
  }
  function animatePlane() {
    switch (planeState) {
      case "move": // on floor, move from start to middle
        airplane2.position.x += 0.03;
        if (airplane2.position.x >= -0.5) {
          airplane2.position.x = -0.5;
          planeState = "wait";
          humansState = "startBoarding";
        }
        break;
      case "wait":
        break;
      case "startTakeoff":
        humans[0].position.z -= 0.005;
        humans[0].position.y += 0.001;
        if (humans[0].position.z <= 3) {
          if (humans[humans.length - 1].visible) {
            humans[humans.length - 1].visible = false;
          } else {
            humans[humans.length - 2].visible = false;
          }
          humans.forEach((human, i) => {
            human.position.set(0, 0, 4 + 0.2 * i);
          });
          planeState = "takeoff";
          airplane2.v = 0.001;
        }
        break;
      case "takeoff":
        airplane2.position.x += airplane2.v;
        airplane2.v += 0.002;
        if (airplane2.position.x >= 3) {
          planeState = "fly1";
          airplane2.theta = Math.PI / 2;
          _airplane2.rotation.z = 0.1;
        }
        break;
      case "fly1":
        airplane2.position.y += 0.02;
        if (airplane2.theta > 0) {
          airplane2.theta -= 0.03;
          airplane2.position.x = 3 + 3 * Math.cos(airplane2.theta);
          airplane2.position.z = 3 * Math.sin(airplane2.theta);
          airplane2.rotation.y = Math.PI - airplane2.theta;
        } else if (airplane2.theta > -Math.PI / 2) {
          airplane2.theta -= 0.02;
          airplane2.position.x = 6 * Math.cos(airplane2.theta);
          airplane2.position.z = 6 * Math.sin(airplane2.theta);
          airplane2.rotation.y = Math.PI - airplane2.theta;
        } else {
          planeState = "fly2-s";
        }
        break;
      case "fly2-s":
        airplane2.position.y += 0.02;
        airplane2.position.x -= 0.08;
        if (airplane2.position.x <= -3) {
          planeState = "fly3-c";
        }
        break;
      case "fly3-c":
        airplane2.position.y += 0.02;
        airplane2.theta -= 0.03;
        airplane2.position.x = -3 + 3 * Math.cos(airplane2.theta);
        airplane2.position.z = -3 + 3 * Math.sin(airplane2.theta);
        airplane2.rotation.y = Math.PI - airplane2.theta;
        if (airplane2.theta <= Math.PI * -1.5) {
          planeState = "fly4-s";
          _airplane2.rotation.z = 0;
        }
        break;
      case "fly4-s":
        airplane2.position.x += 0.03;
        if (airplane2.position.x < 0.03 && airplane2.position.x >= 0) {
          human1.position.set(0, airplane2.position.y, 0);
          human1.visible = true;
          human1.v = 0;
          human1State = "dive";
        }
        if (airplane2.position.x >= 3) {
          _airplane2.rotation.z = -0.1;
          planeState = "fly5-c";
          airplane2.theta = Math.PI / 2;
        }
        break;
      case "fly5-c":
        airplane2.position.y -= 0.02;
        airplane2.theta -= 0.03;
        airplane2.position.x = 3 + 3 * Math.cos(airplane2.theta);
        airplane2.position.z = -3 + 3 * Math.sin(airplane2.theta);
        airplane2.rotation.y = Math.PI - airplane2.theta;
        if (airplane2.theta <= -Math.PI / 2) {
          planeState = "fly6-s";
        }
        break;
      case "fly6-s":
        airplane2.position.y -= 0.02;
        airplane2.position.x -= 0.08;
        if (airplane2.position.x <= 0) {
          planeState = "fly7-c";
        }
        break;
      case "fly7-c":
        airplane2.position.y -= 0.02;
        if (airplane2.theta > Math.PI * -1) {
          airplane2.theta -= 0.02;
          airplane2.position.x = 6 * Math.cos(airplane2.theta);
          airplane2.position.z = 6 * Math.sin(airplane2.theta);
          airplane2.rotation.y = Math.PI - airplane2.theta;
        } else if (airplane2.theta > Math.PI * -1.5) {
          airplane2.theta -= 0.03;
          airplane2.position.x = -3 + 3 * Math.cos(airplane2.theta);
          airplane2.position.z = 3 * Math.sin(airplane2.theta);
          airplane2.rotation.y = Math.PI - airplane2.theta;
        } else {
          _airplane2.rotation.z = 0;
          airplane2.position.y = 0;
          planeState = "move";
        }
        break;
    }
  }

  function animateLoop() {
    //** EXAMPLE CODE - STUDENT SHOULD REPLACE */
    // move in a circle
    let theta = performance.now() / 1000;
    let x = 3 * Math.cos(theta);
    let z = 3 * Math.sin(theta);
    airplane1.position.x = x;
    airplane1.position.z = z;
    airplane1.rotation.y = -theta;

    _airplane1.animate();
    radar1.lookAt(airplane1);
    _airplane2.animate();
    radar2.lookAt(airplane2);

    animateHumans();
    animatePlane();
    animateHuman1();

    renderer.render(scene, camera);
    window.requestAnimationFrame(animateLoop);
  }
  animateLoop();
}
onWindowOnload(quadcopter);
