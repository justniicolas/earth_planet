import * as THREE from 'three'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import gsap from 'gsap'
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'



//SLIDER 



//SPHERE
console.log (vertexShader)
console.log(fragmentShader)

const scene = new THREE.Scene ()
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
    antialias : true,
    canvas : document.querySelector('canvas')
})
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)


//create sphere

const sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50), 
new THREE.ShaderMaterial({
    vertexShader, 
    fragmentShader, 
    uniforms : {
        globeTexture : {
            value: new THREE.TextureLoader().load('./img/globe.jpg')
        }
    }
})
)
// console.log(sphere)
scene.add(sphere)


//create atmosphere 
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50), 
new THREE.ShaderMaterial({
    vertexShader : atmosphereVertexShader,
    fragmentShader : atmosphereFragmentShader, 
    blending : THREE.AdditiveBlending, 
    side : THREE.BackSide
    
})
)

atmosphere.scale.set(1.1, 1.1, 1.1)
// console.log(sphere)
scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)

scene.add(group)



const starGeormetry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
    color : 0xffffff
})

const starVertices = []
for (let i = 0 ; i < 10000 ; i++) {
    const x = (Math.random()-0.5)*3000
    const y = (Math.random()-0.5)*1000
    const z = -Math.random()*5000
    starVertices.push(x,y,z)
}

starGeormetry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices,3))
const stars = new THREE.Points(starGeormetry, starMaterial)

scene.add(stars)

camera.position.z = 15

const mouse = {
    x : undefined,
    y : undefined
}

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    sphere.rotation.y += 0.002
    gsap.to(group.rotation, {
        x : -mouse.x * 0.1, 
        y : mouse.x * 0.1,
        duration : 2
    })
}

animate()


addEventListener('mousemove', (event) =>{
    mouse.x = (event.clientX / innerWidth) * 2- 1
    mouse.y = (event.clientY / innerHeight) * 2+ 1 
})

console.log(mouse)