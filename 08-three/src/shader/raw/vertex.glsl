
precision lowp float;
// 精度范围
// highhp -2^16~2^16
// mediump -2^10~2^10
// lowp -2^8~2^8

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;


varying vec2 vUv;
varying float vElevation;

// 获取时间
uniform float uTime;



void main(){
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    

    // 内置函数 sin
    modelPosition.z = sin((modelPosition.x + uTime) * 10.0) * 0.05;
    modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.05;
    vElevation = modelPosition.z;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}