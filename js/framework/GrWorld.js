/*jshint esversion: 6 */
// @ts-check

/**
 * CS559 3D World Framework Code
 * 
 * GrWorld - bascially a wrapper around scene, except that it uses
 *      GrObject instead of Object3D (GrObjects have Object3D)
 * 
 * To make things simple, this keeps a renderer and a default camera.
 * Of course, that might complicate things if you want to have multiple
 * renderers and cameras
 * 
 * Basically, this keeps some of the basic stuff you need when you use
 * three.
 */

/** @module GrWorld */

// we need to have the BaseClass definition
import { GrObject } from "./GrObject.js";
import { insertElement } from "../../Libs/inputHelpers.js";
import { SimpleGroundPlane } from "./GroundPlane.js";
import * as T from "../THREE/src/Three.js";
import { OrbitControls } from "../THREE/examples/jsm/controls/OrbitControls.js";

/**
 * Document the parameters for making a world - all are optional
 * we'll guess at something if you don't give it to us
 * @typedef GrWorldProperties
 * @property [camera] - use this camera if passed
 * @property [fov] - camera property if we make one
 * @property [near] - camera property if we make one
 * @property [far]  - camera property if we make one
 * @property [renderer] - if you don't give one, we'll make it
 * @property [renderparams] - parameters for making the renderer
 * @property [width] - canvas size 
 * @property [height] - canvas size
 * @property [where] - where in the DOM to insert things
 * @property [lights] - a list of lights, or else default ones are made
 * @property [lightBrightness=.75] - brightness of the default lights
 * @property [lightColoring="cool-to-warm"] - either "c"ool-to-warm, "w"hite, or e"x"treme
 * @property [sideLightColors] - to make extreme lighting
 * @property [ambient=.5] - brightness of the ambient light in default light
 * @property [groundplane] - can be a groundplane, or False (otherwise, one gets made)
 * @property [groundplanecolor="green"] - if we create a ground plane, what color
 * @property [groundplanesize=5] - if we create a ground plane, how big
 * @property [lookfrom] - where to put the camera (only if we make the camera)
 * @property [lookat] - where to have the camera looking (only if we make the camera)
 * @property {HTMLInputElement} [runbutton] - a checkbox (HTML) to switch things on or off (can be undefined)
 * @property {HTMLInputElement} [speedcontrol] - a slider to get the speed (must be an HTML element, not a LabelSlider)
 */

 /** @class GrWorld
  * 
  * The GrWorld is basically a wrapper around THREE.js's `scene`,
  * except that it keeps a list of `GrObject` rather than `Object3D`.
  * 
  * It contains a `scene` (and it puts things into it for you). 
  * It also contains a `renderer` and a `camera`.
  * 
  * When this creates a renderer, it places it into the dom (see the `where` option).
  * 
  * By default, the world is created with a reasonable default `renderer`,
  * `camera` and `groundplane`. Orbit controls are installed. 
  */
