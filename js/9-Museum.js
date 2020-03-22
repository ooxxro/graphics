/*jshint esversion: 6 */
// @ts-check

import * as THREE from "./THREE/src/Three.js";
import { OBJLoader } from "./THREE/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "./THREE/examples/jsm/controls/OrbitControls.js";

window.addEventListener("DOMContentLoaded", () => {
  /** @type{THREE.Scene} */
  let scene = new THREE.Scene();
  /** @type{number} */
  let wid = 700; // window.innerWidth;
  /** @type{number} */
  let ht = 500; // window.innerHeight;
  /** @type{THREE.PerspectiveCamera} */
  let main_camera = new THREE.PerspectiveCamera(60, wid / ht, 1, 100);
  main_camera.position.set(0, 4, 6);
  main_camera.rotation.set(-0.5, 0, 0);
  let active_camera = main_camera;
  /** @type{THREE.WebGLRenderer} */
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(wid, ht);
  renderer.shadowMap.enabled = true;

  let control = new OrbitControls(main_camera, renderer.domElement);

  document.getElementById("museum_area").appendChild(renderer.domElement);
  setupButtons();
  setupBasicScene();

  let T = THREE;

  // Here, we add a basic, simple first object to the museum.
  /**@type{THREE.Material} */
  let material = new THREE.MeshPhongMaterial({
    color: "#00aa00",
    shininess: 15,
    specular: "#00ff00"
  });
  /**@type{THREE.Geometry} */
  let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  /**@type{THREE.Mesh} */
  let cube = new THREE.Mesh(geometry, material);
  cube.position.set(2, 1.35, 2);
  cube.rotation.set(Math.PI / 4, 0, Math.PI / 4);
  cube.castShadow = true;

  // TODO: You need to create three more objects, and place them on pedestals.
  let loader = new OBJLoader();
  let astronautMaterial = new T.MeshStandardMaterial({
    color: "#ffd15c",
    roughness: 1
  });
  let astronaut;
  loader.load("/js/objects/astronaut.obj", _astronaut => {
    astronaut = _astronaut;
    astronaut.position.set(2, 2.2, -2);
    astronaut.scale.set(0.2, 0.2, 0.2);
    astronaut.traverse(node => {
      if (node.type && node.type === "Mesh") {
        node.material = astronautMaterial;
      }
      node.castShadow = true;
    });
    scene.add(astronaut);
  });
  let teapotMaterial = new T.MeshStandardMaterial({
    color: "#07badd"
  });
  let teapot;
  loader.load("/js/objects/teapot.obj", _teapot => {
    teapot = _teapot;
    teapot.position.set(-2, 1.6, 2);
    teapot.scale.set(0.02, 0.02, 0.02);
    teapot.traverse(node => {
      if (node.type && node.type === "Mesh") {
        node.material = teapotMaterial;
      }
      node.castShadow = true;
    });
    scene.add(teapot);
  });

  let snowman = createSnowman(T);
  snowman.position.set(-2, 1.3, -2);
  snowman.scale.set(0.3, 0.3, 0.3);
  scene.add(snowman);

  /**@type{THREE.SpotLight} */
  let spotlight_1 = new THREE.SpotLight(0xaaaaff, 1);
  spotlight_1.angle = Math.PI / 16;
  spotlight_1.position.set(2, 5, 2);
  spotlight_1.target = cube;
  spotlight_1.castShadow = true;
  scene.add(spotlight_1);

  // TODO: You need to place the lights.
  let spotlight_2 = new THREE.SpotLight(0xaaaaff, 1);
  spotlight_2.angle = Math.PI / 16;
  spotlight_2.position.set(-2, 5, -2);
  spotlight_2.target.position.set(-2, 0, -2);
  spotlight_2.castShadow = true;
  scene.add(spotlight_2);
  scene.add(spotlight_2.target);
  let spotlight_3 = new THREE.SpotLight(0xaaaaff, 1);
  spotlight_3.angle = Math.PI / 16;
  spotlight_3.position.set(2, 5, -2);
  spotlight_3.target.position.set(2, 0, -2);
  spotlight_3.castShadow = true;
  scene.add(spotlight_3);
  scene.add(spotlight_3.target);
  let spotlight_4 = new THREE.SpotLight(0xaaaaff, 1);
  spotlight_4.angle = Math.PI / 16;
  spotlight_4.position.set(-2, 5, 2);
  spotlight_4.target.position.set(-2, 0, 2);
  spotlight_4.castShadow = true;
  scene.add(spotlight_4);
  scene.add(spotlight_4.target);

  // TODO: You need to place these cameras.
  let camera_1 = new THREE.PerspectiveCamera(60, wid / ht, 1, 100);
  let camera_2 = new THREE.PerspectiveCamera(60, wid / ht, 1, 100);
  let camera_3 = new THREE.PerspectiveCamera(60, wid / ht, 1, 100);
  let camera_4 = new THREE.PerspectiveCamera(60, wid / ht, 1, 100);
  camera_1.position.set(0, 3, 0);
  camera_2.position.set(0, 3, 0);
  camera_3.position.set(0, 3, 0);
  camera_4.position.set(0, 3, 0);
  camera_1.lookAt(2, 2.2, 2);
  camera_2.lookAt(-2, 2.2, 2);
  camera_3.lookAt(2, 2.2, -2);
  camera_4.lookAt(-2, 2.2, -2);

  scene.add(cube);

  // finally, draw the scene. Also, add animation.
  renderer.render(scene, main_camera);
  function animate() {
    let radian = (performance.now() % (Math.PI * 2 * 500)) / 500;
    cube.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.005);
    cube.position.y = 1.7 + Math.sin(radian) * 0.1;
    if (astronaut) {
      astronaut.rotateOnWorldAxis(new T.Vector3(0, 1, 0), 0.005);
      astronaut.position.y = 2.2 + Math.sin(radian) * 0.1;
    }
    if (teapot) {
      teapot.rotateOnWorldAxis(new T.Vector3(0, 1, 0), 0.005);
      teapot.position.y = 1.7 + Math.sin(radian) * 0.1;
    }
    snowman.rotateOnWorldAxis(new T.Vector3(0, 1, 0), 0.005);
    snowman.position.y = 1.3 + Math.sin(radian) * 0.1;
    renderer.render(scene, active_camera);
    requestAnimationFrame(animate);
  }
  animate();

  // Simple wrapper function for code to set up the basic scene
  // Specifically, sets up the stuff students don't need to use directly.
  function setupBasicScene() {
    // make a ground plane.
    let geometry1 = new THREE.BoxGeometry(10, 0.1, 10);
    let material1 = new THREE.MeshStandardMaterial({
      color: "#dddddd",
      metalness: 0.2,
      roughness: 0.8
    });
    /**@type{THREE.Mesh} */
    let ground = new THREE.Mesh(geometry1, material1);
    ground.position.set(0, -1, 0);
    scene.add(ground);

    let locs = [-2, 2];
    /**@type{THREE.Geometry} */
    let geometry2 = new THREE.CylinderGeometry(0.5, 0.75, 2, 16, 8);
    /**@type{THREE.Material} */
    let material2 = new THREE.MeshPhongMaterial({ color: "#888888", shininess: 50 });
    locs.forEach(function(x_loc) {
      locs.forEach(function(z_loc) {
        /**@type{THREE.Mesh} */
        let object = new THREE.Mesh(geometry2, material2);
        object.position.x = x_loc;
        object.position.z = z_loc;
        object.position.y = 0;
        object.receiveShadow = true;

        scene.add(object);
      });
    });

    /**@type{THREE.AmbientLight} */
    let amb_light = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(amb_light);
  }

  function setupButtons() {
    document.getElementById("main_cam").onclick = function() {
      active_camera = main_camera;
      renderer.render(scene, active_camera);
    };
    document.getElementById("cam_1").onclick = function() {
      active_camera = camera_1;
      renderer.render(scene, active_camera);
    };
    document.getElementById("cam_2").onclick = function() {
      active_camera = camera_2;
      renderer.render(scene, active_camera);
    };
    document.getElementById("cam_3").onclick = function() {
      active_camera = camera_3;
      renderer.render(scene, active_camera);
    };
    document.getElementById("cam_4").onclick = function() {
      active_camera = camera_4;
      renderer.render(scene, active_camera);
    };
  }
});

