#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform sampler2D uSampler3;
uniform float timeFactor;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	vec4 filter = texture2D(uSampler2, vTextureCoord);

	vec4 aux = color * filter;

	color.r -= aux.r * 0.2;
	color.g -= aux.b * 0.2;
	color.b -= aux.g * 0.2;

	gl_FragColor = color;
}
