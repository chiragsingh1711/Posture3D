import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GUI } from "lil-gui";
import "./style.css";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import Common from "./common.json" assert { type: "json" };
console.log(Common);
import { Vector3 } from "three";

// import fs from "fs";
// var dataArray = JSON.parse(fs.readFileSync("back.json", "utf-8"));

// console.log(dataArray);

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

var scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(22.5, 1, 0.001, 1000);
camera.aspect = sizes.width / sizes.height;
camera.updateProjectionMatrix();
camera.position.set(0, 1, 3);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// scene.background = new THREE.Color("#9A9A9A");
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.xr.enabled = true;
const session = renderer.xr.getSession();
renderer.xr.setReferenceSpaceType("local-floor");
// renderer.xr.cameraAutoUpdate = false;
// const xrCamera = renderer.xr.getCamera();

// // Set the new position of the camera
// xrCamera.position.set(0, 3, 10);

// // Update the XR camera matrices
// xrCamera.updateMatrixWorld();

// renderer.xr.setSession("local-floor");

var button = VRButton.createButton(renderer);

// Change the CSS position of the button
button.style.position = "fixed";
button.style.top = "630px"; // Change the top position
button.style.bottom = "100px";
button.style.backgroundColor = "black";

// Add the button to the document body
document.body.appendChild(button);

var arButton = ARButton.createButton(renderer, {
  requiredFeatures: ["hit-test"],
});

function onSelect() {
  if (reticle.visible) {
    // const material = new THREE.MeshPhongMaterial({
    //   color: 0xffffff * Math.random(),
    // });
    // const mesh = new THREE.Mesh(geometry, material);
    group.position.setFromMatrixPosition(reticle.matrix);
    // light.position.setFromMatrixPosition(reticle.matrix);
    // Iterate through the objects in group
    for (const object of group.children) {
      object.position.set(0, 0, 0);
      object.scale.set(0.4, 0.4, 0.4);
    }

    scene.add(group);
  }
}
let reticle, controller;
let hitTestSource = null;
let hitTestSourceRequested = false;
let container;
container = document.createElement("div");
document.body.appendChild(container);
container.appendChild(renderer.domElement);
controller = renderer.xr.getController(0);
controller.addEventListener("select", onSelect);
scene.add(controller);

reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial()
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

// Change the CSS position of the button
arButton.style.backgroundColor = "black";
// arButton.style.position = "fixed";
// arButton.style.top = "630px"; // Change the top position
// arButton.style.bottom = "100px";

// Add the button to the document body
document.body.appendChild(arButton);

// document.body.appendChild(VRButton.createButton(renderer));

// const pmreGenerator = new THREE.PMREMGenerator(renderer);

// console.log(scene.background);
const loader = new RGBELoader();
const hdrTextureURL = new URL("sky.hdr", import.meta.url);
loader.load(hdrTextureURL, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  // scene.background = texture;
  scene.environment = texture;
});

const button_top = document.querySelector(".top");
const button_front = document.querySelector(".front");
const button_back = document.querySelector(".back");
const button_left = document.querySelector(".left");
const button_right = document.querySelector(".right");
const button_upper_front = document.querySelector(".upperFront");
const button_mid_front = document.querySelector(".midFront");
const button_lower_front = document.querySelector(".lowerFront");
const button_upper_back = document.querySelector(".upperBack");
const button_mid_back = document.querySelector(".midBack");
const button_lower_back = document.querySelector(".lowerBack");
const button_5yearsPlus = document.querySelector(".years5Plus");
const button_5yearsMinus = document.querySelector(".years5Minus");

button_top.addEventListener("click", () => {
  camera.position.set(0, 6, -2);
  console.log("top");
  controls.target.set(0, 0.9, -2);
  controls.update();
});

button_front.addEventListener("click", () => {
  camera.position.set(0, 1, 3);
  console.log("front");
  controls.target.set(0, 0.9, -2);
  controls.update();
});

button_back.addEventListener("click", () => {
  camera.position.set(0, 1, -7);
  console.log("back");
  controls.target.set(0, 0.9, -2);
  controls.update();
});

button_left.addEventListener("click", () => {
  camera.position.set(5, 1, 0);
  console.log("left");
  controls.target.set(0, 0.9, -2);
  controls.update();
});

button_right.addEventListener("click", () => {
  camera.position.set(-5, 1, 0);
  console.log("right");
  controls.target.set(0, 0.9, -2);
  controls.update();
});

button_upper_front.addEventListener("click", () => {
  camera.position.set(0, 1.9, 0.8);
  console.log("upper front");
  controls.target.set(0, 1.4, -2);
  controls.update();
});

button_upper_back.addEventListener("click", () => {
  camera.position.set(0, 1.9, -4.8);
  console.log("upper back");
  controls.target.set(0, 1.4, -2);
  controls.update();
});

