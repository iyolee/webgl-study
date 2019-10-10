function main() {
  const canvas = document.getElementById('example');

  if (!canvas) {
    return;
  }

  // 获取上下文类型，区分大小写
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';
  ctx.fillRect(120, 30, 150, 150);
}