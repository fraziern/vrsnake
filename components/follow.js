/* global AFRAME THREE */

AFRAME.registerComponent("follow", {
  schema: {
    target: { type: "selector" },
    speed: { type: "number" }
  },
  init: function() {
    this.directionVec3 = new THREE.Vector3();
    this.speed = this.data.speed;
    this.el.sceneEl.addEventListener("gobbled-apple", () => {
      this.speed += 0.2; // speed up camera move
    });
  },
  tick: function(time, timeDelta) {
    let directionVec3 = this.directionVec3;
    // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
    let targetPosition = this.data.target.object3D.position;
    let currentPosition = this.el.object3D.position;
    // Subtract the vectors to get the direction the entity should head in.
    directionVec3.copy(targetPosition).sub(currentPosition);
    // Calculate the distance.
    let distance = directionVec3.length();
    // Don't go any closer if a close proximity has been reached.
    if (distance < 5) {
      return;
    }
    // Scale the direction vector's magnitude down to match the speed.
    let factor = this.speed / distance;
    ["x", "y", "z"].forEach(function(axis) {
      directionVec3[axis] *= factor * (timeDelta / 1000);
    });
    // Translate the entity in the direction towards the target.
    // don't change Y.
    this.el.setAttribute("position", {
      x: currentPosition.x + directionVec3.x,
      y: currentPosition.y,
      z: currentPosition.z + directionVec3.z
    });
  }
});
