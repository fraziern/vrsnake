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

AFRAME.registerComponent("commander", {
  schema: {
    head: { type: "selector" }
  },

  generateBall: function(pos) {
    const newBall = document.createElement("a-entity");
    newBall.setAttribute("mixin", "sphere");
    newBall.setAttribute("position", pos);
    return newBall;
  },

  init: function() {
    this.beginDelay = this.el.sceneEl.time;
    // TODO: this stuff will be in schema
    this.radius = 2.5;
    this.delay = 1000;

    // direction, momentum, rotation
    this.dirMomentum = new THREE.Vector3(this.radius, 0, 0);
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
    for (let i = 1; i < 3; i++) {
      const el = this.generateBall(headPosition);
      this.balls.push({
        el,
        posTarget: headPosition.clone()
      });
      this.el.appendChild(el);
    }

    this.changeNextMomentumHandler = this.changeNextMomentumHandler.bind(this);
    this.updateMomentumHandler = this.updateMomentumHandler.bind(this);

    // register listeners
    this.el.addEventListener("changemomentum", this.changeNextMomentumHandler);
  },

  changeNextMomentumHandler: function(data) {
    // data is {x,y,z}
    const detail = data.detail;
    this.nextMomentum.set(detail.x, detail.y, detail.z);
    this.nextOrientation =
      this.headOrientation + calcRotationY(this.dirMomentum, this.nextMomentum);
  },

  updateMomentumHandler: function(data) {
    // data is a Vector3
    this.dirMomentum.copy(data);
  },

  tick: function(time, timeDelta) {
    if (time - this.beginDelay >= this.delay) {
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
      this.updateMomentumHandler(this.nextMomentum);

      // update head rotation
      // TODO make this animated? with a "rotate-once" component?
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
          targetPos: ball.posTarget
        });
      });
    }
  }
});
