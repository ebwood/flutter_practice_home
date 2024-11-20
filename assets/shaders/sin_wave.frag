#include<flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float u_time;

out vec4 fragColor;

void main() {
  vec2 uv = FlutterFragCoord().xy / uSize;

    // 像素相对于画布的中心坐标
  vec2 centered = uv - 0.5;

    // 参数定义
  float amplitude = 20.0 / uSize.y; // 振幅：20像素（归一化）
  float edgeOffset = 10.0 / uSize.y; // 离边距：20像素（归一化）
  float frequency = 10.0; // 波形频率

  float sinT = sin(u_time);
  float cosT = sin(u_time);
    // 顶边的正弦波
  float topWave = sin((uv.x - u_time * 0.2) * frequency) * amplitude * sinT - (.5 - edgeOffset);
  float topEdge = step(abs(centered.y - topWave), 0.05);

    // 底边的正弦波
  float bottomWave = sin((uv.x + u_time * 0.2) * frequency) * amplitude * sinT + (1.0 - edgeOffset);
  float bottomEdge = step(abs(centered.y + 0.5 - bottomWave), 0.05);

    // 左边的正弦波
  float leftWave = sin((uv.y + u_time * 0.2) * frequency) * amplitude * cosT - (.5 - edgeOffset);
  float leftEdge = step(abs(centered.x - leftWave), 0.05);

    // 右边的正弦波
  float rightWave = sin((uv.y - u_time * 0.2) * frequency) * amplitude * cosT + (1.0 - edgeOffset);
  float rightEdge = step(abs(centered.x + 0.5 - rightWave), 0.05);

    // 颜色定义
  vec3 topColor = vec3(1.0, 0.0, 0.0);    // 红色 - 顶边
  vec3 bottomColor = vec3(0.0, 1.0, 0.0); // 绿色 - 底边
  vec3 leftColor = vec3(0.0, 0.0, 1.0);   // 蓝色 - 左边
  vec3 rightColor = vec3(1.0, 1.0, 0.0);  // 黄色 - 右边

    // 合并边界的颜色
  vec3 finalColor = topEdge * topColor +
    bottomEdge * bottomColor +
    leftEdge * leftColor +
    rightEdge * rightColor;

    // 输出颜色
  fragColor = vec4(finalColor, 1.0);
}

// #include <flutter/runtime_effect.glsl>

// uniform vec2 uSize;
// uniform float u_time;

// out vec4 fragColor;

// void main() {
//   vec2 uv = FlutterFragCoord().xy / uSize;

//   // 参数定义
//   float amplitude = 20.0 / uSize.y;  // 振幅：20像素（归一化）
//   float edgeOffset = 10.0 / uSize.y; // 离边距：10像素（归一化）
//   float frequency = 10.0;            // 波形频率
//   float thickness = 0.02;            // 曲线宽度
//   float cornerRadius = 0.05;         // 圆角半径

//   float sinT = sin(u_time);
//   float cosT = cos(u_time);

//   // 顶边的正弦波
//   float topWave = sin((uv.x - u_time * 0.2) * frequency) * amplitude * sinT + edgeOffset;
//   float topEdge = smoothstep(thickness, 0.0, abs(uv.y - topWave));

//   // 底边的正弦波
//   float bottomWave = sin((uv.x + u_time * 0.2) * frequency) * amplitude * sinT + (1.0 - edgeOffset);
//   float bottomEdge = smoothstep(thickness, 0.0, abs(uv.y - bottomWave));

//   // 左边的正弦波
//   float leftWave = sin((uv.y + u_time * 0.2) * frequency) * amplitude * cosT + edgeOffset;
//   float leftEdge = smoothstep(thickness, 0.0, abs(uv.x - leftWave));

//   // 右边的正弦波
//   float rightWave = sin((uv.y - u_time * 0.2) * frequency) * amplitude * cosT + (1.0 - edgeOffset);
//   float rightEdge = smoothstep(thickness, 0.0, abs(uv.x - rightWave));

//   // 圆角处理：计算每个角落的圆形区域
//   vec2 topLeftCorner = vec2(edgeOffset, edgeOffset);
//   vec2 topRightCorner = vec2(1.0 - edgeOffset, edgeOffset);
//   vec2 bottomLeftCorner = vec2(edgeOffset, 1.0 - edgeOffset);
//   vec2 bottomRightCorner = vec2(1.0 - edgeOffset, 1.0 - edgeOffset);

//   float topLeftRadius = smoothstep(cornerRadius, 0.0, length(uv - topLeftCorner));
//   float topRightRadius = smoothstep(cornerRadius, 0.0, length(uv - topRightCorner));
//   float bottomLeftRadius = smoothstep(cornerRadius, 0.0, length(uv - bottomLeftCorner));
//   float bottomRightRadius = smoothstep(cornerRadius, 0.0, length(uv - bottomRightCorner));

//   // 合并圆角与边界
//   float combinedEdge = topEdge + bottomEdge + leftEdge + rightEdge;
//   float combinedCorners = 1.0 - (topLeftRadius + topRightRadius + bottomLeftRadius + bottomRightRadius);

//   // 颜色定义
//   vec3 topColor = vec3(1.0, 0.0, 0.0);    // 红色 - 顶边
//   vec3 bottomColor = vec3(0.0, 1.0, 0.0); // 绿色 - 底边
//   vec3 leftColor = vec3(0.0, 0.0, 1.0);   // 蓝色 - 左边
//   vec3 rightColor = vec3(1.0, 1.0, 0.0);  // 黄色 - 右边

//   // 根据边界和圆角选择颜色
//   vec3 finalColor = topEdge * topColor +
//                     bottomEdge * bottomColor +
//                     leftEdge * leftColor +
//                     rightEdge * rightColor;

//   // 将圆角部分的颜色处理为透明
//   finalColor *= combinedCorners;

//   // 输出颜色
//   fragColor = vec4(finalColor, 1.0);
// }
