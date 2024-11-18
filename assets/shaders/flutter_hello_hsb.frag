// #ifdef GL_ES
// precision mediump float;
// #endif

// #include<flutter/runtime_effect.glsl>

// #define PI 3.14159265359
// #define TWO_PI 6.28318530718

// uniform vec2 uResolution;
// uniform float uTime;
// uniform vec2 uMouse;
// // uniform vec3[] uColors;
// uniform sampler2D uTexture;

// out vec4 fragColor;
// vec3 color1 = vec3(1.0, 0.588, 0.816);
// vec3 color2 = vec3(1.0, 0.710, 0.925);
// vec3 color3 = vec3(1.0, 0.545, 0.545);
// vec3 color4 = vec3(1.0, 0.753, 0.216);
// vec3 color5 = vec3(1.0, 0.620, 0.365);
// vec3 color6 = vec3(0.988, 1.0, 0.357);

// // vec3 color1 = vec3(0.839, 0.702, 0.914);
// // vec3 color2 = vec3(0.776, 0.698, 0.937);
// // vec3 color3 = vec3(0.749, 0.698, 0.953);
// // vec3 color4 = vec3(0.667, 0.796, 0.961);
// // vec3 color5 = vec3(0.655, 0.831, 0.941);
// // vec3 color6 = vec3(0.651, 0.886, 0.918);

// vec3 hsb2rgb(in vec3 c) {
//   vec3 rgb = vec3(0.0);
//   float angle = c.x * 6.0;
//   float iPos = floor(angle);
//   float fPos = fract(angle);
//   if(iPos == 0.0) {
//     rgb = mix(color1, color2, fPos);
//   } else if(iPos == 1.0) {
//     rgb = mix(color2, color3, fPos);
//   } else if(iPos == 2.0) {
//     rgb = mix(color3, color4, fPos);
//   } else if(iPos == 3.0) {
//     rgb = mix(color4, color5, fPos);
//   } else if(iPos == 4.0) {
//     rgb = mix(color5, color6, fPos);
//   } else if(iPos == 5.0) {
//     rgb = mix(color6, color1, fPos);
//   }
//   return rgb;
// }

// mat2 rotate2d(float _angle) {
//   return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
// }

// float frequency = 20.0;
// float amplitude = 0.008;

// float sinWave(float p, float factor) {
//   float phase = uTime * 3.0;
//   return amplitude * (1 + sin(p * frequency + factor * phase)) + amplitude * 2;
// }

// bool isInsideCircle(vec2 point1, vec2 point2, vec2 point3) {
//     // 计算圆心
//   vec2 center = (point1 + point2) * 0.5;

//     // 计算半径的平方
//   float radiusSquared = dot(point1 - center, point1 - center);

//     // 计算 point3 到圆心的距离平方
//   float distanceSquared = dot(point3 - center, point3 - center);

//     // 判断 point3 是否在圆内或圆上
//   return distanceSquared <= radiusSquared;
// }

// bool isOutsideLeftUpperEllipse(vec2 point1, vec2 point2, vec2 point3) {
//     // 计算椭圆中心
//   vec2 center = (point1 + point2) * 0.5;
//     // 判断是否在左上方
//     // if (point3.x > )
//   bool isLeftUpperPosition = (point3.x < center.x) && (point3.y < center.y);

//     // 计算长轴和短轴的半径
//   float a = abs(point1.x - point2.x) * 0.5;  // 长轴半径
//   float b = abs(point1.y - point2.y) * 0.5;  // 短轴半径

//     // 标准化判断 point3 是否在椭圆内
//   float normalizedX = (point3.x - center.x) / a;
//   float normalizedY = (point3.y - center.y) / b;
//   bool isInsideEllipse = (normalizedX * normalizedX + normalizedY * normalizedY) <= 1.0;

//     // point3 在椭圆的左上方区域
//   return isInsideEllipse && isLeftUpperPosition;
// }

// bool isInsideLeftUpperHalf(vec2 point1, vec2 point2, vec2 point3) {
//   vec2 center = (point1 + point2) * 0.5;
//   float radiusSquared = dot(point1 - center, point1 - center);
//   float distanceSquared = dot(point3 - center, point3 - center);
//   bool isInsideCircle = distanceSquared <= radiusSquared;
//   bool isLeftUpperHalf = (point3.x < center.x) && (point3.y > center.y);
//   return isInsideCircle && isLeftUpperHalf;
// }

// bool isInsideRightUpperHalf(vec2 point1, vec2 point2, vec2 point3) {
//   vec2 center = (point1 + point2) * 0.5;
//   float radiusSquared = dot(point1 - center, point1 - center);
//   float distanceSquared = dot(point3 - center, point3 - center);
//   bool isInsideCircle = distanceSquared <= radiusSquared;
//   bool isRightUpperHalf = (point3.x > center.x) && (point3.y > center.y);
//   return isInsideCircle && isRightUpperHalf;
// }

// bool isInsideLeftLowerHalf(vec2 point1, vec2 point2, vec2 point3) {
//   vec2 center = (point1 + point2) * 0.5;
//   float radiusSquared = dot(point1 - center, point1 - center);
//   float distanceSquared = dot(point3 - center, point3 - center);
//   bool isInsideCircle = distanceSquared <= radiusSquared;
//   bool isLeftLowerHalf = (point3.x < center.x) && (point3.y < center.y);
//   return isInsideCircle && isLeftLowerHalf;
// }

