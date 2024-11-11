#ifdef GL_ES
precision mediump float;
#endif

#include<flutter/runtime_effect.glsl>
// #include<boxBlur.glsl>

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform sampler2D uTexture;

out vec4 fragColor;

void main() {
  vec2 st = FlutterFragCoord().xy / uResolution.xy;
  st.x *= uResolution.x / uResolution.y;

  vec4 color = vec4(0.);

  const int kernelSize = 3;
  float accumWeight = 0.;
  float kernelSize2 = kernelSize * kernelSize;
  float weight = 1. / kernelSize2;

  for(int j = 0; j < kernelSize; j++) {
    float y = -.5 * (kernelSize - 1.) + float(j);
    for(int i = 0; i < kernelSize; i++) {
      float x = -.5 * (kernelSize - 1.) + float(i);
      color += texture(uTexture, st + vec2(x, y) * uMouse) * weight;
    }
  }

  fragColor = color;
}