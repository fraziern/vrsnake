/* global AFRAME THREE */
function radToDeg(rad) {
  return rad * (180 / Math.PI);
}

AFRAME.registerComponent("slither", {
  schema: {
    delay: { default: 1000, type: "number" },
    animDuration: { default: 100, type: "number" },
    follow: { type: "selector" }
  },

  init: function() {
    this.lastMoveTime = performance.now();
    this.el.lastMoveLocation = this.el.object3D.position;
    this.target = new THREE.Vector3();

    this.target.copy(this.el.lastMoveLocation);

    this.getTarget = this.getTarget.bind(this);
  },

  getYRotation: function(source, compare) {
    // Remember high school math?
    // u and v are vectors. return relative angle between the two in degrees
    const a2 = Math.atan2(source.z, source.x);
    const a1 = Math.atan2(compare.z, compare.x);
    const sign = a1 > a2 ? 1 : -1;
    const angle = a1 - a2;
    const K = -sign * Math.PI * 2;
    const answer = Math.abs(K + angle) < Math.abs(angle) ? K + angle : angle;
    return radToDeg(-answer);
  },

  getTarget: function() {
    if (this.el.velocity) {
      // if we have a velocity, add that to lastMoveLocation
      this.target.copy(this.el.lastMoveLocation);
      this.target.add(this.el.velocity);
    } else if (this.data.follow) {
      // if not we should have a follow. get the lastMoveLocation of follow
      this.target.copy(this.data.follow.lastMoveLocation);
    } else {
      console.log("error, no target found");
    }
  },

  tick: function(time, timeDelta) {
    if (time - this.lastMoveTime >= this.data.delay) {
      // time to move
      let lastMoveLocation = this.el.lastMoveLocation;

      // if we haven't started moving yet, get a new target
      if (lastMoveLocation.equals(this.target)) this.getTarget();

      // if we should be at our target destination, move there and update state
      if (
        time - this.lastMoveTime >=
        this.data.delay + this.data.animDuration
      ) {
        this.lastMoveTime = time;
        lastMoveLocation.copy(this.target);
        this.el.setAttribute("position", {
          x: lastMoveLocation.x,
          y: lastMoveLocation.y,
          z: lastMoveLocation.z
        });
      } else {
        // otherwise let's inch towards the target
        const animElapsed = time - (this.lastMoveTime + this.data.delay);
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
      }
    }
  }
});
