import * as THREE from "three";

import Experience from "../Experience";
import Environment from "./Environment";

import RedBox from "./Red/RedBox";
import RedSphere from "./Red/RedSphere";
import RedSphereStatic from "./Red/RedSphereStatic";

import LimeScene from "./Lime/LimeScene";
import LimeSphere from "./Lime/LimeSphere";
import LimeElement from "./Lime/LimeElement";

import Water2 from "./Blue/Water2";
import BlueBox from "./Blue/BlueBox";
import BlueDoor from "./Blue/BlueDoor";
import BlueCeiling from "./Blue/BlueCeiling";

import PinkVideo from "./Pink/PinkVideo";
import PinkParticles from "./Pink/PinkParticles";

import NutshellHills from "./Nutshell/NutshellHills";
import NutshellElement from "./Nutshell/NutshellElement";
import NutshellClouds from "./Nutshell/NutshellClouds";
import NutshellElementAnimated from "./Nutshell/NutshellElementAnimated";
import NutshellElementAnimated2 from "./Nutshell/NutshellElementAnimated2";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.physics = this.experience.physics;
    this.time = this.experience.time;

    // Wait for resources
    this.resources.on("ready", () => {
      document.getElementById("startexperience").style.display = "block";
      document.getElementsByClassName("loader")[0].style.display = "none";

      this.setColors();

      // Environment
      this.environment = new Environment();
    });
  }

  setColors() {
    this.setRed();
    this.setLime();
    this.setBlue();
    this.setPink();
    this.setNutshell();
  }

  setRed() {
    this.redBox = new RedBox();
    this.redSphere = new RedSphere();
    this.redSphereStatic1 = new RedSphereStatic(
      this.resources.items.redSphereStatic1,
      new THREE.Vector3(0.0008, 0.0008, 0.0008),
      new THREE.Vector3(13.1, 1, 1.2)
    );
    this.redSphereStatic2 = new RedSphereStatic(
      this.resources.items.redSphereStatic2,
      new THREE.Vector3(0.002, 0.002, 0.002),
      new THREE.Vector3(13.6, 1.2, 1.5)
    );
    this.redSphereStatic3 = new RedSphereStatic(
      this.resources.items.redSphereStatic3,
      new THREE.Vector3(0.002, 0.002, 0.002),
      new THREE.Vector3(13.65, 1, 0.5)
    );
  }

  setLime() {
    this.limeScene = new LimeScene();
    this.limeSphere = new LimeSphere();

    this.limeElement1 = new LimeElement(
      this.resources.items.limeElement1,
      new THREE.Vector3(0.02, 0.02, 0.02),
      new THREE.Vector3(-1, 0.9, -1),
      this.resources.items.limeElement1Color
    );
    this.limeElement2 = new LimeElement(
      this.resources.items.limeElement2,
      new THREE.Vector3(0.02, 0.02, 0.02),
      new THREE.Vector3(6.2, 0.35, 2.49),
      this.resources.items.limeElement2Color
    );
    this.limeElement3 = new LimeElement(
      this.resources.items.limeElement3,
      new THREE.Vector3(0.015, 0.015, 0.015),
      new THREE.Vector3(1.7, 0.1, 2.75),
      this.resources.items.limeElement3Color
    );
    this.limeElement4 = new LimeElement(
      this.resources.items.limeElement4,
      new THREE.Vector3(0.01, 0.01, 0.01),
      new THREE.Vector3(3.35, 0.6, 6),
      this.resources.items.limeElement4Color
    );
    this.limeElement5 = new LimeElement(
      this.resources.items.limeElement5,
      new THREE.Vector3(0.02, 0.02, 0.02),
      new THREE.Vector3(4.69, -0.45, 4.8),
      this.resources.items.limeElement5Color
    );
    this.limeElement6 = new LimeElement(
      this.resources.items.limeElement6,
      new THREE.Vector3(0.01, 0.01, 0.01),
      new THREE.Vector3(4.69, 1.3, 1.81),
      this.resources.items.limeElement6Color
    );
  }

  setBlue() {
    this.water2 = new Water2();
    this.blueBox = new BlueBox();
    this.blueDoor = new BlueDoor();
    this.blueCeiling = new BlueCeiling();
  }

  setPink() {
    // this.pinkBg = new PinkBg();
    // this.pinkCloth = new PinkCloth();
    this.pinkVideo = new PinkVideo();
    this.pinkParticles = new PinkParticles();
  }

  setNutshell() {
    this.nutshellHills = new NutshellHills();
    this.nutshellElement1 = new NutshellElement(
      this.resources.items.nutshellElement1,
      new THREE.Vector3(3, -12, -61),
      new THREE.Vector3(0.004, 0.004, 0.004),
      new THREE.Vector3(0, -0.787, 0)
    );
    this.nutshellElement2 = new NutshellElementAnimated(
      this.resources.items.nutshellElement2,
      new THREE.Vector3(1.3, -14, -55),
      new THREE.Vector3(0.006, 0.006, 0.006),
      new THREE.Vector3(0, -2, 0)
    );
    this.nutshellElement6 = new NutshellElementAnimated2(
      this.resources.items.nutshellElement6,
      new THREE.Vector3(3.17, -13.48, -58.39),
      new THREE.Vector3(0.006, 0.006, 0.006),
      new THREE.Vector3(0, -0.787, 0)
    );
    this.nutshellElement3 = new NutshellElement(
      this.resources.items.nutshellElement3,
      new THREE.Vector3(-3.75, -13.29, -69.23),
      new THREE.Vector3(0.006, 0.006, 0.006),
      new THREE.Vector3(1.6, 0, -0.93)
    );
    this.nutshellElement4 = new NutshellElement(
      this.resources.items.nutshellElement4,
      new THREE.Vector3(3.24, -13.75, -54.35),
      new THREE.Vector3(0.005, 0.005, 0.005),
      new THREE.Vector3(0.0652, -2, 0.0652)
    );
    this.nutshellElement5 = new NutshellElement(
      this.resources.items.nutshellElement5,
      new THREE.Vector3(1.55, -13.32, -58.15),
      new THREE.Vector3(0.0172, 0.0172, 0.0172),
      new THREE.Vector3(0.4244, -1.2817, 0.0024)
    );
    this.nutshellClouds = new NutshellClouds();
  }

  update() {
    // Red
    if (this.redSphere) {
      this.redSphere.update();
    }

    if (this.redSphereStatic1) {
      this.redSphereStatic1.update();
    }

    if (this.redSphereStatic2) {
      this.redSphereStatic2.update();
    }

    if (this.redSphereStatic3) {
      this.redSphereStatic3.update();
    }

    if (this.redSphereStatic4) {
      this.redSphereStatic4.update();
    }

    if (this.redSphereStatic5) {
      this.redSphereStatic5.update();
    }

    // Lime
    if (this.limeSphere) {
      this.limeSphere.update();
    }

    if (this.limeElement1) {
      // this.limeElement1.update();
    }

    // Blue
    if (this.water2) {
      this.water2.update();
    }
    if (this.blueDoor) {
      this.blueDoor.update();
    }

    // Pink
    if (this.pinkVideo) {
      this.pinkVideo.update();
    }

    // Nutshell
    if (this.nutshellElement2) {
      this.nutshellElement2.update();
    }
    if (this.nutshellElement6) {
      this.nutshellElement6.update();
    }
    if (this.nutshellClouds) {
      this.nutshellClouds.update();
    }
  }
}
