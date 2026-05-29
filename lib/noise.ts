// Simplex noise — used to displace icosahedron vertices into organic form
// Based on Stefan Gustavson's public domain implementation

const F3 = 1.0 / 3.0
const G3 = 1.0 / 6.0

const GRAD3: number[][] = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
]

function buildPermTable(seed = 42): Uint8Array {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  let r = seed
  for (let i = 255; i > 0; i--) {
    r = (r * 16807 + 0) % 2147483647
    const j = Math.abs(r) % (i + 1)
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  return p
}

const perm = buildPermTable()
const perm12 = new Uint8Array(512)
const permFull = new Uint8Array(512)
for (let i = 0; i < 512; i++) {
  permFull[i] = perm[i & 255]
  perm12[i] = permFull[i] % 12
}

function dot3(g: number[], x: number, y: number, z: number): number {
  return g[0] * x + g[1] * y + g[2] * z
}

export function simplex3(xin: number, yin: number, zin: number): number {
  const s = (xin + yin + zin) * F3
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const k = Math.floor(zin + s)
  const t = (i + j + k) * G3
  const X0 = i - t
  const Y0 = j - t
  const Z0 = k - t
  const x0 = xin - X0
  const y0 = yin - Y0
  const z0 = zin - Z0

  let i1: number, j1: number, k1: number
  let i2: number, j2: number, k2: number

  if (x0 >= y0) {
    if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0 }
    else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1 }
    else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1 }
  } else {
    if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1 }
    else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1 }
    else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0 }
  }

  const x1=x0-i1+G3, y1=y0-j1+G3, z1=z0-k1+G3
  const x2=x0-i2+2*G3, y2=y0-j2+2*G3, z2=z0-k2+2*G3
  const x3=x0-1+3*G3, y3=y0-1+3*G3, z3=z0-1+3*G3

  const ii=i&255, jj=j&255, kk=k&255

  const gi0=perm12[ii+permFull[jj+permFull[kk]]]
  const gi1=perm12[ii+i1+permFull[jj+j1+permFull[kk+k1]]]
  const gi2=perm12[ii+i2+permFull[jj+j2+permFull[kk+k2]]]
  const gi3=perm12[ii+1+permFull[jj+1+permFull[kk+1]]]

  let n0=0,n1=0,n2=0,n3=0
  let t0=0.6-x0*x0-y0*y0-z0*z0
  if(t0>=0){t0*=t0;n0=t0*t0*dot3(GRAD3[gi0],x0,y0,z0)}
  let t1=0.6-x1*x1-y1*y1-z1*z1
  if(t1>=0){t1*=t1;n1=t1*t1*dot3(GRAD3[gi1],x1,y1,z1)}
  let t2=0.6-x2*x2-y2*y2-z2*z2
  if(t2>=0){t2*=t2;n2=t2*t2*dot3(GRAD3[gi2],x2,y2,z2)}
  let t3=0.6-x3*x3-y3*y3-z3*z3
  if(t3>=0){t3*=t3;n3=t3*t3*dot3(GRAD3[gi3],x3,y3,z3)}

  return 32*(n0+n1+n2+n3) // range approx [-1, 1]
}
