// Composições Instagram BJJ Replay — feed 1080×1350 + stories 1080×1920
//   npm run render   (em deploy/social, após capture)

import puppeteer from 'puppeteer'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CAP = path.resolve(__dirname, 'output/capturas')
const FEED_DIR = path.resolve(__dirname, 'output/ig-feed')
const STORY_DIR = path.resolve(__dirname, 'output/ig-stories')
const LOGO_PATH = path.resolve(__dirname, '../../front/public/logo.png')

const ACCENT = '#F97316'
const ACCENT2 = '#fb923c'
const ACCENT_GRAD = `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`
const SITE = 'bjj-replay.asteron.digital'

async function imgB64(rel) {
  const buf = await readFile(path.join(CAP, rel))
  return `data:image/png;base64,${buf.toString('base64')}`
}

async function logoB64() {
  const buf = await readFile(LOGO_PATH)
  return `data:image/png;base64,${buf.toString('base64')}`
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

function fonts() {
  return `<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@9..144,600;9..144,700;1,9..144,600&family=Inter:wght@500;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet">`
}

function baseCss(w, h) {
  return `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${w}px; height: ${h}px; }
  body {
    font-family: 'Inter', system-ui, sans-serif;
    color: #fff;
    background: #030408;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }
  .bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 700px 800px at 20% 0%, rgba(249,115,22,.32), transparent 55%),
      radial-gradient(ellipse 600px 700px at 100% 50%, rgba(251,146,60,.22), transparent 50%),
      radial-gradient(ellipse 500px 500px at 0% 90%, rgba(15,23,42,.8), transparent 50%),
      linear-gradient(180deg, #0a0d1c 0%, #05060a 55%, #030408 100%);
  }
  .grain {
    position: absolute; inset: 0; opacity: .07; mix-blend-mode: overlay; pointer-events: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  }
  .frame {
    position: absolute; inset: 44px;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 24px;
    pointer-events: none;
  }
  .badge-new {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase;
    padding: 14px 22px; border-radius: 12px;
    color: #030408;
    background: ${ACCENT_GRAD};
    box-shadow: 0 0 40px rgba(249,115,22,.4);
  }
  .badge-live {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 12px 20px; border-radius: 999px;
    background: rgba(0,0,0,.5);
    border: 1px solid rgba(255,255,255,.18);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
  }
  .badge-live .dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #22c55e; box-shadow: 0 0 12px #22c55e;
  }
  .brand-footer {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600;
    letter-spacing: .12em; text-transform: uppercase;
    color: rgba(255,255,255,.45);
  }
  .brand-footer strong {
    display: block;
    font-family: 'Fraunces', serif;
    font-size: 20px; font-weight: 600;
    letter-spacing: -.02em; text-transform: none;
    color: #fafbfc; margin-bottom: 4px;
  }
  .browser {
    border-radius: 18px; overflow: hidden;
    border: 2px solid rgba(255,255,255,.15);
    box-shadow: 0 32px 80px rgba(0,0,0,.55), 0 0 60px rgba(249,115,22,.15);
    background: #0c0e18;
  }
  .browser-bar {
    display: flex; align-items: center; gap: 8px;
    padding: 14px 18px;
    background: rgba(0,0,0,.55);
    border-bottom: 1px solid rgba(255,255,255,.08);
  }
  .browser-bar .dots { display: flex; gap: 6px; }
  .browser-bar .dots span {
    width: 10px; height: 10px; border-radius: 50%;
    background: rgba(255,255,255,.2);
  }
  .browser-bar .url {
    flex: 1; text-align: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; font-weight: 600;
    color: ${ACCENT};
  }
  .browser-screen img {
    width: 100%; display: block;
    object-fit: cover; object-position: top center;
  }
  `
}

function feedLayout({ title, subtitle, chips, screenshot, logo, slideNum, total, browserH = 520 }) {
  const W = 1080, H = 1350
  const chipsHtml = (chips || [])
    .map((c) => `<span class="chip">${esc(c)}</span>`)
    .join('')
  const dots = Array.from({ length: total }, (_, i) =>
    `<span class="${i + 1 === slideNum ? 'on' : ''}"></span>`,
  ).join('')

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">${fonts()}<style>
  ${baseCss(W, H)}
  .safe {
    position: relative; z-index: 5;
    height: 100%; display: flex; flex-direction: column;
    padding: 72px 56px 64px;
  }
  .top { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
  .logo-row { display: flex; align-items: center; gap: 16px; margin-top: 28px; }
  .logo-row img { width: 72px; height: 72px; border-radius: 14px; object-fit: contain; }
  h1 {
    font-family: 'Fraunces', serif;
    font-size: 64px; font-weight: 700;
    line-height: .95; letter-spacing: -.04em;
    margin-top: 8px;
  }
  h1 em { font-style: italic; color: ${ACCENT}; }
  .sub {
    margin-top: 16px; font-size: 22px; font-weight: 500;
    line-height: 1.35; color: rgba(255,255,255,.82);
    max-width: 520px;
  }
  .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
  .chip {
    padding: 8px 14px; border-radius: 999px;
    border: 1px solid rgba(249,115,22,.45);
    background: rgba(249,115,22,.12);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
    color: rgba(255,255,255,.9);
  }
  .mock { margin-top: 28px; flex: 1; display: flex; align-items: flex-end; }
  .browser-screen { height: ${browserH}px; overflow: hidden; }
  .footer {
    margin-top: 24px;
    display: flex; justify-content: space-between; align-items: flex-end;
  }
  .pages { display: flex; gap: 8px; }
  .pages span {
    width: 28px; height: 4px; border-radius: 2px;
    background: rgba(255,255,255,.18);
  }
  .pages span.on { background: ${ACCENT_GRAD}; }
  .slide-num {
    position: absolute; top: 64px; right: 56px;
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 120px; line-height: 1;
    color: ${ACCENT}; opacity: .14;
  }
  </style></head><body>
  <div class="bg"></div><div class="grain"></div><div class="frame"></div>
  <span class="slide-num">0${slideNum}</span>
  <div class="safe">
    <div class="top">
      <span class="badge-new">Novo projeto</span>
      <span class="badge-live"><span class="dot"></span> Em produção</span>
    </div>
    <div class="logo-row">
      <img src="${logo}" alt="" />
      <div>
        <h1>${title}</h1>
      </div>
    </div>
    ${subtitle ? `<p class="sub">${esc(subtitle)}</p>` : ''}
    ${chipsHtml ? `<div class="chips">${chipsHtml}</div>` : ''}
    <div class="mock">
      <div class="browser" style="width:100%">
        <div class="browser-bar">
          <div class="dots"><span></span><span></span><span></span></div>
          <div class="url">${SITE}</div>
        </div>
        <div class="browser-screen">
          <img src="${screenshot}" alt="" />
        </div>
      </div>
    </div>
    <div class="footer">
      <p class="brand-footer"><strong>Asteron Digital</strong>Software house · asteron.digital</p>
      <div class="pages">${dots}</div>
    </div>
  </div>
  </body></html>`
}

function feedCta({ logo, slideNum, total }) {
  const W = 1080, H = 1350
  const dots = Array.from({ length: total }, (_, i) =>
    `<span class="${i + 1 === slideNum ? 'on' : ''}"></span>`,
  ).join('')

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">${fonts()}<style>
  ${baseCss(W, H)}
  .safe {
    position: relative; z-index: 5;
    height: 100%; display: flex; flex-direction: column;
    padding: 80px 56px 64px; justify-content: space-between;
  }
  .logo-big { width: 140px; border-radius: 20px; }
  h1 {
    font-family: 'Fraunces', serif;
    font-size: 72px; font-weight: 700;
    line-height: .98; letter-spacing: -.04em;
    margin-top: 36px;
  }
  h1 em { font-style: italic; color: ${ACCENT}; }
  .lead { margin-top: 24px; font-size: 26px; line-height: 1.4; color: rgba(255,255,255,.8); max-width: 680px; }
  .cta-box {
    margin-top: auto;
    padding: 36px 40px; border-radius: 22px;
    border: 1px solid rgba(249,115,22,.4);
    background: linear-gradient(135deg, rgba(249,115,22,.18), rgba(255,255,255,.03));
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
  }
  .cta-box .url {
    font-family: 'JetBrains Mono', monospace;
    font-size: 38px; font-weight: 700; color: ${ACCENT};
  }
  .cta-box .hint { margin-top: 10px; font-size: 18px; color: rgba(255,255,255,.65); }
  .arrow {
    width: 96px; height: 96px; border-radius: 50%;
    background: ${ACCENT_GRAD};
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 20px 60px rgba(249,115,22,.45);
    flex: none;
  }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; }
  .pages { display: flex; gap: 8px; }
  .pages span { width: 28px; height: 4px; border-radius: 2px; background: rgba(255,255,255,.18); }
  .pages span.on { background: ${ACCENT_GRAD}; }
  .brand-footer {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600;
    letter-spacing: .12em; text-transform: uppercase;
    color: rgba(255,255,255,.45);
  }
  .brand-footer strong {
    display: block; font-family: 'Fraunces', serif;
    font-size: 20px; font-weight: 600; letter-spacing: -.02em;
    text-transform: none; color: #fafbfc; margin-bottom: 4px;
  }
  </style></head><body>
  <div class="bg"></div><div class="grain"></div><div class="frame"></div>
  <div class="safe">
    <div>
      <img class="logo-big" src="${logo}" alt="" />
      <h1>Quer um sistema<br>assim para <em>seu nicho?</em></h1>
      <p class="lead">Plataforma completa: landing, auth, painéis por perfil, cadastro kids e deploy em produção.</p>
    </div>
    <div class="cta-box">
      <div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:12px">ACESSE AGORA</div>
        <div class="url">${SITE}</div>
        <div class="hint">Link na bio · DM aberta na Asteron</div>
      </div>
      <div class="arrow">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#030408" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>
    </div>
    <div class="footer">
      <p class="brand-footer"><strong>Asteron Digital</strong>Software house · asteron.digital</p>
      <div class="pages">${dots}</div>
    </div>
  </div>
  </body></html>`
}

function storyLayout({ title, tag, screenshot, logo, variant = 'phone' }) {
  const W = 1080, H = 1920

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">${fonts()}<style>
  ${baseCss(W, H)}
  .safe {
    position: relative; z-index: 5;
    height: 100%; display: flex; flex-direction: column;
    padding: 100px 48px 120px;
  }
  .top-badges { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
  .headline { margin-top: 32px; display: flex; align-items: center; gap: 20px; }
  .headline img { width: 80px; height: 80px; border-radius: 16px; object-fit: contain; }
  .headline .client {
    font-family: 'Fraunces', serif;
    font-size: 68px; font-weight: 700;
    line-height: .95; letter-spacing: -.04em;
  }
  .headline .client em { font-style: italic; color: ${ACCENT}; }
  .headline .tag {
    margin-top: 16px; font-size: 26px; font-weight: 600;
    line-height: 1.35; color: #e8ecf4; max-width: 520px;
  }
  .phone-wrap {
    flex: 1; display: flex; align-items: center; justify-content: center;
    margin: 28px 0; position: relative;
  }
  .phone-glow {
    position: absolute; width: 90%; height: 70%;
    background: ${ACCENT_GRAD};
    filter: blur(80px); opacity: .35; border-radius: 50%;
  }
  .phone {
    position: relative; width: 100%; max-width: 920px;
    border-radius: 28px; overflow: hidden;
    border: 2px solid rgba(255,255,255,.18);
    box-shadow: 0 40px 100px rgba(0,0,0,.65), 0 0 80px rgba(249,115,22,.25);
    background: #0c0e18;
  }
  .phone-bar {
    display: flex; align-items: center; justify-content: center;
    padding: 18px 20px;
    background: rgba(0,0,0,.6);
    border-bottom: 1px solid rgba(255,255,255,.1);
  }
  .phone-bar span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 16px; font-weight: 700; color: ${ACCENT};
  }
  .phone-screen { aspect-ratio: 9/14; overflow: hidden; background: #0a0d1c; }
  .phone-screen img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
  .float-live {
    position: absolute; right: 8px; bottom: 48px; z-index: 10;
    padding: 22px 28px; border-radius: 20px;
    background: rgba(0,0,0,.75); border: 1px solid rgba(255,255,255,.15);
    text-align: center; box-shadow: 0 16px 48px rgba(0,0,0,.5);
  }
  .float-live .v {
    font-family: 'Fraunces', serif; font-size: 44px; font-weight: 700; line-height: 1;
    color: #fff; text-shadow: 0 0 30px rgba(249,115,22,.5);
  }
  .float-live .k {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 700; letter-spacing: .14em;
    text-transform: uppercase; color: #b8c0d4; margin-top: 8px;
  }
  .bottom { text-align: center; }
  .url-big {
    font-family: 'JetBrains Mono', monospace;
    font-size: 34px; font-weight: 700; color: ${ACCENT};
    margin-bottom: 18px;
  }
  .cta {
    font-size: 20px; font-weight: 700; color: #fff;
    padding: 20px 32px; border-radius: 16px;
    background: linear-gradient(135deg, rgba(249,115,22,.45), rgba(251,146,60,.25));
    border: 1px solid rgba(255,255,255,.18);
    display: inline-block;
  }
  .swipe-hint {
    position: absolute; top: 52px; left: 50%; transform: translateX(-50%);
    z-index: 20; width: 120px; height: 6px; border-radius: 99px;
    background: rgba(255,255,255,.25);
  }
  </style></head><body>
  <div class="bg"></div><div class="grain"></div>
  <div class="swipe-hint"></div>
  <div class="safe">
    <div class="top-badges">
      <span class="badge-new">Novo case</span>
      <span class="badge-live"><span class="dot"></span> Site no ar</span>
    </div>
    <div class="headline">
      <img src="${logo}" alt="" />
      <div>
        <p class="client">${title}</p>
        <p class="tag">${esc(tag)}</p>
      </div>
    </div>
    <div class="phone-wrap">
      <div class="phone-glow"></div>
      <div class="phone">
        <div class="phone-bar"><span>${SITE}</span></div>
        <div class="phone-screen">
          <img src="${screenshot}" alt="" />
        </div>
      </div>
      <div class="float-live">
        <div class="v">Live</div>
        <div class="k">Em produção</div>
      </div>
    </div>
    <div class="bottom">
      <div class="url-big">${SITE}</div>
      <div class="cta">Arrasta para cima · vê o projeto</div>
      <p class="brand-footer" style="margin-top:28px">
        <strong>Asteron Digital</strong>
        Software house · asteron.digital
      </p>
    </div>
  </div>
  </body></html>`
}

const TOTAL_FEED = 5

/** @type {{ file: string; html: string; w: number; h: number }[]} */
const RENDERS = []

const logo = await logoB64()
const hero = await imgB64('01-hero-desktop.png')
const features = await imgB64('02-features-desktop.png')
const signup = await imgB64('03-signup-desktop.png')
const professor = await imgB64('06-professor-desktop.png')
const heroStory = await imgB64('05-hero-story.png')
const signupStory = await imgB64('08-signup-story.png')

RENDERS.push(
  {
    file: path.join(FEED_DIR, '01-cover-hero.png'),
    w: 1080, h: 1350,
    html: feedLayout({
      title: 'BJJ <em>Replay</em>',
      subtitle: 'Plataforma de replay e histórico de lutas para academias de Jiu-Jitsu.',
      chips: ['Replay pós-luta', 'Painel professor', 'Cadastro kids', 'PWA'],
      screenshot: hero, logo, slideNum: 1, total: TOTAL_FEED, browserH: 480,
    }),
  },
  {
    file: path.join(FEED_DIR, '02-features.png'),
    w: 1080, h: 1350,
    html: feedLayout({
      title: 'Tudo que o <em>atleta</em> precisa',
      subtitle: 'Replay, IA, histórico por campeonato e compartilhamento em um só lugar.',
      chips: ['Landing premium', 'Auth JWT', 'Mobile first'],
      screenshot: features, logo, slideNum: 2, total: TOTAL_FEED, browserH: 500,
    }),
  },
  {
    file: path.join(FEED_DIR, '03-signup-kids.png'),
    w: 1080, h: 1350,
    html: feedLayout({
      title: 'Cadastro <em>kids</em>',
      subtitle: 'Faixas infantis, CPF do responsável e fluxo guiado em 4 passos.',
      chips: ['Branca → verde', 'Validação CPF', 'Avatar IA'],
      screenshot: signup, logo, slideNum: 3, total: TOTAL_FEED, browserH: 500,
    }),
  },
  {
    file: path.join(FEED_DIR, '04-professor.png'),
    w: 1080, h: 1350,
    html: feedLayout({
      title: 'Painel do <em>professor</em>',
      subtitle: 'Lista de alunos, lutas por atleta e biblioteca integrada à academia.',
      chips: ['Multi-perfil', 'SQLite + Fastify', 'Docker deploy'],
      screenshot: professor, logo, slideNum: 4, total: TOTAL_FEED, browserH: 500,
    }),
  },
  {
    file: path.join(FEED_DIR, '05-cta.png'),
    w: 1080, h: 1350,
    html: feedCta({ logo, slideNum: 5, total: TOTAL_FEED }),
  },
  {
    file: path.join(STORY_DIR, '01-hero-story.png'),
    w: 1080, h: 1920,
    html: storyLayout({
      title: 'BJJ <em>Replay</em>',
      tag: 'Replay de lutas · painéis por perfil · academia conectada',
      screenshot: heroStory, logo,
    }),
  },
  {
    file: path.join(STORY_DIR, '02-signup-story.png'),
    w: 1080, h: 1920,
    html: storyLayout({
      title: 'Cadastro <em>completo</em>',
      tag: 'Atletas adultos e kids · faixa · peso · foto de perfil',
      screenshot: signupStory, logo,
    }),
  },
  {
    file: path.join(STORY_DIR, '03-cta-story.png'),
    w: 1080, h: 1920,
    html: storyLayout({
      title: 'Projeto <em>no ar</em>',
      tag: 'Case Asteron Digital · software sob medida do zero ao deploy',
      screenshot: heroStory, logo,
    }),
  },
)

await mkdir(FEED_DIR, { recursive: true })
await mkdir(STORY_DIR, { recursive: true })

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

let ok = 0
for (const r of RENDERS) {
  process.stdout.write(`-> ${path.basename(r.file)} `)
  const page = await browser.newPage()
  await page.setViewport({ width: r.w, height: r.h, deviceScaleFactor: 2 })
  await page.setContent(r.html, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.evaluate(async () => {
    await document.fonts.ready
    const imgs = [...document.querySelectorAll('img')]
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise((res) => {
            if (img.complete) {
              img.decode().then(res, res)
              return
            }
            img.onload = () => img.decode().then(res, res)
            img.onerror = res
          }),
      ),
    )
  })
  await new Promise((t) => setTimeout(t, 400))
  await page.screenshot({ path: r.file, type: 'png', clip: { x: 0, y: 0, width: r.w, height: r.h } })
  await page.close()
  console.log('ok')
  ok++
}

await browser.close()
console.log(`\n${ok} PNG(s) → output/ig-feed/ e output/ig-stories/`)
