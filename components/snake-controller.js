/* global THREE AFRAME */
const calcRotationY = function(source, compare) {
  // find 2d relative rotation in degrees around y axis
  const a2 = Math.atan2(source.z, source.x);
  const a1 = Math.atan2(compare.z, compare.x);
  const sign = a1 > a2 ? 1 : -1;
  const angle = a1 - a2;
  const K = -sign * Math.PI * 2;
  const rotation = Math.abs(K + angle) < Math.abs(angle) ? K + angle : angle;
  return -rotation * (180 / Math.PI); // degree to rad
};

AFRAME.registerComponent("snake-controller", {
  schema: {
    head: { type: "selector" },
    radius: { default: 2.5, type: "number" },
    delay: { default: 1200, type: "number" },
    numStartingBodies: { default: 2, type: "number" }
  },

  init: function() {
    this.delay = this.data.delay;
    this.beginDelay = this.el.sceneEl.time;
    this.notDead = true;

    // direction, momentum, rotation
    this.dirMomentum = new THREE.Vector3(0, 0, 0);
    this.nextMomentum = this.dirMomentum.clone();
    this.headOrientation = 0;
    this.nextOrientation = 0;

    // add head to balls array
    const headPosition = this.data.head.object3D.position;
    this.balls = [
      {
        el: this.data.head,
        posTarget: headPosition.clone()
      }
    ];

    // add 2 bodies
    for (let i = 0; i < this.data.numStartingBodies; i++) {
      this.generateAndAddBall();
    }

    this.changeNextMomentumHandler = this.changeNextMomentumHandler.bind(this);
    this.generateAndAddBall = this.generateAndAddBall.bind(this);

    // register listeners
    this.el.addEventListener("changemomentum", this.changeNextMomentumHandler);
    this.el.addEventListener("gobbled-apple", () => {
      let ball = this.generateAndAddBall();
      ball.classList.add("collidable");
      this.delay -= 50; // speed up snake
    });
    this.el.addEventListener("bad-collision", () => {
      this.notDead = false;
    });
  },

  pause: function() {
    this.notDead = false;
  },

  generateAndAddBall: function() {
    const pos = this.balls[this.balls.length - 1].el.object3D.position;
    // generate
    const newBall = document.createElement("a-entity");
    newBall.setAttribute("mixin", "body");
    // add hit handler by default
    newBall.setAttribute("hit-handler", { emitEvent: "bad-collision" });
    newBall.setAttribute("position", pos);
    // add to ballArray
    this.balls.push({
      el: newBall,
      posTarget: pos.clone()
    });
    this.el.appendChild(newBall);
    return newBall;
  },

  changeNextMomentumHandler: function(data) {
    // data is {x,y,z}
    const detail = data.detail;
    this.nextMomentum.set(detail.x, detail.y, detail.z);
    this.nextOrientation =
      this.headOrientation + calcRotationY(this.dirMomentum, this.nextMomentum);
  },

  tick: function(time) {
    if (this.notDead && time - this.beginDelay >= this.delay) {
      // MOVE!
      this.beginDelay = time;
      let balls = this.balls;

      // copy stuff over from end
      for (let i = balls.length - 1; i > 0; i--) {
        balls[i].posTarget.copy(balls[i - 1].posTarget);
      }
      // set head target according to wasd...
      const head = balls[0];
      head.posTarget.add(this.nextMomentum);
      this.dirMomentum.copy(this.nextMomentum);

      // update head rotation
      if (this.nextOrientation !== this.headOrientation) {
        AFRAME.utils.entity.setComponentProperty(
          head.el,
          "rotation.y",
          this.nextOrientation
        );
        this.headOrientation = this.nextOrientation;
      }

      // move from beginning
      balls.forEach(ball => {
        ball.el.setAttribute("slither-once", {
          targetPos: ball.posTarget,
          animDuration: this.delay * 0.08
        });
      });
    }
  }
});
