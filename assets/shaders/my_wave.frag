#include<flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float uTime;
uniform float value;
uniform vec2 uMouse;

out vec4 fragColor;

// void main() {
//   vec2 uv = FlutterFragCoord().xy / uSize;
//   // 移到屏幕中间
//   uv -= 0.5;
//   vec2 normalizedMousePos = uMouse / uSize - 0.5;
//   vec2 longestCorner = vec2(-0.5) * sign(normalizedMousePos);
//   // 最远距离
//   float longestDis = distance(normalizedMousePos, longestCorner);

//   vec3 defaultColor = vec3(1.0, .0, .0);

//   if(distance(normalizedMousePos, uv) < 0.001) {
//     fragColor = vec4(defaultColor, 1.0);
//     return;
//   }

//   vec3 dstColor = vec3(0.0, 1.0, 0.0);
//   // 计算触摸点到四个角最远的距离点

//   // 当前像素点和起点的距离
//   float dis = distance(uv, normalizedMousePos);
//   if (dis > longestDis) {
//     fragColor = vec4(defaultColor, 1.0);
//     return;
//   }

//   float rate = dis / longestDis;
//   float factor = value >= rate ? 1 - (value - rate) / (1 - rate) : value / rate;
//   fragColor = vec4(mix(defaultColor, dstColor, factor), 1.0);
// }

// 计算水波偏移
void main() {
  vec2 uv = FlutterFragCoord().xy / uSize;
  vec2 offset = uv - uMouse; // 计算像素到波纹中心的偏移
  float dist = length(offset); // 距离
  float ripple = 0.1 * sin(10.0 * dist - uTime * 5.0); // 波纹效果

    // 应用波纹偏移
  uv += ripple * normalize(offset);

    // 返回颜色 (示例：蓝色背景)
  fragColor = vec4(0.0, 0.5 + ripple, 1.0, 1.0);
}