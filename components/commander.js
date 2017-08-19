/* global THREE AFRAME */

const orientY = {
  N: { x: 0, y: 90, z: 0 },
  W: { x: 0, y: 180, z: 0 },
  S: { x: 0, y: 270, z: 0 },
  E: { x: 0, y: 0, z: 0 }
};

AFRAME.registerComponent("commander", {
  schema: {
    head: { type: "selector" }
  },

  generateBall: function(pos, orient) {
    const newBall = document.createElement("a-entity");
    newBall.setAttribute("mixin", "sphere");
    newBall.setAttribute("position", pos);
    newBall.setAttribute("rotation", orient);
    return newBall;
  },

  init: function() {
    this.beginDelay = this.el.sceneEl.time;
    // TODO: this stuff will be in schema
    this.radius = 2.5;
    this.delay = 1000;

    // direction, momentum
    this.dirMomentum = new THREE.Vector3(this.radius, 0, 0);
    this.nextMomentum = this.dirMomentum.clone();

    // add head to balls array
    this.balls = [
      {
        el: this.data.head,
        posTarget: this.data.head.object3D.position.clone()
      }
    ];

    // add 2 bodies
    for (let i = 1; i < 3; i++) {
      const location = { x: -this.radius * i, y: 1.25, z: -5 };
      const el = this.generateBall(location, orientY.E);
      this.balls.push({
        el,
        posTarget: new THREE.Vector3(location.x, location.y, location.z)
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
      // head.posTarget.add(this.nextMomentum);
      head.posTarget.add(this.nextMomentum);
      this.updateMomentumHandler(this.nextMomentum);

      // move from beginning
      balls.forEach(ball => {
        ball.el.setAttribute("slither-once", {
          targetPos: ball.posTarget
        });
      });
    }
  }
});
