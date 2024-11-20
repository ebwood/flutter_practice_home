precision mediump float;

#include <flutter/runtime_effect.glsl>

// 输入变量
uniform vec2 u_resolution;  // 窗口尺寸 (600x800)
uniform float u_time;       // 时间变量，用于实现滚动效果

out vec4 fragColor;

void main() {
    // 归一化像素坐标 (0.0 ~ 1.0)
  vec2 uv = FlutterFragCoord().xy / u_resolution;

    // 转换到 [-1, 1] 范围中心对齐的坐标系
  vec2 pos = uv * 2.0 - 1.0;

  // 参数定义
  float amplitude = 10.0 / u_resolution.y; // 将10像素幅度归一化
  float frequency = 20.0;                 // 波的频率
  float speed = 2.0;                      // 波的滚动速度
  float offset = 20.0 / u_resolution.y;    // 偏移5像素的归一化值

    // 定义正弦波（基线移动至离边框5像素）
  float top_wave = offset + amplitude * sin(pos.x * frequency + u_time * speed);
  float bottom_wave = -offset + amplitude * sin(pos.x * frequency - u_time * speed);
  float left_wave = -offset + amplitude * sin(pos.y * frequency + u_time * speed);
  float right_wave = offset + amplitude * sin(pos.y * frequency - u_time * speed);

    // 距离边界的距离
  float top_dist = abs(pos.y - (1.0 - top_wave));       // 上边波动
  float bottom_dist = abs(pos.y - (-1.0 - bottom_wave)); // 下边波动
  float left_dist = abs(pos.x - (-1.0 - left_wave));    // 左边波动
  float right_dist = abs(pos.x - (1.0 - right_wave));   // 右边波动

    // 判断是否在波动区域
  float edge_width = 30.0 / u_resolution.y; // 边界宽度（10px）
  float is_edge = step(top_dist, edge_width) +
    step(bottom_dist, edge_width) +
    step(left_dist, edge_width) +
    step(right_dist, edge_width);

    // 颜色输出：边界白色，其余透明
  vec4 color = mix(vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 1.0, 0.0, 1.0), is_edge);

  fragColor = color;
}
