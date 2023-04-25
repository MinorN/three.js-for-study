// 目标:
// WEBGL实现一个三角形

// 获取 canvas 元素
let canvas = document.getElementById('canvas')
// canvas 宽高
canvas.width = window.innerWidth
canvas.height = window.innerHeight
// 获取webgl绘图的上下文
let gl = canvas.getContext('webgl')
// 第一次创建上下文的时候要设置视口大小
gl.viewport(0, 0, canvas.width, canvas.height)

// 创建顶点着色器
let vertexShader = gl.createShader(gl.VERTEX_SHADER)
// 需要编写glsl代码
gl.shaderSource(vertexShader, `
  attribute vec4 a_Position;
  void main(){
    gl_Position = a_Position;
  }
`)
// 注意 上述那个 分号 必须写
// gl编译顶点着色器
gl.compileShader(vertexShader)


// 创建片元着色器
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
// 需要编写glsl代码
gl.shaderSource(fragmentShader, `
  void main(){
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  }
`)
// 注意 上述那个 分号 必须写
// 编译
gl.compileShader(fragmentShader)


// 创建程序连接顶点着色器和片元着色器
let program = gl.createProgram()
// 连接顶点着色器和片元着色器
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
// 链接程序
gl.linkProgram(program)
// 使用程序进行渲染
gl.useProgram(program)
// 创建顶点缓冲区对象
let vertexBuffer = gl.createBuffer()
// 绑定顶点缓冲区对象
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
// 向顶点缓冲区传递数据
let vertices = new Float32Array([
  0.0, 0.5,
  -0.5, -0.5,
  0.5, -0.5
])
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

// 获取顶点着色器中a_Position中变量的位置
let a_Position = gl.getAttribLocation(program, 'a_Position')
// 将顶点缓冲区对象分配给a_Position
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
// 启用顶点着色器中a_Position 变量
gl.enableVertexAttribArray(a_Position)



// 绘制三角形
gl.drawArrays(gl.TRIANGLES, 0, 3)
