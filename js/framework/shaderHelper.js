/*jshint esversion: 6 */ 
// @ts-check

//import THREE from "three";

/**
 * Simplified creation of Shader Material for CS559 Framework
 * 
 * The "shaderMaterial" function creates a THREE shader material
 * given URLs for the vertex and fragment shader.
 * 
 * It work asynchronously - it gives simple shaders until the
 * real ones load.
 * 
 * There are potentially issues if the fragment shader
 * ends up getting compiled before the vertex shader.
 */

import * as T from "./../THREE/src/Three.js";

// this takes an object that describes a shader material and adds the
// shader code (if provided) to it.
// if the shader code is not there, it gives a default shader
const defaultVertexShader = `
    void main()
    {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;
const defaultFragmentShader = `
    void main()
    {
        gl_FragColor = vec4(0.4,0.4,0.6,1);
    }
`;
const errorFragmentShader = `
    void main()
    {
        gl_FragColor = vec4(0.8,0.4,0.4,1);
    }
`;

/**
 * 
 * @param {string} url 
 * @param {THREE.ShaderMaterial} material 
 */
function loadFragmentShader(url,material)
{
    let loader = new T.FileLoader();
    loader.load(url,
            /* onload = */ function(data) {
                material.fragmentShader = data.toString();
                material.needsUpdate = true;
            },
            /* onprogress = */ function(xhr) {
            },
            /* onerror = */ function(err) {
                console.log(`Failed to Load Shader (file:${url})`);
                console.log(`Error: ${err}`);
                material.fragmentShader = errorFragmentShader;
                material.needsUpdate = true;
            }
        );
}

/**
 * 
 * @param {string} url 
 * @param {THREE.ShaderMaterial} material 
 */
function loadVertexShader(url,material)
{
    let loader = new T.FileLoader();
    loader.load(url,
            /* onload = */ function(data) {
                material.vertexShader = data.toString();
                material.needsUpdate = true;
            },
            /* onprogress = */ function(xhr) {
            },
            /* onerror = */ function(err) {
                console.log(`Failed to Load Shader (file:${url})`);
                console.log(`Error: ${err}`);
                material.fragmentShader = errorFragmentShader;
                material.needsUpdate = true;
            }
        );
}

/**
 * Create a Shader Material from a set of shader files
 * Creates the material with default shaders, and async loads the
 * shaders from file and swaps them in when they are ready.
 * 
 * @param {string} vertexShaderURL 
 * @param {string} fragmentShaderURL
 * @param {THREE.ShaderMaterialParameters} [properties] 
 * @returns {THREE.ShaderMaterial} 
 */
export function shaderMaterial(vertexShaderURL, fragmentShaderURL, properties={})
{
    if (!properties) properties = {};

    let sm = new T.ShaderMaterial(properties);
    // create a default shader until the real ones load
    sm.vertexShader = defaultVertexShader;
    sm.fragmentShader = defaultFragmentShader;
    sm.needsUpdate = true;
    // these will be loaded asynchronously
    loadVertexShader(vertexShaderURL,sm);
    loadFragmentShader(fragmentShaderURL,sm);
    // the material is ready for use, even if it has the default shader
    return sm;
}
