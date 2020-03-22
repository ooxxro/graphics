/*jshint esversion: 6 */
// @ts-check

import { GrWorld } from "./framework/GrWorld.js";
import { GrObject } from "./framework/GrObject.js";
import * as Helpers from "../Libs/helpers.js";
import { PyramidHipHouse, OpenGableHouse, FlatHouse, OverlaidHipHouse } from "./6-1-buildings.js";

// your buildings are defined in another file... you should import them
// here

function test() {
  let world = new GrWorld({ where: document.getElementById("texture-houses") });

  // place your buildings and trees into the world here
  const pyramidHipHouse1 = new PyramidHipHouse({ x: 2, z: 2 });
  world.add(pyramidHipHouse1);
  const openGableHouse1 = new OpenGableHouse({ x: 2, z: -2 });
  world.add(openGableHouse1);
  const flatHouse1 = new FlatHouse({ x: -2, z: -2 });
  world.add(flatHouse1);
  const overlaidHouse1 = new OverlaidHipHouse({ x: -2, z: 2 });
  world.add(overlaidHouse1);

  world.go();
}
Helpers.onWindowOnload(test);
