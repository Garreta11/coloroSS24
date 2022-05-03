import EventEmitter from "./EventEmitter";

export default class GlobalFunctions extends EventEmitter {
  constructor() {
    super();
  }

  map(number, inMin, inMax, outMin, outMax) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  rotateObject(object, degreeX = 0, degreeY = 0, degreeZ = 0) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
  }

  randomFromInterval(min, max) {
    // min and max included
    return Math.random() * (max - min + 1) + min;
  }
}
