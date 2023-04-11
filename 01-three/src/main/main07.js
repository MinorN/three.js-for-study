import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 导入动画库
import gsap from 'gsap'

// 目标，调节页面尺寸大小自动适配

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


// 设置控制器阻尼，让控制器更加真实，必须在动画循环里调用update
controls.enableDamping = true

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 设置时钟
const clock = new THREE.Clock()


// 设置动画,
var animate1 = gsap.to(cube.position, {
  x: 5,
  duration: 5,
  ease: 'power1.inOut',
  // 设置重复次数，无限次为-1
  repeat: -1,
  // 往返运动
  yoyo: true,
  // 设置延迟时间
  delay: 2,
  onComplete: () => {
    console.log('动画完成了')
  },
  onStart: () => {
    console.log('动画开始了')
  }
})
gsap.to(cube.rotation, {
  x: 2 * Math.PI,
  duration: 5,
  ease: 'power1.inOut',
})


window.addEventListener('dblclick', () => {
  // console.log('animate1', animate1)
  // 暂停 恢复
  if (animate1.isActive()) {
    animate1.pause()
  } else {
    animate1.resume()
  }
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