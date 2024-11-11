#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#include<flutter/runtime_effect.glsl>

uniform vec2 uResolution;
uniform float uTime;

out vec4 fragColor;

mat2 scale(vec2 _scale) {
  return mat2(_scale.x, 0., 0., _scale.y);
}

float box(in vec2 _st, in vec2 _size) {
  _size = vec2(.5) - _size * .5;
  vec2 uv = smoothstep(_size, _size + vec2(.001), _st);
  uv *= smoothstep(_size, _size + vec2(.001), vec2(1.) - _st);
  return uv.x * uv.y;
}

float cross(in vec2 _st, float _size) {
  return box(_st, vec2(_size, _size / 4.)) +
    box(_st, vec2(_size / 4., _size));
}

mat2 rotate2d(float _angle) {
  return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

// YUV to RGB matrix
mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983, 1.0, -0.39465, -0.58060, 1.0, 2.03211, 0.0);

// RGB to YUV matrix
mat3 rgb2yuv = mat3(0.2126, 0.7152, 0.0722, -0.09991, -0.33609, 0.43600, 0.615, -0.5586, -0.05639);

void main() {
  vec2 st = FlutterFragCoord().xy / uResolution;
  vec3 color = vec3(0.0);

  vec2 translate = vec2(cos(uTime), sin(uTime));
  st += translate * 0.35;
  st -= vec2(0.5);
  // st = rotate2d(sin(uTime) * PI) *  scale(vec2(sin(uTime) * 2.0 + 1.0))  * st;
  st = scale(vec2(sin(uTime) * 2.0 + 1.0)) * rotate2d(sin(uTime) * PI) * st;
  st += vec2(0.5);

  color = vec3(st.x, st.y, 0.0);

  color += vec3(cross(st, 0.4));

  // UV values goes from -1 to 1
  color = vec3(0.0);
    // So we need to remap st (0.0 to 1.0)
  st -= 0.5;  // becomes -0.5 to 0.5
  st *= 2.0;  // becomes -1.0 to 1.0

    // we pass st as the y & z values of
    // a three dimensional vector to be
    // properly multiply by a 3x3 matrix
  color = yuv2rgb * vec3(0.5, 0.5, 0.5);//st.x, st.y);
  fragColor = vec4(color, 1.0);
}