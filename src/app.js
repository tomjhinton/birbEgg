import './style.scss'
import * as THREE from 'three'

import { gsap } from 'gsap'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const textureLoader = new THREE.TextureLoader()

const canvas = document.querySelector('canvas.webgl')



import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xffffff )
const loadingBarElement = document.querySelector('.loading-bar')
const loadingBarText = document.querySelector('.loading-bar-text')
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () =>{
    window.setTimeout(() =>{
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

      loadingBarElement.classList.add('ended')
      loadingBarElement.style.transform = ''

      loadingBarText.classList.add('fade-out')

    }, 500)
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) =>{
    const progressRatio = itemsLoaded / itemsTotal
    loadingBarElement.style.transform = `scaleX(${progressRatio})`

  }
)

const gtlfLoader = new GLTFLoader(loadingManager)

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
  depthWrite: false,
  uniforms:
    {
      uAlpha: { value: 1 }
    },
  transparent: true,
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
  uniform float uAlpha;
        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})

const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)


const invisibleMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, depthWrite: false})


const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  depthWrite: true,
  clipShadows: true,
  wireframe: false,
  side: THREE.DoubleSide,
  uniforms: {
    uFrequency: {
      value: new THREE.Vector2(10, 5)
    },
    uTime: {
      value: 0
    },

    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uPosition: {
      value: {
        x: 0
      }
    },
    uRotation: {
      value: 0



    },
    uValueA: {
      value: Math.random()
    },
    uValueB: {
      value: Math.random()
    },
    uValueC: {
      value: Math.random()
    },
    uValueD: {
      value: Math.random()
    }
  }
})


let sceneGroup, mixer, gltfVar, egg, bit, shell
gtlfLoader.load(
  'eggD.glb',
  (gltf) => {
    console.log(gltf)
    gltfVar = gltf
    gltf.scene.scale.set(3,3,3)
    sceneGroup = gltf.scene
    sceneGroup.needsUpdate = true
    sceneGroup.position.y -= 3
    scene.add(sceneGroup)


    egg = gltf.scene.children.find((child) => {
      return child.name === 'egg'
    })

    bit = gltf.scene.children.find((child) => {
      return child.name ===  'Sphere_cell024'
    })

    console.log(bit)

    scene.traverse( function( object ) {
      // console.log(object)
    if (object.material && object.material.name.includes('2')){

      object.material = shaderMaterial
    }

    if (object.material && object.material.name.includes('1')){
      console.log('hiya')
      shell = object.material

    }

} );


  }
)

document.querySelector('#titular').addEventListener( 'pointerup', onClick, false )

function onClick() {

  shaderMaterial.uniforms.uValueA.value = Math.random()
  shaderMaterial.uniforms.uValueB.value = Math.random()
  shaderMaterial.uniforms.uValueC.value = Math.random()
  shaderMaterial.uniforms.uValueD.value = Math.random()
  event.preventDefault()
  egg.material = shell

  // gsap.to(egg.position, { y: -6,  duration: 7.5 })


  if(gltfVar.animations[0]){
    mixer = new THREE.AnimationMixer(gltfVar.scene)
    console.log(mixer)
    gltfVar.animations.map(x => {
      const action = mixer.clipAction(x)
      action.clampWhenFinished = true;
      action.setLoop(THREE.LoopOnce, 1);
      action.play()
    })


  }


}



// gtlfLoader.load(
//   'birds.glb',
//   (gltf) => {
//
//     gltf.scene.scale.set(5.5,5.5,5.5)
//     sceneGroup = gltf.scene
//     sceneGroup.needsUpdate = true
//     sceneGroup.position.z -= 15
//     sceneGroup.position.y -= 3
//     sceneGroup.position.x += 6
//     scene.add(sceneGroup)
//
//     if(gltf.animations[0]){
//       mixer = new THREE.AnimationMixer(gltf.scene)
//
//       const action2 = mixer.clipAction(gltf.animations[1])
//
//       action2.play()
//
//     }
//
//
//   }
// )


// const light = new THREE.AmbientLight( 0x404040 )
// scene.add( light )
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 )
// scene.add( directionalLight )

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>{



  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ))


})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 10
camera.position.y = -20
camera.position.z = 15
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2 - 0.1
//controls.enableZoom = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0x000000, 1)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const light = new THREE.AmbientLight( 0x404040 )
scene.add( light )
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 )
scene.add( directionalLight )





const clock = new THREE.Clock()

const tick = () =>{
  if ( mixer ) mixer.update( clock.getDelta() )
  const elapsedTime = clock.getElapsedTime()


  // Update controls
  controls.update()

  if(egg && bit){
    egg.position.y = bit.position.y -.218
    if(egg.position.y < -6){
      egg.material = invisibleMaterial

    }
  }

  // fireMaterial.uniforms.uTime.value = elapsedTime
  // fireMaterial.needsUpdate=true
  // // window1Material.fragmentShader = fragArray[selectedArray[0]]
  // //
  // eyesMaterial.uniforms.uTime.value = elapsedTime
  // eyesMaterial.needsUpdate=true
  //
  //
  // screenMaterial.uniforms.uTime.value = elapsedTime
  // screenMaterial.needsUpdate=true
  //
  //
  // thoughtMaterial.uniforms.uTime.value = elapsedTime
  // thoughtMaterial.needsUpdate=true


  shaderMaterial.uniforms.uTime.value = elapsedTime

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
