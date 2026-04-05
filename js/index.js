(function () {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let W, H;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  const PALETTE = ["#00ff88", "#4d9fff", "#a78bfa", "#00ff88", "#4d9fff"];
  const COUNT = Math.min(130, Math.floor(window.innerWidth / 10));
  const CONNECT = 120;

  class P {
    constructor(init) {
      this.reset(!!init);
    }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 5;
      this.r = Math.random() * 1.6 + 0.3;
      this.bvx = (Math.random() - 0.5) * 0.3;
      this.bvy = -(Math.random() * 0.5 + 0.1);
      this.vx = this.bvx;
      this.vy = this.bvy;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      this.alpha = Math.random() * 0.5 + 0.2;
      this.life = init ? Math.floor(Math.random() * 300) : 0;
      this.max = Math.random() * 350 + 200;
    }
    update() {
      const dx = this.x - mouse.x,
        dy = this.y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 150 && d > 0) {
        const f = ((150 - d) / 150) * 1.2;
        this.vx += (dx / d) * f;
        this.vy += (dy / d) * f;
      }
      this.vx += (this.bvx - this.vx) * 0.04;
      this.vy += (this.bvy - this.vy) * 0.04;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      this.life++;
      if (this.y < -10 || this.life > this.max) this.reset(false);
    }
    draw() {
      const fade =
        this.life < 50
          ? this.life / 50
          : this.life > this.max - 50
            ? (this.max - this.life) / 50
            : 1;
      ctx.save();
      ctx.globalAlpha = this.alpha * fade;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const pts = Array.from({ length: COUNT }, () => new P(true));

  function drawLines() {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i],
          b = pts[j];
        const dx = a.x - b.x,
          dy = a.y - b.y,
          d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT) {
          const mx = (a.x + b.x) / 2,
            my = (a.y + b.y) / 2;
          const md = Math.sqrt((mx - mouse.x) ** 2 + (my - mouse.y) ** 2);
          ctx.save();
          ctx.globalAlpha = (1 - d / CONNECT) * 0.16;
          ctx.strokeStyle = md < 200 ? "#00ff88" : "#4d9fff";
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }
      const a = pts[i],
        mdx = a.x - mouse.x,
        mdy = a.y - mouse.y,
        md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 170) {
        ctx.save();
        ctx.globalAlpha = (1 - md / 170) * 0.38;
        ctx.strokeStyle = "#00ff88";
        ctx.lineWidth = 0.75;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        ctx.restore();
        ctx.setLineDash([]);
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    pts.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── SCROLL REVEAL ───────────────────────────────────────────────────
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("in"), (i % 4) * 80);
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ── TERMINAL TYPING ─────────────────────────────────────────────────
const cmds = [
  "npm run start",
  "node server.js",
  "kubectl get pods",
  "docker-compose up",
  "git push origin main",
  "terraform apply",
];
let ci = 0;
const cursors = document.querySelectorAll(".tcursor");
cursors.forEach((cursor) => {
  const cmdLine = cursor.closest(".tcmd");
  if (!cmdLine) return;
  setInterval(() => {
    ci = (ci + 1) % cmds.length;
    const txt = cmds[ci];
    let i = 0;
    cmdLine.textContent = "";
    cmdLine.appendChild(cursor);
    const t = setInterval(() => {
      if (i < txt.length) {
        cursor.insertAdjacentText("beforebegin", txt[i++]);
      } else {
        clearInterval(t);
      }
    }, 55);
  }, 3500);
});
