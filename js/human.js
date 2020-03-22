/**
 *
 * @param {import('./THREE/src/Three.js')} T
 */
export default function drawHuman(T) {
  const root = new T.Group();
  // materials
  const mat = new T.MeshStandardMaterial({
    color: '#fff',
    metalness: 0,
    roughness: 1,
  });

  // body
  const body = new T.Mesh(new T.CylinderBufferGeometry(0.008, 0.008, 0.1), mat);
  body.castShadow = true;
  body.receiveShadow = true;
  body.position.y = 0.09;
  root.add(body);

  // head
  const head = new T.Mesh(new T.SphereBufferGeometry(0.03), mat);
  head.castShadow = true;
  head.receiveShadow = true;
  head.position.y = 0.16;
  root.add(head);

  // legs
  const legGeo = new T.CylinderBufferGeometry(0.008, 0.008, 0.05);
  const legLeft = new T.Mesh(legGeo, mat);
  legLeft.castShadow = true;
  legLeft.receiveShadow = true;
  legLeft.position.set(0.017, 0.023, 0);
  legLeft.rotateZ(Math.PI / 4);
  root.add(legLeft);
  const legRight = new T.Mesh(legGeo, mat);
  legRight.castShadow = true;
  legRight.receiveShadow = true;
  legRight.position.set(-0.017, 0.023, 0);
  legRight.rotateZ(-Math.PI / 4);
  root.add(legRight);

  // arms
  const armLeft = new T.Mesh(legGeo, mat);
  armLeft.castShadow = true;
  armLeft.receiveShadow = true;
  armLeft.position.set(0.017, 0.12, 0);
  armLeft.rotateZ(-Math.PI / 3);
  root.add(armLeft);
  const armRight = new T.Mesh(legGeo, mat);
  armRight.castShadow = true;
  armRight.receiveShadow = true;
  armRight.position.set(-0.017, 0.12, 0);
  armRight.rotateZ(Math.PI / 3);
  root.add(armRight);

  // parachute
  const parachute = drawParachute(T, { color: 'orange' });
  parachute.visible = false;
  root.add(parachute);
  root.parachute = parachute;

  return root;
}

/**
 *
 * @param {import('./THREE/src/Three.js')} T
 */
export function drawParachute(T, shellParam) {
  shellParam = Object.assign(
    {
      color: 0xc0c0c0,
      roughness: 1,
      metalness: 0,
    },
    shellParam
  );

  const root = new T.Group();
  const upper = new T.Group();
  upper.scale.set(1.5, 1, 1);
  root.add(upper);

  const shellPoints = [];
  for (let i = 0; i <= 0.8; i += 0.1) {
    shellPoints.push(new T.Vector2(i, 0.8 * (1 - Math.sqrt(1 - i * i))));
  }
  const shellGeo = new T.LatheGeometry(shellPoints, 6);
  shellGeo.scale(0.3, 0.4, 0.3);
  shellGeo.rotateY(Math.PI / 6);
  shellGeo.rotateX(Math.PI);
  const shellMet = new T.MeshStandardMaterial(
    Object.assign(shellParam, {
      side: T.DoubleSide,
    })
  );
  const shell = new T.Mesh(shellGeo, shellMet);
  shell.castShadow = true;
  shell.receiveShadow = true;
  // shell.rotation.x = Math.PI / 2;
  shell.position.y = 0.6;
  // shell.position.z = 0.1;
  upper.add(shell);

  // rope
  const ropeGeo = new T.BoxBufferGeometry(0.003, 0.3, 0.003);
  const ropeMat = new T.MeshStandardMaterial({ color: '#fff' });
  for (let i = 0; i < 6; ++i) {
    const rope = new T.Mesh(ropeGeo, ropeMat);
    rope.rotation.y = (Math.PI * i) / 3;
    rope.rotation.z = 0.75;
    rope.translateY(0.36);
    rope.translateX(0.15);
    upper.add(rope);
  }

  // disk
  const diskGeo = new T.CylinderBufferGeometry(0.042, 0.042, 0.002);
  const disk = new T.Mesh(diskGeo, ropeMat);
  disk.position.y = 0.255;
  upper.add(disk);

  // hand rope
  const ropeLeft = new T.Mesh(ropeGeo, ropeMat);
  disk.add(ropeLeft);
  ropeLeft.scale.set(1, 0.43, 1);
  ropeLeft.rotateZ(-0.1);
  ropeLeft.position.set(0.033, -0.063, 0);
  const ropeRight = new T.Mesh(ropeGeo, ropeMat);
  disk.add(ropeRight);
  ropeRight.scale.set(1, 0.43, 1);
  ropeRight.rotateZ(0.1);
  ropeRight.position.set(-0.033, -0.063, 0);

  return root;
}
