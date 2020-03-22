/*jshint esversion: 6 */
// @ts-check

/**
 * Access to THREE's loaders within the CS559 framework
 */

import * as T from "../THREE/src/Three.js";
import {GrObject} from "./GrObject.js";
import { MTLLoader } from "../THREE/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "../THREE/examples/jsm/loaders/OBJLoader.js";
import { FBXLoader } from "../THREE/examples/jsm/loaders/FBXLoader.js";

/**
 * Rescale an object - assumes that the object is a group with 1 mesh in it
 * 
 * @param {THREE.Object3D} obj 
 */
function normObject(obj, scale=1.0, center=true, ground=true) {
    // since other bounding box things aren't reliable
    let box = new T.Box3();
    box.setFromObject(obj);
    // easier than vector subtract
    let dx = box.max.x-box.min.x;
    let dy = box.max.y-box.min.y;
    let dz = box.max.z-box.min.z;
    let size = Math.max(dx,dy,dz);
    let s = scale/size;
    obj.scale.set(s,s,s);

    if (center) {
        obj.translateX( - s * (box.max.x+box.min.x)/2 );
        obj.translateZ( - s * (box.max.z+box.min.z)/2 );
        if (!ground) {  // only center Y if not grounding
            obj.translateY( - s * (box.max.y+box.min.y)/2 );
        }
    }
    if (ground) {
        obj.translateY( - box.min.y * s);
    }
}

/**
 * A base class of GrObjects loaded from an OBJ file
 * note: this has to deal with the deferred loading
 * 
 * Warning: While ObjLoader2 might be better, ObjLoader is simpler
 */
export class ObjGrObject extends GrObject {
    /**
     * 
     * @param {Object} params 
     * @property {string} params.obj
     * @property {string} [params.mtl]
     * @property {Object} [params.mtloptions]
     * @property {Number} [norm] - normalize the object (make the largest dimension this value)
     * @property {Number} [x] - initial translate for the group
     * @property {Number} [y]
     * @property {Number} [z]
     * @property {String} [name]
     */
    constructor(params={}) {

        if (!params.obj) {
            alert("Bad OBJ object - no obj file given!");
            throw "No OBJ given!";
        }

        let name = params.name || "Objfile(UNNAMED)";
        let objholder = new T.Group();

        super(name,objholder); 

        // if there is a material, load it first, and then have that load the OBJ file
        if (params.mtl) {
            let mtloader = new MTLLoader();
            if (params.mtloptions) {
                mtloader.setMaterialOptions(params.mtloptions);
            }

            // note that the callback then calls the Obj Loader
            mtloader.load(params.mtl, function(myMaterialCreator) {
                myMaterialCreator.preload();
                let objLoader = new OBJLoader();
                objLoader.setMaterials(myMaterialCreator);
                objLoader.load(params.obj,function(obj) {
                    if (params.norm)
                        normObject(obj, params.norm);
                    objholder.add(obj);
                });
            });

        } else {    // no material file, just an obj
            let objLoader = new OBJLoader();
            objLoader.load(params.obj,function(obj) {
                if (params.norm)
                    normObject(obj, params.norm);
                objholder.add(obj);
            });
        }
        objholder.translateX(params.x || 0);
        objholder.translateY(params.y || 0);
        objholder.translateZ(params.z || 0);
    }
}

/* load from an FBX file */
export class FbxGrObject extends GrObject {
    /**
     * 
     * @param {Object} [params] 
     * @property {string} params.fbx
     * @property {Number} [norm] - normalize the object (make the largest dimension this value)
     * @property {Number} [x] - initial translate for the group
     * @property {Number} [y]
     * @property {Number} [z]
     * @property {String} [name]
     */
    constructor(params={}) {
        let name = params.name || "FBXfile(UNNAMED)";
        let objholder = new T.Group();
        super(name,objholder); 

        let fbx = new FBXLoader();
        fbx.load(params.fbx, function(obj) {
            if (params.norm)
                normObject(obj, params.norm);
            objholder.add(obj);
        });
        objholder.translateX(params.x || 0);
        objholder.translateY(params.y || 0);
        objholder.translateZ(params.z || 0);
    }
}