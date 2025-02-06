let mic;
let volume;
let scaleValue;
/*
function setup(){
    getAudioContext().suspend();
    mic = new p5.AudioIn();
    mic.start();
    userStartAudio();

}
function draw(){
    vol = mic.getLevel();
    let expansion = map(vol, 0, 1, 0.3, 2);
    scaleValue = expansion;
    console.log (mic.getLevel)
}
function mousePressed(){
    userStartAudio();

}*/
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Define elements: scene (required), renderder (required), camera (required), a model loader (filetype specific), lights, controls (for mouse and keyboard interaction)
const div = document.querySelector ('.threewrapper')
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const camera = new THREE.PerspectiveCamera( 69, 1000 / 500, 0.1, 1000 );
const loader = new GLTFLoader();
const light = new THREE.AmbientLight(0xffffff, 1); // Soft white light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const controls = new OrbitControls( camera, renderer.domElement );
var listener = new THREE.AudioListener();
camera.add( listener );
navigator.mediaDevices.getUserMedia( { audio: true, video: false } ).then( handleSuccess );


let loadedModel;

function setScene() {
    //Enable shadows on renderer
    renderer.shadowMap.enabled = true;

    //Set renderer size to window size, could be a number if you want it in x pixels
    renderer.setSize(1600, 800);

    //Add the two lights we defined to the scene, set position of directional light
    scene.add(light);
    scene.add(directionalLight);
    //Set directional light position
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;

    //Add a background color
    scene.background = new THREE.Color( 'black' );

    //Set camera position
    camera.position.set(0, 10, 0);
    camera.rotation.set(90, 0, 0);
    
    console.log( camera.rotation);
}

function addPlane() {
    //Add a plane 
    const geometry = new THREE.PlaneGeometry( 10, 10 );
    const material = new THREE.MeshStandardMaterial({ color: 'blue', side: THREE.DoubleSide, roughness: 0, metalness: 0 });
    const plane = new THREE.Mesh( geometry, material );
    plane.position.set (0,-5,0)
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add( plane );
}



let velocity = new THREE.Vector2(0.02, 0.03); // speed x and y 
let bounds = {x:10, z:2};

function addModel() {
    const textureLoader = new THREE.TextureLoader();
    const matCap = textureLoader.load("matcap.png");

    //Load our model
    loader.load( 'dobby.glb', function ( gltf ) {
        loadedModel = gltf.scene;

        loadedModel.traverse ((obj) => {
            if (obj.isMesh) { // Ensure it's a mesh before applying material
                obj.material = new THREE.MeshMatcapMaterial({ matcap: matCap }); }

        })

        loadedModel.scale.set (0.3,0.3,0.3)
           
        loadedModel.position.set(0,0,0)

        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );
}
setScene();
addPlane();
addModel();
function animate() {
    requestAnimationFrame(animate);

    if (loadedModel) {

        //console.log(scaleValue)
        //loadedModel.scale.set(scaleValue, scaleValue, scaleValue); 
        let scaleFactor = Math.max(scaleValue, 0.3); // Ensure it doesn't go below 0.3
        loadedModel.scale.set(volume, volume, volume);


        loadedModel.position.x += velocity.x;
        loadedModel.position.z += velocity.y;

        if (loadedModel.position.x > bounds.x || loadedModel.position.x < -bounds.x) {
            velocity.x *= -1; // Reverse X direction
        }
        if (loadedModel.position.z > bounds.z || loadedModel.position.z < -bounds.z) {
            velocity.y *= -1; // Reverse Y direction
        }
        loadedModel.rotation.y += 0.01; // Rotate around the Y-axis
        loadedModel.rotation.x += 0.01; // Rotate around the Y-axis
    }
    //controls.update();
    renderer.render(scene, camera);
}
animate();

div.appendChild( renderer.domElement );


let audioCtx;

// Function to handle user gesture
function handleUserGesture() {
    console.log('doc clicked')
    //setup()
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } else if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  // Now you can safely play sounds using the audio context
}

// Add an event listener to the document to listen for user gestures
document.addEventListener('click', handleUserGesture);

function handleSuccess( stream ) {
    //console.log(stream)
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function getVolume() {
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }

      const average = sum / dataArray.length;

      // Convert to a value between 0 and 1
      const volume = average / 255;

      return volume;
    }
    function vol() {
        volume = getVolume();
        //console.log("Volume:", volume);
        requestAnimationFrame(vol)
    }
    vol()
}