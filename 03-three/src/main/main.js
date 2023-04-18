// 目标:
// 打造复杂形状臂旋星系

import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)



let geometry = null
let material = null
const generateGalaxy = (params, scene) => {
  const textureLoader = new THREE.TextureLoader()

  const particlesTexture = textureLoader.load(`./textures/particles/${params.url}.png`)
  // 生成顶点
  geometry = new THREE.BufferGeometry()
  // 随机生成位置
  const positions = new Float32Array(params.count * 3)
  // 设置顶点颜色
  const colors = new Float32Array(params.count * 3)
  const centerColor = new THREE.Color(params.color)
  const endColor = new THREE.Color(params.endColor)
  // 循环生成点
  for (let i = 0; i < params.count; i++) {
    // 当前点应该在那哪一条分支的角度
    const branchAngel = (i % params.branch) * (2 * Math.PI / params.branch)
    // 当前点距离圆心的距离
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3)
    const current = 3 * i
    // 随机值
    const randomX = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5
    const randomY = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5
    const randomZ = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5
    positions[current] = Math.cos(branchAngel + distance * params.rotateScale) * distance + randomX
    positions[current + 1] = randomY
    positions[current + 2] = Math.sin(branchAngel + distance * params.rotateScale) * distance + randomZ

    // 混合颜色形成渐变
    const mixColor = centerColor.clone()
    mixColor.lerp(endColor, distance / params.radius)
    colors[current] = mixColor.r
    colors[current + 1] = mixColor.g
    colors[current + 2] = mixColor.b
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  // 设置点的材质
  material = new THREE.PointsMaterial({
    // color: new THREE.Color(params.Color),
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: particlesTexture,
    alphaMap: particlesTexture,
    transparent: true,
    vertexColors: true
  })
  const points = new THREE.Points(geometry, material)
  scene.add(points)
}
const params = {
  count: 10000,
  size: 0.1,
  radius: 5,
  branch: 20,
  color: '#ff6030',
  endColor: '#1b3984',
  url: '1',
  rotateScale: 0.3
}
generateGalaxy(params, scene)


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

let clock = new THREE.Clock()

// 设置渲染函数
function render () {
  let time = clock.getElapsedTime()
  controls.update()
  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)

  // 下一帧继续render
  requestAnimationFrame(render)

}
render()

