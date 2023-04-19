// 目标:
// 精讲投射管线实现三维物体交互

import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



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
      cube.position.set(i * 2 - 5, j * 2 - 5, z * 2 - 5)
      cubeArr.push(cube)
      cubeGroup.add(cube)
    }
  }
}
scene.add(cubeGroup)

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


// 将渲染内容canvas添加到body
document.body.appendChild(renderer.domElement)

// 创建轨道控制器
// const controls = new OrbitControls(camera, renderer.domElement)

// 设置控制器阻尼，让控制器更加真实，必须在动画循环里调用update
// controls.enableDamping = true

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const clock = new THREE.Clock()

// 设置渲染函数
function render () {
  // controls.update()
  let time = clock.getElapsedTime()
  cubeGroup.rotation.x = time * 0.5
  cubeGroup.rotation.y = time * 0.5


  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)

  // 下一帧继续render
  requestAnimationFrame(render)

}
render()

