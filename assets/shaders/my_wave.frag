#include<flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float uTime;
uniform float value;
uniform vec2 uMouse;

out vec4 fragColor;

void main() {
  vec2 uv = FlutterFragCoord().xy / uSize;
  // 移到屏幕中间
  uv -= 0.5;
  vec2 pos = uMouse / uSize;
  pos -= 0.5;
  if (pos == uv) {
    fragColor = vec4(1.0);
    return;
  }

  // 计算触摸点到四个角最远的距离点
  vec2 longestCorner = vec2(-0.5) * sign(pos);
  // 最远距离
  float longestDis = distance(pos, longestCorner);

  // 当前像素点和起点的距离
  float dis = distance(uv, pos);

  float rate = dis / longestDis;
  if (value >= rate) {
    fragColor = vec4(1.0);
  } else {
    fragColor = vec4(vec3(rate - value), 1.0);
  }
}