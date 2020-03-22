/** @module WorldController */
// these four lines fake out TypeScript into thinking that THREE
// has the same type as the T.js module, so things work for type checking
// type inferencing figures out that THREE has the same type as T
// and then I have to use T (not THREE) to avoid the "UMD Module" warning

import {GrWorld} from "./GrWorld.js";
import * as T from "../THREE/src/Three.js";

 /** @class WorldController
  * 
  * Class to hold code that the WorldUI uses to control the view of a GrWorld.
  * This acts as the controller in a MVC pattern for a graphics world.
  */
export class WorldController {
    /**
     * Construct an empty world
     * @param {GrWorld} world 
     */
    constructor(world) {
        /** @type {GrWorld} */
        this.world = world;
        this.solo_mode = false;
        this.view_mode = "Orbit Camera";

        // If the world has a perspective camera, we'll add controls to it.
        if (this.world.active_camera.isPerspectiveCamera) {
            if (T.FlyControls) {
                // Here, we create fly controls to attach to the world, if available.
                let fly_controls = new T.FlyControls(this.world.active_camera, this.world.renderer.domElement);
                fly_controls.dragToLook = true;
                fly_controls.rollSpeed = 0.1;
                fly_controls.dispose();
                let flySaveState = function() {
                    this.position0 = new T.Vector3(this.object.position.x, this.object.position.y, this.object.position.z);
                    this.rotation0 = new T.Euler(this.object.rotation.x, this.object.rotation.y, this.object.rotation.z, this.object.rotation.order);
                };
                let flyReset = function() {
                    if (this.position0)
                    {
                        this.object.position.set(this.position0.x, this.position0.y, this.position0.z);
                    }
                    if (this.rotation0)
                    {
                        this.object.rotation.set(this.rotation0.x, this.rotation0.y, this.rotation0.z, this.rotation0.order);
                    }
                    this.update(0.1);
                };
                let register = function() {
                    function bind( scope, fn ) {
                        return function () {
                            fn.apply( scope, arguments );
                        };
                    }
                    this.domElement.addEventListener( 'mousemove', bind(this, this.mousemove), false );
                    this.domElement.addEventListener( 'mousedown', bind(this, this.mousedown), false );
                    this.domElement.addEventListener( 'mouseup', bind(this, this.mouseup), false );

                    window.addEventListener( 'keydown', bind(this, this.keydown), false );
                    window.addEventListener( 'keyup', bind(this, this.keyup), false );
                };
                if (!fly_controls.saveState)
                {
                    fly_controls.saveState = flySaveState;
                    fly_controls.reset = flyReset;
                }
                if (!fly_controls.register)
                {
                    fly_controls.register = register;
                }
                this.world.fly_controls = fly_controls;
            } else {
                console.warn("No FlyControls (FlyControls not in HTML)");
            }
        }
    }

    restoreActiveObject()
    {
        if (this.world.active_object)
        {
            // In case we were in drive mode, make the active object visible.
            let showObject = function(ob)
            {
                ob.visible = true;
                ob.children.forEach(child => {showObject(child);});
            };
            this.world.active_object.objects.forEach(ob => {showObject(ob);});
            // In case we were in solo mode, put the active object back in the main scene.
            this.world.active_object.objects.forEach(element => {
                this.world.scene.add(element);
            });
        }
    }

    setActiveObject(name)
    {
        // Restore the previous object before setting a new one.
        this.restoreActiveObject();
        // We assume each object has a unique name to search on.
        this.world.active_object = this.world.objects.find(ob => ob.name === name);
        // In case we are already in an object-centric mode, focus on the new active object.
        this.currentStateOn();
        if (this.solo_mode)
        {
            this.showSoloObject();
        }
    }

    setViewMode(mode)
    {
        // first, turn off old mode.
        if (this.world.active_object)
        {
            this.restoreActiveObject();
        }
        this.currentStateOff();
        // then, turn on new mode.
        this.view_mode = mode;
        if (this.solo_mode)
        {
            this.showSoloObject();
        }
        else
        {
            this.showWorld();
        }
        // this.currentStateOn();
    }

    currentStateOff()
    {
        this.world.orbit_controls.enabled = false;
        this.world.fly_controls.dispose();
        this.world.active_controls = null;
        this.restoreActiveObject();
        this.world.scene.add(this.world.camera);
        this.world.solo_scene.add(this.world.solo_camera);
        if (!this.solo_mode)
        {
            if (this.view_mode == "Orbit Camera")
            {
                // @ts-ignore
                this.world.orbit_controls.saveState();
            }
            if (this.view_mode == "Fly Camera")
            {
                // @ts-ignore
                this.world.fly_controls.saveState();
            }
        }
    }

