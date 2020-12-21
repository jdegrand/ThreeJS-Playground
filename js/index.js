import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.123.0/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

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

camera.position.set(-0.043080985211751695, 2.1572384430790104, 5.733150140117139);
controls.update();
const clock = new THREE.Clock();


const animate = function () {
    requestAnimationFrame( animate );

    mixer.update( clock.getDelta() );

    renderer.render( scene, camera );
};

//Load Model
const loader = new GLTFLoader();
    loader.load('./assets/spider-man.gltf', (gltf) => {

    scene.add(gltf.scene);

    mixer = new THREE.AnimationMixer( gltf.scene );

    mixer.clipAction( gltf.animations[ 0 ] ).play();

    animate();
});

window.addEventListener('resize', windowResize, false);

function windowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}