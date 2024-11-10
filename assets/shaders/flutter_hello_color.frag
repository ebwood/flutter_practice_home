#ifdef GLSL
precision mediump float;
#endif

#include <flutter/runtime_effect.glsl>

#define PI 3.14159265359
#define TWO_PI 6.28318530718

vec3 colorA = vec3(0.149, 0.141, 0.912);
vec3 colorB = vec3(1.000, 0.833, 0.224);

uniform vec2 uResolution;
uniform float uTime;

out vec4 fragColor;

float plot(vec2 st, float pct) {
  return smoothstep(pct - 0.01, pct, st.y) -
    smoothstep(pct, pct + 0.01, st.y);
}

vec3 rgb2hsb(in vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb(in vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

float starShape(vec2 position, float innerRadius, float outerRadius) {
    // 计算角度和距离
  float angle = atan(position.y, position.x);
  float radius = length(position);
    // 创建星形边界条件
  float k = 5.0; // 星形的分支数（5代表五角星）
  float f = abs(cos(k * angle)) * (outerRadius - innerRadius) + innerRadius;
  return step(radius, f); // 返回1表示在星形内部，0表示在外部
}

// 定义星形形状函数
float starShape(vec2 position, float innerRadius, float outerRadius, float rotation) {
    // 计算旋转后的角度
    float angle = atan(position.y, position.x) + rotation;
    float radius = length(position);
    
    // 控制星形分支数量和形状
    float k = 5.0; // 星形的分支数量
    float f = abs(cos(k * angle)) * (outerRadius - innerRadius) + innerRadius;
    return step(radius, f); // 返回 1 表示在星形内部，0 表示在外部
}

void main() {
  vec2 st = FlutterFragCoord().xy / uResolution;
  vec3 color = vec3(0.0);
  // vec3 pct = vec3(st.x);

  // pct.r = smoothstep(0.0, 1.0, st.x);
  // pct.g = sin(st.x * PI);
  // // pct.b = pow(st.x, 0.5);
  // pct.b = step(0.2, st.x);

  // color = mix(colorA, colorB, pct);

  //   // Plot transition lines for each channel
  //   color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
  //   color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
  //   color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

  // color = hsb2rgb(vec3(1.0 - st.x,1.0,1.0 - st.y));

   // Use polar coordinates instead of cartesian
  vec2 toCenter = vec2(0.5) - st;
  float angle = atan(toCenter.y, toCenter.x);
  float radius = length(toCenter) * 2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
  color = hsb2rgb(vec3((angle / TWO_PI) + 0.5, radius, 1.0));

    // 将 RGB 转换为 HSV
  // vec3 hsvColor = rgb2hsb(color);

  // 随着时间旋转色相
  // hsvColor.x += uTime * 0.1; // 调整速度
  // hsvColor.x = fract(hsvColor.x); // 确保色相在 0 到 1 之间循环
  // 将 HSV 转换回 RGB
  // color = hsb2rgb(hsvColor);

  // 将坐标调整为以画布中心为原点（-1 到 1）
  vec2 pos = st * 2.0 - 1.0;
  pos.x *= uResolution.x / uResolution.y;

    // 定义圆的半径
  radius = 0.5;

    // 计算当前像素距离圆心的距离
  float dist = length(pos);

    // 判断是否在圆形内
  if(dist < radius) {
        // 如果在圆内，则显示颜色
    fragColor = vec4(0.0, 0.0, 0.0, 0.0); // 设置为透明
  } else {
        // 如果在圆外，则不显示颜色
    fragColor = vec4(color, 1.0);
  }

  // 定义星形的内外半径
  float innerRadius = 0.2;
  float outerRadius = 0.5;

    // 判断当前像素是否在星形内
  // float mask = starShape(pos, innerRadius, outerRadius);

  // 计算旋转角度，根据时间调整
    float rotation = uTime * 0.5; // 控制旋转速度

    // 判断当前像素是否在星形内部
    float mask = starShape(pos, innerRadius, outerRadius, rotation);


  // 设置颜色
  if(mask < 0.5) {
    fragColor = vec4(color, 1.0);
  } else {
    fragColor = vec4(0.0, 0.0, 0.0, 0.0); // 设置为透明
  }

  vec3 hsvColor = rgb2hsb(fragColor.rgb);
  // 随着时间旋转色相
  hsvColor.x += uTime * 0.1; // 调整速度
  hsvColor.x = fract(hsvColor.x); // 确保色相在 0 到 1 之间循环
  // 将 HSV 转换回 RGB
  fragColor.rgb = hsb2rgb(hsvColor);

}