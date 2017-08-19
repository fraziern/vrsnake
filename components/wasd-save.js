/* global AFRAME THREE */

// TODO remove newVelocity

AFRAME.registerComponent("wasd-save", {
  schema: {
    speed: { default: 2.5, type: "number" }
  },

  init: function() {
    this.newVelocity = new THREE.Vector3(); // reusable vector
    this.onKeyDown = this.onKeyDown.bind(this);
    window.addEventListener("keydown", this.onKeyDown, false);
  },

  onKeyDown: function(e) {
    const speed = this.data.speed;
    switch (e.keyCode) {
    case 65: // left
      this.newVelocity.set(-speed, 0, 0);
      break;
    case 68: // right
      this.newVelocity.set(speed, 0, 0);
      break;
    case 87: // up
      this.newVelocity.set(0, 0, -speed);
      break;
    case 83: // down
      this.newVelocity.set(0, 0, speed);
      break;
    }
    // this.el.rotate = this.getYRotation(this.el.velocity, this.newVelocity);
    this.el.sceneEl.emit("changemomentum", this.newVelocity);
  }
});
