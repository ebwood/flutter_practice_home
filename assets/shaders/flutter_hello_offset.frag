#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#include<flutter/runtime_effect.glsl>

uniform vec2 uResolution;
uniform float uTime;

out vec4 fragColor;

vec2 brickTile(vec2 _st, float _zoom) {
  _st *= _zoom;
  _st.x += step(1., mod(_st.y, 2.0)) * 0.5 * abs(sin(uTime));
  _st.y += (1.0 - step(1., mod(_st.x, 2.0))) * 0.5 * abs(sin(uTime));

  return fract(_st);
}

float box(vec2 _st, vec2 _size, float _smoothEdges) {
  _size = vec2(0.5) - _size * 0.5;
  vec2 uv = smoothstep(_size, _size + _smoothEdges, _st);
  uv *= smoothstep(_size, _size + _smoothEdges, vec2(1.0) - _st);
  return uv.x * uv.y;
}

vec2 tile(vec2 _st, float _zoom) {
  _st *= _zoom;
  return fract(_st);
}

vec2 rotate2D(vec2 _st, float _angle) {
  _st -= 0.5;
  _st = mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle)) * _st;
  _st += 0.5;
  return _st;
}

vec2 rotateTilePattern(vec2 _st) {
  _st *= 2.0;

  float index = 0.0;
  index += step(1., mod(_st.x, 2.0));
  index += step(1., mod(_st.y, 2.0)) * 2.0;

  _st = fract(_st);

  if(index == 1.0) {
    _st = rotate2D(_st, PI * 0.5);
  } else if(index == 2.0) {
    _st = rotate2D(_st, PI * -0.5);
  } else if(index == 3.0) {
    _st = rotate2D(_st, PI);
  }
  return _st;
}

void main() {
  vec2 st = FlutterFragCoord().xy / uResolution;
  vec3 color = vec3(.0);

  // st = tile(st, 4.0);
  // st = rotate2D(st, abs(sin(uTime * 0.1)) * PI);
  // st = rotateTilePattern(st);

  st = tile(st, 2.0);
  st = rotate2D(st, -PI * uTime * 0.25);
  st = rotateTilePattern(st * 2.);
  st = rotate2D(st, PI * uTime * 0.25);
  st = rotate2D(st, -PI * uTime * 0.25);
  st = rotateTilePattern(st * 2.);
  st = rotate2D(st, PI * uTime * 0.25);
  st = rotate2D(st, -PI * uTime * 0.25);
  // st = rotateTilePattern(st * 2.);
  // st = rotate2D(st, PI * uTime * 0.25);

  // 左半边黑色，右半边白色
  color = vec3(step(st.x, st.y));
  fragColor = vec4(color, 1.0);
}