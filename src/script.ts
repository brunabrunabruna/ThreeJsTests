import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { MeshPhysicalMaterial, PointLightHelper } from "three";
import {
  Camera,
  cloneUniformsGroups,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshStandardMaterial,
  PointLight,
  Scene,
  SkinnedMesh,
  SphereGeometry,
} from "three";
import { RenderPass, UnrealBloomPass, EffectComposer } from "three-stdlib";
import { loadAssets } from "./assets";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

const run = async () => {
  const assets = await loadAssets();

  const scene = new THREE.Scene();

  /**
   * Textures
   */
  const sphereBackground = new THREE.Mesh(
    new THREE.SphereGeometry(10, 60, 60),
    new THREE.MeshBasicMaterial({
      map: assets.cloudsTex,
      side: THREE.DoubleSide,
    })
  );
  sphereBackground.rotation.z = Math.PI;
  sphereBackground.rotation.z = 30;

  //add cube background
  scene.add(sphereBackground);

  //

  //
  //
  //
  //
  //              LIGHTS

  //ambient
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);

  //point1
  const pointLight = new THREE.PointLight("white", 6);
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  pointLight.position.set(0, 4, 0.5);

  scene.add(pointLight, pointLightHelper);
  gui.add(pointLight, "intensity", 0, 10, 0.1);

  //point2
  const pointLight2 = new THREE.PointLight("pink", 4);
  pointLight2.position.set(0, 1, -3);
  const pointLightHelper2 = new THREE.PointLightHelper(pointLight2);

  scene.add(pointLight2, pointLightHelper2);
  gui.add(pointLight2, "intensity", 0, 10, 0.1);

  //rect
  const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
  scene.add(rectAreaLight);
  //          GEOMETRIES
  //
  //
  //      CRYSTAL
  //
  //
  //
  //

  assets.crystalMesh.scale.set(1.2, 1.2, 1.2);
  assets.crystalMesh.position.set(0, 0, -0.5);
  scene.add(assets.crystalMesh);
  gui.add(assets.crystalMesh.material, "thickness", 0, 10, 0.1);
  gui.add(assets.crystalMesh.material, "ior", 1, 5, 0.01);

  //group
  const flowerTallGroup = new THREE.Group();

  flowerTallGroup.add(
    assets.flowersTallStemsMesh,
    assets.flowersTallFlowersMesh
  );

  //position
  flowerTallGroup.position.set(-1.5, -1.3, -1.2);
  const flowerTallGroup2 = flowerTallGroup.clone();
  flowerTallGroup2.position.set(1.5, -1.3, -1.2);
  flowerTallGroup2.rotation.y = Math.PI;

  scene.add(flowerTallGroup, flowerTallGroup2);

  const flowerGroup = new THREE.Group();
  flowerGroup.position.set(2, -1.3, 0);

  flowerGroup.add(
    assets.flowersShortStemsMesh,
    assets.flowersShortFlowersMesh,
    assets.flowersShortCenterMesh
  );
  const flowerGroup2 = flowerGroup.clone();
  flowerGroup.position.set(-2, -1.3, 0);

  scene.add(flowerGroup, flowerGroup2);

  assets.grassMesh.position.set(0, -1.3, 0);
  assets.grassMesh.scale.set(2, 2, 2);

  for (let i = 0; i < 50; i++) {
    const grassNew = assets.grassMesh.clone();
    grassNew.position.x = (Math.random() - 0.5) * 4.5;
    grassNew.position.z = (Math.random() - 0.5) * 4.5;
    scene.add(grassNew);
  }

  assets.logoMesh.position.set(0, 1.2, 0);
  scene.add(assets.logoMesh);

  //
  //
  //
  ///
  //          MENU
  /**
   * Fonts
   */

  // const font = await fontLoader.loadAsync(
  //   "/fonts/helvetiker_regular.typeface.json"
  // );

  // Material
  const menuMaterial = new THREE.MeshPhysicalMaterial({ color: "white" });

  // Text

  ///
  //
  //  text parameters
  const textParameters = {
    font: assets.font,
    size: 0.1,
    height: 0.01,
    // curveSegments: 12,
    // bevelEnabled: true,
    // bevelThickness: 0.03,
    // bevelSize: 0.02,
    // bevelOffset: 0,
    // bevelSegments: 5,
  };

  const generateTextMesh = (text: string) => {
    const geometry = new TextGeometry(text, textParameters);
    geometry.center();
    return new THREE.Mesh(geometry, menuMaterial);
  };

  //projects
  const text1 = generateTextMesh("projects");
  text1.position.set(-2.5, 1.4, 0);

  //about
  const text2 = generateTextMesh("about");
  text2.position.set(-1.5, 1.4, 0);

  //ista
  const text3 = generateTextMesh("instagram");
  text3.position.set(1.5, 1.4, 0);

  //more
  const text4 = generateTextMesh("more");
  text4.position.set(2.5, 1.4, 0);

  //add to the scene
  scene.add(text1, text2, text3, text4);

  //cube
  const cubeGeometry = new THREE.BoxGeometry(16, 10, 0.1);
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: "white",
    map: assets.cloudsTex,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(0, 0, -5);
  scene.add(cube);

  //
  //
  //
  //          FLOOR DISC

  ///

  const floorPlane = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.1, 5, 1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "#421d6b" })
  );
  floorPlane.position.set(0, -1.4, 0);
  scene.add(floorPlane);

  //
  //
  //
  //        PARTICLES
  //
  //

  // Geometry
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 500;

  const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)

  for (
    let i = 0;
    i < count * 3;
    i++ // Multiply by 3 for same reason
  ) {
    positions[i] = (Math.random() - 0.5) * 10; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  ); // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
  //
  //
  // Material

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    transparent: true,
    alphaMap: assets.particlesTex,
  });
  // Points
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  //
  //
  //
  //        FOG
  //
  //
  //
  const fog = new THREE.Fog("#000", 5, 15);
  // scene.fog = fog;

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    50,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 4;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor("#000");

  //
  //
  //
  //
  //
  //             BLOOM
  //
  //
  //
  const params = {
    exposure: 1,
    bloomStrength: 0.5,
    bloomThreshold: 0.57,
    bloomRadius: 0.2,
  };
  const renderScene = new RenderPass(scene, camera);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  //gui
  gui.add(params, "exposure", 0.1, 2).onChange(function (value) {
    renderer.toneMappingExposure = Math.pow(value, 4.0);
  });

  gui.add(params, "bloomThreshold", 0.0, 1.0).onChange(function (value) {
    bloomPass.threshold = Number(value);
  });

  gui.add(params, "bloomStrength", 0.0, 3.0).onChange(function (value) {
    bloomPass.strength = Number(value);
  });

  gui
    .add(params, "bloomRadius", 0.0, 1.0)
    .step(0.01)
    .onChange(function (value) {
      bloomPass.radius = Number(value);
    });

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    // renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    composer.setSize(sizes.width, sizes.height);
  });

  /**
   * Animate
   */
  const clock = new THREE.Clock();
  let previousTime = 0;
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // //update models animation
    // if (mixer) {
    //   mixer.update(deltaTime);
    // }
    assets.crystalMesh.rotation.y = elapsedTime * 0.3;

    // Update controls
    controls.update();

    // Render
    // renderer.render(scene, camera);
    composer.render();
    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};
run();
