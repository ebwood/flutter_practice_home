#ifdef GL_ES
precision mediump float;
#endif

#include<flutter/runtime_effect.glsl>

#define PI 3.14159265359

uniform vec2 uResolution;
uniform float uTime;

out vec4 fragColor;

mat2 rotate2d(float _angle) {
  return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

float box(in vec2 _st, in vec2 _size) {
  // _size: vec2(0.4, 0.1), vec2(0.1, 0.4)
  _size = vec2(0.5) - _size * 0.5;
  // _size: vec2(0.5) - vec2(0.4, 0.1) * 0.5 = vec2(0.3, 0.45), vec2(0.5) - vec2(0.1, 0.4) * 0.5 = vec2(0.45, 0.3)
  vec2 uv = smoothstep(_size, _size + vec2(0.001), _st);
  uv *= smoothstep(_size, _size + vec2(0.001), vec2(1.0) - _st);
  return uv.x * uv.y;
}

float cross(in vec2 _st, float _size){
  // _size: 0.4
  // box(_st, vec2(0.4, 0.1)) + box(_st, vec2(0.1, 0.4))
  return box(_st, vec2(_size, _size / 4.0)) + box(_st, vec2(_size / 4.0, _size));
}

void main() {
  vec2 st = FlutterFragCoord().xy / uResolution;
  vec3 color = vec3(0.0);

  st -= vec2(0.5);
  st = rotate2d(sin(uTime) * PI) * st;
  st += vec2(0.5);

  color += vec3(cross(st, 0.4));
  fragColor = vec4(color, 1.0);
}
