#ifdef GL_ES
precision mediump float;
#endif

#include<flutter/runtime_effect.glsl>

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
// uniform vec3[] uColors;
uniform sampler2D uTexture;

out vec4 fragColor;
vec3 color1 = vec3(1.0, 0.588, 0.816);
vec3 color2 = vec3(1.0, 0.710, 0.925);
vec3 color3 = vec3(1.0, 0.545, 0.545);
vec3 color4 = vec3(1.0, 0.753, 0.216);
vec3 color5 = vec3(1.0, 0.620, 0.365);
vec3 color6 = vec3(0.988, 1.0, 0.357);

// vec3 color1 = vec3(0.839, 0.702, 0.914);
// vec3 color2 = vec3(0.776, 0.698, 0.937);
// vec3 color3 = vec3(0.749, 0.698, 0.953);
// vec3 color4 = vec3(0.667, 0.796, 0.961);
// vec3 color5 = vec3(0.655, 0.831, 0.941);
// vec3 color6 = vec3(0.651, 0.886, 0.918);

vec3 hsb2rgb(in vec3 c) {
  vec3 rgb = vec3(0.0);
  float angle = c.x * 6.0;
  float iPos = floor(angle);
  float fPos = fract(angle);
  if(iPos == 0.0) {
    rgb = mix(color1, color2, fPos);
  } else if(iPos == 1.0) {
    rgb = mix(color2, color3, fPos);
  } else if(iPos == 2.0) {
    rgb = mix(color3, color4, fPos);
  } else if(iPos == 3.0) {
    rgb = mix(color4, color5, fPos);
  } else if(iPos == 4.0) {
    rgb = mix(color5, color6, fPos);
  } else if(iPos == 5.0) {
    rgb = mix(color6, color1, fPos);
  }
  return rgb;
}

mat2 rotate2d(float _angle) {
  return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

vec4 getColor(vec2 uv, vec4 fragColor) {
  float frequency = 5.0;
  float amplitude = 0.01;
  float range = amplitude * 4;

  float phase = uTime * 5.0;

  uv -= vec2(0.5);
  float sinWaveX = amplitude * (2 +  sin(uv.y * frequency + phase)) - 0.5;
  float sineWaveY = amplitude * (2 + sin(uv.x * frequency + phase)) - 0.5;

  if(uv.x < sinWaveX || uv.x > sinWaveX + 1 - range || uv.y < sineWaveY || uv.y > sineWaveY + 1 - range) {
    return fragColor.rgba;
  } else {
    return vec4(0.0);
  }
}

void main() {
  vec2 uv = FlutterFragCoord().xy / uResolution;
  vec2 stack = uv;

  uv -= vec2(0.5);
  uv = rotate2d(uTime * 0.5) * uv;
  uv += vec2(0.5);

  vec3 color = vec3(0.0);

  vec2 toCenter = vec2(0.5) - uv;
  float angle = atan(toCenter.y, toCenter.x);
  float radius = length(toCenter) * 2.0;

  color = hsb2rgb(vec3((angle / TWO_PI) + 0.5, radius, 1.0));
  fragColor = vec4(color, 1.0);

  fragColor = getColor(stack, fragColor);
}
