import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 导入动画库
import gsap from 'gsap'

// 导入dat.gui
import * as dat from "dat.gui"

// 目标，用js实现全屏和退出全屏

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

const gui = new dat.GUI()
gui.add(cube.position, "x").min(0).max(5).step(0.1).name('移动x轴').onChange((value) => {
  console.log('值被修改为', value)
}).onFinishChange((value) => {
  console.log('完全停止了', value)
})

// 修改物体颜色
const params = {
  color: '#ffff00',
  fn: () => {
    // 让立方体运动起来
    gsap.to(cube.position, { x: 5, duration: 5, yoyo: true, repeat: -1 })
  }
}
gui.addColor(params, 'color').onChange((value) => {
  console.log('值被修改为', value)
  cube.material.color.set(value)
})

// 设置checkbox物体是否显示
gui.add(cube, 'visible').name('是否显示')

// 设置按钮点击触发某个事件

// 添加一个文件夹
const folder = gui.addFolder("设置cube")
folder.add(cube.material, "wireframe")
folder.add(params, 'fn').name('立方体运动动画')

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
