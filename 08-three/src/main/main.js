// 目标:
// 初识着色器语言


import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 5)
scene.add(camera)


// 创建纹理加载器
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./texture/da.jpeg')
const params = {
  uFrequency: 10,
  uScale: 0.1
}

// 创建着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    void main(){
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    void main(){
      gl_FragColor = vec4(1.0,1.0,0.0,1.0);
    }
  `
})

const material = new THREE.MeshBasicMaterial({ color: "#00ff00" })

// 创建平面
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 64, 64),
  // material
  shaderMaterial
)

scene.add(floor)


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


const clock = new THREE.Clock()
// 设置渲染函数
function render () {
  let deltaTime = clock.getDelta()
  controls.update()
  // 使用渲染器通过相机将场景渲染出来
  renderer.render(scene, camera)
  // 下一帧继续render
  requestAnimationFrame(render)

}
render()