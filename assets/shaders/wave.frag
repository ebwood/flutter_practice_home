#include<flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float u_time;
uniform float r;

out vec4 fragColor;

void main() {
  vec2 uv = FlutterFragCoord().xy / uSize; 
 // Normalize UV coordinates to center
  vec2 centered = uv - 0.5;

    // Calculate sine wave for each edge
  float top = sin((uv.x + u_time * 0.2) * 10) * 0.05 * r;
  float top2 = sin((uv.x - u_time * 0.2) * 10) * 0.1 * r;

    // Check if the current pixel is near any sine wave edge
  float edge1 = step(abs(centered.y - top), 0.005);
  float edge2 = step(abs(centered.y - top2), 0.005);
  float edge = edge1 + edge2;

// Assign different colors to each edge
  vec3 color1 = vec3(1.0, 0.0, 0.0); // Red for the first wave
  vec3 color2 = vec3(0.0, 0.0, 1.0); // Blue for the second wave
  vec3 defaultColor = vec3(.0, .5, .0);

    // Mix the colors based on edges
  vec3 finalColor = edge1 * color1 + edge2 * color2;
  finalColor = mix(defaultColor, finalColor, edge1 + edge2);


    // Output the final color
  fragColor = vec4(finalColor, 1.0);
    // Output color based on edge proximity
  // fragColor = vec4(edge, .0, .0, 1.0);
}