#ifdef GL_ES
precision mediump float;
#endif

#include<flutter/runtime_effect.glsl>

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform sampler2D uTexture;

out vec4 fragColor;

void main() {
  vec2 st = FlutterFragCoord().xy / uResolution;
  st *= 7.0;
  float iPos = floor(st.x);
  float fPos = fract(st.x);

  vec3 color1 = vec3(1.0, 0.588, 0.816);
  vec3 color2 = vec3(1.0, 0.710, 0.925);
  vec3 color3 = vec3(1.0, 0.545, 0.545);
  vec3 color4 = vec3(1.0, 0.753, 0.216);
  vec3 color5 = vec3(1.0, 0.620, 0.365);
  vec3 color6 = vec3(0.988, 1.0, 0.357);
  vec3 color7 = vec3(1.0, 0.588, 0.816);

  vec3 color = vec3(0.0);
  if(iPos == 0.0) {
    color = color1;
  } else if(iPos == 1.0) {
    color = color2;
  } else if(iPos == 2.0) {
    color = color3;
  } else if(iPos == 3.0) {
    color = color4;
  } else if(iPos == 4.0) {
    color = color5;
  } else if(iPos == 5.0) {
    color = color6;
  } else if(iPos == 6.0) {
    color = color7;
  }

  if(iPos == 0.0) {
    color = mix(color1, color2, fPos);
  } else if(iPos == 1.0) {
    color = mix(color2, color3, fPos);
  } else if(iPos == 2.0) {
    color = mix(color3, color4, fPos);
  } else if(iPos == 3.0) {
    color = mix(color4, color5, fPos);
  } else if(iPos == 4.0) {
    color = mix(color5, color6, fPos);
  } else if(iPos == 5.0) {
    color = mix(color6, color7, fPos);
  } else {
    color = mix(color7, color1, fPos);
  }

  fragColor = vec4(color, 1.0);
}