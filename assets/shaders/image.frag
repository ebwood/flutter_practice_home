#include<flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float uTime;
uniform sampler2D uTexture;

out vec4 fragColor;

void main() {
  vec2 uv = FlutterFragCoord().xy / uSize;

  fragColor = texture(uTexture, vec2(1.0 - uv.x, uv.y));
  fragColor = fragColor * 0.5;
}