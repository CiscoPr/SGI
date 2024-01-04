  varying vec2 vUv;

  uniform sampler2D uSampler2;

  void main() {
    vec4 texColor = texture2D(uSampler2, vUv);
    gl_FragColor = texColor; // Use the color from the texture

    // Ensure correct blending for transparent pixels
    if (texColor.a < 0.5) discard;
  }