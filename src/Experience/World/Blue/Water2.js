import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

import Experience from "../../Experience";

import EventEmitter from "../../Utils/EventEmitter";

import waterVertexShader from "../../../shaders/blue/waterVertexShader.glsl";
import heightmapFragmentShader from "../../../shaders/blue/heightmapFragmentShader.glsl";
import smoothFragmentShader from "../../../shaders/blue/smoothFragmentShader.glsl";
import readWaterLevelFragmentShader from "../../../shaders/blue/readWaterLevelFragmentShader.glsl";

export default class Water2 extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.renderer = this.experience.renderer;
    this.camera = this.experience.camera;
    this.sizes = this.experience.sizes;
    this.mouse = this.experience.mouse;
    this.globalFunctions = this.experience.globalFunctions;

    this.resource = this.resources.items.blueWater;

    this.mouseCoords = new THREE.Vector2();

    // Variables
    this.BOUNDS = 512;
    this.BOUNDS_HALF = this.BOUNDS * 0.5;
    this.WIDTH = 128;
    this.NUM_SPHERES = 5;
    this.spheresEnabled = true;
    this.spheres = [];
    this.simplex = new SimplexNoise();
    this.raycaster = new THREE.Raycaster();

    this.readWaterLevelImage;
    this.waterNormal = new THREE.Vector3();

    // Control
    this.effectController = {
      mouseSize: 20.0,
      viscosity: 0.99,
      spheresEnabled: this.spheresEnabled,
    };

    this.setGeometry();
    this.setMaterial();
    this.setMesh();

    this.createRaycaster();

    this.setRaycastMesh();
    this.setGpuComputation();
    this.valuesChanger();

    this.mouse.on("pointermove", (event) => {
      this.setMouseCoords(this.mouse.mouse.x, -this.mouse.mouse.y);
    });

    this.mouse.on("touchmove", (event) => {
      this.setMouseCoords(this.mouse.mouse.x, -this.mouse.mouse.y);
    });
  }

  setGeometry() {
    this.geometry = new THREE.PlaneBufferGeometry(
      this.BOUNDS,
      this.BOUNDS,
      this.WIDTH - 1,
      this.WIDTH - 1
    );
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib["phong"].uniforms,
        {
          heightmap: { value: null },
        },
      ]),
      vertexShader: waterVertexShader,
      fragmentShader: THREE.ShaderChunk["meshphong_frag"],
    });

    this.material.lights = true;

    this.material.color = new THREE.Color("#0a2243");
    this.material.specular = new THREE.Color("#1f2f61");
    this.material.shininess = 0.4;
    this.material.opacity = 1.0;

    // Sets the uniforms with the material values
    this.material.uniforms["diffuse"].value = this.material.color;
    this.material.uniforms["specular"].value = this.material.specular;
    this.material.uniforms["shininess"].value = Math.max(
      this.material.shininess,
      1e-4
    );
    this.material.uniforms["opacity"].value = this.material.opacity;

    // Defines
    this.material.defines.WIDTH = this.WIDTH.toFixed(1);
    this.material.defines.BOUNDS = this.BOUNDS.toFixed(1);

    this.waterUniforms = this.material.uniforms;
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = -15;
    this.mesh.position.z = -27;
    this.mesh.scale.x = 0.1;
    this.mesh.scale.y = 0.1;
    this.mesh.scale.z = 0.1;
    this.mesh.rotateX(-Math.PI * 0.5);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
    this.scene.add(this.mesh);
    this.mesh.visilbe = true;
  }

  setRaycastMesh() {
    // THREE.Mesh just for mouse raycasting
    this.geometryRay = new THREE.PlaneGeometry(
      this.BOUNDS / 2,
      this.BOUNDS,
      1,
      1
    );
    this.meshRay = new THREE.Mesh(
      this.geometryRay,
      new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false })
    );

    this.meshRay.position.y = -15;
    this.meshRay.position.z = -27;
    this.meshRay.scale.x = 0.1;
    this.meshRay.scale.y = 0.1;
    this.meshRay.scale.z = 0.1;

    this.meshRay.rotation.x = -Math.PI / 2;
    this.meshRay.matrixAutoUpdate = false;
    this.meshRay.updateMatrix();
    this.scene.add(this.meshRay);
  }

  setGpuComputation() {
    this.gpuCompute = new GPUComputationRenderer(
      this.WIDTH,
      this.WIDTH,
      this.renderer.instance
    );

    if (this.renderer.instance.capabilities.isWebGL2 === false) {
      this.gpuCompute.setDataType(THREE.HalfFloatType);
    }

    this.heightmap0 = this.gpuCompute.createTexture();

    this.fillTexture(this.heightmap0);

    this.heightmapVariable = this.gpuCompute.addVariable(
      "heightmap",
      heightmapFragmentShader,
      this.heightmap0
    );

    this.gpuCompute.setVariableDependencies(this.heightmapVariable, [
      this.heightmapVariable,
    ]);

    this.heightmapVariable.material.uniforms["mousePos"] = {
      value: new THREE.Vector2(10000, 10000),
    };
    this.heightmapVariable.material.uniforms["mouseSize"] = { value: 10.0 };
    this.heightmapVariable.material.uniforms["viscosityConstant"] = {
      value: 0.98,
    };
    this.heightmapVariable.material.uniforms["heightCompensation"] = {
      value: 0,
    };
    this.heightmapVariable.material.defines.BOUNDS = this.BOUNDS.toFixed(1);

    this.error = this.gpuCompute.init();
    if (this.error !== null) {
      console.error(error);
    }

    // Create compute shader to smooth the water surface and velocity
    this.smoothShader = this.gpuCompute.createShaderMaterial(
      smoothFragmentShader,
      { smoothTexture: { value: null } }
    );

    // Create compute shader to read water level
    this.readWaterLevelShader = this.gpuCompute.createShaderMaterial(
      readWaterLevelFragmentShader,
      {
        point1: { value: new THREE.Vector2() },
        levelTexture: { value: null },
      }
    );
    this.readWaterLevelShader.defines.WIDTH = this.WIDTH.toFixed(1);
    this.readWaterLevelShader.defines.BOUNDS = this.BOUNDS.toFixed(1);

    // Create a 4x1 pixel image and a render target (Uint8, 4 channels, 1 byte per channel) to read water height and orientation
    this.readWaterLevelImage = new Uint8Array(4 * 1 * 4);

    this.readWaterLevelRenderTarget = new THREE.WebGLRenderTarget(4, 1, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: false,
    });
  }

  fillTexture(texture) {
    this.waterMaxHeight = 1;

    this.pixels = texture.image.data;

    this.p = 0;
    for (let j = 0; j < this.WIDTH; j++) {
      for (let i = 0; i < this.WIDTH; i++) {
        this.x = (i * 128) / this.WIDTH;
        this.y = (j * 128) / this.WIDTH;

        this.pixels[this.p + 0] = this.noise(this.x, this.y);
        this.pixels[this.p + 1] = this.pixels[this.p + 0];
        this.pixels[this.p + 2] = 0;
        this.pixels[this.p + 3] = 1;

        this.p += 4;
      }
    }
  }

  noise(x, y) {
    this.multR = this.waterMaxHeight;
    this.mult = 0.025;
    this.r = 0;
    for (let i = 0; i < 15; i++) {
      this.r += this.multR * this.simplex.noise(x * this.mult, y * this.mult);
      this.multR *= 0.53 + 0.025 * i;
      this.mult *= 1.25;
    }

    return this.r;
  }

  valuesChanger() {
    this.heightmapVariable.material.uniforms["mouseSize"].value =
      this.effectController.mouseSize;
    this.heightmapVariable.material.uniforms["viscosityConstant"].value =
      this.effectController.viscosity;
  }

  createRaycaster() {
    this.raycaster = new THREE.Raycaster();
  }

  setMouseCoords(x, y) {
    this.mouseCoords.set(x, y);
    this.mouseMoved = true;
  }

  update() {
    this.uniforms = this.heightmapVariable.material.uniforms;

    if (this.mouseMoved) {
      this.raycaster.setFromCamera(this.mouseCoords, this.camera.instance);
      this.intersects = this.raycaster.intersectObject(this.meshRay);

      if (this.intersects.length > 0) {
        this.point = this.intersects[0].point;
        this.point.x *= 10;

        this.point.z = this.globalFunctions.map(
          this.point.z,
          -50,
          -1,
          -150,
          150
        );
        this.uniforms["mousePos"].value.set(this.point.x, this.point.z);
        document.getElementById("prompts").style.opacity = 0;
        this.trigger("bluemove");
      } else {
        this.trigger("bluestop");
        this.uniforms["mousePos"].value.set(10000, 10000);
      }
      this.mouseMoved = false;
    } else {
      this.trigger("bluestop");
      this.raycaster.setFromCamera(this.mouseCoords, this.camera.instance);
      this.intersects = this.raycaster.intersectObject(this.meshRay);
      if (this.intersects.length > 0) {
        this.uniforms["mousePos"].value.set(10000, 10000);
      }
    }

    if (this.lastMouseMove != this.mouseMoved) {
      if (this.mouseMoved) {
        this.trigger("bluestarts");
      }
    }

    this.lastMouseMove = this.mouseMoved;

    this.gpuCompute.compute();

    // Get compute output in custom uniform
    this.waterUniforms["heightmap"].value =
      this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable).texture;
  }
}
