import StatsShow from "three/examples/jsm/libs/stats.module.js";
import EventEmitter from "./EventEmitter";

export default class Stats extends EventEmitter {
  constructor() {
    super();
    this.stats = new StatsShow();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }
}