export class GrWorld {
    /**
     * Construct an empty world
     * @param {GrWorldProperties} params 
     */
    constructor(params={}) {
        /** @type {Number} */
        this.objCount = 0;

        // mainly a set for checking object name legality
        /** @type {Object} */
        this.objNames = {};

        // this keeps a list of objects in the world
        /** @type Array<GrObject> */
        this.objects = [];

        // the GrWorld "has a" of the main things we need in three
        this.scene = new T.Scene();
        this.solo_scene = new T.Scene(); // secondary scene for showing a solo object.
        this.active_scene = this.scene; // active scene to draw.

        // make a renderer if it isn't given
        /** @type THREE.WebGLRenderer */
        this.renderer = "renderer" in params ? params.renderer :
            new T.WebGLRenderer("renderparams" in params ? params.renderparams : {} );

        // width and height are tricky, since they can come from many places
        let width = 600;
        let height= 400;
        // if the renderer was given, get its DOM
        if ("renderer" in params) {
            width = params.renderer.domElement.width;
            height = params.renderer.domElement.height;
        } else if (("renderparams" in params) && ("canvas" in params.renderparams)) {
            width = params.renderparams.canvas.width;
            height = params.renderparams.canvas.height;
        }
        // specified width/height overrides everything
        if ("width" in params) { width = params.width;}
        if ("height" in params) { height = params.height;}

        // get the light brightnesses
        if (!("lightBrightness" in params)) params.lightBrightness = 0.75;
        if (!("ambient" in params)) params.ambient=0.5;

        // make things be the right size
        this.renderer.setSize(width,height);

        // make a groundplane (or install a given one)
        // we do this before we made the camera, since it's useful for placing the camera
        if ("groundplane" in params) {
            this.groundplane = params.groundplane;
        } else {
            // the default is to create a groundplane
            this.groundplane = new SimpleGroundPlane(params.groundplanesize || 5, 0.2, params.groundplanecolor || "darkgreen");
            this.add(this.groundplane);
        }
   
        // make a camera
        /** @type {THREE.PerspectiveCamera} */
        this.camera = undefined;
        if ("camera" in params) {
            this.camera = params.camera;
        } else {
            this.camera = new T.PerspectiveCamera(
                ("fov" in params) ? params.fov : 45,
                width/height,
                ("near" in params) ? params.near : 0.1,
                ("far" in params) ? params.far : 2000
            );
            /* figure out a default lookat */
            let lookat = params.lookat;
            if (!("lookat" in params)) {
                lookat = new T.Vector3(0,0,0);
            }
            let lookfrom = params.lookfrom;
            if (!("lookat" in params)) {
                let gpSize = this.groundplane ? this.groundplane.size : 10;
                lookfrom = new T.Vector3(gpSize/2,gpSize,gpSize*2);
            }
            this.camera.position.copy(lookfrom);
            this.camera.lookAt(lookat);
            this.camera.name = "World Camera";
        }
        this.active_camera = this.camera;
        // create a camera for viewing a solo object.
        // This isn't something the user should worry about, so values are set directly.
        this.solo_camera = new T.PerspectiveCamera( 45, width/height, 0.1, 2000 );
        this.solo_camera.name = "Solo Camera";
        this.solo_camera.position.set(1, 1, 1);

        // make the controls
        if (this.active_camera.isPerspectiveCamera) {
            this.orbit_controls =  new OrbitControls(this.active_camera,this.renderer.domElement);
            this.orbit_controls.keys = {UP: 87, BOTTOM: 83, LEFT: 65, RIGHT: 68};
            // For some reason, this version of three is missing the saveState method.
            // Hack in something here to at least save something.
            let orbitSaveState = function() {
                this.position0 = new T.Vector3(this.object.position.x, this.object.position.y, this.object.position.z);
                this.target0   = this.target;
            };
            let orbitReset = function() {
                this.object.position.set(this.position0.x, this.position0.y, this.position0.z);
                this.target   = this.target0;
                this.update();
            };
            // @ts-ignore - we are adding the save state function
            this.orbit_controls.saveState = orbitSaveState;
            this.orbit_controls.reset = orbitReset;
            
            this.active_controls = this.orbit_controls;
            
            this.fly_controls = null;
            // We also want a pointer to active set of controls.
            this.active_controls = null;
        } // only make controls for PerspectiveCameras

        // if we either specify where things go in the DOM or we made our
        // own canvas, install it
        if ( ("where" in params) || ( !("renderer" in params) || ("renderparams" in params))) {
            insertElement(this.renderer.domElement, ("where" in params) ? params.where : undefined);
        }

        /**
         * Some Lights
         */
        if ("lights" in params) {
            if (params.lights.length) {
                params.lights.forEach(light => this.scene.add(light));
            }
            this.ambient = undefined;
        } else {
            this.ambient = new T.AmbientLight("white",params.ambient);
            this.scene.add(this.ambient);

            // colors for the three "key" lights - maybe be overridden with sideLightColors
            let leftColor = 0xFFFFFF;
            let rightColor = 0xFFFFFF;
            let bottomColor = 0xFFFFFF;
            
            switch ((params.lightColoring || "cool-to-warm")[0]) {
                case 'c':       // cool to warm
                case 'C':
                    leftColor = 0xFFF0C0;
                    rightColor = 0xC0F0FF;
                    bottomColor = 0xFFC0FF;
                    break;
                case 'x':       // extremely cool to wam
                case 'X':
                case 'e':
                case 'E':
                    leftColor = 0xFFE080;
                    rightColor = 0x80E0FF;
                    bottomColor = 0xFF80FF;
                    break;
                case 'W':
                case 'w':
                    break;
                default:
                    console.log(`Bad coloring ${params.lightColoring} to GrWorld - assuming white`);
            }

            // three lights - all a little off white to give some contrast
            let leftLight =  (params.sideLightColors) ? params.sideLightColors[0] : leftColor;
            let rightLight = (params.sideLightColors) ? params.sideLightColors[1] : rightColor;

            let dirLight1 = new T.DirectionalLight(leftLight,params.lightBrightness);
            dirLight1.position.set(1,1,-0.4);
            this.scene.add(dirLight1);
        
            let dirLight2 = new T.DirectionalLight(rightLight,params.lightBrightness);
            dirLight2.position.set(-1,1,-0.4);
            this.scene.add(dirLight2);   
            
            let bottomLight = new T.DirectionalLight(bottomColor,params.lightBrightness/3);
            bottomLight.position.set(0,-1,0.1);
            this.scene.add(bottomLight);
        }
        // add a pair of lights to the "solo" scene as well.
        this.solo_scene.add(new T.AmbientLight(0xfffff8, 0.6));
        this.solo_scene.add(new T.DirectionalLight(0xf8f8ff, 1.0));

        // Keep track of rendering timings
        this.lastRenderTime = 0;
        this.lastTimeOfDay = 12;

        // Track the "active" object, which we may follow, view solo, etc.
        /**@type GrObject */
        this.active_object = undefined;

        // Have a switch for turning things on and off
        /** @type {HTMLInputElement} */
        this.runbutton = params.runbutton;
        /** @type {HTMLInputElement} */
        this.speedcontrol = params.speedcontrol;
    } // end of constructor


