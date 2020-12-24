import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.123.0/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

let userInteracted = false;
let started = false;
let enterText = 'click me!';

scene.background = new THREE.CubeTextureLoader().setPath('./assets/background/').load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

// Lights
const ambient = new THREE.AmbientLight(0x404040, 20);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(10, 10, 10);
scene.add(light);

// Mouse controls
const controls = new OrbitControls(camera, renderer.domElement);

document.body.appendChild( renderer.domElement );

const groundTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( './assets/floor.jpeg') });

const texture = new THREE.TextureLoader().load( './assets/floor.jpeg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 1, 0.15 )

const sideTexture = new THREE.MeshBasicMaterial( { map: texture });

var groundTextures = 
    [
        sideTexture,
        sideTexture,
        groundTexture,
        groundTexture,
        sideTexture,
        sideTexture
    ];

let mixer;

const geometry = new THREE.BoxGeometry(6, 0.5, 6);
const cube = new THREE.Mesh( geometry, groundTextures );
scene.add( cube );
cube.position.set(0, -0.25, 0)

let x = -0.043080985211751695;
let y = 2.1572384430790104;
let z = 5.733150140117139;

if (window.matchMedia("(max-width: 700px)").matches) {
    y = 3.9922238750280132;
    z = 10.60048671882729;
}

camera.position.set(x, y, z);
controls.update();

const clock = new THREE.Clock();

const animate = function () {
    requestAnimationFrame( animate );

    if (started && !userInteracted) {
        camera.position.set(camera.position.x + 0.005776231125, camera.position.y, camera.position.z - 0.001690069155);
        controls.update();
    }
    mixer.update( clock.getDelta() );

    renderer.render( scene, camera );
};

let manager = new THREE.LoadingManager();
manager.onLoad = () => {
    percentage = 100;
    document.getElementById('loader').style.width = percentage + '%';
};

manager.onError = (err) => {
    console.log( 'ERROR ON:', err);
};

//Load Model
var percentage = 0;
const loader = new GLTFLoader(manager);
loader.load('./assets/spider-man.gltf', (gltf) => {
    scene.add(gltf.scene);

    mixer = new THREE.AnimationMixer(gltf.scene);

    mixer.clipAction(gltf.animations[0]).play();
    
    animate();
});

function playAudio() {
    document.getElementById('suprise').play();
}

window.addEventListener('resize', e => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('enter').addEventListener('click', e => {
    if (document.getElementById('enter').innerText == enterText) {
        document.getElementById('overlay').style.display = "none";
        playAudio();
        started = true;
    }
});

document.body.addEventListener("pointerdown", e => {
    if (started) {
        userInteracted = true;
    }
});

function checkForLoaded() {
    if (percentage == 100) {
        document.getElementById('enter').innerText = enterText;
        document.getElementById('enter').style.backgroundColor = "#F44336";
        document.getElementById('loader').style.transition = "none";
        document.getElementById('loading-bar').style.visibility = "hidden";
    }
}

document.getElementById("loader").addEventListener("transitionend", checkForLoaded);