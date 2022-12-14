import * as THREE from "./modules/Three.module.js";
import { FBXLoader } from "./modules/jsm/fbxloader.js";
import { OrbitControls } from "./modules/OrbitControls.js";

console.clear();

/**
 * Fabricjs
 * @type {fabric}
 */

var canvas = new fabric.Canvas("canvas");
let clickedValue = "front";
let shape;
canvas.backgroundColor = "#f5f5f5";
canvas.selection = false;
canvas.setWidth(512);
canvas.setHeight(512);
const svgs = [
  "front",
  "bottom",
  "front_pocket",
  "side1",
  "side2",
  "top_pocket",
  "safeZone_bottom",
  "safeZone_front",
  "safeZone_front_pocket",
  "safeZone_side1",
  "safeZone_side2",
];
// JQUERY
$("button.pattern").click(function () {
  $("div.popup").attr("style", "display:block");
});
$("div.front").click(function () {
  clickedValue = $(this).attr("value");
  console.log(clickedValue);
});
$("div.bottom").click(function () {
  clickedValue = $(this).attr("value");
  console.log(clickedValue);
});
$("div.front_pocket").click(function () {
  clickedValue = $(this).attr("value");
  console.log(clickedValue);
});
$("div.side1").click(function () {
  clickedValue = $(this).attr("value");
  console.log(clickedValue);
});
$("div.side2").click(function () {
  clickedValue = $(this).attr("value");
  console.log(clickedValue);
});
$("div.top_pocket").click(function () {
  clickedValue = $(this).attr("value");
  console.log(clickedValue);
});
$("button.cancel").click(function () {
  $("div.popup").attr("style", "display:none");
});
// fabric.JS
window.canvas = canvas;
var group = [];
let shapePath;
svgs.forEach((data) => {
  fabric.loadSVGFromURL(
    `./Model/BagPack/${data}.svg`,
    function (objects, options) {
      shape = fabric.util.groupSVGElements(objects, options);

      if (shape?.id === "front" && !shape?.id?.includes("safeZone")) {
        shapePath = new fabric.Path(shape.d, { objectCaching: false });
        shapePath.absolutePositioned = true;
      } else {
      }

      shape.setCoords();
      shape.selectable = false;
      if (shape?.id) {
        if (!shape?.id?.includes("safeZone")) {
          shape.fill = "#ffffff";
        }
      }
      group.push(shape);
      window.canvas = canvas;

      canvas.add(shape);
      canvas.renderAll();
    },
    function (item, object) {}
  );
});
canvas.on("mouse:dblclick", mouseClick);
function mouseClick(e) {
  const object = canvas.getObjects();
  object.forEach((child) => {
    if (child?.id) {
      if (child?.id === "front" && !child?.id?.includes("safeZone")) {
        fabric.Image.fromURL("./Model/test.jpg", function (img) {
          const left = child.getBoundingRect().left;
          const top = child.getBoundingRect().top;
          const width = child.getBoundingRect().width;
          const height = child.getBoundingRect().height;

          img.setCoords();
          canvas.add(
            img.set({
              left: left,
              top: top + height / 4,
              dirty: true,
              objectCaching: false,
              statefullCache: true,
              clipPath: shapePath,
            })
          );
        });
      }
      canvas.renderAll();
    }
  });
}
/**
 * Threejs
 */

var containerHeight = "512";
var containerWidth = "512";
var camera, renderer, container, scene, texture, material, geometry, cube;

init();
animate();

/**
 * Configurator init function
 */

function init() {
  /**
   * Camera
   */

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );
  camera.position.set(0, 0, 3.5);

  /**
   * Renderer
   */

  container = document.getElementById("renderer");
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(containerWidth, containerHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  container.appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 0, 0);
  camera.lookAt(0, 0, 0);
  controls.minDistance = 2.0;
  controls.maxDistance = 10.0;
  controls.update();

  /**
   * Scene
   */

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  const light = new THREE.AmbientLight(0xffffff, 0.7); // soft white light
  scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  scene.add(directionalLight);

  /**
   * Texture and material
   */

  texture = new THREE.CanvasTexture(document.getElementById("canvas"));
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  material = new THREE.MeshBasicMaterial({ map: texture });

  /**
   * Model
   */

  const loader = new FBXLoader();
  loader.load("./Model/backpack.fbx", (obj) => {
    obj.traverse((child) => {
      if (
        child.name.includes("bottom") ||
        child.name.includes("front") ||
        child.name.includes("side1") ||
        child.name.includes("top")
      ) {
        child.material = new THREE.MeshStandardMaterial();
        child.material.map = texture;
        child.material.map.wrapS = THREE.RepeatWrapping;
        child.material.map.wrapT = THREE.RepeatWrapping;
        child.material.needsUpdate = true;
      }
    });
    obj.position.set(0, -0.5, 0);
    obj.scale.set(0.02, 0.02, 0.02);
    scene.add(obj);
  });

  geometry = new THREE.BoxGeometry(1, 1, 1);
  cube = new THREE.Mesh(geometry, material);
  //scene.add(cube);
}

/**
 * Configurator frame render function
 */

function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.004;
  // cube.rotation.y += 0.001;
  texture.needsUpdate = true;
  renderer.render(scene, camera);
}
/**
 * Listeners
 */

// adding pattern
window.check = function (currentSvg,) {
  console.log(canvas.getActiveObject().getBoundingRect());
  console.log(canvas.getActiveObject())
  canvas.getActiveObject().clone((img) => {
    img.absolutePositioned = true
    console.log(img)
    img.set({
      left:40,
      top:260
    });
    canvas.add(img).renderAll();
    // img.set({
    //   left: activeObjectLeft + objectRotationLeftOffset,
    //   top: activeObjectTop + objectRotationTopOffset,
    //   clipPath: svgPath[activeObjectToRepeat.svgType],
    //   withoutTransform: true,
    // })
})
};
