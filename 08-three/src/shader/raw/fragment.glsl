
precision lowp float;


varying vec2 vUv;
varying float vElevation;

uniform sampler2D uTexture;


void main(){
    // gl_FragColor = vec4(vUv,0.0,1.0);
    float height = vElevation + 0.05 * 10.0;
    // gl_FragColor = vec4(height * 1.0,0.0,0.0,1.0);

    // 根据uv进行采样
    vec4 textureColor = texture2D(uTexture,vUv);
    textureColor.rgb*= height;
    gl_FragColor = textureColor;
}