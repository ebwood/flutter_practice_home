#ifdef GLSL
precision float mediump;
#endif

#define PI 3.14159265359
#include<flutter/runtime_effect.glsl>

uniform vec2 uResolution;
uniform float uTime;

out vec4 fragColor;

// float plot(vec2 st) {
// return smoothstep(0.02, 0.00, abs(1 - st.y - st.x));
// }

// void main() {
  // vec2 st = FlutterFragCoord().xy / uResolution;
  // float y = st.x;
  // vec3 color = vec3(y);
  // float pct = plot(st);
  // color = (1.0 - pct) * color + pct * vec3(0.0, 1.0, 0.0);

  // fragColor = vec4(color, 1.0);
// }

float plot(vec2 st, float pct) {
return smoothstep(pct - 0.02, pct, st.y) - smoothstep(pct, pct + 0.02, st.y);
}

float blinnWyvillCosineApproximation (float x){
  float x2 = x*x;
  float x4 = x2*x2;
  float x6 = x4*x2;
  
  float fa = ( 4.0/9.0);
  float fb = (17.0/9.0);
  float fc = (22.0/9.0);
  
  float y = fa*x6 - fb*x4 + fc*x2;
  return y;
}

float doubleCubicSeat (float x, float a, float b){
  
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 
  
  float y = 0;
  if (x <= a){
    y = b - b*pow(1-x/a, 3.0);
  } else {
    y = b + (1-b)*pow((x-a)/(1-a), 3.0);
  }
  return y;
}

float exponentialEasing (float x, float a){
  
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  a = max(min_param_a, min(max_param_a, a));
  
  if (a < 0.5){
    // emphasis
    a = 2.0*(a);
    float y = pow(x, a);
    return y;
  } else {
    // de-emphasis
    a = 2.0*(a-0.5);
    float y = pow(x, 1.0/(1-a));
    return y;
  }
}

void main() {
vec2 st = FlutterFragCoord().xy / uResolution;
  // float y = pow(st.x, 2.0);
// float y = sqrt(st.x);
// float y = step(0.2, st.x);
// float y = smoothstep(0.2, 0.5, st.x) - smoothstep(0.5, 0.8, st.x);
// float y = floor(sin(st.x + uTime));
// float y = mod(st.x, 0.9);
// float y = clamp(st.x, 0.2, 0.8);
// float y = min(0.0, st.x);
// float y = max(0.0, st.x);
// float y = blinnWyvillCosineApproximation(st.x);
float y = exponentialEasing(st.x, 0.2);
vec3 color = vec3(y);

float pct = plot(st, y);
color = (1.0 - pct) * color + pct * vec3(0.0, 1.0, 0.0);
fragColor = vec4(color, 1.0);
// [0, 1, 2, 3] = [r, g, b, a] = [s, t, p, q] = [x, y , z, w]
fragColor.w = 1.0;
// fragColor.a = 0.5;
// fragColor.q = 0.2;
// fragColor[3] = 0.8;
}
