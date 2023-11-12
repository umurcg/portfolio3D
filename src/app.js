import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import StickmanModel from './assets/models/Stickman.fbx';


// Basic setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xB0E0E6);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function loadModel(url) {
    return new Promise((resolve, reject) => {
        const loader = new FBXLoader();  // Or any other loader you're using
        loader.load(url, (object) => {
            object.position.set(0, 50, 0);  // Set the position of the model
            object.scale.set(100, 100, 100);// Set the scale of the model
            resolve(object);  // Resolve the promise when the model is loaded
        }, undefined, (error) => {
            reject(error);  // Reject the promise if there's an error
        });
    });
}

function loadFont(text){
    return new Promise((resolve, reject) => {
        // Font loader
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const geometry = new TextGeometry(text, {
                font: font,
                size: 40,
                height: 5,
                curveSegments: 10,
                bevelEnabled: true,
                bevelThickness: 2,
                bevelSize: 0.5,
                bevelOffset: 0,
                bevelSegments: 5
            });
            const material = new THREE.MeshBasicMaterial({ color: 0x111111 });
            const textMesh = new THREE.Mesh(geometry, material);
            geometry.computeBoundingBox();
            const offset = geometry.boundingBox.getCenter(new THREE.Vector3()).negate();
            geometry.translate(offset.x, offset.y, offset.z);
    
            var textObject = new THREE.Object3D();
            textObject.add(textMesh);
            resolve(textObject);

        }, undefined, function (error) {
            reject(error);
        });
    });
}

function GenerateRandomDirection() {
    let localDirection = new THREE.Vector3();
    localDirection.x = Math.random() * 2 - 1;
    localDirection.y = Math.random() * 2 - 1;
    localDirection.z = 0;
    localDirection.normalize();
    return localDirection;
}

function IsTextMeshOutsideOfScreen(textMesh) {
    let localPosition = new THREE.Vector3();
    localPosition.copy(textMesh.position);
    localPosition.project(camera);
    return Math.abs(localPosition.x) > 1 || Math.abs(localPosition.y) > 1;
}

Promise.all([
    loadModel(StickmanModel),
    loadFont('umurcg'),
]).then((loadedObjects) => {
    // All models are loaded at this point
    loadedObjects.forEach(object => {
        scene.add(object);  // Add each loaded object to the scene
    });

    let stickmanModel = loadedObjects[0];
    let textMesh = loadedObjects[1];

    GenerateRandomDirection();
    let direction = GenerateRandomDirection();
    const speed = 1;
    const rotationSpeed = 0.01;

    const animate = function () {
        requestAnimationFrame(animate);

        textMesh.rotateY(rotationSpeed);
        textMesh.rotateX(-rotationSpeed);
        textMesh.translateX(direction.x * speed);
        textMesh.translateY(direction.y * speed);

        if (IsTextMeshOutsideOfScreen(textMesh)) {
            direction = GenerateRandomDirection();
        }

        renderer.render(scene, camera);
    };
    
    // Now you can proceed with the rest of your logic
    animate();  // Start the animation loop or any other logic
    camera.position.z = 500;
}).catch(error => {
    console.error('An error happened during loading:', error);
});

