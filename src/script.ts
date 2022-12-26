import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { MeshPhysicalMaterial, PlaneGeometry, PointLightHelper } from "three";
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
import { loadAssets, loadLogo } from "./assets";
import { Easing, Tween, update } from "@tweenjs/tween.js";
/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
});

//

var c = document.getElementById("myCanvas") as HTMLCanvasElement;
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();

ctx.beginPath();
ctx.arc(95, 50, 40, 0, 2 * Math.PI);
ctx.stroke();

ctx.beginPath();
ctx.arc(1, 1, 3, 0, 2 * Math.PI);
ctx.stroke();
