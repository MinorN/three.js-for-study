// 目标:
// 精讲投射管线实现三维物体交互

import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap'


// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300)
camera.position.set(0, 0, 18)
scene.add(camera)


const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({
  wireframe: true
})
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// 创建1000个立方体
let cubeArr = []
let cubeGroup = new THREE.Group()
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let z = 0; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material)
      cube.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4)
      cubeArr.push(cube)
      cubeGroup.add(cube)
    }
  }
}
scene.add(cubeGroup)


// 创建三角形酷炫物体
let sjxMesh
let sjxGroup = new THREE.Group()
for (let i = 0; i < 50; i++) {
  const geometry = new THREE.BufferGeometry()
  const positionArray = new Float32Array(9)
  // 每个三角形需要3个顶点，每个顶点需要三个值
  for (let j = 0; j < 9; j++) {
    if (j % 3 === 1) {
      positionArray[j] = Math.random() * 10 - 5
    } else {
      positionArray[j] = Math.random() * 10 - 5
    }
  }
  let color = new THREE.Color(Math.random(), Math.random(), Math.random())

  geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  })
  sjxMesh = new THREE.Mesh(geometry, material)
  sjxGroup.add(sjxMesh)

}
sjxGroup.position.set(0, -30, 0)
scene.add(sjxGroup)


// 小球
// 添加一个球
const sphereGroup = new THREE.Group()

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereGroup.add(sphere)

// // 创建一个平面
// const planeGeometry = new THREE.PlaneGeometry(50, 50)
// const plane = new THREE.Mesh(planeGeometry, sphereMaterial)
// plane.position.set(0, -1, 0)
// plane.rotation.x = -Math.PI / 2
// scene.add(plane)

// 灯光
// 1. 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5)
sphereGroup.add(light)
const smallBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
smallBall.position.set(2, 2, 2)
// 聚光灯
const pointLight = new THREE.PointLight(0xff0000, 1)
pointLight.position.set(2, 2, 2)
sphereGroup.add(smallBall)
smallBall.add(pointLight)

scene.add(sphereGroup)
sphereGroup.position.set(0, -60, 0)





let geometry = null
let xxMaterial = null
let XXGroup = new THREE.Group()
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
  xxMaterial = new THREE.PointsMaterial({
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
  const points = new THREE.Points(geometry, xxMaterial)
  XXGroup.add(points)
  scene.add(XXGroup)
  XXGroup.position.set(0, -90, 0)
}
const params = {
  count: 10000,
  size: 0.1,
  radius: 20,
  branch: 20,
  color: '#ff6030',
  endColor: '#1b3984',
  url: '1',
  rotateScale: 0.3
}
generateGalaxy(params, scene)




let arrGroup = [cubeGroup, sjxGroup, sphereGroup, XXGroup]






// 创建投射光线对象
const raycaster = new THREE.Raycaster()

// 鼠标的位置
const mouse = new THREE.Vector2()

// 获取鼠标位置
window.addEventListener('click', (e) => {
  mouse.x = e.clientX / window.innerWidth * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight * 2 - 1)
  raycaster.setFromCamera(mouse, camera)
  let result = raycaster.intersectObjects(cubeArr)
  result.forEach(item => item.object.material = redMaterial)
})





// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })
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
// plane.receiveShadow = true



// 设置光照强度
pointLight.intensity = 2
// 设置阴影贴图模糊度
pointLight.shadow.radius = 20
// 设置阴影贴图分辨率
pointLight.shadow.mapSize.set(4096, 4096)
// 设置透视相机的属性
pointLight.distance = 0
pointLight.decay = 0






// 将渲染内容canvas添加到body
document.body.appendChild(renderer.domElement)

// 创建轨道控制器
// const controls = new OrbitControls(camera, renderer.domElement)

// 设置控制器阻尼，让控制器更加真实，必须在动画循环里调用update
// controls.enableDamping = true

// 添加坐标轴辅助器
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

const clock = new THREE.Clock()

gsap.to(cubeGroup.rotation, {
  x: "+=" + Math.PI,
  y: "+=" + Math.PI,
  duration: 5,
  repeat: -1,
  ease: "none"
})

gsap.to(sjxGroup.rotation, {
  x: "+=" + Math.PI,
  z: "+=" + Math.PI,
  duration: 5,
  repeat: -1,
  ease: "none"
})

gsap.to(smallBall.position, {
  x: -3,
  z: 2,
  duration: 6,
  repeat: -1,
  ease: "none",
  yoyo: true
})


// 设置渲染函数
function render () {
  // controls.update()

  // smallBall.position.x = Math.sin(time) * 3
  // smallBall.position.z = Math.cos(time) * 3
  // smallBall.position.y = 2 + Math.sin(time) * 1
  // 根据当前滚动的scrolly，去设置相机移动位置
  camera.position.y = -(window.scrollY / window.innerHeight) * 30


  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)

  // 下一帧继续render
  requestAnimationFrame(render)

}
render()

// 设置当前页
let currentPage = 0
// 监听滚动事件
window.addEventListener('scroll', () => {
  const newPage = Math.round(window.scrollY / window.innerHeight)
  if (newPage !== currentPage) {
    currentPage = newPage
    gsap.to(arrGroup[currentPage].rotation, {
      z: "+=" + Math.PI,
      duration: 1,
    })

    // gsap.to(`.page${currentPage} h1`, {
    //   rotate: '+=' + 360,
    //   duration: 1
    // })
    gsap.fromTo(`.page${currentPage} h1`, { x: -300 }, { x: 0, rotate: '+=' + 360, duration: 1 })

  }
})
