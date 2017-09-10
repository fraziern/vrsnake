/* global AFRAME THREE */

AFRAME.registerComponent("plane-collider", {
  schema: {
    objects: { default: ".collidable" },
    state: { default: "collided" }
  },

  init: function() {
    this.els = [];
    this.elMax = new THREE.Vector3();
    this.elMin = new THREE.Vector3();
    this.observer = null;
    this.tick = AFRAME.utils.throttleTick(this.throttledTick, 30, this);
    this.handleHit = this.handleHit.bind(this);
  },

  remove: function() {
    this.pause();
  },

  play: function() {
    var sceneEl = this.el.sceneEl;

    if (this.data.watch) {
      this.observer = new MutationObserver(this.update.bind(this, null));
      this.observer.observe(sceneEl, { childList: true, subtree: true });
    }
  },

  pause: function() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },

  /**
     * Update list of entities to test for collision.
     */
  update: function() {
    var data = this.data;
    var objectEls;

    // Push entities into list of els to intersect.
    if (data.objects) {
      objectEls = this.el.sceneEl.querySelectorAll(data.objects);
    } else {
      // If objects not defined, intersect with everything.
      objectEls = this.el.sceneEl.children;
    }
    // Convert from NodeList to Array
    this.els = Array.prototype.slice.call(objectEls);
  },

  handleHit: function(hitEl) {
    hitEl.emit("hit");
    hitEl.addState(this.data.state);
    this.el.emit("hit", { el: hitEl });
  },

  checkCollisions: function(mainMin, mainMax, els) {
    // pure function that can be used externally
    // check bounding box of main against all els
    let boundingBox = new THREE.Box3();
    let collisions = [];
    els.forEach(el => {
      if (!el.isEntity) return;
      let mesh = el.getObject3D("mesh");
      if (!mesh) return;
      boundingBox.setFromObject(mesh);
      let elMin = boundingBox.min;
      let elMax = boundingBox.max;
      let intersected =
        mainMin.x <= elMax.x &&
        mainMax.x >= elMin.x &&
        (mainMin.z <= elMax.z && mainMax.z >= elMin.z);
      if (intersected) {
        collisions.push(el);
      }
    });
    return collisions;
  },

  throttledTick: (function() {
    let boundingBox = new THREE.Box3();
    return function() {
      const updateBoundingBox = () => {
        boundingBox.setFromObject(mesh);
        this.elMin.copy(boundingBox.min);
        this.elMax.copy(boundingBox.max);
      };

      var mesh = this.el.getObject3D("mesh");
      // No mesh, no collisions
      if (!mesh) return;
      // update locations
      this.update();
      // update bounding Box
      updateBoundingBox();
      // update collisions
      let collisions = this.checkCollisions(this.elMin, this.elMax, this.els);
      // emit events
      collisions.forEach(this.handleHit);
    };
  })()
});
