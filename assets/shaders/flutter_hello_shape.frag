#ifdef GLSL
precision mediump float;
#endif

#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

#include<flutter/runtime_effect.glsl>

uniform vec2 uResolution;
uniform float uTime;

out vec4 fragColor;

vec3 water(float x) {
    return pow(vec3(.1, .7, .8), vec3(4.* saturate(1.0-x) ));
}

float circle(in vec2 _st, in float _radius) {
  vec2 dist = _st - vec2(0.5);
  return 1. - smoothstep(_radius - (_radius * 0.01), _radius + (_radius * 0.01), dot(dist, dist) * 4.0);
}
void main() {
  vec2 st = FlutterFragCoord().xy / uResolution;
  // vec3 color = vec3(0.0);
  // st.x > 0.1 && st. y > 0.1为白色，否则为黑色
  // vec2 tl = smoothstep(vec2(0.1), vec2(0.1 + 0.1), st);
  // vec2 br = smoothstep(vec2(0.1), vec2(0.1 + 0.08), 1.0 - st);
  // color = vec3(tl.x * tl.y * br.x * br.y);

  // float pct = distance(st, vec2(0.5));
  // float pct = circle(st, 0.5);
  // if (pct <= 0.2) {
  //   color = vec3(1.0, 0.0, 0.0);
  // } else {

  // }
  // pct = abs(sin(uTime)) * pct;
  // pct = distance(st, vec2(0.4)) + distance(st, vec2(0.6));
  // pct = distance(st, vec2(0.4)) * distance(st, vec2(0.6));
  // pct = min(distance(st, vec2(0.4)), distance(st, vec2(0.6)));
  // pct = max(distance(st, vec2(0.4)), distance(st, vec2(0.6)));
  // pct = pow(distance(st, vec2(0.4)), distance(st, vec2(0.6)));
  // color = vec3(pct);
  // color = smoothstep(0.2, 0.3, color);

  // fragColor = vec4(color, 1.0);

  vec3 color = vec3(0.0);
  float d = 0.0;

  // Remap the space to -1. to 1.
  st = st * 2. - 1.;

  // Make the distance field
  d = length(abs(st) - .3);
  // d = length( min(abs(st)-.3,0.) );
  // d = length( max(abs(st)-.3,0.) );

  // Visualize the distance field
  fragColor = vec4(vec3(fract(d * 10.0)), 1.0);

  // Drawing with the distance field
  fragColor = vec4(vec3(step(.3, d)), 1.0);
  fragColor = vec4(vec3(step(.3, d) * step(d, .4)), 1.0);
  fragColor = vec4(vec3(smoothstep(.3, .4, d) * smoothstep(.6, .5, d)), 1.0);

  vec2 pos = vec2(0.5) - st;

  float r = length(pos) * 2.0;
  float a = atan(pos.y, pos.x);

  float f = cos(a * 3.);
    // f = abs(cos(a*3.));
    // f = abs(cos(a*2.5))*.5+.3;
    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1;
    // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

  color = vec3(1. - smoothstep(f, f + 0.02, r));
  // color *= abs(sin(uTime * 1.5));

  st.x *= uResolution.x / uResolution.y;
  d = 0.0;

  st = vec2(st.x, 1 - st.y);
  // Remap the space to -1. to 1.
  st = st * 2. - 1.;

  // Number of sides of your shape
  int N = 4;

  // Angle and radius from the current pixel
  a = atan(st.x, st.y) + PI;
  r = TWO_PI / float(N);

  // Shaping function that modulate the distance
  d = cos(floor(.4 + a / r) * r - a) * length(st);

  color = vec3(1.0 - smoothstep(.4, .41, d));
  // color = vec3(d);

  color.r = water(color.x).x;
  fragColor = vec4(color, 1.0);
}