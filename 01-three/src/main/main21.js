// 目标:
// 纹理加载进度情况
// 希望纹理加载完毕再进行显示，就需要了解纹理是否加载完成

import * as THREE from 'THREE';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.set(0, 0, 10)
scene.add(camera)


// Q:那么多张呢？不会一张一张来吧？？？不可能的
// LoadingManager
// 设置加载管理器
let div = document.createElement('div')
div.style.width = '200px'
div.style.height = '200px'
div.style.position = 'fixed'
div.style.right = 0
div.style.top = 0
div.style.color = '#fff'
document.body.appendChild(div)
let event = {}
event.onLoad = function () {
  console.log('图片加载完成')
}
event.onProgress = function (url, num, total) {
  console.log('url ,num ,total', url, num, total)
  console.log('图片加载中')
  let value = ((num / total * 100).toFixed(2) + '%')
  div.innerHTML = value
  console.log('加载进度为', (num / total * 100).toFixed(2) + '%')

}
event.onError = function (error) {
  console.log('error', error)
  console.log('图片加载出错')
}
const LoadingManager = new THREE.LoadingManager(event.onLoad, event.onProgress, event.onError)

// 导入纹理
const textureLoader = new THREE.TextureLoader(LoadingManager)



// 单张纹理图的加载
// const doorColorTexture = textureLoader.load('./textures/door/color.jpg',event.onLoad,event.onProgress,event.onError)

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')


const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')

const doorAOTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')



// 导入置换贴图
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')

// 导入粗糙度贴图
const doorRoughTexture = textureLoader.load('./textures/door/roughness.jpg')

// 导入金属贴图
const doorMaterTexture = textureLoader.load('./textures/door/metalness.jpg')

// 导入法相贴图
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')

// 添加物体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100)

const material = new THREE.MeshStandardMaterial({
  color: "#ffff00",
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,
  transparent: true,
  aoMap: doorAOTexture,
  aoMapIntensity: 0.8,
  // side: THREE.FrontSide
  displacementMap: doorHeightTexture, /// 置换贴图，影响物体的高度，也就是有薄厚之分
  displacementScale: 0.05,
  roughnessMap: doorRoughTexture, // 粗糙贴图
  roughness: 1, // 材质的粗糙度
  metalnessMap: doorMaterTexture, // 金属贴图
  metalness: 0.8,  // 金属的相似度
  normalMap: doorNormalTexture,
})

const cube = new THREE.Mesh(cubeGeometry, material)
// 给cube设置第二组uv
cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2))

scene.add(cube)


// 添加一个平面
const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(1.5, 0, 0)

scene.add(plane)

// 给平面设置第二组uv
planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2))



// 灯光
// 1. 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)
// 2. 直线光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(10, 10, 10)
scene.add(directionalLight)



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
