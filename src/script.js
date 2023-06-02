import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GUI } from "lil-gui";
import "./style.css";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { Vector3 } from "three";

const canvas = document.querySelector("canvas.webgl");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const panel = new GUI({ width: 310 });

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(22.5, 1, 0.001, 1000);
camera.aspect = sizes.width / sizes.height;
camera.updateProjectionMatrix();
camera.position.set(0, 3, 10);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.35;
renderer.xr.enabled = true;
const session = renderer.xr.getSession();
renderer.xr.setReferenceSpaceType("viewer");
// renderer.xr.cameraAutoUpdate = false;
// const xrCamera = renderer.xr.getCamera();

// // Set the new position of the camera
// xrCamera.position.set(0, 3, 10);

// // Update the XR camera matrices
// xrCamera.updateMatrixWorld();

// renderer.xr.setSession("local-floor");

document.body.appendChild(VRButton.createButton(renderer));

scene.background = new THREE.Color("#9A9A9A");
const loader = new RGBELoader();
const hdrTextureURL = new URL("sky.hdr", import.meta.url);
loader.load(hdrTextureURL, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  // scene.background = texture;
  scene.environment = texture;
});

// Plane Mesh with translucent material
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: "blue",
  opacity: 0.1,
  transparent: true,
  side: THREE.DoubleSide,
});

const planeX = new THREE.Mesh(planeGeometry, planeMaterial);
const planeZ = new THREE.Mesh(
  planeGeometry,
  new THREE.MeshBasicMaterial({
    color: "red",
    opacity: 0.1,
    transparent: true,
    side: THREE.DoubleSide,
  })
);

planeX.position.set(0, 2.5, 0);
planeZ.position.set(0, 2.5, 0);
planeZ.rotation.y = Math.PI / 2;
// scene.add(planeX);
// scene.add(planeZ);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.875, 0.1);
controls.update();

let skullMixer;
let allActions = [];
const skullAdditiveActions = {};
let panelSettings;
let numSkullActions = 0;
// skull19
// LeftLegLatest1

// fetch('./data.json')
//     .then((response) => response.json())
//     .then((json) => console.log(json));

gltfLoader.load("skull20.glb", (gltf) => {
  scene.add(gltf.scene);
  numSkullActions = gltf.animations.length;
  skullMixer = new THREE.AnimationMixer(gltf.scene);
  gltf.animations.forEach((clip) => {
    // skullAnimations[clip.name.concat("Action")] = clip;
    const name = clip.name;
    skullAdditiveActions[clip.name] = { weight: 0 };
    THREE.AnimationUtils.makeClipAdditive(clip);
    clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 24);
    const action = skullMixer.clipAction(clip);
    activateActionSkull(action);
    skullAdditiveActions[name].action = action;
    allActions.push(action);
  });
  let panel = createPanel();
  loadSpinal(panel);
  loadLeg(panel);
  tick();
});

let spinalMixer;
let spinalAdditiveActions = {};
let numSpinalActions = 0;
function loadSpinal(panel) {
  gltfLoader.load("SpinalLatest7.glb", (gltf) => {
    scene.add(gltf.scene);
    numSpinalActions = gltf.animations.length;
    spinalMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      const name = clip.name;
      spinalAdditiveActions[clip.name] = { weight: 0 };
      THREE.AnimationUtils.makeClipAdditive(clip);
      clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 24);
      const action = spinalMixer.clipAction(clip);
      activateActionSpinal(action);
      spinalAdditiveActions[name].action = action;
      allActions.push(action);
    });
    const folder2 = panel.addFolder("Spinal Weights");
    for (const name of Object.keys(spinalAdditiveActions)) {
      const settings = spinalAdditiveActions[name];
      panelSettings[name] = settings.weight;
      folder2
        .add(panelSettings, name, 0.0, 0.5, 0.01)
        .listen()
        .onChange(function (weight) {
          setWeight(settings.action, weight);
          settings.weight = weight;
        });
    }
    folder2.close();
  });
}

let legMixer;
let legAdditiveActions = {};
let numLegActions = 0;
function loadLeg(panel) {
  gltfLoader.load("LeftLegLatest2.glb", (gltf) => {
    scene.add(gltf.scene);
    numLegActions = gltf.animations.length;
    legMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      const name = clip.name;
      legAdditiveActions[clip.name] = { weight: 0 };
      THREE.AnimationUtils.makeClipAdditive(clip);
      clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 24);
      const action = legMixer.clipAction(clip);
      activateActionLeg(action);
      legAdditiveActions[name].action = action;
      allActions.push(action);
    });
    const folder3 = panel.addFolder("Leg Weights");
    for (const name of Object.keys(legAdditiveActions)) {
      const settings = legAdditiveActions[name];
      panelSettings[name] = settings.weight;
      folder3
        .add(panelSettings, name, 0.0, 0.5, 0.01)
        .listen()
        .onChange(function (weight) {
          setWeight(settings.action, weight);
          settings.weight = weight;
        });
    }
    folder3.close();
  });
}

const labelMaterial = new THREE.SpriteMaterial({ color: 0xffffff });

