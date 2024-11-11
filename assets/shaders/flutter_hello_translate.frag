#ifdef GL_ES
precision mediump float;
#endif

#include<flutter/runtime_effect.glsl>

uniform vec2 uResolution;
uniform float uTime;

out vec4 fragColor;

float box(in vec2 _st, in vec2 _size) {
  _size = vec2(0.5) - _size * 0.5;
  vec2 uv = smoothstep(_size, _size + vec2(0.001), _st);
  uv *= smoothstep(_size, _size + vec2(0.001), vec2(1.0) - _st);
  return uv.x * uv.y;
}

float cross(in vec2 _st, float _size){
  return box(_st, vec2(_size, _size / 4.0)) + box(_st, vec2(_size / 4.0, _size));
}

void main() {
    vec2 st = FlutterFragCoord().xy / uResolution;
    vec2 translate = vec2(cos(uTime), sin(uTime));
    st += translate * 0.35;
    vec3 color = vec3(0.0);
    color = vec3(st.x,st.y,0.0);
    color += vec3(cross(st, 0.25));
    fragColor = vec4(color, 1.0);
}