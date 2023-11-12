import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


// Basic setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xB0E0E6);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Font loader
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const geometry = new TextGeometry('UMURCG', {
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

    // Center the text
    geometry.computeBoundingBox();
    const offset = geometry.boundingBox.getCenter(new THREE.Vector3()).negate();
    geometry.translate(offset.x, offset.y, offset.z);
    
    scene.add(textMesh);


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

    GenerateRandomDirection();
    let direction = GenerateRandomDirection();
    const speed = 1;
    const rotationSpeed = 0.01;
    

    // Animation
    const animate = function () {
        requestAnimationFrame(animate);

        textMesh.rotateY(rotationSpeed);
        textMesh.rotateX(-rotationSpeed);
    

        // // Bouncing logic (simplified example)
        textMesh.translateX(direction.x * speed);
        textMesh.translateY(direction.y * speed);

        if (IsTextMeshOutsideOfScreen(textMesh)) {
            direction = GenerateRandomDirection();
        }
        
        renderer.render(scene, camera);
    };

    
    
    animate();
});

camera.position.z = 500;
