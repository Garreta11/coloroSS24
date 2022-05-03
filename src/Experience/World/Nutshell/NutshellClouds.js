import * as THREE from "three";
import Experience from "../../Experience";

export default class NutshellClouds {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.NUM_CLODUS = 6;

    this.textures = {};

    this.setCloud1();
    this.setCloud2();
    this.setCloud3();
    this.setCloud4();
    this.setCloud5();
    this.setCloud6();
  }

  setCloud1() {
    var geometry = new THREE.PlaneGeometry(16, 9);
    this.textures.cloud1 = this.resources.items.nutshellcloud1;
    this.textures.cloud1.encoding = THREE.sRGBEncoding;
    var material = new THREE.MeshStandardMaterial({
      map: this.textures.cloud1,
      transparent: true,
      opacity: 0.8,
    });
    this.meshCloud1 = new THREE.Mesh(geometry, material);
    this.meshCloud1.position.set(7.25, -13, -62.25);
    this.meshCloud1.scale.set(0.5, 0.5, 0.5);
    this.meshCloud1.castShadow = false;
    this.meshCloud1.receiveShadow = false;
    this.scene.add(this.meshCloud1);

    this.meshCloud1.visible = false;

    this.randMoveVertical1 = Math.random() * 100;
  }

  setCloud2() {
    var geometry = new THREE.PlaneGeometry(16, 9);
    this.textures.cloud2 = this.resources.items.nutshellcloud2;
    this.textures.cloud2.encoding = THREE.sRGBEncoding;
    var material = new THREE.MeshStandardMaterial({
      map: this.textures.cloud2,
      transparent: true,
      opacity: 0.8,
    });
    this.meshCloud2 = new THREE.Mesh(geometry, material);
    this.meshCloud2.position.set(-4.64, -13, -64.25);
    this.meshCloud2.scale.set(0.5, 0.5, 0.5);
    this.meshCloud2.castShadow = false;
    this.meshCloud2.receiveShadow = false;
    this.scene.add(this.meshCloud2);

    this.meshCloud2.visible = false;

    this.randMoveVertical2 = Math.random() * 100;
  }

  setCloud3() {
    var geometry = new THREE.PlaneGeometry(16, 9);
    this.textures.cloud3 = this.resources.items.nutshellcloud3;
    this.textures.cloud3.encoding = THREE.sRGBEncoding;
    var material = new THREE.MeshStandardMaterial({
      map: this.textures.cloud3,
      transparent: true,
      opacity: 0.8,
    });
    this.meshCloud3 = new THREE.Mesh(geometry, material);
    this.meshCloud3.position.set(0.39, -11.05, -60.25);
    this.meshCloud3.scale.set(0.5, 0.5, 0.5);
    this.meshCloud3.castShadow = false;
    this.meshCloud3.receiveShadow = false;
    this.scene.add(this.meshCloud3);

    this.meshCloud3.visible = false;

    this.randMoveVertical3 = Math.random() * 100;
  }

  setCloud4() {
    var geometry = new THREE.PlaneGeometry(16, 9);
    this.textures.cloud4 = this.resources.items.nutshellcloud4;
    this.textures.cloud4.encoding = THREE.sRGBEncoding;
    var material = new THREE.MeshStandardMaterial({
      map: this.textures.cloud4,
      transparent: true,
      opacity: 0.8,
    });
    this.meshCloud4 = new THREE.Mesh(geometry, material);
    this.meshCloud4.position.set(-0.98, -13.78, -58.25);
    this.meshCloud4.scale.set(0.5, 0.5, 0.5);
    this.meshCloud4.castShadow = false;
    this.meshCloud4.receiveShadow = false;
    this.scene.add(this.meshCloud4);

    this.meshCloud4.visible = false;

    this.randMoveVertical4 = Math.random() * 100;
  }

  setCloud5() {
    var geometry = new THREE.PlaneGeometry(16, 9);
    this.textures.cloud5 = this.resources.items.nutshellcloud5;
    this.textures.cloud5.encoding = THREE.sRGBEncoding;
    var material = new THREE.MeshStandardMaterial({
      map: this.textures.cloud5,
      transparent: true,
      opacity: 0.8,
    });
    this.meshCloud5 = new THREE.Mesh(geometry, material);
    this.meshCloud5.position.set(4, -13.78, -66.5);
    this.meshCloud5.scale.set(0.5, 0.5, 0.5);
    this.meshCloud5.castShadow = false;
    this.meshCloud5.receiveShadow = false;
    this.scene.add(this.meshCloud5);

    this.meshCloud5.visible = false;

    this.randMoveVertical5 = Math.random() * 100;
  }

  setCloud6() {
    var geometry = new THREE.PlaneGeometry(16, 9);
    this.textures.cloud6 = this.resources.items.nutshellcloud6;
    this.textures.cloud6.encoding = THREE.sRGBEncoding;
    var material = new THREE.MeshStandardMaterial({
      map: this.textures.cloud6,
      transparent: true,
      opacity: 0.8,
    });
    this.meshCloud6 = new THREE.Mesh(geometry, material);
    this.meshCloud6.position.set(1.3, -12.5, -70.25);
    this.meshCloud6.scale.set(0.5, 0.5, 0.5);
    this.meshCloud6.castShadow = false;
    this.meshCloud6.receiveShadow = false;
    this.scene.add(this.meshCloud6);

    this.meshCloud6.visible = false;

    this.randMoveVertical6 = Math.random() * 100;
  }

  update() {
    this.meshCloud1.position.y +=
      -Math.sin(this.time.elapsed / 400 + this.randMoveVertical1) * 0.0003 +
      Math.sin(this.time.elapsed / 100 + this.randMoveVertical1) * 0.001;

    this.meshCloud2.position.y +=
      -Math.sin(this.time.elapsed / 500 + this.randMoveVertical2) * 0.0003 +
      Math.sin(this.time.elapsed / 300 + this.randMoveVertical2) * 0.001;

    this.meshCloud3.position.y +=
      -Math.sin(this.time.elapsed / 400 + this.randMoveVertical3) * 0.0003 +
      Math.sin(this.time.elapsed / 200 + this.randMoveVertical3) * 0.001;

    this.meshCloud4.position.y +=
      -Math.sin(this.time.elapsed / 600 + this.randMoveVertical4) * 0.0003 +
      Math.sin(this.time.elapsed / 200 + this.randMoveVertical4) * 0.0001;

    this.meshCloud5.position.y +=
      -Math.sin(this.time.elapsed / 300 + this.randMoveVertical5) * 0.0003 +
      Math.sin(this.time.elapsed / 100 + this.randMoveVertical5) * 0.001;

    this.meshCloud6.position.y +=
      -Math.sin(this.time.elapsed / 600 + this.randMoveVertical6) * 0.0003 +
      Math.sin(this.time.elapsed / 200 + this.randMoveVertical6) * 0.001;
  }
}
