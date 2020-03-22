/*jshint esversion: 6 */
// @ts-check

import * as T from './THREE/src/Three.js';
import { GrObject } from './framework/GrObject.js';

// define your buildings here - remember, they need to be imported
// into the "main" program

let pyramidHipCount = 0;
export class PyramidHipHouse extends GrObject {
  constructor(params = {}) {
    const roofGeo = new T.Geometry();
    roofGeo.vertices.push(new T.Vector3(0, 2, 0));
    roofGeo.vertices.push(new T.Vector3(-1, 1, -1));
    roofGeo.vertices.push(new T.Vector3(1, 1, -1));
    roofGeo.vertices.push(new T.Vector3(1, 1, 1));
    roofGeo.vertices.push(new T.Vector3(-1, 1, 1));

    roofGeo.faceVertexUvs = [[]];
    const f1 = new T.Face3(3, 2, 0);
    roofGeo.faces.push(f1);
    roofGeo.faceVertexUvs[0].push([
      new T.Vector2(0, 0),
      new T.Vector2(1, 0),
      new T.Vector2(1 / 2, 1 / 2)
    ]);

    const f2 = new T.Face3(2, 1, 0);
    roofGeo.faces.push(f2);
    roofGeo.faceVertexUvs[0].push([
      new T.Vector2(0, 0),
      new T.Vector2(1, 0),
      new T.Vector2(1 / 2, 1 / 2)
    ]);

    const f3 = new T.Face3(1, 4, 0);
    roofGeo.faces.push(f3);
    roofGeo.faceVertexUvs[0].push([
      new T.Vector2(0, 0),
      new T.Vector2(1, 0),
      new T.Vector2(1 / 2, 1 / 2)
    ]);

    const f4 = new T.Face3(4, 3, 0);
    roofGeo.faces.push(f4);
    roofGeo.faceVertexUvs[0].push([
      new T.Vector2(0, 0),
      new T.Vector2(1, 0),
      new T.Vector2(1 / 2, 1 / 2)
    ]);

    roofGeo.computeFaceNormals();
    roofGeo.uvsNeedUpdate = true;

    const bottomGeo = new T.BoxGeometry(2, 1, 2);
    bottomGeo.faceVertexUvs = [[]];
    for (let i = 0; i < 6; ++i) {
      bottomGeo.faceVertexUvs[0].push([
        new T.Vector2(0, 1),
        new T.Vector2(0, 0),
        new T.Vector2(1, 1)
      ]);
      bottomGeo.faceVertexUvs[0].push([
        new T.Vector2(0, 0),
        new T.Vector2(1, 0),
        new T.Vector2(1, 1)
      ]);
    }

    const roofTex = new T.TextureLoader().load('/Images/roof-white.jpg');
    const doorTex = new T.TextureLoader().load('/Images/shop-facade.jpg');
    const windowTex = new T.TextureLoader().load('/Images/window-white.jpg');
    const bottomMat = [
      new T.MeshStandardMaterial({ map: windowTex }),
      new T.MeshStandardMaterial({ map: windowTex }),
      new T.MeshStandardMaterial({ color: 0xaaaaaa }),
      new T.MeshStandardMaterial({ color: 0xaaaaaa }),
      new T.MeshStandardMaterial({ map: doorTex }),
      new T.MeshStandardMaterial({ map: windowTex })
    ];
    const bottom = new T.Mesh(bottomGeo, bottomMat);
    bottom.translateY(0.5);

    const roofMat = new T.MeshStandardMaterial({
      map: roofTex,
      roughness: 0.75
    });
    const roof = new T.Mesh(roofGeo, roofMat);

    const house = new T.Group();
    house.add(bottom);
    house.add(roof);

    super('PyramidHipHouse' + pyramidHipCount++, house);

    this.house = house;
    this.house.position.x = params.x ? Number(params.x) : 0;
    this.house.position.y = params.y ? Number(params.y) : 0;
    this.house.position.z = params.z ? Number(params.z) : 0;
    const scale = params.size ? Number(params.size) : 1;
    this.house.scale.set(scale, scale, scale);
  }
}

let openGableCount = 0;
export class OpenGableHouse extends GrObject {
  constructor(params = {}) {
    const roofGeo = new T.Geometry();

    roofGeo.vertices.push(new T.Vector3(-1, 1, 0));
    roofGeo.vertices.push(new T.Vector3(1, 1, 0));
    roofGeo.vertices.push(new T.Vector3(1, 1.5, 0.5));
    roofGeo.vertices.push(new T.Vector3(1, 1, 1));
    roofGeo.vertices.push(new T.Vector3(-1, 1, 1));
    roofGeo.vertices.push(new T.Vector3(-1, 1.5, 0.5));

    roofGeo.faceVertexUvs = [[]];

    const f1 = new T.Face3(5, 1, 0);
    roofGeo.faces.push(f1);
    roofGeo.faceVertexUvs[0].push([new T.Vector2(1, 1), new T.Vector2(0, 0), new T.Vector2(1, 0)]);

    const f2 = new T.Face3(2, 1, 5);
    roofGeo.faces.push(f2);
    roofGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);

