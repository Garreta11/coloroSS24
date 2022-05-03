import * as dat from "dat.gui";

export default class Debug {
  constructor() {
    this.ui = new dat.GUI();
    this.ui.closed = true;
  }
}
