#ifdef GL_ES
precision mediump float;
#endif

#include<flutter/runtime_effect.glsl>
#include<lygia/generative/random.glsl>

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

out vec4 fragColor;

void mainOld() {
  vec2 st = FlutterFragCoord().xy / uResolution;

  st.x *= uResolution.x / uResolution.y;

  vec3 color = vec3(.0);
  vec2 point[5];
  point[0] = vec2(0.83, 0.75);
  point[1] = vec2(0.60, 0.07);
  point[2] = vec2(0.28, 0.64);
  point[3] = vec2(0.31, 0.26);
  point[4] = uMouse / uResolution;

  float m_dist = 1.;
  for(int i = 0; i < 5; i++) {
    float dist = distance(st, point[i]);
    m_dist = min(m_dist, dist);
  }

  color += m_dist;

  fragColor = vec4(vec3(st.x, st.y, 0.0), 1.0);
}

// vec2 random2(vec2 p) {
//   return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
// }

void main() {
  vec2 st = FlutterFragCoord().xy / uResolution.xy;
  st.x *= uResolution.x / uResolution.y;
  vec3 color = vec3(.0);

    // Scale
  st *= 14.;

    // Tile the space
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);

  float m_dist = 1.;  // minimum distance

  for(int y = -1; y <= 1; y++) {
    for(int x = -1; x <= 1; x++) {
            // Neighbor place in the grid
      vec2 neighbor = vec2(float(x), float(y));

            // Random position from current + neighbor place in the grid
      vec2 point = random2(i_st + neighbor);

			// Animate the point
      point = 0.5 + 0.5 * sin(uTime + 6.2831 * point);

			// Vector between the pixel and the point
      vec2 diff = neighbor + point - f_st;

            // Distance to the point
      float dist = length(diff);

            // Keep the closer distance
      m_dist = min(m_dist, dist);
    }
  }

    // Draw the min distance (distance field)
  color += m_dist;

    // Draw cell center
  color += 1. - step(.02, m_dist);

    // Draw grid
  color.r += step(.98, f_st.x) + step(.98, f_st.y);

    // Show isolines
    // color -= step(.7,abs(sin(27.0*m_dist)))*.5;

  fragColor = vec4(color, 1.0);
}

void mainNew() {
  vec2 st = FlutterFragCoord().xy / uResolution.xy;
  st.x *= uResolution.x / uResolution.y;

  vec3 color = vec3(.0);
  st *= 4.0;

    // Cell positions
  vec2 point[5];
  point[0] = vec2(0.83, 0.75);
  point[1] = vec2(0.60, 0.07);
  point[2] = vec2(0.28, 0.64);
  point[3] = vec2(0.31, 0.26);
  point[4] = uMouse / uResolution;

  float m_dist = 1.;  // minimum distance
  vec2 m_point;        // minimum position

    // Iterate through the points positions
  for(int i = 0; i < 5; i++) {
    float dist = distance(st, point[i]);
    if(dist < m_dist) {
            // Keep the closer distance
      m_dist = dist;

            // Kepp the position of the closer point
      m_point = point[i];
    }
  }

    // Add distance field to closest point center
  color += m_dist * 2.;

    // tint acording the closest point position
  color.rg = m_point;

    // Show isolines
  color -= abs(sin(80.0 * m_dist)) * 0.07;

    // Draw point center
  color += 1. - step(.02, m_dist);

  fragColor = vec4(color, 1.0);
}