    const f3 = new T.Face3(3, 2, 5);
    roofGeo.faces.push(f3);
    roofGeo.faceVertexUvs[0].push([new T.Vector2(1, 0), new T.Vector2(1, 1), new T.Vector2(0, 1)]);

    const f4 = new T.Face3(3, 5, 4);
    roofGeo.faces.push(f4);
    roofGeo.faceVertexUvs[0].push([new T.Vector2(1, 0), new T.Vector2(0, 1), new T.Vector2(0, 0)]);

    const f5 = new T.Face3(4, 5, 0);
    roofGeo.faces.push(f5);

    const f6 = new T.Face3(1, 2, 3);
    roofGeo.faces.push(f6);
    roofGeo.computeFaceNormals();
    roofGeo.uvsNeedUpdate = true;

    const roofTex = new T.TextureLoader().load('/Images/roof-red.jpg');
    const doorTex = new T.TextureLoader().load('/Images/palace-facade.jpg');
    const windowTex = new T.TextureLoader().load('/Images/window-brown.jpg');

    const roofMat = new T.MeshStandardMaterial({ map: roofTex, roughness: 0.75 });

    const bottomGeo = new T.BoxGeometry(2, 1, 1);
    bottomGeo.faceVertexUvs = [[]];
    for (let i = 0; i < 6; ++i) {
      bottomGeo.faceVertexUvs[0].push([
        new T.Vector2(0, 1),
        new T.Vector2(0, 0),
        new T.Vector2(1, 1)
      ]);
      bottomGeo.faceVertexUvs[0].push([
        new T.Vector2(0, 0),
        new T.Vector2(1, 0),
        new T.Vector2(1, 1)
      ]);
    }

    const bottomMat = [
      new T.MeshStandardMaterial({ map: windowTex }),
      new T.MeshStandardMaterial({ map: doorTex }),
      new T.MeshStandardMaterial({ color: 0xaaaaaa }),
      new T.MeshStandardMaterial({ color: 0xaaaaaa }),
      new T.MeshStandardMaterial({ map: windowTex }),
      new T.MeshStandardMaterial({ map: windowTex })
    ];
    const bottom = new T.Mesh(bottomGeo, bottomMat);
    bottom.position.set(0, 0.5, 0.5);

    const roof = new T.Mesh(roofGeo, roofMat);

    const house = new T.Group();

    house.add(bottom);
    house.add(roof);
    super('OpenGableHouse' + openGableCount++, house);

    this.house = house;
    this.house.position.x = params.x ? Number(params.x) : 0;
    this.house.position.y = params.y ? Number(params.y) : 0;
    this.house.position.z = params.z ? Number(params.z) : 0;
    const scale = params.size ? Number(params.size) : 1;
    this.house.scale.set(scale, scale, scale);
  }
}

let flatHouseCount = 0;
export class FlatHouse extends GrObject {
  constructor(params = {}) {
    let roof = new T.TextureLoader().load('/Images/roof1.jpg');
    let door = new T.TextureLoader().load('/Images/door1.jpg');
    let window = new T.TextureLoader().load('/Images/window1.jpg');
    let roofGeo = new T.BoxGeometry(2.2, 0.1, 2.2);

    let bodyGeo = new T.BoxGeometry(2, 1, 1.99);
    bodyGeo.faceVertexUvs = [[]];
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    let bodyMat = [
      new T.MeshStandardMaterial({ map: window }),
      new T.MeshStandardMaterial({ map: window }),
      new T.MeshStandardMaterial({ color: '#6c5d62' }),
      new T.MeshStandardMaterial({ color: '#6c5d62' }),
      new T.MeshStandardMaterial({ map: window }),
      new T.MeshStandardMaterial({ map: door, roughness: 0 })
    ];
    let bodyMesh = new T.Mesh(bodyGeo, bodyMat);
    bodyMesh.translateY(0.5);

    let roofMat = new T.MeshStandardMaterial({ map: roof, roughness: 1 });
    let roofMesh = new T.Mesh(roofGeo, roofMat);
    roofMesh.translateY(1.05);

    const house = new T.Group();
    house.add(bodyMesh);
    house.add(roofMesh);

    super('FlatHouse' + flatHouseCount++, house);
    this.house = house;
    this.house.position.x = params.x ? Number(params.x) : 0;
    this.house.position.y = params.y ? Number(params.y) : 0;
    this.house.position.z = params.z ? Number(params.z) : 0;
    const scale = params.size ? Number(params.size) : 1;
    this.house.scale.set(scale, scale, scale);
  }
}

