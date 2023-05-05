
precision lowp float;


varying vec2 vUv;
varying float vElevation;


void main(){
    // gl_FragColor = vec4(vUv,0.0,1.0);
    float height = vElevation + 0.05 * 10.0;
    gl_FragColor = vec4(height * 1.0,0.0,0.0,1.0);
}