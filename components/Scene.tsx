'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { configureGSAP } from '@/lib/gsap-config'

// ─── GLSL ──────────────────────────────────────────────────────────────────
const VERT = `
varying vec2 vUv;
varying float vDistance;
void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vDistance = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
}
`

const FRAG = `
varying vec2 vUv;
varying float vDistance;
uniform float uTime;
uniform vec3 uColor;
void main() {
  float dist = abs(vUv.x - 0.5) * 2.0;
  float glow = 1.0 - smoothstep(0.0, 1.0, dist);
  glow = pow(glow, 2.5);
  float pulse = sin(vUv.y * 20.0 - uTime * 2.0) * 0.5 + 0.5;
  pulse = mix(0.3, 1.0, pulse * 0.3);
  float fog = 1.0 - smoothstep(10.0, 40.0, vDistance);
  vec3 color = uColor * glow * pulse * fog;
  float alpha = glow * 0.85 * fog;
  gl_FragColor = vec4(color, alpha);
}
`

// ─── HELPERS ───────────────────────────────────────────────────────────────
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function makeTubeMat(hex: string): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime:  { value: 0 },
      uColor: { value: new THREE.Color(hex) },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
}

// Canvas-based radial gradient texture for sprites
function makeNodeTexture(inner: string, mid: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128; canvas.height = 128
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0,   inner)
  gradient.addColorStop(0.3, mid)
  gradient.addColorStop(1,   'rgba(200,169,110,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

function makePulseTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64; canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0,   'rgba(255,255,255,1.0)')
  g.addColorStop(0.4, 'rgba(255,220,160,0.85)')
  g.addColorStop(1,   'rgba(255,220,160,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────
interface SceneProps {
  onNodeChange?: (node: number) => void
}

export default function Scene({ onNodeChange }: SceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cbRef = useRef(onNodeChange)
  useEffect(() => { cbRef.current = onNodeChange }, [onNodeChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── RENDERER ────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x030810, 1)

    // ── CAMERA ──────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.05, 180)

    // ── SCENE ───────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    // No THREE.Fog — the GLSL shader handles distance fading

    // ── AMBIENT + GLOBAL ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a1825, 0.8))
    const globalPt = new THREE.PointLight(0x1A5080, 1.2, 80)
    scene.add(globalPt)

    // ── STARS ───────────────────────────────────────────────────────
    const starRng = makeRng(99)
    const starPos = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      const theta = starRng() * Math.PI * 2
      const phi   = Math.acos(2 * starRng() - 1)
      const r     = 50 + starRng() * 25
      starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPos[i * 3 + 2] = r * Math.cos(phi)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.14, sizeAttenuation: true, transparent: true, opacity: 0.55 })
    scene.add(new THREE.Points(starGeo, starMat))

    // ── SHADER MATERIALS (3 types — shared across tubes) ────────────
    const mainMat = makeTubeMat('#C8A96E')  // main branches — gold
    const pathMat = makeTubeMat('#FFD4A0')  // path-adjacent — warm bright
    const subMat  = makeTubeMat('#E8D0A0')  // sub-dendrites — pale

    const allShaderMats = [mainMat, pathMat, subMat]
    const tubeGeos: THREE.BufferGeometry[] = []

    // ── 60 MAIN BRANCHES ────────────────────────────────────────────
    const rng = makeRng(7)
    const branchCurves: THREE.CatmullRomCurve3[] = []

    for (let b = 0; b < 60; b++) {
      const startR  = rng() * 2.5
      const sTheta  = rng() * Math.PI * 2
      const sPhi    = Math.acos(2 * rng() - 1)
      const startZ  = (rng() - 0.5) * 30

      const pts: THREE.Vector3[] = [
        new THREE.Vector3(
          startR * Math.sin(sPhi) * Math.cos(sTheta),
          startR * Math.sin(sPhi) * Math.sin(sTheta),
          startZ,
        ),
      ]

      for (let p = 1; p < 8; p++) {
        const prev     = pts[p - 1]
        const stepSize = 2.0 + rng() * 3.5
        const bTheta   = rng() * Math.PI * 2
        const bPhi     = Math.acos(2 * rng() - 1)
        const next     = new THREE.Vector3(
          prev.x + stepSize * Math.sin(bPhi) * Math.cos(bTheta),
          prev.y + stepSize * Math.sin(bPhi) * Math.sin(bTheta),
          prev.z + (rng() - 0.5) * stepSize * 1.2,
        )
        if (next.length() > 18) next.normalize().multiplyScalar(14 + rng() * 4)
        pts.push(next)
      }

      const curve  = new THREE.CatmullRomCurve3(pts)
      branchCurves.push(curve)

      const originDist = pts[0].length()
      const radius = originDist < 2 ? 0.06 + rng() * 0.04
                   : originDist < 7 ? 0.03 + rng() * 0.03
                   :                   0.015 + rng() * 0.02

      const geo = new THREE.TubeGeometry(curve, 80, radius, 6, false)
      tubeGeos.push(geo)
      // 65% mainMat (gold), 35% pathMat (warm bright) for visual variety
      scene.add(new THREE.Mesh(geo, rng() > 0.35 ? mainMat : pathMat))
    }

    // ── SUB-DENDRITES ───────────────────────────────────────────────
    for (let b = 0; b < 60; b++) {
      const parent = branchCurves[b]
      const numSub = Math.floor(rng() * 2) + 2

      for (let s = 0; s < numSub; s++) {
        const origin  = parent.getPoint(0.25 + rng() * 0.55)
        const subPts  = [origin]

        for (let p = 1; p < 5; p++) {
          const prev = subPts[p - 1]
          const step = 1.0 + rng() * 2.0
          subPts.push(new THREE.Vector3(
            prev.x + (rng() - 0.5) * step * 2.2,
            prev.y + (rng() - 0.5) * step * 2.2,
            prev.z + (rng() - 0.5) * step,
          ))
        }

        const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(subPts), 40, 0.008 + rng() * 0.015, 4, false)
        tubeGeos.push(geo)
        scene.add(new THREE.Mesh(geo, subMat))
      }
    }

    // ── SPRITE TEXTURES ─────────────────────────────────────────────
    const nodeTexWarm = makeNodeTexture('rgba(255,212,160,1.0)', 'rgba(200,169,110,0.8)')
    const nodeTexCool = makeNodeTexture('rgba(220,240,255,1.0)', 'rgba(180,210,245,0.8)')
    const pulseTexture = makePulseTexture()

    // ── REGULAR SYNAPSE SPRITES ─────────────────────────────────────
    const regularMatWarm = new THREE.SpriteMaterial({ map: nodeTexWarm, transparent: true })
    const regularMatCool = new THREE.SpriteMaterial({ map: nodeTexCool, transparent: true })

    for (let b = 0; b < branchCurves.length; b++) {
      for (const t of [1.0, 0.5]) {
        const pos    = branchCurves[b].getPoint(t)
        const sprite = new THREE.Sprite(b % 3 === 0 ? regularMatWarm : regularMatCool)
        sprite.scale.setScalar(0.3 + rng() * 0.5)
        sprite.position.copy(pos)
        scene.add(sprite)
      }
    }

    // ── CAMERA PATH ─────────────────────────────────────────────────
    const pathPoints = [
      new THREE.Vector3(0,   0,   35),
      new THREE.Vector3(0,   0,   22),
      new THREE.Vector3(-3,  1,   14),
      new THREE.Vector3(-5,  3,    6),   // NODE 0
      new THREE.Vector3(2,  -2,    0),
      new THREE.Vector3(6,   1,   -8),   // NODE 1
      new THREE.Vector3(-1,  4,  -15),
      new THREE.Vector3(-4, -2,  -22),   // NODE 2
      new THREE.Vector3(3,   2,  -29),
      new THREE.Vector3(1,  -1,  -35),   // NODE 3
      new THREE.Vector3(0,   0,  -44),   // CORE
    ]
    const cameraPath = new THREE.CatmullRomCurve3(pathPoints)

    // ── MAJOR NODE SPRITES (1.5× scale, warm, with PointLight) ──────
    const majorMat = new THREE.SpriteMaterial({ map: nodeTexWarm, transparent: true })
    const majorLights: THREE.PointLight[] = []

    for (const pos of [pathPoints[3], pathPoints[5], pathPoints[7], pathPoints[9]]) {
      const sprite = new THREE.Sprite(majorMat)
      sprite.scale.setScalar(1.5)
      sprite.position.copy(pos)
      scene.add(sprite)

      const light = new THREE.PointLight(0xFFD4A0, 1.0, 5)
      light.position.copy(pos)
      scene.add(light)
      majorLights.push(light)
    }

    // ── CORE COMMAND CENTER ─────────────────────────────────────────
    const corePos   = pathPoints[10]
    const coreGroup = new THREE.Group()
    coreGroup.position.copy(corePos)
    scene.add(coreGroup)

    const nucleusMat = new THREE.SpriteMaterial({ map: nodeTexWarm, transparent: true })
    const nucleus = new THREE.Sprite(nucleusMat)
    nucleus.scale.setScalar(3.0)
    coreGroup.add(nucleus)

    const coreLight = new THREE.PointLight(0xFFD4A0, 5.0, 25)
    coreGroup.add(coreLight)

    // 3 tilted orbital rings
    const ringConfigs = [
      { r: 2.0, count: 8,  tiltX: 0,    tiltZ: 0,    speed:  0.004  },
      { r: 3.5, count: 12, tiltX: 0.95, tiltZ: 0,    speed: -0.003  },
      { r: 5.0, count: 10, tiltX: 0.4,  tiltZ: 0.6,  speed:  0.002  },
    ]
    const orbitalMat = new THREE.SpriteMaterial({ map: nodeTexWarm, transparent: true, opacity: 0.9 })
    const ringGroups: { group: THREE.Group; speed: number }[] = []

    for (const cfg of ringConfigs) {
      const group = new THREE.Group()
      group.rotation.x = cfg.tiltX
      group.rotation.z = cfg.tiltZ
      coreGroup.add(group)

      for (let i = 0; i < cfg.count; i++) {
        const angle  = (i / cfg.count) * Math.PI * 2
        const orb    = new THREE.Sprite(orbitalMat)
        orb.scale.setScalar(0.45)
        orb.position.set(Math.cos(angle) * cfg.r, 0, Math.sin(angle) * cfg.r)
        group.add(orb)
      }
      ringGroups.push({ group, speed: cfg.speed })
    }

    // ── ELECTRICAL PULSE POOL ───────────────────────────────────────
    const POOL    = 20
    const pulseMat = new THREE.SpriteMaterial({ map: pulseTexture, transparent: true })

    interface Pulse { sprite: THREE.Sprite; active: boolean; curveIdx: number; t: number; speed: number }
    const pulses: Pulse[] = []
    for (let i = 0; i < POOL; i++) {
      const sprite = new THREE.Sprite(pulseMat)
      sprite.scale.setScalar(0.35)
      sprite.visible = false
      scene.add(sprite)
      pulses.push({ sprite, active: false, curveIdx: 0, t: 0, speed: 0 })
    }

    let pulseTimer  = 0
    let nextPulseIn = 0.4 + Math.random() * 0.5
    let stormActive = false
    let stormTime   = 0

    function spawnPulse() {
      const free = pulses.find(p => !p.active)
      if (!free) return
      free.active = true
      free.curveIdx = Math.floor(Math.random() * branchCurves.length)
      free.t     = 0
      free.speed = 1 / (0.8 + Math.random() * 1.2)
      free.sprite.visible = true
    }

    function triggerStorm() {
      stormActive = true; stormTime = 0
      for (const p of pulses) {
        p.active = true
        p.curveIdx = Math.floor(Math.random() * branchCurves.length)
        p.t     = Math.random()
        p.speed = 1 / (0.25 + Math.random() * 0.4)
        p.sprite.visible = true
      }
    }

    // ── SCROLL PROXY ────────────────────────────────────────────────
    const scrollProxy = { t: 0 }
    let prevNode      = -2
    let coreTriggered = false

    function getNode(t: number): number {
      if (t > 0.94) return 4
      if (t > 0.84) return 3
      if (t > 0.65) return 2
      if (t > 0.45) return 1
      if (t > 0.26) return 0
      return -1
    }

    // ── RESIZE ──────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let isVisible = true
    const onVis   = () => { isVisible = document.visibilityState === 'visible' }
    document.addEventListener('visibilitychange', onVis)

    // ── RENDER LOOP ─────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let elapsed = 0
    let animId  = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return

      const delta = clock.getDelta()
      elapsed += delta
      const t   = scrollProxy.t

      // Update shader time — same elapsed for all (coherent pulse phase)
      for (const m of allShaderMats) m.uniforms.uTime.value = elapsed

      // Camera follows path
      camera.position.copy(cameraPath.getPoint(t))
      camera.lookAt(cameraPath.getPoint(Math.min(t + 0.055, 1)))

      // Node detection
      const node = getNode(t)
      if (node !== prevNode) {
        prevNode = node
        cbRef.current?.(node)
        if (node === 4 && !coreTriggered) { coreTriggered = true; triggerStorm() }
      }

      // Pulse spawn
      if (!stormActive) {
        pulseTimer += delta
        if (pulseTimer > nextPulseIn) {
          spawnPulse()
          pulseTimer  = 0
          nextPulseIn = 0.3 + Math.random() * 0.5
        }
      } else {
        stormTime += delta
        if (stormTime > 2) stormActive = false
      }
      for (const p of pulses) {
        if (!p.active) continue
        p.t += delta * p.speed
        if (p.t >= 1) { p.active = false; p.sprite.visible = false; continue }
        p.sprite.position.copy(branchCurves[p.curveIdx].getPoint(p.t))
      }

      // Core orbital rotation
      for (const r of ringGroups) r.group.rotation.y += r.speed

      // Nucleus slow rotation (world-space: rotate parent group)
      coreGroup.rotation.y += delta * 0.08

      // Major node light pulse
      const lp = (Math.sin(elapsed * 2.5) + 1) * 0.5
      for (const l of majorLights) l.intensity = 0.5 + lp * 0.9

      renderer.render(scene, camera)
    }
    animate()

    // ── GSAP SCROLL TRIGGER ─────────────────────────────────────────
    let killTriggers: (() => void) | null = null
    ;(async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const gsap = await configureGSAP()
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.to(scrollProxy, {
        t: 1, ease: 'none',
        scrollTrigger: {
          trigger: '#scroll-spacer',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2.0,
        },
      })
      killTriggers = () => ScrollTrigger.getAll().forEach(st => st.kill())
    })()

    // ── CLEANUP ─────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      killTriggers?.()

      tubeGeos.forEach(g => g.dispose())
      allShaderMats.forEach(m => m.dispose())
      starGeo.dispose()
      starMat.dispose()
      nodeTexWarm.dispose()
      nodeTexCool.dispose()
      pulseTexture.dispose()
      regularMatWarm.dispose()
      regularMatCool.dispose()
      majorMat.dispose()
      nucleusMat.dispose()
      orbitalMat.dispose()
      pulseMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 1, width: '100%', height: '100%' }}
    />
  )
}
