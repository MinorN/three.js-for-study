// 目标:
// 掌握几何体顶点——UV——法向属性


import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.set(0, 0, 10)
scene.add(camera)

// 添加物体
const geometry = new THREE.BufferGeometry()

const vertices = new Float32Array([
  -1.0, -1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0, 1.0, 1.0,
  -1.0, 1.0, 1.0,
  -1.0, -1.0, 1.0,
])

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })

const mesh = new THREE.Mesh(geometry, material)


scene.add(mesh)
// 初始化渲染器
const renderer = new THREE.WebGLRenderer()

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)

// 将渲染内容canvas添加到body
document.body.appendChild(renderer.domElement)

// // 使用渲染器通过相机将场景渲染出来
// renderer.render(scene, camera)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)


// 设置控制器阻尼，让控制器更加真实，必须在动画循环里调用update
controls.enableDamping = true

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 设置时钟
const clock = new THREE.Clock()


// 设置动画,


window.addEventListener('dblclick', () => {
  // // 双击控制进入、退出全屏
  // if (!document.fullscreenElement) {
  //   renderer.domElement.requestFullscreen()
  // }
  // else {
  //   document.exitFullscreen()
  // }
})

// 设置渲染函数
function render () {
  controls.update()
  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)

  // 下一帧继续render
  requestAnimationFrame(render)
}
render()


// 监听画面尺寸变化，自适应
window.addEventListener('resize', () => {
  // console.log('画面变化了')

  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight

  // 更新摄像机投影矩阵
  camera.updateProjectionMatrix()

  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio)

})
