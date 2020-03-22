/*jshint esversion: 6 */
// @ts-check

/**
 * Code for page 8
 */

import * as T from './THREE/src/Three.js';
import { OrbitControls } from './THREE/examples/jsm/controls/OrbitControls.js';
import { onWindowOnload } from '../Libs/helpers.js';

function snowman() {
  let renderer = new T.WebGLRenderer();
  renderer.setSize(500, 500);
  document.getElementById('snowman').appendChild(renderer.domElement);

  // student does the rest.
  let scene = new T.Scene();
  scene.background = new T.Color('skyblue');
  let camera = new T.PerspectiveCamera();
  camera.position.set(0, 5, 16);
  let control = new OrbitControls(camera, renderer.domElement);
  control.target.set(0, 3, 0);
  camera.lookAt(0, 3, 0);

  // add lights
  let pointLight = new T.PointLight('#fff', 0.5, 0, 2);
  pointLight.position.set(-10, 10, 15);
  scene.add(pointLight);
  let pointLight2 = new T.PointLight('#fff', 0.5, 0, 2);
  pointLight2.position.set(10, 10, 15);
  scene.add(pointLight2);
  let directionalLight = new T.DirectionalLight('#fff', 0.5);
  directionalLight.position.set(0, 5, -5);
  scene.add(directionalLight);
  let directionalLight2 = new T.DirectionalLight('#fff', 0.3);
  directionalLight2.position.set(-10, 50, 20);
  scene.add(directionalLight2);

  // add ground
  let ground = new T.Mesh(
    new T.BoxGeometry(50, 0.1, 50),
    new T.MeshStandardMaterial({
      color: '#3da334',
      roughness: 1
    })
  );
  ground.position.y = -0.05;
  scene.add(ground);
  let snowman1 = createSnowman(T);

  scene.add(snowman1);

  function draw() {
    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
  }
  draw();
}
onWindowOnload(snowman);

/**
 *
 * @param {import('./THREE/src/Three.js')} T
 */
function createSnowman(T) {
  let g = new T.Group();

  // snowball
  let snowMaterial = new T.MeshStandardMaterial({
    color: '#fffafa',
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
      color: '#f7b531',
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
  let hatMaterial = new T.MeshStandardMaterial({ color: '#d61854', roughness: 1 });
  let hatTop = new T.Mesh(hatTopGeo, hatMaterial);
  hatTop.position.set(0, 0.2, 0);
  hat.add(hatTop);
  let hatMidGeo = new T.CylinderGeometry(0.351, 0.351, 0.2, 16);
  let hatMidMaterial = new T.MeshStandardMaterial({ color: '#fcc142', roughness: 1 });
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
    color: '#8c4816',
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
