// Capturas BJJ Replay — produção (Puppeteer)
//   npm run capture   (em deploy/social)

import puppeteer from 'puppeteer'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = 'https://bjj-replay.asteron.digital'
const OUT = path.resolve(__dirname, 'output/capturas')

const DESKTOP = { width: 1600, height: 1100, deviceScaleFactor: 2 }
const STORY = { width: 1080, height: 1920, deviceScaleFactor: 2, isMobile: true }

/** @type {{ id: string; url: string; viewport?: typeof DESKTOP; scrollY?: number; waitMs?: number; waitFor?: string; auth?: { email: string; password: string } }[]} */
const SHOTS = [
  { id: '01-hero-desktop', url: `${BASE}/`, viewport: DESKTOP, scrollY: 0, waitMs: 3500, waitFor: 'h1' },
  { id: '02-features-desktop', url: `${BASE}/`, viewport: DESKTOP, scrollY: 1100, waitMs: 2000 },
  { id: '03-signup-desktop', url: `${BASE}/signup`, viewport: DESKTOP, scrollY: 0, waitMs: 3000, waitFor: 'h1' },
  { id: '04-pricing-desktop', url: `${BASE}/`, viewport: DESKTOP, scrollY: 3800, waitMs: 2000 },
  { id: '05-hero-story', url: `${BASE}/`, viewport: STORY, scrollY: 0, waitMs: 4000, waitFor: 'h1' },
  {
    id: '06-professor-desktop',
    url: `${BASE}/professor`,
    viewport: DESKTOP,
    scrollY: 0,
    waitMs: 2500,
    auth: { email: 'professor@bjjreplay.app', password: 'prof123' },
  },
  {
    id: '07-dashboard-desktop',
    url: `${BASE}/dashboard`,
    viewport: DESKTOP,
    scrollY: 0,
    waitMs: 2500,
    auth: { email: 'atleta@bjjreplay.app', password: 'demo123' },
  },
  { id: '08-signup-story', url: `${BASE}/signup`, viewport: STORY, scrollY: 0, waitMs: 3000 },
]

async function login(page, { email, password }) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 45000 })
  await page.waitForSelector('input[type="email"]', { visible: true, timeout: 12000 })
  await page.click('input[type="email"]', { clickCount: 3 })
  await page.type('input[type="email"]', email, { delay: 25 })
  await page.click('input[type="password"]', { clickCount: 3 })
  await page.type('input[type="password"]', password, { delay: 25 })
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ])
  await new Promise((r) => setTimeout(r, 1500))
}

await mkdir(OUT, { recursive: true })

const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: null,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars'],
})

const page = await browser.newPage()
await page.setUserAgent(
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
)
await page.setExtraHTTPHeaders({ 'Accept-Language': 'pt-BR,pt;q=0.9' })

let ok = 0
for (const shot of SHOTS) {
  const out = path.join(OUT, `${shot.id}.png`)
  process.stdout.write(`-> ${shot.id} `)
  try {
    if (shot.auth) await login(page, shot.auth)
    await page.setViewport(shot.viewport ?? DESKTOP)
    await page.goto(shot.url, { waitUntil: 'networkidle2', timeout: 45000 })
    await page.evaluate((y) => window.scrollTo(0, y), shot.scrollY ?? 0)
    if (shot.waitFor) {
      try {
        await page.waitForSelector(shot.waitFor, { visible: true, timeout: 10000 })
      } catch {}
    }
    await new Promise((r) => setTimeout(r, shot.waitMs ?? 2000))
    await page.screenshot({ path: out, type: 'png' })
    console.log('ok')
    ok++
  } catch (err) {
    console.log(`FAIL: ${err.message}`)
  }
}

await browser.close()
console.log(`\n${ok}/${SHOTS.length} capturas → ${OUT}`)
