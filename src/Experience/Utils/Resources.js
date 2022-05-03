import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import EventEmitter from "./EventEmitter";
import Experience from "../Experience";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    gsap.registerPlugin(ScrollTrigger);

    // Options
    this.sources = sources;
    this.experience = new Experience();
    this.camera = this.experience.camera;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.fbxLoader = new FBXLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (model) => {
          this.sourceLoaded(source, model);
        });
      } else if (source.type === "fbxModel") {
        this.loaders.fbxLoader.load(source.path, (model) => {
          this.sourceLoaded(source, model);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.file, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }
  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;
    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
