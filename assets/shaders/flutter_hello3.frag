#ifdef GLSL
precision float mediump;
#endif

#include <flutter/runtime_effect.glsl>


#define A(v) mat2(cos(m.v*3.1416 + vec4(0, -1.5708, 1.5708, 0)))       // rotate
#define H(v) (cos(((v)+.5)*6.2832 + radians(vec3(60, 0, -60)))*.5+.5)  // hue

uniform vec2 iResolution;
uniform float iTime;
uniform vec3 iMouse;

out vec4 fragColor;

float map(vec3 u) {
  float t = iTime * 5.,  // speed
  l = 4.,        // loop to reduce clipping
  w = 40.,       // z warp size
  s = .4,        // object size (max)
  f = 1e20, i = 0., y, z;

  u.yz = -u.zy;
  u.xy = vec2(atan(u.x, u.y), length(u.xy));  // polar transform
  u.x += t / 6.;                                // counter rotation

  vec3 p;
  for(; i++ < l;) {
    p = u;
    y = round(max(p.y - i, 0.) / l) * l + i;      // segment y & skip rows
    p.x *= y;                             // scale x with y
    p.x -= sqrt(y * t * t * 2.);                // move x (appears more random over time)
        //p.x -= y*y*t*3.1416;                // move x (denominator of t)
    p.x -= round(p.x / 6.2832) * 6.2832;      // segment x
    p.y -= y;                             // move y
    p.z += sqrt(y / w) * w;                   // curve inner z down
    z = cos(y * t / 50.) * .5 + .5;               // cos wave
    p.z += z * 2.;                          // wave z
        //f = min(f, length(p) - s*(z*.5+.5));  // spheres
    p = abs(p);
    f = min(f, max(p.x, max(p.y, p.z)) - s * z);  // cubes
  }

  return f;
}

void main() {
  float l = 50.,  // loop
  i = 0., d = i, s, r;

  vec2 R = iResolution.xy, m = iMouse.z > 0. ? (iMouse.xy - R / 2.) / R.y : vec2(0, -.17);

  vec3 o = vec3(0, 20, -120),  // camera
  u = normalize(vec3(iResolution - R / 2., R.y)),  // 3d coords
  c = vec3(0), p;

  mat2 v = A(y),  // pitch
  h = A(x);  // yaw

  for(; i++ < l;)  // raymarch
  {
    p = u * d + o;
    p.yz *= v;
    p.xz *= h;

    s = map(p);
    r = (cos(round(length(p.xz)) * iTime * .1) * .7 - 1.8) / 2.;  // color gradient
    c += min(s, exp(-s / .07))  // black & white
    * H(r) * (r + 2.4);      // color

    if(s < 1e-3 || d > 1e3)
      break;
    d += s * .7;
  }

  fragColor = vec4(exp(log(c) / 2.2), 1);
}