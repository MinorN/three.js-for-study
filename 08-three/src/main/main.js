// 目标:
// 控制定点位置打造波浪形状

import * as THREE from 'THREE';

// 顶点着色器
import basicVertexShader from '../shader/raw/vertex.glsl'
// 片元着色器
import basicFragmentShader from '../shader/raw/fragment.glsl'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 5)
scene.add(camera)


// 创建纹理加载器
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./textures/a.jpg')
const params = {
  uFrequency: 10,
  uScale: 0.1
}

// 创建原始着色器材质
const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  // wireframe: true
  side: THREE.DoubleSide,
  uniforms: {
    uTime: {
      value: 0,
    },
    uTexture: {
      value: texture,
    }
  }
})

const material = new THREE.MeshBasicMaterial({ color: "#00ff00" })

// 创建平面
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 64, 64),
  // material
  rawShaderMaterial
)

scene.add(floor)


// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)

// 将渲染内容canvas添加到body
document.body.appendChild(renderer.domElement)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼，让控制器更加真实，必须在动画循环里调用update
controls.enableDamping = true

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)


const clock = new THREE.Clock()
// 设置渲染函数
function render () {
  // let deltaTime = clock.getDelta()
  const elapsedTime = clock.getElapsedTime()
  rawShaderMaterial.uniforms.uTime.value = elapsedTime
  controls.update()
  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)
  // 下一帧继续render
  requestAnimationFrame(render)

}
render()