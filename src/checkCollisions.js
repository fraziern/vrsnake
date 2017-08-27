/* global THREE */

const checkCollisions = function(mainMin, mainMax, els) {
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
};
