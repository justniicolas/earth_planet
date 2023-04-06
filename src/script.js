import * as THREE from "three";
import gsap from "gsap";



const typewriterText = document.querySelector('#typewriter-text');

function typeWriter(text) {
  const delay = 100; // Délai entre chaque lettre en millisecondes
  let index = 0;

  function type() {
    if (index < text.length) {
      typewriterText.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, delay);
    }
  }

  type();
}

// Définir le texte en fonction de l'URL de la page
const pageUrl = window.location.href;
if (pageUrl.endsWith('/newsletters')) {
  typeWriter("newsletters");
} else if (pageUrl.endsWith('/page2')) {
  typeWriter("Texte de la page 2");
} else if (pageUrl.endsWith('/page3')) {
  typeWriter("Texte de la page 3");
} else {
  typeWriter("");
}



// SPHERE

const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("canvas")
});

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// create sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(7, 50, 50),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("./img/globe.jpg")
  })
);
scene.add(sphere);

// create atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(12, 50, 50),
  new THREE.ShaderMaterial({
    uniforms: {
      c: { type: "f", value: 0.5 },
      p: { type: "f", value: 5.0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float c;
      uniform float p;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  })
);
scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
});

const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 3000;
  const y = (Math.random() - 0.5) * 1000;
  const z = -Math.random() * 5000;
  starVertices.push(x, y, z);
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.z = 15;

const mouse = {
  x: undefined,
  y: undefined
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  group.rotation.y += 0.002;
  gsap.to(sphere.rotation, {
    x: -mouse.y * 0.1,
    y: mouse.x * 0.1, 
      duration: 2
  });
}

// Function to update the position of stars
function updateStars(delta) {
  const starPositions = starGeometry.attributes.position.array;
  for (let i = 0; i < starVertices.length; i += 3) {
    // Randomly move the star in a small range
    starPositions[i] += (Math.random() - 0.5) * 0.1 * delta;
    starPositions[i + 1200] += (Math.random() - 0.5) * 0.1 * delta;
    starPositions[i + 1020] += (Math.random() - 0.5) * 0.1 * delta;
  }
  starGeometry.attributes.position.needsUpdate = true;
}

animate();

// Listen for mouse movement
addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

// Use GSAP ticker to update stars at each frame
gsap.ticker.add((time, delta) => {
  updateStars(delta * 0.015); // Delta is the time elapsed since the last frame in milliseconds
});

