#include<flutter/runtime_effect.glsl>

// 输入变量
uniform vec3 uLightPos; // 光源位置
uniform vec3 uViewPos;  // 观察者位置
uniform vec3 uLightColor; // 光的颜色
uniform vec3 uObjectColor; // 物体的颜色

in vec3 vNormal;  // 从顶点着色器传入的法线
in vec3 vFragPos; // 从顶点着色器传入的片段位置

out vec4 fragColor;

void main() {
    // 1. 归一化法线和光源方向
    vec3 normal = normalize(vNormal); // 法线向量
    vec3 lightDir = normalize(uLightPos - vFragPos); // 从片段到光源的方向

    // 2. 计算漫反射分量 (Lambertian reflectance)
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor;

    // 3. 加入环境光 (简单常量)
    vec3 ambient = 0.1 * uLightColor;

    // 4. 最终颜色 = 物体颜色 * (环境光 + 漫反射)
    vec3 result = (ambient + diffuse) * uObjectColor;
    fragColor = vec4(result, 1.0);
}
