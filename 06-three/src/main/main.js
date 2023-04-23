// 目标:
// 给物体施加一个力

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




const cubeArr = []

function createCube () {
  // 创建立方体和平面
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  const cubeMaterial = new THREE.MeshStandardMaterial()
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.castShadow = true
  scene.add(cube)

  // 创建物理世界立方体
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))

  // 创建物理世界物体
  const cubeBody = new CANNON.Body({
    shape: cubeShape,
    position: new CANNON.Vec3(0, 0, 0),
    // 立方体质量
    mass: 1,
    // 物体材质
    material: cubeWorldMaterial
  })
  cubeBody.applyLocalForce(
    new CANNON.Vec3(180, 0, 0),  // 添加的力的大小和方向
    new CANNON.Vec3(0, 0, 0)  // 施加的力是在哪个位置
  )
  // 将物体添加到物理世界
  world.addBody(cubeBody)

  // 添加监听碰撞事件
  function HitEvent (e) {
    // 获取碰撞的强度
    const impactStrength = e.contact.getImpactVelocityAlongNormal()
    if (impactStrength > 2) {
      HitSound.currentTime = 0;
      HitSound.play()
    }
  }
  cubeBody.addEventListener('collide', HitEvent)

  cubeArr.push({ mesh: cube, body: cubeBody })
}

window.addEventListener('click', () => {
  createCube()
})


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




// 创建物理世界
const world = new CANNON.World()
world.gravity.set(0, -9.8, 0)


// 创建击打声音
const HitSound = new Audio('assets/metalHit.mp3')





// 创建物理世界地面
const floorMaterial = new CANNON.Material('floor')
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.material = floorMaterial
floorBody.mass = 0 // 保持不动，也就是mass为0
floorBody.addShape(floorShape)
floorBody.position.set(0, -5, 0)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(floorBody)




// 设置两种材质碰撞的参数
// 设置物体材质
const cubeWorldMaterial = new CANNON.Material('cube')
const defaultContactMaterial = new CANNON.ContactMaterial(
  cubeWorldMaterial,
  floorMaterial,
  {
    friction: 0.1,  // 摩擦力
    restitution: 0.7  // 弹性
  }
)

world.addContactMaterial(defaultContactMaterial)

// 设置世界碰撞的默认材料
world.defaultContactMaterial = defaultContactMaterial

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
  cubeArr.forEach((item) => {
    item.mesh.position.copy(item.body.position)
    // 设置渲染的物体跟随物理的物体旋转
    item.mesh.quaternion.copy(item.body.quaternion)
  })
  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)
  // 下一帧继续render
  requestAnimationFrame(render)

}
render()

