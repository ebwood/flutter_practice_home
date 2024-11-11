#ifdef GL_ES
precision mediump float;
#endif

#include<flutter/runtime_effect.glsl>

uniform vec2 uResolution;
uniform float uTime;

out vec4 fragColor;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 truchetPattern(in vec2 _st, in float _index) {
  _index = fract(((_index - 0.5) * 2.0));
  if(_index > 0.75) {
    _st = vec2(1.0) - _st;
  } else if(_index > 0.5) {
    _st = vec2(1.0 - _st.x, _st.y);
  } else if(_index > 0.25) {
    _st = 1.0 - vec2(1.0 - _st.x, _st.y);
  }
  return _st;
}

float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float tl = random(i);
  float tr = random(i + vec2(1.0, 0.0));
  float bl = random(i + vec2(0.0, 1.0));
  float br = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(tl, tr, u.x) + (bl - tl) * u.y + (br - bl) * u.x * u.y;
}

void main_old() {
  vec2 st = FlutterFragCoord().xy / uResolution;
  // st *= 4.0;
  // vec2 ipos = floor(st);
  // vec2 fpos = fract(st);
  // vec2 u = fpos * fpos * (3.0 - 2.0 * fpos);
  // // vec2 tile = truchetPattern(fpos, random(ipos));
  // // float color = 0.0;
  // // color = smoothstep(tile.x - 0.3, tile.x, tile.y) - smoothstep(tile.x, tile.x + 0.3, tile.y);
  // float color = random(fpos);
  // color = mix(random(ipos), random(ipos + 3.0), fpos.x);
  // color = mix(random(ipos), random(ipos + 1.0), smoothstep(0.0, 1.0, fpos.x));
  // fragColor = vec4(vec3(color), 1.0);
  // color = mix(random(ipos), random(ipos + 1.0), u.x);
  // fragColor = vec4(vec3(color),1.0);
  vec2 pos = vec2(st * 3.0 * sin(uTime)) * 2.0;
  float n = noise(pos);
  fragColor = vec4(vec3(n), 1.0);
}

// 2D 噪声函数
float noiseNew(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

    // 四个角的权重
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

    // 使用 Hermite 插值
  vec2 u = f * f * (3.0 - 2.0 * f);

    // 混合四个角的噪声值
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// 火焰颜色映射
vec3 fireColor(float intensity) {
  return mix(vec3(1.0, 0.3, 0.0), vec3(1.0, 1.0, 0.0), intensity); // 从橙色到黄色
}

void mainNew() {
  vec2 st = FlutterFragCoord().xy / uResolution;

    // 噪声生成火焰纹理
  float y = st.y * 3.0; // 控制火焰的高度
  float x = st.x * 2.0 - 1.0; // 控制火焰的宽度

    // 动态噪声：让火焰随时间变化
  float n = noiseNew(vec2(x, y - uTime * 0.5)); // 使火焰向上移动

    // 使用sin函数控制火焰边缘形状
  float shape = smoothstep(0.1, 0.3, sin(x * 3.14) * 0.5 + 0.5);

    // 调整噪声以获得火焰的流动效果
  float intensity = smoothstep(0.2, 0.5, n * shape);

    // 根据强度映射颜色
  vec3 color = fireColor(intensity);

  fragColor = vec4(color, 1.0);
}

vec2 skew(vec2 st) {
  vec2 r = vec2(0.0);
  r.x = 1.1547 * st.x;
  r.y = st.y + 0.5 * r.x;
  return r;
}

vec3 simplexGrid(vec2 st) {
  vec3 xyz = vec3(0.0);

  vec2 p = fract(skew(st));
  if(p.x > p.y) {
    xyz.xy = 1.0 - vec2(p.x, p.y - p.x);
    xyz.z = p.y;
  } else {
    xyz.yz = 1.0 - vec2(p.x - p.y, p.y);
    xyz.x = p.x;
  }

  return fract(xyz);
}

void main() {
  vec2 st = FlutterFragCoord().xy / uResolution;
  vec3 color = vec3(0.0);

    // Scale the space to see the grid
  st *= 10.;

    // Show the 2D grid
  color.rg = fract(st);

    // Skew the 2D grid
    color.rg = fract(skew(st));

    // Subdivide the grid into to equilateral triangles
    // color = simplexGrid(st);

  fragColor = vec4(color, 1.0);
}
