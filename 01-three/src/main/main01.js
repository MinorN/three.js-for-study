import * as THREE from 'THREE';

// 目标，了解THREE.js最基本的内容

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

// 将几何体添加到场景中
scene.add(cube)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)

// 将渲染内容canvas添加到body
document.body.appendChild(renderer.domElement)

// 使用渲染器通过相机将场景渲染出来
renderer.render(scene, camera)