    currentStateOn()
    {
        switch (this.view_mode) {
            case "Orbit Camera":
                this.orbitControlOn();
                break;
            case "Fly Camera":
                this.flyControlOn();
                break;
            case "Follow Object":
                this.followObjectOn();
                break;
            case "Drive Object":
                this.driveObjectOn();
                break;
            default:
                break;
        }
    }

    showSoloObject()
    {
        this.solo_mode = true;
        // put active object in solo scene, and render the solo scene.
        this.world.active_object.objects.forEach(element => {
            this.world.solo_scene.add(element);
        });
        this.world.orbit_controls.object = this.world.solo_camera;
        this.world.fly_controls.object = this.world.solo_camera;
        this.world.active_camera = this.world.solo_camera;
        this.world.active_scene = this.world.solo_scene;
        this.currentStateOn();
    }

    showWorld()
    {
        this.solo_mode = false;
        if (this.world.active_object) {
            this.world.active_object.objects.forEach(element => {
                this.world.scene.add(element);
            });
        } else {
            console.warn("No active object when expecting one!");
        }
        this.world.orbit_controls.object = this.world.camera;
        // this.world.orbit_controls.update();
        if (this.world.fly_controls) {
            this.world.fly_controls.object = this.world.camera;
        }
        this.world.active_camera = this.world.camera;
        this.world.active_scene = this.world.scene;
        this.currentStateOn();
    }

    orbitControlOn()
    {
        this.world.orbit_controls.enabled = true;
        if (this.solo_mode && this.world.active_object)
        {
            let camparams = this.world.active_object.lookFromLookAt();
            this.world.solo_camera.position.set(camparams[0],camparams[1],camparams[2]);
            this.world.active_camera.lookAt(camparams[3],camparams[4],camparams[5]);
            // set controls to use whatever the active camera is, and position so it can see the active object.
            this.world.orbit_controls.target.set(camparams[3],camparams[4],camparams[5]);
        }
        else
        {
            // @ts-ignore
            this.world.orbit_controls.reset();
        }
        this.world.orbit_controls.update();
        this.world.active_controls = this.world.orbit_controls;
    }

    flyControlOn()
    {
        if (this.solo_mode && this.world.active_object)
        {
            let camparams = this.world.active_object.lookFromLookAt();
            this.world.active_camera.position.set(camparams[0],camparams[1],camparams[2]);
            this.world.active_camera.lookAt(camparams[3],camparams[4],camparams[5]);
        }
        else
        {
            // @ts-ignore
            this.world.fly_controls.reset();
        }
        this.world.fly_controls.register();
        this.world.active_controls = this.world.fly_controls;
    }

    followObjectOn()
    {
        if (this.world.active_object.rideable) {
            this.world.active_object.rideable.add(this.world.solo_camera);
            this.world.active_object.rideable.add(this.world.camera);
            let bbox = new T.Box3();
            bbox.setFromObject(this.world.active_object.objects[0]);
            this.world.camera.position.set(0, bbox.max.y-bbox.min.y, -1.5*(bbox.max.z-bbox.min.z));
            this.world.solo_camera.position.set(0, bbox.max.y-bbox.min.y, -1.5*(bbox.max.z-bbox.min.z));
            // Set look direction
            let target = this.world.active_object.objects[0].position;
            this.world.camera.lookAt(target);
            this.world.solo_camera.lookAt(target);
        } else {
            this.setViewMode("Orbit Camera");
        }
    }

    driveObjectOn()
    {
        if (this.world.active_object.rideable) {
            let hideObject = function(ob)
            {
                ob.visible = false;
                ob.children.forEach(child => {hideObject(child);});
            };
            this.world.active_object.rideable.add(this.world.solo_camera);
            this.world.active_object.rideable.add(this.world.camera);
            this.world.camera.position.set(0,0,0);
            this.world.camera.rotation.set(0,Math.PI,0);
            this.world.solo_camera.position.set(0,0,0);
            this.world.solo_camera.rotation.set(0,Math.PI,0);
            this.world.active_object.objects.forEach(ob => {hideObject(ob);});
        } else {
            this.setViewMode("Orbit Camera");
        }
    }
}