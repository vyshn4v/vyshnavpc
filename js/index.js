const SKILLS = {
  "sk-backend": [
    { t: "Node.js", c: "g" },
    { t: "Express.js", c: "g" },
    { t: "NestJS", c: "g" },
    { t: "JWT Auth", c: "g" },
    { t: "TypeScript", c: "g" },
    { t: "REST APIs", c: "g" },
    { t: "Middleware", c: "g" },
    { t: "Webhooks", c: "g" },
    { t: "Socket.io", c: "g" },
  ],
  "sk-db": [
    { t: "MySQL", c: "b" },
    { t: "MongoDB", c: "b" },
    { t: "Redis", c: "b" },
    { t: "Mongoose", c: "b" },
    { t: "Sequelize", c: "b" },
    { t: "PostgreSQL", c: "b" },
  ],
  "sk-fe": [
    { t: "React", c: "p" },
    { t: "Redux Toolkit", c: "p" },
    { t: "CSS / SCSS", c: "p" },
    { t: "HTML5", c: "p" },
    { t: "Tailwind CSS", c: "p" },
    { t: "Axios", c: "p" },
  ],
  "sk-devops": [
    { t: "Kubernetes", c: "y" },
    { t: "Docker", c: "y" },
    { t: "AWS", c: "y" },
    { t: "Jenkins", c: "y" },
    { t: "Terraform", c: "y" },
    { t: "Ansible", c: "y" },
    { t: "Nginx", c: "y" },
    { t: "Git", c: "y" },
    { t: "GitHub", c: "y" },
    { t: "CI/CD", c: "y" },
    { t: "Linux", c: "y" },
  ],
};
Object.entries(SKILLS).forEach(([id, pills]) => {
  const t = document.getElementById(id);
  if (!t) return;
  const mk = () =>
    pills
      .map(
        (p) =>
          `<div class="skpill"><span class="sp ${p.c}"></span>${p.t}</div>`,
      )
      .join("");
  t.innerHTML = mk() + mk();
});
(function () {
  const cvs = document.getElementById("sky"),
    ctx = cvs.getContext("2d");
  let W, H;
  const mouse = { x: -9999, y: -9999, down: false };
  function resize() {
    W = cvs.width = window.innerWidth;
    H = cvs.height = window.innerHeight;
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
  window.addEventListener("mousedown", () => {
    mouse.down = true;
  });
  window.addEventListener("mouseup", () => {
    mouse.down = false;
  });
  const STAR_COUNT = Math.floor((window.innerWidth * window.innerHeight) / 900);
  const starField = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const layer = Math.random();
    starField.push({
      x: Math.random(),
      y: Math.random(),
      r:
        layer < 0.6
          ? Math.random() * 0.5 + 0.1
          : layer < 0.88
            ? Math.random() * 0.8 + 0.4
            : Math.random() * 1.4 + 0.8,
      a:
        layer < 0.6
          ? Math.random() * 0.35 + 0.08
          : layer < 0.88
            ? Math.random() * 0.45 + 0.2
            : Math.random() * 0.5 + 0.35,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.003 + Math.random() * 0.018,
      col:
        Math.random() < 0.08
          ? "#b8d4ff"
          : Math.random() < 0.05
            ? "#ffd8a8"
            : "#ffffff",
    });
  }
  const ORBS = [
    { fx: 0.08, fy: 0.05, r: 380, c: "#00ff880b" },
    { fx: 0.75, fy: 0.08, r: 420, c: "#4d9fff09" },
    { fx: 0.45, fy: 0.35, r: 340, c: "#a78bfa08" },
    { fx: 0.92, fy: 0.5, r: 300, c: "#00ff8808" },
    { fx: 0.05, fy: 0.65, r: 320, c: "#4d9fff09" },
    { fx: 0.6, fy: 0.8, r: 280, c: "#a78bfa07" },
    { fx: 0.3, fy: 0.92, r: 240, c: "#00ff8808" },
    { fx: 0.5, fy: 0.15, r: 260, c: "#ffffff05" },
    { fx: 0.2, fy: 0.5, r: 210, c: "#4d9fff07" },
    { fx: 0.85, fy: 0.75, r: 230, c: "#a78bfa07" },
  ];
  const DRIFT = [
    { x: 0.2, y: 0.2, vx: 0.00008, vy: 0.00005, r: 220, c: "#00ff880c" },
    { x: 0.7, y: 0.6, vx: -0.00006, vy: 0.00007, r: 240, c: "#4d9fff0b" },
    { x: 0.5, y: 0.85, vx: 0.00005, vy: -0.00008, r: 190, c: "#a78bfa0a" },
    { x: 0.15, y: 0.75, vx: 0.00007, vy: -0.00004, r: 175, c: "#00ff8809" },
    { x: 0.9, y: 0.3, vx: -0.00005, vy: 0.00009, r: 205, c: "#4d9fff09" },
  ];
  const MW_BANDS = [
    { cx: 0.5, cy: 0.45, rx: 1.4, ry: 0.18, a: 28, c: "#c8e0ff06" },
    { cx: 0.5, cy: 0.48, rx: 1.2, ry: 0.1, a: 28, c: "#a0c8ff08" },
    { cx: 0.5, cy: 0.44, rx: 1.0, ry: 0.07, a: 28, c: "#ffffff07" },
    { cx: 0.5, cy: 0.55, rx: 1.5, ry: 0.22, a: 20, c: "#8ab4e806" },
    { cx: 0.38, cy: 0.42, rx: 0.45, ry: 0.14, a: 35, c: "#ffe8c010" },
    { cx: 0.62, cy: 0.52, rx: 0.4, ry: 0.12, a: 25, c: "#c0d8ff09" },
    { cx: 0.48, cy: 0.46, rx: 0.25, ry: 0.08, a: 30, c: "#fffde014" },
  ];
  function drawMilkyWay() {
    MW_BANDS.forEach((b) => {
      ctx.save();
      const cx = b.cx * W,
        cy = b.cy * H,
        rx = b.rx * W,
        ry = b.ry * H,
        rad = (b.a * Math.PI) / 180;
      ctx.translate(cx, cy);
      ctx.rotate(rad);
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      grd.addColorStop(0, b.c);
      grd.addColorStop(0.5, b.c.slice(0, -2) + "04");
      grd.addColorStop(1, "transparent");
      ctx.scale(1, ry / rx);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
  function drawOrbs() {
    ORBS.forEach((o) => {
      const g = ctx.createRadialGradient(
        o.fx * W,
        o.fy * H,
        0,
        o.fx * W,
        o.fy * H,
        o.r,
      );
      g.addColorStop(0, o.c);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.fx * W, o.fy * H, o.r, 0, Math.PI * 2);
      ctx.fill();
    });
    DRIFT.forEach((o) => {
      o.x += o.vx;
      o.y += o.vy;
      if (o.x < 0 || o.x > 1) o.vx *= -1;
      if (o.y < 0 || o.y > 1) o.vy *= -1;
      const g = ctx.createRadialGradient(
        o.x * W,
        o.y * H,
        0,
        o.x * W,
        o.y * H,
        o.r,
      );
      g.addColorStop(0, o.c);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  function drawStars() {
    starField.forEach((s) => {
      s.twinkle += s.twinkleSpeed;
      const a = s.a + Math.sin(s.twinkle) * 0.2;
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = s.col;
      ctx.shadowColor = s.col;
      ctx.shadowBlur = s.r > 1.0 ? 6 : s.r > 0.5 ? 2 : 0;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
  const COLS = [
    "#00ff88",
    "#4d9fff",
    "#a78bfa",
    "#00ff88",
    "#00ff88",
    "#4d9fff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
  ];
  const COUNT = Math.min(350, Math.floor(window.innerWidth / 4));
  class Pt {
    constructor(init) {
      this.reset(!!init);
    }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init
        ? Math.random() * H
        : Math.random() < 0.7
          ? H + 6
          : Math.random() * H;
      this.r = Math.random() * 1.8 + 0.2;
      this.bvx = (Math.random() - 0.5) * 0.4;
      this.bvy = -(Math.random() * 0.45 + 0.05);
      this.vx = this.bvx;
      this.vy = this.bvy;
      this.col = COLS[Math.floor(Math.random() * COLS.length)];
      this.a = Math.random() * 0.55 + 0.12;
      this.ph = Math.random() * Math.PI * 2;
      this.life = init ? Math.floor(Math.random() * 500) : 0;
      this.max = 400 + Math.random() * 400;
    }
    update() {
      this.ph += 0.025;
      this._r = this.r + Math.sin(this.ph) * 0.5;
      const dx = this.x - mouse.x,
        dy = this.y - mouse.y,
        d = Math.sqrt(dx * dx + dy * dy);
      const rd = mouse.down ? 220 : 160,
        rs = mouse.down ? 2.2 : 1.4;
      if (d < rd && d > 0.1) {
        const f = ((rd - d) / rd) * rs;
        this.vx += (dx / d) * f;
        this.vy += (dy / d) * f;
      }
      this.vx += (this.bvx - this.vx) * 0.03;
      this.vy += (this.bvy - this.vy) * 0.03;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      this.life++;
      if (this.y < -10 || this.life > this.max) this.reset(false);
    }
    draw() {
      const fade =
        this.life < 80
          ? this.life / 80
          : this.life > this.max - 80
            ? (this.max - this.life) / 80
            : 1;
      ctx.save();
      ctx.globalAlpha = this.a * fade;
      ctx.shadowColor = this.col;
      ctx.shadowBlur = 10 + Math.sin(this.ph) * 4;
      ctx.fillStyle = this.col;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.1, this._r), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  const pts = Array.from({ length: COUNT }, () => new Pt(true));
  const CONN = 125;
  function drawNet() {
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j],
          dx = a.x - b.x,
          dy = a.y - b.y,
          d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONN) {
          const str = 1 - d / CONN,
            mx = (a.x + b.x) * 0.5,
            my = (a.y + b.y) * 0.5;
          const md = Math.sqrt((mx - mouse.x) ** 2 + (my - mouse.y) ** 2);
          ctx.save();
          ctx.globalAlpha = str * (md < 200 ? 0.3 : 0.1);
          ctx.strokeStyle = md < 200 ? "#00ff88" : "#4d9fff";
          ctx.lineWidth = str;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }
      const mdx = a.x - mouse.x,
        mdy = a.y - mouse.y,
        md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 190) {
        ctx.save();
        ctx.globalAlpha = (1 - md / 190) * 0.42;
        ctx.strokeStyle = "#00ff88";
        ctx.lineWidth = 0.8;
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
  class ShootStar {
    constructor() {
      this.alive = false;
    }
    spawn() {
      this.x = Math.random() * W * 0.6;
      this.y = Math.random() * H * 0.3;
      this.spd = 10 + Math.random() * 8;
      this.len = 80 + Math.random() * 120;
      this.a = 0;
      this.maxA = 0.7 + Math.random() * 0.3;
      this.w = 0.6 + Math.random() * 1.4;
      this.dx = this.spd * Math.cos(Math.PI / 5.5);
      this.dy = this.spd * Math.sin(Math.PI / 5.5);
      this.alive = true;
    }
    update() {
      if (!this.alive) return;
      this.x += this.dx;
      this.y += this.dy;
      this.a = this.a < this.maxA ? this.a + 0.07 : this.a - 0.04;
      if (this.a <= 0 || this.x > W + 50) this.alive = false;
    }
    draw() {
      if (!this.alive || this.a <= 0) return;
      const tx = this.x - this.dx * (this.len / this.spd),
        ty = this.y - this.dy * (this.len / this.spd);
      ctx.save();
      ctx.globalAlpha = this.a;
      const g = ctx.createLinearGradient(this.x, this.y, tx, ty);
      g.addColorStop(0, "#ffffffcc");
      g.addColorStop(0.4, "#ffffff44");
      g.addColorStop(1, "transparent");
      ctx.strokeStyle = g;
      ctx.lineWidth = this.w;
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.restore();
    }
  }
  const shoots = [new ShootStar(), new ShootStar(), new ShootStar()];
  let shootTimer = 0;
  const bursts = [];
  window.addEventListener("click", (e) => {
    if (
      e.target.closest(".modal-bg") ||
      e.target.closest("nav") ||
      e.target.closest(".btn") ||
      e.target.closest("button") ||
      e.target.closest(".mac-btns")
    )
      return;
    for (let i = 0; i < 16; i++) {
      const ang = Math.random() * Math.PI * 2,
        spd = 2 + Math.random() * 5;
      bursts.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 50,
        col: COLS[Math.floor(Math.random() * COLS.length)],
      });
    }
  });
  function drawBursts() {
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      ctx.save();
      ctx.globalAlpha = b.life / 50;
      ctx.fillStyle = b.col;
      ctx.shadowColor = b.col;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(b.x, b.y, (b.life / 50) * 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.92;
      b.vy *= 0.92;
      b.life--;
      if (b.life <= 0) bursts.splice(i, 1);
    }
  }
  function loop() {
    ctx.clearRect(0, 0, W, H);
    const sg = ctx.createLinearGradient(0, 0, 0, H);
    sg.addColorStop(0, "#06060e");
    sg.addColorStop(0.5, "#08081a");
    sg.addColorStop(1, "#070714");
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, W, H);
    drawOrbs();
    drawMilkyWay();
    drawStars();
    drawNet();
    pts.forEach((p) => {
      p.update();
      p.draw();
    });
    drawBursts();
    shootTimer++;
    if (shootTimer > 200) {
      shootTimer = 0;
      const s = shoots.find((s) => !s.alive);
      if (s) s.spawn();
    }
    shoots.forEach((s) => {
      s.update();
      s.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();
function openModal() {
  document.getElementById("fview").style.display = "block";
  document.getElementById("fsuc").style.display = "none";
  document.getElementById("modal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => {
    ["fn", "ln", "em", "su", "ms"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    document.getElementById("fview").style.display = "block";
    document.getElementById("fsuc").style.display = "none";
  }, 380);
}
function bgClick(e) {
  if (e.target === document.getElementById("modal")) closeModal();
}
function sendMsg() {
  const fn = document.getElementById("fn").value.trim(),
    em = document.getElementById("em").value.trim(),
    ms = document.getElementById("ms").value.trim();
  if (!fn || !em || !ms) {
    alert("Please fill in your name, email, and message.");
    return;
  }
  const su = document.getElementById("su").value.trim(),
    ln = document.getElementById("ln").value.trim();
  const to = "vyshnavpcnaravoor@gmail.com";
  const subj = encodeURIComponent(
    su || "Portfolio enquiry from " + fn + " " + ln,
  );
  const body = encodeURIComponent(
    "Hi Vyshnav,\n\n" +
      ms +
      "\n\n---\nFrom: " +
      fn +
      " " +
      ln +
      "\nEmail: " +
      em,
  );
  window.open("mailto:" + to + "?subject=" + subj + "&body=" + body);
  document.getElementById("fview").style.display = "none";
  document.getElementById("fsuc").style.display = "block";
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
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
const CMDS = [
  "npm run start",
  "node server.js",
  "kubectl get pods",
  "docker-compose up",
  "git push origin main",
  "terraform apply",
  "ansible-playbook site.yml",
];
let ci = 0;
function startTyping(cmdElId, curElId) {
  const cmdEl = document.getElementById(cmdElId),
    cur = document.getElementById(curElId);
  if (!cmdEl || !cur) return;
  setInterval(() => {
    ci = (ci + 1) % CMDS.length;
    const txt = CMDS[ci];
    let i = 0;
    cmdEl.textContent = "";
    cmdEl.appendChild(cur);
    const t = setInterval(() => {
      if (i < txt.length) {
        cur.insertAdjacentText("beforebegin", txt[i++]);
      } else {
        clearInterval(t);
      }
    }, 58);
  }, 3600);
}
startTyping("cmd1", "cur1");
startTyping("cmd2", "cur2");
function switchTab(tab) {
  document.getElementById("ctab-hire").classList.toggle("act", tab === "hire");
  document
    .getElementById("ctab-contact")
    .classList.toggle("act", tab === "contact");
  document.getElementById("cpane-hire").style.display =
    tab === "hire" ? "" : "none";
  document.getElementById("cpane-contact").style.display =
    tab === "contact" ? "" : "none";
}