function createLabel(text) {
  const labelCanvas = document.createElement("canvas");
  const context = labelCanvas.getContext("2d");
  context.font = "Bold 20px Arial";
  const textWidth = context.measureText(text).width;

  labelCanvas.width = textWidth;
  labelCanvas.height = 25;
  context.font = "Bold 20px Arial";
  context.fillStyle = "black";
  context.fillText(text, 0, 20);

  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.minFilter = THREE.LinearFilter;

  const labelSprite = new THREE.Sprite(labelMaterial.clone());
  labelSprite.scale.set((0.1 * textWidth) / 2, 1, 0.5);
  labelSprite.position.y = 1.5;
  labelSprite.material.map = labelTexture;

  return labelSprite;
}

function createPanel() {
  const folder1 = panel.addFolder("Skull Weights");
  panelSettings = {
    "modify time scale": 1.0,
  };
  for (const name of Object.keys(skullAdditiveActions)) {
    const settings = skullAdditiveActions[name];

    panelSettings[name] = settings.weight;
    folder1
      .add(panelSettings, name, 0.0, 0.5, 0.01)
      .listen()
      .onChange(function (weight) {
        setWeight(settings.action, weight);
        settings.weight = weight;
      });
  }

  folder1.close();
  return panel;
}

function activateActionLeg(action) {
  const clip = action.getClip();
  const settings = legAdditiveActions[clip.name];
  setWeight(action, settings.weight);
  action.play();
  action.paused = true;
}

function activateActionSpinal(action) {
  const clip = action.getClip();
  const settings = spinalAdditiveActions[clip.name];
  setWeight(action, settings.weight);
  action.play();
  action.paused = true;
}

function activateActionSkull(action) {
  const clip = action.getClip();
  const settings = skullAdditiveActions[clip.name];
  setWeight(action, settings.weight);
  action.play();
  action.paused = true;
}
function setWeight(action, weight) {
  action.enabled = true;
  action.setEffectiveTimeScale(1);
  action.setEffectiveWeight(weight);
}

const clock = new THREE.Clock();
//Access json file points.json
// const points = require("./points.json");
// let left = points["message"]["left_ear"];
// let right = points["message"]["right_ear"];
// if (-595 > left[1] > -565 && -595 > right[1] > -565) {
//   console.log("yes");
// } else {
//   console.log("no");
//   if (left < -595) {
//     let diff = left + 595;
//     let i = 1;
//     // while()
//   } else {
//     console.log("right is more");
//   }
// }
function updateXRCamera() {
  if (session) {
    session.requestAnimationFrame(() => {
      const xrCamera = renderer.xr.getCamera(camera);

      if (xrCamera) {
        // Set the new position of the camera
        xrCamera.position.set(0, 2, 2);
        xrCamera.updateMatrixWorld();
      }

      updateXRCamera(); // Call recursively to update camera continuously
    });
  }
}
updateXRCamera();

renderer.setAnimationLoop(function () {
  // XRFrame.getViewerPose().then((pose) => {
  //   // if (pose) {
  //   //   const view = pose.views[0];
  //   //   const viewport = session.renderState.baseLayer.getViewport(view);
  //   //   renderer.setSize(viewport.width, viewport.height);
  //   // }
  // });
  // const frame = session.requestAnimationFrame();
  // const pose = renderer.xr.getViewerPose(referenceSpace);

  // if (pose) {
  //   const viewerPose = pose.views[0];
  //   const transform = viewerPose.transform;

  //   // Update camera position and rotation
  //   camera.position.copy(transform.position);
  //   camera.quaternion.copy(transform.orientation);
  // }
  // // XRFrame.getViewerPose();
  // renderer.xr.getCamera().position.set(0, 10, 10);
  // renderer.xr.getCamera().lookAt(0, 0, 0);
  // const xrCamera = renderer.xr.getCamera();

  // // Set the new position of the camera
  // xrCamera.position.set(0, 3, 10);

  // // Update the XR camera matrices
  // xrCamera.updateMatrixWorld();
  renderer.render(scene, camera);
  // camera.position.set(0, 3, 10);
  // renderer.xr.updateCamera(camera);
});

const tick = () => {
  requestAnimationFrame(tick);
  const mixerUpdateDelta = clock.getDelta();
  for (let i = 0; i !== numSkullActions; ++i) {
    const action = allActions[i];
    const clip = allActions[i]._clip;
    const settings = skullAdditiveActions[clip.name];
    settings.weight = action.getEffectiveWeight();
  }
  if (skullMixer) {
    skullMixer.update(mixerUpdateDelta);
  }
  if (spinalMixer) {
    spinalMixer.update(mixerUpdateDelta);
  }
  if (legMixer) {
    legMixer.update(mixerUpdateDelta);
  }
  for (let j = 0; j !== numSpinalActions; ++j) {
    const action = allActions[j + numSkullActions];
    const clip = allActions[j + numSkullActions]._clip;
    const settings = spinalAdditiveActions[clip.name];
    settings.weight = action.getEffectiveWeight();
  }
  for (let k = 0; k !== numLegActions; ++k) {
    const action = allActions[k + numSkullActions + numSpinalActions];
    const clip = allActions[k + numSkullActions + numSpinalActions]._clip;
    const settings = legAdditiveActions[clip.name];
    settings.weight = action.getEffectiveWeight();
  }

  controls.update();

  // const xrCamera = renderer.xr.getCamera();

  // // Set the new position of the camera
  // xrCamera.position.set(0, 3, 10);

  // // Update the XR camera matrices
  // xrCamera.updateMatrixWorld();
  renderer.render(scene, camera);
};
