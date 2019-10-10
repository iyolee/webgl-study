// 顶点着色器程序
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
  }
`

// 片元着色器程序
const FSHPDER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`

function main() {
  const canvas = document.getElementById('webgl')

  const gl = getWebGLContext(canvas);

  if (!initShaders(gl, VSHADER_SOURCE, FSHPDER_SOURCE)) {
    console.log('failed init');
    return;
  }

  // 获取attribute变量的存储位置
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

  // 获取u_FragColor变量的存储位置
  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

  // 鼠标点击位置数组
  const g_points = [];
  // 存储点颜色的数组
  const g_colors = [];

  function click(ev, gl, canvas, a_Position, u_FragColor) {
    // 鼠标点击处的x坐标
    let x = ev.clientX;
    // 鼠标点击处的y坐标
    let y = ev.clientY;
    const rect = ev.target.getBoundingClientRect();
    // WebGL中轴的坐标区间从-1.0到1.0
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    // 将坐标存储到数组中
    g_points.push([x, y]);

    // 将点的颜色存储到g_colors数组中
    if (x >= 0.0 && y >= 0.0) {
      // 第一象限
      g_colors.push([1.0, 0.0, 0.0, 1.0]); // red
    } else if (x < 0.0 && y < 0.0) {
      // 第三象限
      g_colors.push([0.0, 1.0, 0.0, 1.0]); // green
    } else {
      g_colors.push([1.0, 1.0, 1.0, 1.0]); // white
    }

    // 清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < g_points.length; i ++) {
      const xy = g_points[i];
      const rgba = g_colors[i];

      // 将点的位置传输到a_Position变量中
      gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
      // 将点的颜色传输到u_FragColor变量中
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // 绘制点
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }

  // 注册鼠标点击事件响应函数
  canvas.onmousedown = function (ev) {
    click(ev, gl, canvas, a_Position, u_FragColor);
  };

  // 将顶点位置传输给attribute变量
  // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  gl.vertexAttrib1f(a_PointSize, 20.0);

  // gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.drawArrays(gl.POINTS, 0, 4);
}