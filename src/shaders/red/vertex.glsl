uniform float uTime;
uniform float uDragReleaseTime;
uniform float uDragRelease;
uniform vec3 uDragStart;
uniform vec3 uDragTarget;

varying float vDistortion;


void main() {
    float startToTarget = distance(uDragTarget, uDragStart);
    float distanceToStart = distance(position, uDragStart);
    float influence = distanceToStart / (0. + 0.3 * startToTarget);
    float distortion = exp(influence * -3.2);

    if (uDragRelease > 0.) {
        float timeSinceRelease = uTime - uDragReleaseTime;
        distortion *= exp(-3. * timeSinceRelease);
        distortion *= sin(timeSinceRelease * 50.);
    }

    vec3 stretch = (uDragTarget - uDragStart) * distortion;
    vec3 newPosition = position;
    newPosition += stretch;
    newPosition.z += distanceToStart * distortion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.);

    vDistortion = distortion;
}
