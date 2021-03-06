/* global AFRAME THREE */

AFRAME.registerComponent("slither-once", {
  schema: {
    animDuration: { default: 100, type: "number" },
    targetPos: { type: "vec3" }
  },

  init: function() {
    this.lastMoveLocation = this.el.object3D.position;
    this.target = new THREE.Vector3();
    this.update();
  },

  update: function(oldData) {
    if (oldData && this.data.targetPos != oldData.targetPos) {
      this.lastMoveTime = this.el.sceneEl.time;
      this.lastMoveLocation.copy(this.el.object3D.position);
      const targetPos = this.data.targetPos;
      this.target.set(targetPos.x, targetPos.y, targetPos.z);
    }
  },

  tick: function(time) {
    const easeOut = (t, d) => 1 - Math.pow(1 - t / d, 4);

    if (time - this.lastMoveTime <= this.data.animDuration) {
      // time to move
      const lastMoveLocation = this.lastMoveLocation;
      const animElapsed = time - this.lastMoveTime;
      const animElapsedFactor = easeOut(animElapsed, this.data.animDuration);
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
    }
  }
});
