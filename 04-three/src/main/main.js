// 目标:
// 精讲投射管线实现三维物体交互

import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)


const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  wireframe: true
})
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// 创建1000个立方体
let cubeArr = []
for (let i = -5; i < 5; i++) {
  for (let j = -5; j < 5; j++) {
    for (let z = -5; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material)
      cube.position.set(i, j, z)
      scene.add(cube)
      cubeArr.push(cube)
    }
  }
}
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


// 设置渲染函数
function render () {
  controls.update()
  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)

  // 下一帧继续render
  requestAnimationFrame(render)

}
render()

