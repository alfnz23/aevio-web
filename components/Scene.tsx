'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { configureGSAP } from '@/lib/gsap-config'

interface SceneProps {
  onNodeChange?: (node: number) => void
}

// Seeded LCG for deterministic network generation
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

// Dispose helper
function disposeGroup(group: THREE.Group) {
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh || obj instanceof THREE.Points) {
      obj.geometry?.dispose()
      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
      else obj.material?.dispose()
    }
  })
}

export default function Scene({ onNodeChange }: SceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const onNodeChangeRef = useRef(onNodeChange)
  useEffect(() => { onNodeChangeRef.current = onNodeChange }, [onNodeChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ─── RENDERER ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x030810, 1)

    // ─── CAMERA ────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.05, 180)

    // ─── SCENE ─────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x030810, 0.022)

    // ─── LIGHTS ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a1825, 0.9))
    const globalBlue = new THREE.PointLight(0x1A5080, 1.5, 80)
    scene.add(globalBlue)

    // ─── STARS ─────────────────────────────────────────────────────────────
    const starRng = makeRng(99)
    const starPos = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      const theta = starRng() * Math.PI * 2
      const phi = Math.acos(2 * starRng() - 1)
      const r = 50 + starRng() * 25
      starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPos[i * 3 + 2] = r * Math.cos(phi)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.14, sizeAttenuation: true, transparent: true, opacity: 0.7 })
    scene.add(new THREE.Points(starGeo, starMat))

    // ─── TUBE SHARED MATERIALS ─────────────────────────────────────────────
    // 5 opacity bands shared across all main tubes
    const mainOpacities = [0.55, 0.62, 0.68, 0.74, 0.80]
    const tubeMats = mainOpacities.map(op => new THREE.MeshStandardMaterial({
      color: 0x0D2B45,
      emissive: new THREE.Color(0x1A5080),
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: op,
      roughness: 0.05,
      metalness: 0.1,
      side: THREE.DoubleSide,
    }))

    // 3 opacity bands for sub-dendrites (dimmer)
    const subOpacities = [0.30, 0.40, 0.50]
    const subMats = subOpacities.map(op => new THREE.MeshStandardMaterial({
      color: 0x0D2B45,
      emissive: new THREE.Color(0x1A5080),
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: op,
      roughness: 0.05,
      side: THREE.DoubleSide,
    }))

    // ─── NEURON TUBE NETWORK ───────────────────────────────────────────────
    const rng = makeRng(7)
    const branchCurves: THREE.CatmullRomCurve3[] = []
    const tubeGeometries: THREE.BufferGeometry[] = []
    const networkGroup = new THREE.Group()
    scene.add(networkGroup)

    for (let b = 0; b < 60; b++) {
      // Start near center of the volume the camera travels through
      const startR = rng() * 2.5
      const sTheta = rng() * Math.PI * 2
      const sPhi   = Math.acos(2 * rng() - 1)
      const startZ = (rng() - 0.5) * 30 // z range -15..15 (camera travels -44..35)

      const pts: THREE.Vector3[] = [
        new THREE.Vector3(
          startR * Math.sin(sPhi) * Math.cos(sTheta),
          startR * Math.sin(sPhi) * Math.sin(sTheta),
          startZ,
        ),
      ]

      // 7 more organic control points branching outward
      for (let p = 1; p < 8; p++) {
        const prev = pts[p - 1]
        const stepSize = 2.0 + rng() * 3.5
        const bTheta = rng() * Math.PI * 2
        const bPhi   = Math.acos(2 * rng() - 1)
        const candidate = new THREE.Vector3(
          prev.x + stepSize * Math.sin(bPhi) * Math.cos(bTheta),
          prev.y + stepSize * Math.sin(bPhi) * Math.sin(bTheta),
          prev.z + (rng() - 0.5) * stepSize * 1.2,
        )
        // Soft-clamp to sphere radius 18
        if (candidate.length() > 18) {
          candidate.normalize().multiplyScalar(14 + rng() * 4)
        }
        pts.push(candidate)
      }

      const curve = new THREE.CatmullRomCurve3(pts)
      branchCurves.push(curve)

      // Radius: thicker near center origin
      const originDist = pts[0].length()
      const radius = originDist < 2
        ? 0.06 + rng() * 0.04
        : originDist < 7
          ? 0.03 + rng() * 0.03
          : 0.015 + rng() * 0.02

      const geo = new THREE.TubeGeometry(curve, 80, radius, 6, false)
      tubeGeometries.push(geo)

      const matIdx = Math.floor(rng() * tubeMats.length)
      networkGroup.add(new THREE.Mesh(geo, tubeMats[matIdx]))
    }

    // Sub-dendrites: 2-3 per main branch
    for (let b = 0; b < 60; b++) {
      const parentCurve = branchCurves[b]
      const numSub = Math.floor(rng() * 2) + 2

      for (let s = 0; s < numSub; s++) {
        const tStart = 0.25 + rng() * 0.55
        const origin = parentCurve.getPoint(tStart)
        const subPts: THREE.Vector3[] = [origin]

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
        tubeGeometries.push(geo)
        networkGroup.add(new THREE.Mesh(geo, subMats[Math.floor(rng() * subMats.length)]))
      }
    }

    // ─── REGULAR SYNAPSE NODES (InstancedMesh) ─────────────────────────────
    const regularPositions: THREE.Vector3[] = []
    for (const curve of branchCurves) {
      regularPositions.push(curve.getPoint(1.0))
      regularPositions.push(curve.getPoint(0.5))
    }
    const synapseGeo = new THREE.SphereGeometry(0.09, 8, 8)
    const synapseMat = new THREE.MeshStandardMaterial({
      color: 0xC8E0FF,
      emissive: new THREE.Color(0xC8E0FF),
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.85,
      roughness: 0.05,
    })
    const synapseInst = new THREE.InstancedMesh(synapseGeo, synapseMat, regularPositions.length)
    const dummy = new THREE.Object3D()
    for (let i = 0; i < regularPositions.length; i++) {
      const scale = 0.4 + rng() * 1.2
      dummy.position.copy(regularPositions[i])
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      synapseInst.setMatrixAt(i, dummy.matrix)
    }
    synapseInst.instanceMatrix.needsUpdate = true
    networkGroup.add(synapseInst)

    // ─── CAMERA PATH ────────────────────────────────────────────────────────
    const pathPoints = [
      new THREE.Vector3(0,   0,   35),
      new THREE.Vector3(0,   0,   22),
      new THREE.Vector3(-3,  1,   14),
      new THREE.Vector3(-5,  3,   6),   // NODE 0
      new THREE.Vector3(2,  -2,   0),
      new THREE.Vector3(6,   1,  -8),   // NODE 1
      new THREE.Vector3(-1,  4,  -15),
      new THREE.Vector3(-4, -2,  -22),  // NODE 2
      new THREE.Vector3(3,   2,  -29),
      new THREE.Vector3(1,  -1,  -35),  // NODE 3
      new THREE.Vector3(0,   0,  -44),  // CORE (node 4)
    ]
    const cameraPath = new THREE.CatmullRomCurve3(pathPoints)

    // ─── MAJOR NODE MESHES + LIGHTS (at camera stops) ───────────────────────
    const majorNodePositions = [pathPoints[3], pathPoints[5], pathPoints[7], pathPoints[9]]
    const majorLights: THREE.PointLight[] = []
    const majorNodeGeo = new THREE.SphereGeometry(0.4, 16, 16)
    const majorNodeMats: THREE.Material[] = []

    for (const pos of majorNodePositions) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xFFD4A0,
        emissive: new THREE.Color(0xFFD4A0),
        emissiveIntensity: 3.0,
        roughness: 0.05,
      })
      majorNodeMats.push(mat)
      const mesh = new THREE.Mesh(majorNodeGeo, mat)
      mesh.position.copy(pos)
      scene.add(mesh)

      const light = new THREE.PointLight(0xFFD4A0, 1.0, 5)
      light.position.copy(pos)
      scene.add(light)
      majorLights.push(light)
    }

    // ─── CORE COMMAND CENTER ────────────────────────────────────────────────
    const corePos = pathPoints[10]
    const coreGroup = new THREE.Group()
    coreGroup.position.copy(corePos)
    scene.add(coreGroup)

    const nucleusGeo = new THREE.SphereGeometry(0.8, 32, 32)
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0xFFD4A0,
      emissive: new THREE.Color(0xFFD4A0),
      emissiveIntensity: 5.0,
      roughness: 0.05,
    })
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat)
    coreGroup.add(nucleus)

    const coreLight = new THREE.PointLight(0xFFD4A0, 4.0, 25)
    coreGroup.add(coreLight)

    // 3 orbital rings, each tilted at different angle
    const ringConfigs = [
      { r: 2.0, count: 8,  tiltX: 0,    tiltZ: 0,    speed: 0.0035 },
      { r: 3.5, count: 12, tiltX: 0.95, tiltZ: 0,    speed: -0.0022 },
      { r: 5.0, count: 10, tiltX: 0.4,  tiltZ: 0.6,  speed: 0.0016 },
    ]
    const orbitalNodeGeo = new THREE.SphereGeometry(0.12, 8, 8)
    const orbitalMat = new THREE.MeshStandardMaterial({
      color: 0xFFD4A0,
      emissive: new THREE.Color(0xFFD4A0),
      emissiveIntensity: 2.2,
      roughness: 0.05,
    })

    const ringGroups: { group: THREE.Group; speed: number }[] = []
    for (const cfg of ringConfigs) {
      const group = new THREE.Group()
      group.rotation.x = cfg.tiltX
      group.rotation.z = cfg.tiltZ
      coreGroup.add(group)

      const inst = new THREE.InstancedMesh(orbitalNodeGeo, orbitalMat, cfg.count)
      const od = new THREE.Object3D()
      for (let i = 0; i < cfg.count; i++) {
        const angle = (i / cfg.count) * Math.PI * 2
        od.position.set(Math.cos(angle) * cfg.r, 0, Math.sin(angle) * cfg.r)
        od.updateMatrix()
        inst.setMatrixAt(i, od.matrix)
      }
      inst.instanceMatrix.needsUpdate = true
      group.add(inst)
      ringGroups.push({ group, speed: cfg.speed })
    }

    // ─── ELECTRICAL PULSE POOL ──────────────────────────────────────────────
    const POOL = 20
    const pulseGeo = new THREE.SphereGeometry(0.05, 6, 6)
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff })

    interface Pulse {
      mesh: THREE.Mesh
      active: boolean
      curveIdx: number
      t: number
      speed: number
    }
    const pulses: Pulse[] = []
    for (let i = 0; i < POOL; i++) {
      const mesh = new THREE.Mesh(pulseGeo, pulseMat)
      mesh.visible = false
      scene.add(mesh)
      pulses.push({ mesh, active: false, curveIdx: 0, t: 0, speed: 0 })
    }

    let pulseTimer = 0
    let nextPulseIn = 0.4 + Math.random() * 0.5
    let stormActive = false
    let stormTime = 0

    function spawnPulse() {
      const free = pulses.find(p => !p.active)
      if (!free) return
      free.active = true
      free.curveIdx = Math.floor(Math.random() * branchCurves.length)
      free.t = 0
      free.speed = 1 / (0.8 + Math.random() * 1.2)
      free.mesh.visible = true
    }

    function triggerStorm() {
      stormActive = true
      stormTime = 0
      for (const p of pulses) {
        p.active = true
        p.curveIdx = Math.floor(Math.random() * branchCurves.length)
        p.t = Math.random()
        p.speed = 1 / (0.25 + Math.random() * 0.4)
        p.mesh.visible = true
      }
    }

    // ─── SCROLL PROXY ───────────────────────────────────────────────────────
    const scrollProxy = { t: 0 }
    let prevNode = -2
    let coreTriggered = false

    function getNode(t: number): number {
      if (t > 0.94) return 4
      if (t > 0.84) return 3
      if (t > 0.65) return 2
      if (t > 0.45) return 1
      if (t > 0.26) return 0
      return -1
    }

    // ─── RESIZE ─────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let isVisible = true
    const onVis = () => { isVisible = document.visibilityState === 'visible' }
    document.addEventListener('visibilitychange', onVis)

    // ─── RENDER LOOP ─────────────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let animId = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return

      const delta = clock.getDelta()
      const t = scrollProxy.t

      // Camera follows path
      const camPos = cameraPath.getPoint(t)
      camera.position.copy(camPos)
      const lookT = Math.min(t + 0.055, 1)
      camera.lookAt(cameraPath.getPoint(lookT))

      // Node detection
      const node = getNode(t)
      if (node !== prevNode) {
        prevNode = node
        onNodeChangeRef.current?.(node)
        if (node === 4 && !coreTriggered) {
          coreTriggered = true
          triggerStorm()
        }
      }

      // Pulse spawn
      if (!stormActive) {
        pulseTimer += delta
        if (pulseTimer > nextPulseIn) {
          spawnPulse()
          pulseTimer = 0
          nextPulseIn = 0.3 + Math.random() * 0.5
        }
      } else {
        stormTime += delta
        if (stormTime > 2) stormActive = false
      }

      // Move pulses
      for (const p of pulses) {
        if (!p.active) continue
        p.t += delta * p.speed
        if (p.t >= 1) {
          p.active = false
          p.mesh.visible = false
          continue
        }
        p.mesh.position.copy(branchCurves[p.curveIdx].getPoint(p.t))
      }

      // Core animations
      nucleus.rotation.x += delta * 0.15
      nucleus.rotation.y += delta * 0.22
      for (const r of ringGroups) {
        r.group.rotation.y += r.speed
      }

      // Major node light pulse
      const lp = (Math.sin(Date.now() * 0.0025) + 1) * 0.5
      for (const l of majorLights) {
        l.intensity = 0.5 + lp * 0.9
      }

      renderer.render(scene, camera)
    }
    animate()

    // ─── GSAP SCROLL TRIGGER ─────────────────────────────────────────────────
    let killTriggers: (() => void) | null = null
    ;(async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const gsap = await configureGSAP()
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.to(scrollProxy, {
        t: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#scroll-spacer',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2.0,
        },
      })

      killTriggers = () => ScrollTrigger.getAll().forEach(st => st.kill())
    })()

    // ─── CLEANUP ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      killTriggers?.()

      tubeGeometries.forEach(g => g.dispose())
      tubeMats.forEach(m => m.dispose())
      subMats.forEach(m => m.dispose())
      majorNodeMats.forEach(m => m.dispose())
      starGeo.dispose()
      starMat.dispose()
      synapseGeo.dispose()
      synapseMat.dispose()
      majorNodeGeo.dispose()
      pulseGeo.dispose()
      pulseMat.dispose()
      nucleusGeo.dispose()
      nucleusMat.dispose()
      orbitalNodeGeo.dispose()
      orbitalMat.dispose()
      disposeGroup(coreGroup)
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
