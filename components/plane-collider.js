/* global AFRAME THREE */

AFRAME.registerComponent("plane-collider", {
  schema: {
    objects: { default: "" },
    state: { default: "collided" }
  },

  init: function() {
    this.els = [];
    this.collisions = [];
    this.elMax = new THREE.Vector3();
    this.elMin = new THREE.Vector3();
  },

  // update object list
  update: function() {
    const data = this.data;
    let objectEls;

    if (data.objects) {
      objectEls = this.el.sceneEl.querySelectorAll(this.data.objects);
    } else {
      objectEls = this.el.sceneEl.children;
    }

    // convert to array
    this.els = Array.prototype.slice.call(objectEls);
  },

  tick: (function() {
    let boundingBox = new THREE.Box3();
    return function() {
      const handleHit = hitEl => {
        hitEl.emit("hit");
        hitEl.addState(this.data.state);
        this.el.emit("hit", { el: hitEl });
      };

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
      collisions.forEach(handleHit);
      // store new collisions
      this.collisions = collisions;
    };
  })()
});