/**
 *
 * @param {import('./THREE/src/Three.js')} T
 */
function createSnowman(T) {
  let g = new T.Group();

  // snowball
  let snowMaterial = new T.MeshStandardMaterial({
    color: "#fffafa",
    roughness: 1,
    metalness: 0.2
  });

  // bottom
  let bodyBottom = new T.Mesh(new T.SphereGeometry(1, 16, 16), snowMaterial);
  bodyBottom.position.set(0, 1, 0);
  g.add(bodyBottom);
  // middle
  let bodyMiddle = new T.Mesh(new T.SphereGeometry(0.8, 16, 16), snowMaterial);
  bodyMiddle.position.set(0, 2.4, 0);
  g.add(bodyMiddle);
  // head
  let head = new T.Mesh(new T.SphereGeometry(0.52, 16, 16), snowMaterial);
  head.position.set(0, 3.5, 0);
  g.add(head);

  // nose
  let nose = new T.Mesh(
    new T.ConeGeometry(0.2, 1, 16),
    new T.MeshStandardMaterial({
      color: "#f7b531",
      roughness: 1
    })
  );
  nose.position.set(0, head.position.y, 0.52);
  nose.rotation.x = Math.PI / 2;
  g.add(nose);

  // eyes
  let eyeGeo = new T.SphereGeometry(0.05, 16, 16);
  let eyeMaterial = new T.MeshStandardMaterial({
    color: 0,
    roughness: 1
  });
  let eyeLeft = new T.Mesh(eyeGeo, eyeMaterial);
  eyeLeft.position.set(
    Math.sin((Math.PI * 3) / 8) * Math.sin(Math.PI / 8) * 0.52,
    head.position.y + Math.cos((Math.PI * 3) / 8) * 0.52,
    Math.sin((Math.PI * 3) / 8) * Math.cos(Math.PI / 8) * 0.52
  );
  g.add(eyeLeft);
  let eyeRight = new T.Mesh(eyeGeo, eyeMaterial);
  eyeRight.position.set(
    Math.sin((Math.PI * 3) / 8) * Math.sin(-Math.PI / 8) * 0.52,
    head.position.y + Math.cos((Math.PI * 3) / 8) * 0.52,
    Math.sin((Math.PI * 3) / 8) * Math.cos(Math.PI / 8) * 0.52
  );
  g.add(eyeRight);

  // mouth
  let mouthGeo = new T.SphereGeometry(0.06);
  let mouth = new T.Mesh(mouthGeo, eyeMaterial);
  mouth.position.set(
    Math.sin(Math.PI * 0.67) * Math.sin(Math.PI * 0) * 0.52,
    head.position.y + Math.cos(Math.PI * 0.67) * 0.52,
    Math.sin(Math.PI * 0.67) * Math.cos(Math.PI * 0) * 0.52
  );
  g.add(mouth);

  // hat
  let hat = new T.Group();
  g.add(hat);
  hat.position.set(0.15, 3.85, 0);
  hat.rotateZ(-Math.PI / 8);
  let hatTopGeo = new T.CylinderGeometry(0.35, 0.35, 0.4, 16);
  let hatMaterial = new T.MeshStandardMaterial({ color: "#d61854", roughness: 1 });
  let hatTop = new T.Mesh(hatTopGeo, hatMaterial);
  hatTop.position.set(0, 0.2, 0);
  hat.add(hatTop);
  let hatMidGeo = new T.CylinderGeometry(0.351, 0.351, 0.2, 16);
  let hatMidMaterial = new T.MeshStandardMaterial({ color: "#fcc142", roughness: 1 });
  let hatMid = new T.Mesh(hatMidGeo, hatMidMaterial);
  hatMid.position.set(0, 0.1, 0);
  hat.add(hatMid);
  let hatRingGeo = new T.CylinderGeometry(0.6, 0.6, 0.1, 16);
  let hatRing = new T.Mesh(hatRingGeo, hatMaterial);
  hatRing.position.set(0, 0.05, 0);
  hat.add(hatRing);

  // arms
  let armGeo = new T.CylinderGeometry(0.05, 0.01, 1, 8);
  let armMaterial = new T.MeshStandardMaterial({
    color: "#8c4816",
    roughness: 1
  });
  let armLeft = new T.Mesh(armGeo, armMaterial);
  armLeft.position.set(1.1, bodyMiddle.position.y + 0.0, 0);
  armLeft.rotation.z = Math.PI / 3;
  g.add(armLeft);
  let armRight = new T.Mesh(armGeo, armMaterial);
  armRight.position.set(-1.1, bodyMiddle.position.y + 0.5, 0);
  armRight.rotation.z = (-Math.PI * 2) / 3;
  g.add(armRight);

  return g;
}
