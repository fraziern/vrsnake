/* global AFRAME THREE */

AFRAME.registerComponent("plane-collider", {
  schema: {
    objects: { default: ".collidable" },
    state: { default: "collided" }
  },

  init: function() {
    this.els = [];
    this.collisions = [];
    this.elMax = new THREE.Vector3();
    this.elMin = new THREE.Vector3();
    this.observer = null;

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

  tick: (function() {
    let boundingBox = new THREE.Box3();
    return function() {
      const updateBoundingBox = () => {
        boundingBox.setFromObject(mesh);
        this.elMin.copy(boundingBox.min);
        this.elMax.copy(boundingBox.max);
      };

      // AABB collision detection
      const intersect = el => {
        if (!el.isEntity) {
          return;
        }
        let intersected;
        let mesh = el.getObject3D("mesh");
        let elMin;
        let elMax;
        if (!mesh) {
          return;
        }
        boundingBox.setFromObject(mesh);
        elMin = boundingBox.min;
        elMax = boundingBox.max;
        // for this game we only need to check 2 dimensions on a plane
        intersected =
          this.elMin.x <= elMax.x &&
          this.elMax.x >= elMin.x &&
          (this.elMin.z <= elMax.z && this.elMax.z >= elMin.z);
        if (intersected) {
          collisions.push(el);
        }
      };

      var mesh = this.el.getObject3D("mesh");
      // No mesh, no collisions
      if (!mesh) {
        return;
      }
      var collisions = [];
      // update bounding Box
      updateBoundingBox();
      // update collisions
      this.els.forEach(intersect);
      // emit events
      collisions.forEach(this.handleHit);
      // store new collisions
      this.collisions = collisions;
    };
  })()
});
