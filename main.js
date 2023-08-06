import * as THREE from "three";
import "./style.css";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

// CREATE OBJECT
const geometry = new THREE.TorusGeometry(8, 5, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.7,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//SIZE
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// LIGHT
const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
// light.intensity = 1.4;
scene.add(light);
// CAMERA
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 30;
camera.position.y = -50;
camera.position.x = 20;
scene.add(camera);
// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
// Controls for the camera
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = false;
controls.autoRotateSpeed = 2;
// Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});
// Render loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
// Timeline animation intro
const timeLine = gsap.timeline({ defaults: { duration: 1 } });
timeLine.fromTo("nav", { y: "-100%" }, { y: "0%" });
timeLine.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
timeLine.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// Mouse color change
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));
window.addEventListener("mousemove", (event) => {
  if (mouseDown) {
    rgb = [
      Math.round((event.pageX / sizes.width) * 255),
      Math.round((event.pageY / sizes.height) * 255),
      150,
    ];
    const newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    mesh.material.color.copy(newColor);
  }
});

// Generate the colors and distribute them to the circles
const colorButton = document.getElementById("color-button");
const circles = document.querySelectorAll(".circle");
let currentCircleIndex = 0;

function resetCirles() {
  const colorString = mesh.material.color.getStyle();
  if (currentCircleIndex < circles.length) {
    circles[currentCircleIndex].style.backgroundColor = colorString;
    currentCircleIndex++;
  } else {
    circles.forEach((circle) => {
      circle.style.backgroundColor = "transparent";
    });
    currentCircleIndex = 0;
    gsap.to(camera.position, {
      duration: 2,
      z: 30,
      y: -50,
      x: 20,
      ease: "power2.out",
    });
  }
  if (currentCircleIndex === 5) {
    colorButton.textContent = "Reset the colors";
  } else {
    colorButton.textContent = "Grab the color";
  }
}

colorButton.addEventListener("click", resetCirles);
//
//Circles filled with color and copy the hex codes from them
circles.forEach((circle) => {
  circle.addEventListener("click", () => {
    const colorString = circle.style.backgroundColor;
    const hexColor = rgbToHex(colorString);
    copyToClipboard(hexColor);
  });
});
function rgbToHex(colorString) {
  const rgbValues = colorString.match(/\d+/g);
  const hexValues = rgbValues.map((value) => {
    const hex = Number(value).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  });
  return "#" + hexValues.join("");
}
function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  // document.execCommand("copy");
  navigator.clipboard.writeText(text);
  document.body.removeChild(textarea);
}

const rotateCheckbox = document.getElementById("rotate-checkbox");

function rotateDonut() {
  if (rotateCheckbox.checked) {
    controls.autoRotate = true;
  } else {
    controls.autoRotate = false;
  }
}
rotateCheckbox.addEventListener("click", rotateDonut);
