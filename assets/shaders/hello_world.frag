#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec4 red() {
  return vec4(1.0, 0.0, 0.0, 1.0);
}

vec4 green() {
  return vec4(vec3(0.0,1.0,0.0), 1.0);
}
void main() {
  vec2 st = u_mouse.xy / u_resolution;
  // gl_FragColor = vec4(sin(u_time*st.x), sin(u_time*st.y), 0.0, 1.0);
  gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);
}
