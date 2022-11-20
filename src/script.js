import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { PointLightHelper } from "three";
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
  // scene.add(cubeBackground);
  cubeBackground.rotation.z = 30;
  //   scene.add(cubeBackground);
  //   scene.background = cubeBackground;
  //   scene.background = material.envMap;
  //

  //
  //
  //
  //
  //              LIGHTS

  // const areaLight = new THREE.RectAreaLight("pink", 100, 2, 2);
  // areaLight.position.set(0, 1, 2);
  // const areaLightHelper = new RectAreaLightHelper(areaLight);
  // scene.add(areaLight, areaLightHelper);

  // gui.add(areaLight, "intensity", 0, 10, 0.1);

  //ambient
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  // scene.add(ambientLight);

  //point1
  const pointLight = new THREE.PointLight("white", 10);
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  pointLight.position.set(0, 4, 0.5);

  scene.add(pointLight, pointLightHelper);
  gui.add(pointLight, "intensity", 0, 10, 0.1);

  //point2
  const pointLight2 = new THREE.PointLight("pink", 4);
  pointLight2.position.set(0, 1, 3);
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
  const gltf = await gltfLoader.loadAsync("models/crystal.gltf");
  const crystalMesh = gltf.scene.children[0];
  // console.log(gltf);
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
  crystalMesh.scale.set(1.2, 1.2, 1.2);
  crystalMesh.position.set(0, -0.5, -0.5);
  scene.add(crystalMesh);
  gui.add(crystalMesh.material, "thickness", 0, 10, 0.1);
  // areaLight.lookAt(crystalMesh.position);
  //heart
  const heart = await gltfLoader.loadAsync("models/heart.gltf");
  const heartMesh = heart.scene.children[0];
  // scene.add(heartMesh);
  // console.log(heartMesh);
  //
  //
  //
  //
  //            FLOWERS;
  //
  //
  //
  //group
  const flowerTallGroup = new THREE.Group();
  //stems
  const flowersTallStems = await gltfLoader.loadAsync(
    "models/flowers_tall_stems.glb"
  );
  const flowersTallStemsMesh = flowersTallStems.scene.children[0];

  flowersTallStemsMesh.material = new THREE.MeshPhysicalMaterial({});

  //flowers
  const flowersTallFlowers = await gltfLoader.loadAsync(
    "models/flowers_tall_flowers.glb"
  );
  const flowersTallFlowersMesh = flowersTallFlowers.scene.children[0];
  flowersTallStemsMesh.material = new THREE.MeshPhysicalMaterial({});

  flowerTallGroup.add(flowersTallStemsMesh, flowersTallFlowersMesh);

  //position
  flowerTallGroup.position.set(-1.5, -1.3, -1.2);
  const flowerTallGroup2 = flowerTallGroup.clone();
  flowerTallGroup2.position.set(1.5, -1.3, -1.2);
  flowerTallGroup2.rotation.y = Math.PI;

  scene.add(flowerTallGroup, flowerTallGroup2);
  //
  //
  //
  //short
  const flowerShortGroup = new THREE.Group();
  const flowersShortStems = await gltfLoader.loadAsync(
    "models/flowers_short_stems.glb"
  );
  const flowersShortFlowers = await gltfLoader.loadAsync(
    "models/flowers_short_flowers.glb"
  );
  const flowersShortStems2 = await gltfLoader.loadAsync(
    "models/flowers_short_stems.glb"
  );
  const flowersShortFlowers2 = await gltfLoader.loadAsync(
    "models/flowers_short_flowers.glb"
  );
  const flowerGroup1 = new THREE.Group();
  flowerGroup1.position.set(2, -1.3, 0);
  const flowersShortStemsMesh = flowersShortStems.scene.children[0];
  const flowersShortFlowersMesh = flowersShortFlowers.scene.children[0];
  flowerGroup1.add(flowersShortStemsMesh, flowersShortFlowersMesh);

  const flowerGroup2 = new THREE.Group();
  flowerGroup2.position.set(-2, -1.3, 0);

  const flowersShortStemsMesh2 = flowersShortStems2.scene.children[0];
  const flowersShortFlowersMesh2 = flowersShortFlowers2.scene.children[0];
  flowerGroup2.add(flowersShortStemsMesh2, flowersShortFlowersMesh2);
  // flowersShortMesh.material = new THREE.MeshStandardMaterial({
  //   // color: "#fff",
  //   // transparent: true,
  //   // opacity: 1,
  //   // metalness: 0,
  //   // side: THREE.DoubleSide,
  // });

  flowerShortGroup.add(flowerGroup1, flowerGroup2);
  scene.add(flowerShortGroup);
  console.log(flowersShortStemsMesh);
  //   directionalLight.lookAt(crystalMesh);

  //
  //
  //
  //        GRASS
  //

  const grass = await gltfLoader.loadAsync("models/grass.glb");
  const grassMesh = grass.scene.children[0];
  scene.add(grassMesh);

  const grassNew = grassMesh.clone();
  grassNew.position.set(0, -1.3, 0);
  scene.add(grassNew);

  for (let i = 0; i < 10; i++) {}
  //
  //
  //   LOGO
  //
  //
  //

  const logo = await gltfLoader.loadAsync("models/my_logo.gltf");
  const logoMesh = logo.scene.children[0];
  logoMesh.material = new THREE.MeshPhysicalMaterial({
    color: "#fff",
    metalness: 0.5,
  });
  logoMesh.position.set(0, 1.2, 0);
  // logoMesh.scale.set();
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
  const cubeMaterial = new THREE.MeshPhysicalMaterial({
    color: "pink",
    metalness: 0.5,
    reflectivity: 1,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(3, 0, 0);
  scene.add(cube);

  ///
  //
  //
  //
  //        FOG
  //
  //
  //
  const fog = new THREE.Fog("#000", 5, 15);
  scene.fog = fog;

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
