// 目标:
// 应用顶点着色打造星空

import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as dat from 'dat.gui';


const gui = new dat.GUI()
// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

const particlesGeometry = new THREE.BufferGeometry()
const count = 5000
// 设置缓冲区数组
const position = new Float32Array(count * 3)
// 设置顶点
// 设置顶点颜色
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
  position[i] = Math.random() * 30 - 15
  colors[i] = Math.random()
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
// 创建点
const pointMaterial = new THREE.PointsMaterial({
  size: 0.1,
  color: 0xffff00,
  sizeAttenuation: true, // 是否因为相机深度而衰减
})
// 载入纹理
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("./textures/particles/1.png")
pointMaterial.map = texture
pointMaterial.alphaMap = texture
pointMaterial.transparent = true
pointMaterial.depthWrite = false
pointMaterial.blending = THREE.AdditiveBlending
// 设置启用顶点颜色
pointMaterial.vertexColors = true
const points = new THREE.Points(particlesGeometry, pointMaterial)
scene.add(points)


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

// 设置渲染函数
function render () {
  controls.update()
  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)

  // 下一帧继续render
  requestAnimationFrame(render)

}
render()

