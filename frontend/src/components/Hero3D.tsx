import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 160;

class Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.z = Math.random() * 1200;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.vz = (Math.random() - 0.5) * 2;
    this.size = Math.random() * 2.5 + 0.8;
    this.opacity = Math.random() * 0.4 + 0.2;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
    if (this.z < 0 || this.z > 1200) this.vz *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const perspective = 1200 / (1200 + this.z);
    const x = this.x * perspective + ctx.canvas.width / 2 * (1 - perspective);
    const y = this.y * perspective + ctx.canvas.height / 2 * (1 - perspective);
    const radius = this.size * perspective;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * perspective})`;
    ctx.shadowBlur = 15 * perspective;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export default function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    let animationFrame: number;

    const render = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-20" />;
}
