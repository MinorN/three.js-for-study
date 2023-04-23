// 目标:
// 设置固定地面，小球撞击

import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as dat from 'dat.gui';

import * as CANNON from 'cannon-es'




const gui = new dat.GUI()
// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.set(0, 0, 10)
scene.add(camera)



// 创建球和平面
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.castShadow = true
scene.add(sphere)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial()
)
floor.position.set(0, -5, 0)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
// 添加平行光
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
dirLight.castShadow = true
scene.add(dirLight)

// 设置物体材质
const sphereWorldMaterial = new CANNON.Material()

// 创建物理世界
const world = new CANNON.World()
world.gravity.set(0, -9.8, 0)
// 创建物理世界小球形状
const sphereShape = new CANNON.Sphere(1)
// 创建物理世界物体
const sphereBody = new CANNON.Body({
  shape: sphereShape,
  position: new CANNON.Vec3(0, 0, 0),
  // 小球质量
  mass: 1,
  // 物体材质
  material: sphereWorldMaterial
})
// 将物体添加到物理世界
world.addBody(sphereBody)

// 创建物理世界地面
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0 // 保持不动，也就是mass为0
floorBody.addShape(floorShape)
floorBody.position.set(0, -5, 0)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(floorBody)





// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
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
  let deltaTime = clock.getDelta()

  // controls.update()
  // 更新物理引擎里面世界的物体
  world.step(1 / 144, deltaTime)
  sphere.position.copy(sphereBody.position)
  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)
  // 下一帧继续render
  requestAnimationFrame(render)

}
render()

