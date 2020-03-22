/**
 *
 * @param {import('./THREE/src/Three.js')} T
 */
export default function drawAirplane(T, bodyParam) {
  bodyParam = Object.assign(
    {
      color: '#fff',
    },
    bodyParam
  );
  const root = new T.Group();

  // body
  const bodyGeo = new T.SphereBufferGeometry(1, 16, 30);
  bodyGeo.scale(1, 0.2, 0.2);
  const bodyMat = new T.MeshStandardMaterial(bodyParam);
  const body = new T.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  root.add(body);

  // wing left
  const wingGeo = new T.CylinderBufferGeometry(0.1, 0.3, 1, 4);
  wingGeo.rotateY(Math.PI / 4);
  wingGeo.scale(1, 1, 0.3);
  const wingLeft = new T.Mesh(wingGeo, bodyMat);
  wingLeft.castShadow = true;
  wingLeft.rotateX(-Math.PI / 2 + 0.1);
  wingLeft.rotateZ(0.2);
  wingLeft.position.z = -0.6;
  root.add(wingLeft);
  // wing right
  const wingRight = new T.Mesh(wingGeo, bodyMat);
  wingRight.castShadow = true;
  wingRight.rotateX(Math.PI / 2 - 0.1);
  wingRight.rotateZ(0.2);
  wingRight.position.z = 0.6;
  root.add(wingRight);

  // tail left
  const tailGeo = new T.CylinderBufferGeometry(0.05, 0.15, 0.3, 4);
  tailGeo.rotateY(Math.PI / 4);
  tailGeo.scale(1, 1, 0.3);
  const tailLeft = new T.Mesh(tailGeo, bodyMat);
  tailLeft.castShadow = true;
  tailLeft.rotateX(-Math.PI / 2);
  tailLeft.rotateZ(0.3);
  tailLeft.position.x = -0.9;
  tailLeft.position.z = -0.2;
  root.add(tailLeft);
  // tail right
  const tailRight = new T.Mesh(tailGeo, bodyMat);
  tailRight.castShadow = true;
  tailRight.rotateX(Math.PI / 2);
  tailRight.rotateZ(0.3);
  tailRight.position.x = -0.9;
  tailRight.position.z = 0.2;
  root.add(tailRight);
  // tail top
  const tailTop = new T.Mesh(tailGeo, bodyMat);
  tailTop.castShadow = true;
  tailTop.rotateZ(0.3);
  tailTop.position.x = -0.9;
  tailTop.position.y = 0.2;
  root.add(tailTop);

  // propeller
  const propellerLeft = drawPropeller(T);
  propellerLeft.position.set(0.18, 0, -0.6);
  root.add(propellerLeft);
  const propellerRight = drawPropeller(T);
  propellerRight.position.set(0.18, 0, 0.6);
  root.add(propellerRight);

  // wheels
  const wheels = new T.Group();
  // wheels.visible = false;
  root.wheels = wheels;
  root.add(wheels);
  const wheelGeo = new T.CylinderBufferGeometry(0.05, 0.05, 0.05);
  wheelGeo.rotateX(Math.PI / 2);
  const wheelMat = new T.MeshStandardMaterial({ color: '#333', roughness: 1 });
  const wheelLeft = new T.Mesh(wheelGeo, wheelMat);
  wheelLeft.position.set(0.4, -0.15, -0.12);
  wheels.add(wheelLeft);
  const wheelRight = new T.Mesh(wheelGeo, wheelMat);
  wheelRight.position.set(0.4, -0.15, 0.12);
  wheels.add(wheelRight);
  const wheelRear = new T.Mesh(wheelGeo, wheelMat);
  wheelRear.position.set(-0.6, -0.15, 0);
  wheels.add(wheelRear);

  root.animate = (leftTheta = 0.3, rightTheta = 0.3) => {
    propellerLeft.propellers.rotation.x += leftTheta;
    propellerRight.propellers.rotation.x += rightTheta;
  };

  return root;
}

/**
 *
 * @param {import('./THREE/src/Three.js')} T
 */
export function drawPropeller(T) {
  const root = new T.Group();
  // materials
  const mat = new T.MeshStandardMaterial({ color: 'darkgray' });

  // shaft
  const shaftGeo = new T.SphereBufferGeometry(0.1);
  shaftGeo.scale(1, 0.3, 0.3);
  const shaft = new T.Mesh(
    shaftGeo,
    new T.MeshStandardMaterial({ color: 'gray' })
  );
  shaft.castShadow = true;
  root.add(shaft);

  // propellers
  const propellers = new T.Group();
  root.add(propellers);
  root.propellers = propellers;
  const propellerGeo = new T.SphereBufferGeometry(0.1, 8, 16);
  propellerGeo.scale(0.1, 1, 0.2);

  const propeller1 = new T.Mesh(propellerGeo, mat);
  propeller1.castShadow = true;
  propeller1.translateX(0.05);
  propeller1.translateY(0.09);
  propellers.add(propeller1);

  const propeller2 = new T.Mesh(propellerGeo, mat);
  propeller2.castShadow = true;
  propeller2.rotateX((Math.PI * 2) / 3);
  propeller2.translateX(0.05);
  propeller2.translateY(0.09);
  propellers.add(propeller2);

  const propeller3 = new T.Mesh(propellerGeo, mat);
  propeller3.castShadow = true;
  propeller3.rotateX((Math.PI * 4) / 3);
  propeller3.translateX(0.05);
  propeller3.translateY(0.09);
  propellers.add(propeller3);

  return root;
}