    /**
     * Add an object to the world - this takes care of putting everything
     * into the scene, as well as assigning IDs
     * @param {GrObject} grobj 
     */
    add(grobj) {
        if (grobj.id) {
            console.warn(`Adding GrObj that already has an assigned ID. Object named "${grobj.name}"`);
        } else {
            grobj.id = this.objCount++;
        }

        if (grobj.name in this.objNames) {
            console.warn(`Adding GrObj with non-unique name. Object named "${grobj.name}"`);
        } else {
            this.objNames[grobj.name] = grobj;
        }

        this.objects.push(grobj);
        // be sure to add all the objects to the scene
        grobj.objects.forEach(element => {
            this.scene.add(element);
        });
    }

    /**
     * draw the default camera to the default renderer
     */
    draw() {
        this.lastRenderTime = performance.now();
        this.renderer.render(this.active_scene,this.active_camera);
    }

    /**
     * next tick of the clock: advance all of the objects
     */
    tick(delta, timeOfDay) {
        this.objects.forEach(obj => obj.tick(delta,timeOfDay));
    }

    /**
     * perform a cycle of the animation loop - this measures the time since the
     * last redraw and advances that much before redrawing
     */
    animate() {
        if (!this.runbutton || this.runbutton.checked) {
            let delta = performance.now() - this.lastRenderTime;
            let speed = this.speedcontrol ? Number(this.speedcontrol.value) : 1.0;
            this.tick(delta * speed,this.lastTimeOfDay);
        }
        // since we're already running an animation loop, update view controls here.
        // Pass in a delta since that's what fly controls want. Orbit controls can just ignore.
        if (this.active_controls)
        {
            // @ts-ignore       // this is an error since the argument is sometimes ignored
            this.active_controls.update(0.1);
        }
        this.draw();
    }

    /**
     * start an (endless) animation loop - this just keeps going
     */
    go() {
        // remember, this gets redefined (it doesn't follow scope rules)
        let self=this;
        function loop() {
            self.animate();
            // self.draw();     // animate does the draw
            window.requestAnimationFrame(loop);
        }
        loop();
    }
}