// bool isInsideRightLowerHalf(vec2 point1, vec2 point2, vec2 point3) {
//   vec2 center = (point1 + point2) * 0.5;
//   float radiusSquared = dot(point1 - center, point1 - center);
//   float distanceSquared = dot(point3 - center, point3 - center);
//   bool isInsideCircle = distanceSquared <= radiusSquared;
//   bool isRightLowerHalf = (point3.x > center.x) && (point3.y < center.y);
//   return isInsideCircle && isRightLowerHalf;
// }

// bool isOutsideLeftUpperHalf(vec2 point1, vec2 point2, vec2 point3) {
//   vec2 center = (point1 + point2) * 0.5;
//   float radiusSquared = dot(point1 - center, point1 - center);
//   float distanceSquared = dot(point3 - center, point3 - center);
//   bool isOutsideCircle = distanceSquared > radiusSquared;
//   bool isLeftUpperHalf = (point3.x < center.x) && (point3.y < center.y);
//   return isOutsideCircle && isLeftUpperHalf;
// }

// bool isOutsideRightUpperHalf(vec2 point1, vec2 point2, vec2 point3) {
//   vec2 center = (point1 + point2) * 0.5;
//   float radiusSquared = dot(point1 - center, point1 - center);
//   float distanceSquared = dot(point3 - center, point3 - center);
//   bool isOutsideCircle = distanceSquared > radiusSquared;
//   bool isRightUpperHalf = (point3.x > center.x) && (point3.y < center.y);
//   return isOutsideCircle && isRightUpperHalf;
// }

// bool isOutsideLeftLowerHalf(vec2 point1, vec2 point2, vec2 point3) {
//   vec2 center = (point1 + point2) * 0.5;
//   float radiusSquared = dot(point1 - center, point1 - center);
//   float distanceSquared = dot(point3 - center, point3 - center);
//   bool isOutsideCircle = distanceSquared > radiusSquared;
//   bool isLeftLowerHalf = (point3.x < center.x) && (point3.y < center.y);
//   return isOutsideCircle && isLeftLowerHalf;
// }

// bool isOutsideRightLowerHalf(vec2 point1, vec2 point2, vec2 point3) {
//   vec2 center = (point1 + point2) * 0.5;
//   float radiusSquared = dot(point1 - center, point1 - center);
//   float distanceSquared = dot(point3 - center, point3 - center);
//   bool isOutsideCircle = distanceSquared > radiusSquared;
//   bool isRightLowerHalf = (point3.x > center.x) && (point3.y < center.y);
//   return isOutsideCircle && isRightLowerHalf;
// }

// vec4 getColor(vec2 uv, vec4 fragColor) {

//   vec4 transparent = vec4(0.0);

//   uv -= vec2(0.5);
//   float pt = -0.45;
//   float pb = 0.45;

//   float sinWaveX = sinWave(uv.y, 1);
//   vec2 tlX = vec2(sinWave(pt, 1), pt + .5);
//   vec2 blX = vec2(sinWave(pb, 1), pb + .5);

//   float sinWaveX2 = sinWave(uv.y, -1);
//   vec2 trX = vec2(sinWave(pt, -1), pt + .5);
//   vec2 brX = vec2(sinWave(pb, -1), pb + .5);

//   float sineWaveY = sinWave(uv.x, -1);
//   vec2 tlY = vec2(pt + .5, sinWave(pt, -1));
//   vec2 blY = vec2(pt + .5, sinWave(pt, -1));

//   float sineWaveY2 = sinWave(uv.x, 1);
//   vec2 trY = vec2(pt + .5, sinWave(pt, 1));
//   vec2 brY = vec2(pb + .5, sinWave(pb, 1));

//   uv += vec2(0.5);
//   float percent1 = 1.0;
//   float percent2 = 1.0;

//   vec4 color = fragColor;
//   if(uv.x < sinWaveX || uv.x > 1 - sinWaveX2 || uv.y < sineWaveY || uv.y > 1 - sineWaveY2) {
//   } else {
//     color = transparent;
//     if(isInsideLeftUpperEllipse(tlX, tlY, uv)) {
//       color = transparent;
//     }
//   }
//   return color;

//   bool one = true;
//   if(uv.x < sinWaveX) {
//     percent1 = uv.x / sinWaveX;
//   } else if(uv.x > 1 - sinWaveX2) {
//     percent1 = (1 - uv.x) / sinWaveX2;
//   } else {
//     one = false;
//   }

//   bool two = true;
//   if(uv.y < sineWaveY) {
//     percent2 = uv.y / sineWaveY;
//   } else if(uv.y > 1 - sineWaveY2) {
//     percent2 = (1 - uv.y) / sineWaveY2;
//   } else {
//     two = false;
//   }

//   float percent = min(percent1, percent2);
//   return mix(fragColor, transparent, percent);
// }

// void main() {
//   vec2 uv = FlutterFragCoord().xy / uResolution;
//   vec2 stack = uv;

//   uv -= vec2(0.5);
//   uv = rotate2d(uTime * 0.5) * uv;
//   uv += vec2(0.5);

//   vec3 color = vec3(0.0);

//   vec2 toCenter = vec2(0.5) - uv;
//   float angle = atan(toCenter.y, toCenter.x);
//   float radius = length(toCenter) * 2.0;

//   color = hsb2rgb(vec3((angle / TWO_PI) + 0.5, radius, 1.0));
//   fragColor = vec4(color, 1.0);

//   fragColor = getColor(stack, fragColor);
// }
