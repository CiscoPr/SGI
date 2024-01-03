attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;
uniform sampler2D WaterMap;
uniform float timeFactor;

void main() {
	float x = aTextureCoord.x;
	float y = aTextureCoord.y;
	vTextureCoord = vec2(x,y);
	vec3 offset= aVertexNormal* texture2D(uSampler2, vTextureCoord).b * 0.5;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset , 1.0);
}
