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
    const baseGeo = new THREE.SphereGeometry(2, 64, 64)
    const geometry = baseGeo.toNonIndexed()
    baseGeo.dispose()

    const positions = geometry.attributes.position
    const vertexCount = positions.count

    for (let i = 0; i < vertexCount; i++) {
      const ox = positions.getX(i)
      const oy = positions.getY(i)
      const oz = positions.getZ(i)
      // Brain-like lumpy displacement (spec)
      const dy = simplex3(ox * 0.8, oz * 0.8, 0) * 0.6
      const dx = simplex3(oy * 0.6, oz * 0.9, 1.3) * 0.4
      // Also a small radial term to keep organic roundness
      const len = Math.sqrt(ox*ox + oy*oy + oz*oz)
      const radial = simplex3(ox/len * 2.5, oy/len * 2.5, oz/len * 2.5) * 0.25
      positions.setXYZ(i, ox + dx + (ox/len)*radial, oy + dy + (oy/len)*radial, oz + (oz/len)*radial)
    }
    geometry.computeVertexNormals()

    const material = new THREE.MeshStandardMaterial({
      color: 0x1a1208,
      roughness: 0.85,
      metalness: 0.15,
      emissive: new THREE.Color(0xc8a96e),
      emissiveIntensity: 0.08,
      side: THREE.FrontSide,
    })

    const mainObject = new THREE.Mesh(geometry, material)
    scene.add(mainObject)

    // ============================================================
    // LIGHTING — internal glow + ambient + spot + depth points
    // ============================================================
    // Internal glow — intensity 4 (was 3)
    const innerLight = new THREE.PointLight(0xc8a96e, 4, 10)
    innerLight.position.set(0, 0, 0)
    mainObject.add(innerLight)

    // Ambient
    const ambientLight = new THREE.AmbientLight(0xf2ede6, 0.35)
    scene.add(ambientLight)

    // Spot from above — approximates RectAreaLight
    const topSpot = new THREE.SpotLight(0xd4a85a, 1.2, 20, Math.PI * 0.25, 0.6)
    topSpot.position.set(0, 9, 2)
    scene.add(topSpot)

    // 3 depth PointLights for atmospheric depth
    const warmLight = new THREE.PointLight(0xd4b896, 0.3, 20)
    warmLight.position.set(5, 3, -4)
    scene.add(warmLight)

    const coolLight = new THREE.PointLight(0xe8e0d8, 0.2, 20)
    coolLight.position.set(-4, -2, 3)
    scene.add(coolLight)

    const accentLight = new THREE.PointLight(0xc8a96e, 0.15, 20)
    accentLight.position.set(0, 6, 0)
    scene.add(accentLight)

    // ============================================================
    // BACKGROUND ATMOSPHERE — inverted sphere with radial gradient
    // ============================================================
    const bgGeo = new THREE.SphereGeometry(22, 32, 32)
    const bgMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPos;
        void main() {
          float d = clamp(length(vPos.xz) / 22.0, 0.0, 1.0);
          vec3 c0 = vec3(0.949, 0.929, 0.902); // #F2EDE6 center
          vec3 c1 = vec3(0.898, 0.867, 0.831); // #E5DDD4 edge
          gl_FragColor = vec4(mix(c0, c1, d * d), 1.0);
        }
      `,
      side: THREE.BackSide,
    })
    const bgSphere = new THREE.Mesh(bgGeo, bgMat)
    scene.add(bgSphere)

    // ============================================================
    // NEURAL NETWORK OVERLAY — fibonacci sphere points + lines
    // ============================================================
    const pointCount = 300
    const pointPositions = new Float32Array(pointCount * 3)

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / pointCount)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 2.08
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
      size: 0.04,
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
      opacity: 0.25,
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
    const PULSE_INTERVAL = 1500
    const PULSE_DURATION = 600

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
          lineMat.opacity = 0.25
        } else {
          lineMat.opacity = 0.25 + 0.65 * Math.sin(t * Math.PI)
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
                lineMat.opacity = 0.25
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

      // Dispose background atmosphere
      bgGeo.dispose()
      bgMat.dispose()
      // topSpot has no extra dispose needed

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
