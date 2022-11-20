import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

const run = async () => {
  // Scene
  const scene = new THREE.Scene();

  //      LOADERS
  const gltfLoader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader();

  /**
   * Textures
   */
  const matcapTexture = await textureLoader.loadAsync("textures/matcaps/8.png");
  const newTex = await textureLoader.loadAsync("textures/art1.jpg");
  const GlassDisplacement = await textureLoader.loadAsync(
    "/textures/glass/displacement.jpg"
  );
  const GlassNormal = await textureLoader.loadAsync(
    "/textures/glass/normal.jpg"
  );
  const GlassAO = await textureLoader.loadAsync("/textures/glass/ao.jpg");
  const GlassRoughness = await textureLoader.loadAsync(
    "/textures/glass/roughness.jpg"
  );
  const environmentMapTexture = cubeTextureLoader.load(
    [
      "/cubemap/px.png",
      "/cubemap/nx.png",
      "/cubemap/py.png",
      "/cubemap/ny.png",
      "/cubemap/pz.png",
      "/cubemap/nz.png",
    ]
    // ,
    // () => {
    //   material.envMap = pmremGenerator.fromCubemap(
    //     environmentMapTexture
    //   ).texture;
    //   pmremGenerator.dispose();
    //   scene.background = material.envMap;
    // }
  );

  const cubeBackground = new THREE.Mesh(
    new THREE.SphereGeometry(10, 60, 60),
    new THREE.MeshBasicMaterial({
      envMap: environmentMapTexture,
      side: THREE.DoubleSide,
    })
  );
  cubeBackground.rotation.z = Math.PI;
  //   scene.add(cubeBackground);
  cubeBackground.rotation.z = 30;
  //   scene.add(cubeBackground);
  //   scene.background = cubeBackground;
  //   scene.background = material.envMap;
  //              LIGHTS

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const directionalLight = new THREE.DirectionalLight("white", 10);
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.2
  );
  directionalLight.position.set(1, 1, -3);
  directionalLight.rotation.x = -Math.PI / 2;
  directionalLight.shadow = true;
  const areaLight = new THREE.RectAreaLight("red", 100);
  areaLight.position.set(-1, 1, 0);
  scene.add(directionalLight, directionalLightHelper, ambientLight, areaLight);
  gui.add(directionalLight, "intensity", 0, 100, 0.1);
  //   gui.add(directionalLight, "intensity", 0, 10, 0.1);

  //          GEOMETRIES

  const gltf = await gltfLoader.loadAsync("models/crystal.gltf");
  const crystalMesh = gltf.scene.children[0];
  console.log(gltf);
  crystalMesh.material = new THREE.MeshPhysicalMaterial({
    color: "#fff",
    // map: newTex,
    envMap: environmentMapTexture,
    normalMap: GlassNormal,
    aoMap: GlassAO,
    // aoMapIntensity: 1,
    roughnessMap: GlassRoughness,

    // displacementMap: GlassDisplacement,
    // displacementScale: 0.1,
    reflectivity: 1,
    roughness: 0.3,
    clearcoat: 0.3,
    transmission: 1,
    ior: 1.2,
    thickness: 5,
    side: THREE.DoubleSide,
    // opacity: 0.5,
    // transparent: true,
    // wireframe: true,
  });
  scene.add(crystalMesh);
  gui.add(crystalMesh.material, "thickness", 0, 10, 0.1);

  //heart
  const heart = await gltfLoader.loadAsync("models/heart.gltf");
  const heartMesh = heart.scene.children[0];
  scene.add(heartMesh);
  console.log(heartMesh);
  //   directionalLight.lookAt(crystalMesh);

  //logo
  const logo = await gltfLoader.loadAsync("models/my_logo.gltf");
  const logoMesh = logo.scene.children[0];
  logoMesh.material = new THREE.MeshPhysicalMaterial({
    color: "#fff",
  });
  scene.add(logoMesh);
  /**
   * Fonts
   */
  const fontLoader = new FontLoader();

  const font = await fontLoader.loadAsync(
    "/fonts/helvetiker_regular.typeface.json"
  );

  // Material
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // Text
  const textGeometry = new TextGeometry("brunaaart", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, material);
  text.position.set(0, 0, -2);
  scene.add(text);

  //cube
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#00f" });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(3, 0, 0);
  scene.add(cube);

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
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

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;
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

  /**
   * Animate
   */
  const clock = new THREE.Clock();
  // let previousTime = 0;
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    //   const deltaTime = elapsedTime - previousTime;
    //   previousTime = elapsedTime;

    crystalMesh.rotation.y = elapsedTime * 0.3;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};
run();
