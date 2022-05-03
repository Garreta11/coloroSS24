import * as THREE from "three";
import EventEmitter from "./EventEmitter";
import Experience from "../Experience";

export default class Mouse extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.sizes = this.experience.sizes;

    this.mouse = new THREE.Vector2();
    this.mouseMovement = new THREE.Vector2();

    window.addEventListener("mousedown", (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = (event.clientY / this.sizes.height) * 2 - 1;

      this.mouseMovement.x = event.movementX;
      this.mouseMovement.y = event.movementY;

      this.trigger("mousedown");
    });

    window.addEventListener("onmousedown", (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = (event.clientY / this.sizes.height) * 2 - 1;

      this.mouseMovement.x = event.movementX;
      this.mouseMovement.y = event.movementY;
      this.trigger("onmousedown");
    });

    window.addEventListener("mouseup", (event) => {
      this.trigger("mouseup");
    });

    window.addEventListener("mousemove", (event) => {
      event.preventDefault();

      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = (event.clientY / this.sizes.height) * 2 - 1;

      this.mouseMovement.x = event.movementX;
      this.mouseMovement.y = event.movementY;

      this.currentEvent = event;

      this.trigger("mouseMove");
    });

    window.addEventListener(
      "touchstart",
      (event) => {
        this.mouse.x = (event.touches[0].clientX / this.sizes.width) * 2 - 1;
        this.mouse.y = (event.touches[0].clientY / this.sizes.height) * 2 - 1;

        this.trigger("onmousedown");
        this.trigger("mousedown");
      },
      { passive: true }
    );

    window.addEventListener(
      "touchend",
      (event) => {
        this.trigger("mouseup");
      },
      { passive: false }
    );

    window.addEventListener(
      "touchmove",
      (event) => {
        event.preventDefault();

        this.mouse.x = (event.touches[0].clientX / this.sizes.width) * 2 - 1;
        this.mouse.y = (event.touches[0].clientY / this.sizes.height) * 2 - 1;

        this.trigger("mouseMove");
      },
      { passive: false }
    );

    window.addEventListener("pointermove", (event) => {
      this.trigger("pointermove");
      this.trigger("mouseMove");
    });
  }
}
