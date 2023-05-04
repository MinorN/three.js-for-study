
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



void main(){
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
}