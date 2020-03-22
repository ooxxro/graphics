/**
 *
 * @param {import('./THREE/src/Three.js')} T
 * @param {*} param1
 */
export default function drawRadar(T, shellParam) {
  shellParam = Object.assign(
    {
      color: 0xc0c0c0,
      roughness: 0.6,
    },
    shellParam
  );
  const root = new T.Group();

  const head = new T.Group();
  root.add(head);

  const shellPoints = [];
  for (let i = 0; i <= 0.8; i += 0.1) {
    shellPoints.push(new T.Vector2(i, 0.8 * (1 - Math.sqrt(1 - i * i))));
  }
  const shellGeo = new T.LatheGeometry(shellPoints, 16);
  shellGeo.rotateX(Math.PI / 2);
  const shellMet = new T.MeshStandardMaterial(
    Object.assign(shellParam, {
      side: T.DoubleSide,
    })
  );
  const shell = new T.Mesh(shellGeo, shellMet);
  shell.castShadow = true;
  shell.receiveShadow = true;
  // shell.rotation.x = Math.PI / 2;
  // shell.position.y = 0.8;
  shell.position.z = 0.1;
  head.add(shell);

  const antennaGeo = new T.CylinderGeometry(0.05, 0.08, 0.8);
  antennaGeo.rotateX(Math.PI / 2);
  const antenna = new T.Mesh(
    antennaGeo,
    new T.MeshStandardMaterial(shellParam)
  );
  antenna.castShadow = true;
  antenna.receiveShadow = true;
  // antenna.position.y = 0.8;
  antenna.position.z = 0.6;
  head.add(antenna);

  const headShaft = new T.Mesh(
    new T.SphereGeometry(0.2, 16, 16),
    new T.MeshStandardMaterial(shellParam)
  );
  headShaft.castShadow = true;
  headShaft.receiveShadow = true;
  // headShaft.position.y = 0.8;
  head.position.y = 0.8;
  head.add(headShaft);

  const standGroup = new T.Group();
  root.add(standGroup);

  const standTopGeo = new T.CylinderGeometry(0.08, 0.08, 0.4);
  const standTop = new T.Mesh(
    standTopGeo,
    new T.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.8,
    })
  );
  standTop.castShadow = true;
  standTop.receiveShadow = true;
  standTop.position.y = 0.5;
  standTop.rotation.y = Math.PI / 4;
  standGroup.add(standTop);
  const standBaseGeo = new T.CylinderGeometry(0.2, 0.4, 0.4, 4);
  const standBase = new T.Mesh(
    standBaseGeo,
    new T.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.8,
    })
  );
  standBase.castShadow = true;
  standBase.receiveShadow = true;
  standBase.position.y = 0.2;
  standBase.rotation.y = Math.PI / 4;
  standGroup.add(standBase);

  root.lookAt = target => {
    head.lookAt(target.position);
  };

  return root;
}
