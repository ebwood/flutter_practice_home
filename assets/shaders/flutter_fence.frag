#include <flutter/runtime_effect.glsl>

uniform vec2 u_resolution;
uniform sampler2D u_image;

out vec4 fragColor;

float plot(vec2 st) {
  return smoothstep(0.02, 1.0, abs(st.y - st.x));
}

void main() {
  vec2 st = FlutterFragCoord().xy/u_resolution;

  // float y = 1.0 - st.y;

  // vec3 color = vec3(y);

  // float pct = plot(st);
  // color = pct*color + (1.0-pct)*vec3(0.0,1.0,0.0);

  // fragColor = vec4(color, 1.0);
  fragColor = texture(u_image, st);
}