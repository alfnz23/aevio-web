'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { simplex3 } from '@/lib/noise'
import { configureGSAP } from '@/lib/gsap-config'

interface SceneProps {
  onSectionChange?: (section: number) => void
}

export default function Scene({ onSectionChange }: SceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ============================================================
    // RENDERER
    // ============================================================
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0xf2ede6, 1)

    // ============================================================
    // CAMERA
    // ============================================================
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    )
    camera.position.set(0, 0, 8)

    // ============================================================
    // SCENE
    // ============================================================
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0xf2ede6, 0.05)

    // ============================================================
    // MAIN OBJECT — neural brain crystal
    // ============================================================
    const baseGeo = new THREE.IcosahedronGeometry(1.8, 5)
    const geometry = baseGeo.toNonIndexed()
    baseGeo.dispose()

    const positions = geometry.attributes.position
    const vertexCount = positions.count

    for (let i = 0; i < vertexCount; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)
      const len = Math.sqrt(x * x + y * y + z * z)
      const nx = x / len
      const ny = y / len
      const nz = z / len
      const displacement =
        simplex3(nx * 2.1, ny * 2.1, nz * 2.1) * 0.35 +
        simplex3(nx * 4.3 + 1.7, ny * 4.3 + 1.7, nz * 4.3 + 1.7) * 0.12
      positions.setXYZ(
        i,
        x + nx * displacement,
        y + ny * displacement,
        z + nz * displacement,
      )
    }
    geometry.computeVertexNormals()

    const material = new THREE.MeshStandardMaterial({
      color: 0x1a1208,
      roughness: 0.85,
      metalness: 0.15,
      side: THREE.FrontSide,
    })

    const mainObject = new THREE.Mesh(geometry, material)
    scene.add(mainObject)

    // ============================================================
    // LIGHTING — internal glow + ambient + rim
    // ============================================================
    const innerLight = new THREE.PointLight(0xc8a96e, 3, 8)
    innerLight.position.set(0, 0, 0)
    mainObject.add(innerLight)

    const ambientLight = new THREE.AmbientLight(0xf2ede6, 0.4)
    scene.add(ambientLight)

    const rimLight = new THREE.DirectionalLight(0xd4a85a, 0.8)
    rimLight.position.set(2, 4, 3)
    scene.add(rimLight)

    // ============================================================
    // NEURAL NETWORK OVERLAY — fibonacci sphere points + lines
    // ============================================================
    const pointCount = 200
    const pointPositions = new Float32Array(pointCount * 3)

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / pointCount)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 1.85
      pointPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pointPositions[i * 3 + 1] = r * Math.cos(phi)
      pointPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }

    const pointGeo = new THREE.BufferGeometry()
    pointGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(pointPositions, 3),
    )
    const pointMat = new THREE.PointsMaterial({
      color: 0xc8a96e,
      size: 0.025,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })
    const pointsMesh = new THREE.Points(pointGeo, pointMat)
    mainObject.add(pointsMesh)

    // Find connections: pairs where distance < 0.8
    const linePositions: number[] = []
    for (let i = 0; i < pointCount; i++) {
      for (let j = i + 1; j < pointCount; j++) {
        const dx = pointPositions[i * 3] - pointPositions[j * 3]
        const dy = pointPositions[i * 3 + 1] - pointPositions[j * 3 + 1]
        const dz = pointPositions[i * 3 + 2] - pointPositions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 0.8) {
          linePositions.push(
            pointPositions[i * 3],
            pointPositions[i * 3 + 1],
            pointPositions[i * 3 + 2],
            pointPositions[j * 3],
            pointPositions[j * 3 + 1],
            pointPositions[j * 3 + 2],
          )
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(linePositions), 3),
    )
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xc8a96e,
      transparent: true,
      opacity: 0.3,
    })
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat)
    mainObject.add(linesMesh)

    // ============================================================
    // SATELLITE OBJECTS — appear in section 3
    // ============================================================
    const satelliteData = [
      { angle: 0, distance: 3.5, size: 0.4 },
      { angle: (2 * Math.PI) / 3, distance: 3.5, size: 0.38 },
      { angle: (4 * Math.PI) / 3, distance: 3.5, size: 0.42 },
    ]

    const satellites: THREE.Mesh[] = []
    const satelliteGeometries: THREE.BufferGeometry[] = []
    const satelliteMaterials: THREE.Material[] = []
    const satelliteGroup = new THREE.Group()
    satelliteGroup.visible = false

    for (const sd of satelliteData) {
      const satBaseGeo = new THREE.IcosahedronGeometry(sd.size, 3)
      const satGeo = satBaseGeo.toNonIndexed()
      satBaseGeo.dispose()
      const satPos = satGeo.attributes.position
      for (let i = 0; i < satPos.count; i++) {
        const x = satPos.getX(i)
        const y = satPos.getY(i)
        const z = satPos.getZ(i)
        const len = Math.sqrt(x * x + y * y + z * z)
        const d =
          simplex3((x / len) * 2, (y / len) * 2, (z / len) * 2) * 0.15
        satPos.setXYZ(
          i,
          x + (x / len) * d,
          y + (y / len) * d,
          z + (z / len) * d,
        )
      }
      satGeo.computeVertexNormals()
      const satMat = new THREE.MeshStandardMaterial({
        color: 0x1a1208,
        roughness: 0.85,
        metalness: 0.15,
      })
      const sat = new THREE.Mesh(satGeo, satMat)
      sat.position.set(
        Math.cos(sd.angle) * sd.distance,
        0,
        Math.sin(sd.angle) * sd.distance,
      )
      satellites.push(sat)
      satelliteGeometries.push(satGeo)
      satelliteMaterials.push(satMat)
      satelliteGroup.add(sat)
    }
    scene.add(satelliteGroup)

    // ============================================================
    // ANIMATION STATE
    // ============================================================
    const camProxy = { x: 0, y: 0, z: 8, lookAtY: 0 }

    let pulseTimer = 0
    let pulseActive = false
    let pulseDuration = 0
    const PULSE_INTERVAL = 2500
    const PULSE_DURATION = 1200

    const clock = new THREE.Clock()

    let isVisible = true
    const onVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // ============================================================
    // RESIZE HANDLER
    // ============================================================
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // ============================================================
    // RENDER LOOP
    // ============================================================
    let animId = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return

      const delta = clock.getDelta()

      // Autonomous rotation — paused when camera is close (section 2)
      const camDist = camera.position.z
      if (camDist > 2.5) {
        mainObject.rotation.y += 0.0003
        mainObject.rotation.x += 0.00015
      }

      // Satellite orbit
      if (satelliteGroup.visible) {
        satelliteGroup.rotation.y += 0.001
      }

      // Pulse animation
      pulseTimer += delta * 1000
      if (!pulseActive && pulseTimer > PULSE_INTERVAL) {
        pulseActive = true
        pulseDuration = 0
        pulseTimer = 0
      }
      if (pulseActive) {
        pulseDuration += delta * 1000
        const t = pulseDuration / PULSE_DURATION
        if (t >= 1) {
          pulseActive = false
          lineMat.opacity = 0.3
        } else {
          lineMat.opacity = 0.3 + 0.7 * Math.sin(t * Math.PI)
        }
      }

      // Apply camera from proxy
      camera.position.set(camProxy.x, camProxy.y, camProxy.z)
      camera.lookAt(0, camProxy.lookAtY ?? 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    // ============================================================
    // GSAP SCROLL JOURNEY — 5 sections across 0–600vh
    // ============================================================
    let killScrollTriggers: (() => void) | null = null

    ;(async () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Only set up scroll animation if user hasn't requested reduced motion
      if (!prefersReducedMotion) {
        const gsap = await configureGSAP()
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#scroll-spacer',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
            onUpdate: (self) => {
              const p = self.progress
              const section =
                p < 0.15 ? 0 : p < 0.35 ? 1 : p < 0.55 ? 2 : p < 0.75 ? 3 : 4
              if (onSectionChange) onSectionChange(section)

              // Show/hide satellites
              satelliteGroup.visible = section === 3

              // Section 4: activate all neural lines
              if (section === 4) {
                lineMat.opacity = 0.8
              } else if (!pulseActive) {
                lineMat.opacity = 0.3
              }
            },
          },
        })

        // Camera keyframes via proxy
        tl.to(
          camProxy,
          { z: 4, y: 0.5, duration: 0.2, ease: 'power2.inOut' },
          0.15,
        )
        tl.to(
          camProxy,
          { z: 1.2, y: 0, duration: 0.2, ease: 'power2.inOut' },
          0.35,
        )
        tl.to(
          camProxy,
          { z: 5, y: -0.5, duration: 0.2, ease: 'power2.inOut' },
          0.55,
        )
        tl.to(
          camProxy,
          { z: 7, y: 0, duration: 0.2, ease: 'power2.inOut' },
          0.75,
        )

        // Background shift via body background color
        tl.to(document.body, { backgroundColor: '#EDE8E0', duration: 1 }, 0)

        // Inner light intensity: stays 3 until section 4, then spikes to 8
        tl.to(innerLight, { intensity: 8, duration: 0.1 }, 0.85)
        tl.to(innerLight, { intensity: 3, duration: 0.1 }, 1.0)

        killScrollTriggers = () => {
          ScrollTrigger.getAll().forEach((t) => t.kill())
          tl.kill()
        }
      }
    })()

    // ============================================================
    // CLEANUP
    // ============================================================
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (killScrollTriggers) killScrollTriggers()

      // Dispose main object
      geometry.dispose()
      material.dispose()

      // Dispose neural network overlay
      pointGeo.dispose()
      pointMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()

      // Dispose satellites
      satelliteGeometries.forEach((g) => g.dispose())
      satelliteMaterials.forEach((m) => m.dispose())

      renderer.dispose()
    }
  }, [onSectionChange])

  return (
    <canvas
      id="scene-canvas"
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
      }}
    />
  )
}
