
#ifdef GL_ES
precision mediump float;
#endif

#include<flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float iTime;
uniform sampler2D iChannel0;

out vec4 fragColor;

const float scale = 100.;
const float EPSILON = .001;
const float reflection = 1.5;
const float heightScale = 10000.;
const float rangeScale = 2.;
const float speed = 6.;

float getHeight(vec2 uv) {
  return cos(.5 * sqrt(uv.x * uv.x + uv.y * uv.y) - speed * iTime) /
    (1. / rangeScale * (uv.x * uv.x + uv.y * uv.y) + 3. * iTime) * heightScale;
}

vec3 getNormal(vec3 p, float eps) {
  vec3 n;
  n.z = p.z;
  n.x = n.z - getHeight(vec2(p.x + eps, p.y));
  n.y = n.z - getHeight(vec2(p.x, p.y + eps));
  n.z = eps;
  return normalize(n);
}

void main() {
  vec2 uv = FlutterFragCoord().xy / uSize;
  vec4 camColor = texture(iChannel0, uv);

  // z-position
  uv = uv * 2. - 1.;
  uv *= scale;
  float n = floor(iTime - floor(iTime / 10.) * 10.);
  float z = getHeight(uv);

  // normal
  vec3 p = vec3(uv, z);
  vec3 normal = getNormal(p, EPSILON);
  vec3 refractDir = refract(vec3(0, 0, -1), normal, 1. / reflection);

  // actual pixel
  float k = -p.z / refractDir.z;
  vec3 actualPt = p + k * refractDir;
  vec2 samp = (actualPt.xy / scale + 1.) / 2.;
  vec4 actualColor = texture(iChannel0, samp);

  fragColor = actualColor;
}