button_mid_front.addEventListener("click", () => {
  camera.position.set(0, 1.2, 2);
  console.log("mid front");
  controls.target.set(0, 1.2, -2);
  controls.update();
});

button_mid_back.addEventListener("click", () => {
  camera.position.set(0, 1.2, -6);
  console.log("mid back");
  controls.target.set(0, 1.2, -2);
  controls.update();
});

button_lower_front.addEventListener("click", () => {
  camera.position.set(0, 0.3, 2);
  console.log("upper front");
  controls.target.set(0, 0.5, -2);
  controls.update();
});

button_lower_back.addEventListener("click", () => {
  camera.position.set(0, 0.3, -6);
  console.log("lower front");
  controls.target.set(0, 0.5, -2);
  controls.update();
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
controls.target.set(0, 0.9, -2);
controls.update();

let skullMixer;
let allActions = [];
const skullAdditiveActions = {};
let panelSettings;
let numSkullActions = 0;
// skull19
// LeftLegLatest1

function Head_X_L_Deform(left_ear, right_ear) {
  // Slope of Horizontal Line
  let m1 = (right_ear[1] - right_ear[1]) / (left_ear[0] - right_ear[0]);

  // Slope of Deformed Line
  let m2 = (left_ear[1] - right_ear[1]) / (left_ear[0] - right_ear[0]);

  // Angle between the two lines
  let angle = (Math.atan((m2 - m1) / (1 + m1 * m2)) * 180) / Math.PI;

  // Lerp angle between 0 to 0.5
  let lerp_angle = (angle + 90) / 180;
  console.log(0.5 - lerp_angle);
  head_x_l = 0.5 - lerp_angle;
  return head_x_l;
}

function Head_X_R_Deform(left_ear, right_ear) {
  // Slope of Horizontal Line
  let m1 = (right_ear[1] - right_ear[1]) / (left_ear[0] - right_ear[0]);

  // Slope of Deformed Line
  let m2 = (left_ear[1] - right_ear[1]) / (left_ear[0] - right_ear[0]);

  // Angle between the two lines

  let angle = (Math.atan((m2 - m1) / (1 + m1 * m2)) * 180) / Math.PI;
  // Lerp angle between 0 to 0.5
  let lerp_angle = (angle + 90) / 180;
  console.log(0.5 - lerp_angle);
  head_x_r = 0.5 - lerp_angle;
  return head_x_r;
}

// let obj;
// fetch("./back.json")
//   .then((response) => response.json())
//   .then((json) => (obj = json));
// console.log(obj);

// import a json file

const group = new THREE.Group();
gltfLoader.load("skull20.glb", (gltf) => {
  // scene.add(gltf.scene);
  group.add(gltf.scene);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(0, 0, -2);
  numSkullActions = gltf.animations.length;
  skullMixer = new THREE.AnimationMixer(gltf.scene);
  gltf.animations.forEach((clip) => {
    // skullAnimations[clip.name.concat("Action")] = clip;
    const name = clip.name;
    console.log(name);
    if (name == "Head-X-L") {
      console.log("Head-X-L");
      skullAdditiveActions[clip.name] = { weight: 0.25 };
    }
    // if (name == "Head-X-L" || name == "Head-X-R") {
    //   console.log(Common["left_ear"][1] / 30);
    //   console.log(Common["right_ear"][1] / 30);
    //   if (
    //     Math.floor(Common["left_ear"][1] / 30) ==
    //     Math.floor(Common["right_ear"][1] / 30)
    //   ) {
    //     skullAdditiveActions[clip.name] = { weight: 0 };
    //     console.log("No Deformation");
    //   } else if (
    //     Math.floor(Common["left_ear"][1] / 30) >
    //     Math.floor(Common["right_ear"][1] / 30)
    //   ) {
    //     skullAdditiveActions[clip.name] = {
    //       weight: Head_X_L_Deform(Common["left_ear"], Common["right_ear"]),
    //     };
    //     console.log("Left Deformation");
    //   } else {
    //     skullAdditiveActions[clip.name] = {
    //       weight: Head_X_R_Deform(Common["left_ear"], Common["right_ear"]),
    //     };
    //     console.log("Right Deformation");
    //   }
    // } else {
    //   skullAdditiveActions[clip.name] = { weight: 0 };
    // }
    else {
      skullAdditiveActions[clip.name] = { weight: 0 };
    }

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
});

let spinalMixer;
let spinalAdditiveActions = {};
let numSpinalActions = 0;
let Skeletonpoints = {};
// const objectLayer = 1 << 10;

const folder4 = panel.addFolder("Skeleton Points");
folder4.close();
gltfLoader.load("SkeletonPoints5.glb", (gltf) => {
  // scene.add(gltf.scene);
  group.add(gltf.scene);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(0, 0, -2);
  Skeletonpoints = gltf.scene;
  gltf.scene.traverse(function (child) {
    if (child.isMesh) {
      child.position.z = -child.position.z;
      child.add(new THREE.AxesHelper(2.0));
      child.add(createLabel(child.name));
      // console.log(child.position.x);
      folder4
        .add(
          child.position,
          "x",
          child.position.x - 0.1,
          child.position.x + 0.1,
          0.0001
        )
        .name(child.name + " x");
      folder4
        .add(
          child.position,
          "y",
          child.position.y - 0.15,
          child.position.y + 0.15,
          0.0001
        )
        .name(child.name + " y");
      folder4
        .add(
          child.position,
          "z",
          child.position.z - 0.2,
          child.position.z + 0.2,
          0.0001
        )
        .name(child.name + " z");
    }
  });
});
function loadSpinal(panel) {
  gltfLoader.load("SpinalLatest7.glb", (gltf) => {
    // scene.add(gltf.scene);
    group.add(gltf.scene);
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.position.set(0, 0, -2);
    numSpinalActions = gltf.animations.length;
    spinalMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      const name = clip.name;
      if (name == "LeftShoulder-Z-Up") {
        // console.log("LeftShoulder-Z-Up");
        spinalAdditiveActions[clip.name] = { weight: 0.35 };
      } else {
        spinalAdditiveActions[clip.name] = { weight: 0 };
      }

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
    // scene.add(gltf.scene);
    group.add(gltf.scene);
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.position.set(0, 0, -2);
    numLegActions = gltf.animations.length;
    legMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      const name = clip.name;
      if (name == "RightLeg-X-Positive") {
        legAdditiveActions[clip.name] = { weight: 0.45 };
      } else {
        legAdditiveActions[clip.name] = { weight: 0 };
      }
      // legAdditiveActions[clip.name] = { weight: 0 };
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
    scene.add(group);
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

// const res = await fetch("/back.json");
// const data = await res.json();

// console.log("hello");
// console.log(data);

button_5yearsPlus.addEventListener("click", () => {
  // Iterate through all skullAdditiveActions
  for (const name of Object.keys(skullAdditiveActions)) {
    if (skullAdditiveActions[name].weight != 0) {
      skullAdditiveActions[name].weight += 0.05;
      panelSettings[name] += 0.05;
      setWeight(
        skullAdditiveActions[name].action,
        skullAdditiveActions[name].weight
      );
    }
  }

  // Iterate through all spinalAdditiveActions
  for (const name of Object.keys(spinalAdditiveActions)) {
    if (spinalAdditiveActions[name].weight != 0) {
      spinalAdditiveActions[name].weight += 0.05;
      panelSettings[name] += 0.05;
      setWeight(
        spinalAdditiveActions[name].action,
        spinalAdditiveActions[name].weight
      );
    }
  }

  // Iterate through all legAdditiveActions
  for (const name of Object.keys(legAdditiveActions)) {
    if (legAdditiveActions[name].weight != 0) {
      legAdditiveActions[name].weight += 0.05;
      panelSettings[name] += 0.05;
      setWeight(
        legAdditiveActions[name].action,
        legAdditiveActions[name].weight
      );
    }
  }
});

button_5yearsMinus.addEventListener("click", () => {
  // Iterate through all skullAdditiveActions
  for (const name of Object.keys(skullAdditiveActions)) {
    if (skullAdditiveActions[name].weight != 0) {
      skullAdditiveActions[name].weight -= 0.05;
      panelSettings[name] -= 0.05;
      setWeight(
        skullAdditiveActions[name].action,
        skullAdditiveActions[name].weight
      );
    }
  }

  // Iterate through all spinalAdditiveActions
  for (const name of Object.keys(spinalAdditiveActions)) {
    if (spinalAdditiveActions[name].weight != 0) {
      spinalAdditiveActions[name].weight -= 0.05;
      panelSettings[name] -= 0.05;
      setWeight(
        spinalAdditiveActions[name].action,
        spinalAdditiveActions[name].weight
      );
    }
  }

  // Iterate through all legAdditiveActions
  for (const name of Object.keys(legAdditiveActions)) {
    if (legAdditiveActions[name].weight != 0) {
      legAdditiveActions[name].weight -= 0.05;
      panelSettings[name] -= 0.05;
      setWeight(
        legAdditiveActions[name].action,
        legAdditiveActions[name].weight
      );
    }
  }
});

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

renderer.setAnimationLoop(function (timestamp, frame) {
  // scene = obj.scene;
  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then(function (referenceSpace) {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then(function (source) {
            hitTestSource = source;
          });
      });

      session.addEventListener("end", function () {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });

      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length) {
        const hit = hitTestResults[0];

        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
      } else {
        reticle.visible = false;
      }
    }
  }
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

// function animate() {
//   renderer.setAnimationLoop(render);
// }

// function render(timestamp, frame) {
//   renderer.render(scene, camera);
// }

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
// animate();
panel.close();
tick();
