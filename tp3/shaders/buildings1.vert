uniform sampler2D uSampler1;
uniform float bumpScale;

varying vec2 vUv;

void main(){
	vUv = uv;
	float x = vUv.x;
	float y = vUv.y;
	vec3 offset = aVertexNormal * bumpScale * texture2D(uSampler1, vUv).x * 0.5;
	vec3 newPosition = position + offset;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
