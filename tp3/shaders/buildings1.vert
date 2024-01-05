uniform sampler2D uSampler1;
uniform float bumpScale;

varying vec2 vUv;

void main(){
    vUv = uv;
    vec3 offset = vec3(bumpScale * texture2D(uSampler1, vUv).x);
    vec3 newPosition = position + offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
