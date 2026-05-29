// lib/gsap-config.ts
let configured = false

export async function configureGSAP() {
  if (configured) {
    const { gsap } = await import('gsap')
    return gsap
  }
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ])
  gsap.registerPlugin(ScrollTrigger)
  configured = true
  return gsap
}
