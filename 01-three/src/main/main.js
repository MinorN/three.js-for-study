// 目标:
// 初识Points与点材质

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




// 添加一个球
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeometry, material)
scene.add(sphere)


// 创建一个平面
const planeGeometry = new THREE.PlaneGeometry(50, 50)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
scene.add(plane)






// 灯光
// 1. 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)



const smallBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
smallBall.position.set(2, 2, 2)



// 聚光灯
const pointLight = new THREE.PointLight(0xff0000, 1)
pointLight.position.set(2, 2, 2)
scene.add(smallBall)
smallBall.add(pointLight)


// 初始化渲染器
const renderer = new THREE.WebGLRenderer()

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)

// 设置渲染器开启阴影计算
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true
// 光照要投射阴影
pointLight.castShadow = true
// 物体也要投射阴影
sphere.castShadow = true
// 平面要捕获阴影
plane.receiveShadow = true



// 设置光照强度
pointLight.intensity = 2
// 设置阴影贴图模糊度
pointLight.shadow.radius = 20
// 设置阴影贴图分辨率
pointLight.shadow.mapSize.set(4096, 4096)
// 设置透视相机的属性
pointLight.distance = 0
pointLight.decay = 0

gui
  .add(pointLight, 'distance')
  .min(0)
  .max(20)
  .step(0.1)
gui
  .add(pointLight, 'decay')
  .min(0)
  .max(5)
  .step(0.01)





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
  let time = clock.getElapsedTime()
  smallBall.position.x = Math.sin(time) * 3
  smallBall.position.z = Math.cos(time) * 3
  smallBall.position.y = 2 + Math.sin(time) * 1

  controls.update()
  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)

  // 下一帧继续render
  requestAnimationFrame(render)

}
render()

