/* global AFRAME THREE */

AFRAME.registerComponent("plane-collider", {
  schema: {
    whitelist: { default: "" }
  },

  init: function() {
    this.els = [];
    this.collisions = [];
    this.elMax = new THREE.Vector2();
    this.elMin = new THREE.Vector2();
  },

  // update object list
  update: function() {
    const data = this.data;
    let objectEls;

    if (data.whitelist) {
      objectEls = this.el.sceneEl.querySelectorAll(`:not(${data.whitelist})`);
    } else {
      objectEls = this.el.sceneEl.children;
    }

    // convert to array
    this.els = Array.prototype.slice.call(objectEls);
    console.log(this.els);
  }
});