let overlaidHipCount = 0;
export class OverlaidHipHouse extends GrObject {
  constructor(params = {}) {
    let roof = new T.TextureLoader().load('/Images/roof2.jpg');
    let door = new T.TextureLoader().load('/Images/door2.jpg');
    let window = new T.TextureLoader().load('/Images/window2.jpg');

    let roofGeo = new T.Geometry();

    roofGeo.vertices.push(new T.Vector3(-1, 1, 0));
    roofGeo.vertices.push(new T.Vector3(1, 1, 0));
    roofGeo.vertices.push(new T.Vector3(1, 3 / 2, 1 / 2));
    roofGeo.vertices.push(new T.Vector3(1, 1, 1));
    roofGeo.vertices.push(new T.Vector3(-1, 1, 1));
    roofGeo.vertices.push(new T.Vector3(-1, 3 / 2, 1 / 2));

    roofGeo.faceVertexUvs = [[]];

    let f1 = new T.Face3(5, 1, 0);
    roofGeo.faces.push(f1);
    roofGeo.faceVertexUvs[0].push([new T.Vector2(1, 1), new T.Vector2(0, 0), new T.Vector2(1, 0)]);

    let f2 = new T.Face3(2, 1, 5);
    roofGeo.faces.push(f2);
    roofGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);

    let f3 = new T.Face3(3, 2, 5);
    roofGeo.faces.push(f3);
    roofGeo.faceVertexUvs[0].push([new T.Vector2(1, 0), new T.Vector2(1, 1), new T.Vector2(0, 1)]);

    let f4 = new T.Face3(3, 5, 4);
    roofGeo.faces.push(f4);
    roofGeo.faceVertexUvs[0].push([new T.Vector2(1, 0), new T.Vector2(0, 1), new T.Vector2(0, 0)]);

    let f5 = new T.Face3(4, 5, 0);
    roofGeo.faces.push(f5);

    let f6 = new T.Face3(1, 2, 3);
    roofGeo.faces.push(f6);
    roofGeo.computeFaceNormals();
    roofGeo.uvsNeedUpdate = true;

    let roofMat = new T.MeshStandardMaterial({ map: roof, roughness: 0.75 });

    let bodyGeo = new T.BoxGeometry(2, 1, 0.99);
    bodyGeo.faceVertexUvs = [[]];
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 1), new T.Vector2(0, 0), new T.Vector2(1, 1)]);
    bodyGeo.faceVertexUvs[0].push([new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1)]);

    let bodyMat = [
      new T.MeshStandardMaterial({ map: window }),
      new T.MeshStandardMaterial({ map: window }),
      new T.MeshStandardMaterial({ color: 'gray' }),
      new T.MeshStandardMaterial({ color: 'gray' }),
      new T.MeshStandardMaterial({ map: window }),
      new T.MeshStandardMaterial({ map: door, roughness: 0.0 })
    ];
    let bodyMesh = new T.Mesh(bodyGeo, bodyMat);
    bodyMesh.translateY(0.5);
    bodyMesh.translateZ(0.5);

    let roofMesh = new T.Mesh(roofGeo, roofMat);

    const house = new T.Group();
    house.add(bodyMesh);
    house.add(roofMesh);
    let roofMesh2 = new T.Mesh(roofGeo, roofMat);
    let bodyMesh2 = new T.Mesh(bodyGeo, bodyMat);
    bodyMesh2.rotateY(Math.PI / 2);
    roofMesh2.rotateY(Math.PI / 2);
    bodyMesh2.translateY(0.5);
    bodyMesh2.translateZ(0);
    roofMesh2.translateZ(-0.5);
    bodyMesh2.scale.x = 0.5;
    roofMesh2.scale.x = 0.5;
    house.add(bodyMesh2);
    house.add(roofMesh2);

    super('OverlaidHipHouse' + overlaidHipCount++, house);
    this.house = house;
    this.house.position.x = params.x ? Number(params.x) : 0;
    this.house.position.y = params.y ? Number(params.y) : 0;
    this.house.position.z = params.z ? Number(params.z) : 0;
    const scale = params.size ? Number(params.size) : 1;
    this.house.scale.set(scale, scale, scale);
  }
}
