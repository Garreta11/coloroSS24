import EventEmitter from "./EventEmitter";
import Experience from "../Experience";

export default class Time extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.experience = new Experience();
    this.stats = this.experience.stats;
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    // this.stats.stats.begin();
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger("tick");
    // this.stats.stats.end();

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
