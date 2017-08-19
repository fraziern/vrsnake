/* global AFRAME THREE */
function radToDeg(rad) {
  return rad * (180 / Math.PI);
}

AFRAME.registerComponent("slither-once", {
  schema: {
    animDuration: { default: 100, type: "number" },
    targetPos: { type: "vec3" },
    targetRot: { type: "vec3" }
  },

  init: function() {
    this.lastMoveTime = this.el.sceneEl.time;
    this.lastMoveLocation = this.el.object3D.position;
    this.target = new THREE.Vector3();
    const targetPos = this.data.targetPos;
    this.target.set(targetPos.x, targetPos.y, targetPos.z);
  },

  update: function(oldData) {
    if (this.data.targetPos != oldData.targetPos) {
      this.lastMoveTime = this.el.sceneEl.time;
      this.lastMoveLocation = this.el.object3D.position;
    }
  },

  tick: function(time, timeDelta) {
    if (time - this.lastMoveTime <= this.data.animDuration) {
      // time to move
      const lastMoveLocation = this.lastMoveLocation;
      const animElapsed = time - this.lastMoveTime;
      const animElapsedFactor = animElapsed / this.data.animDuration;
      let movement = {};
      ["x", "y", "z"].forEach(axis => {
        movement[axis] =
          (this.target[axis] - lastMoveLocation[axis]) * animElapsedFactor;
      });

      this.el.setAttribute("position", {
        x: lastMoveLocation.x + movement.x,
        y: lastMoveLocation.y + movement.y,
        z: lastMoveLocation.z + movement.z
      });
    } else {
      // if we should be at our target destination, move there and remove self
      this.el.setAttribute("position", {
        x: this.target.x,
        y: this.target.y,
        z: this.target.z
      });
      this.el.removeAttribute("slither-once");
    }
  }
});
