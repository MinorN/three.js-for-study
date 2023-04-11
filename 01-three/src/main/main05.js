import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 目标，Clock来跟踪时间

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.set(0, 0, 10)
scene.add(camera)

// 添加物体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })

// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)


// 修改物体的位置
// cube.position.set(5, 0, 0)
// cube.position.x = 5

// 缩放
// cube.scale.set(3, 2, 1)
// cube.scale.x = 5

// 旋转
cube.rotation.set(Math.PI / 4, 0, 0)

// 将几何体添加到场景中
scene.add(cube)
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

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 设置时钟
const clock = new THREE.Clock()


// 设置渲染函数
function render () {
  // 获取时钟运行的总时长
  let time = clock.getElapsedTime()
  // let deltaTime = clock.getDelta()

  // console.log('时钟运行的总时长', time)
  // console.log('两次获取时间的间隔时间', deltaTime)
  let space = time % 5
  cube.position.x = space
  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)

  // 下一帧继续render
  requestAnimationFrame(render)
}
render()