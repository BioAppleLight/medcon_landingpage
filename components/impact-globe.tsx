"use client"

import { useEffect, useRef } from "react"
import {
  geoDistance,
  geoEquirectangular,
  geoGraticule10,
  geoInterpolate,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
} from "d3-geo"
import { feature } from "topojson-client"
import landTopology from "world-atlas/land-110m.json"

type Coordinate = [number, number]

const WIDTH = 720
const HEIGHT = 420
const LAND_WIDTH = 720
const LAND_HEIGHT = 360
const ORIGIN: Coordinate = [-73.97, 40.75]
const DESTINATIONS: Coordinate[] = [
  // Americas
  [-118.24, 34.05],
  [-122.42, 37.77],
  [-87.63, 41.88],
  [-80.19, 25.76],
  [-95.37, 29.76],
  [-122.33, 47.61],
  [-79.38, 43.65],
  [-99.13, 19.43],
  [-46.63, -23.55],
  [-58.38, -34.6],
  // Slovakia
  [17.11, 48.15],
  [21.26, 48.72],
  [18.74, 49.22],
  [19.15, 48.74],
  [21.24, 49.0],
  [18.08, 48.31],
  [17.59, 48.38],
  // Australia
  [151.21, -33.87],
  [144.96, -37.81],
  [153.03, -27.47],
  [115.86, -31.95],
  [138.6, -34.93],
  [149.13, -35.28],
  [130.84, -12.46],
]

const topology = landTopology as unknown as {
  type: "Topology"
  objects: { land: Parameters<typeof feature>[1] }
  arcs: unknown[]
}

const land = feature(topology as never, topology.objects.land as never) as GeoPermissibleObjects

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function sampleLandPoints(): Coordinate[] {
  const mask = document.createElement("canvas")
  mask.width = LAND_WIDTH
  mask.height = LAND_HEIGHT
  const context = mask.getContext("2d", { willReadFrequently: true })
  if (!context) return []

  const projection = geoEquirectangular()
    .translate([LAND_WIDTH / 2, LAND_HEIGHT / 2])
    .scale(LAND_WIDTH / (2 * Math.PI))
  const path = geoPath(projection, context)

  context.clearRect(0, 0, LAND_WIDTH, LAND_HEIGHT)
  context.beginPath()
  path(land)
  context.fillStyle = "#fff"
  context.fill()

  const pixels = context.getImageData(0, 0, LAND_WIDTH, LAND_HEIGHT).data
  const points: Coordinate[] = []

  for (let latitude = -58; latitude <= 84; latitude += 1.2) {
    const longitudeStep = 1.2 / Math.max(0.25, Math.cos((latitude * Math.PI) / 180))
    for (let longitude = -180; longitude < 180; longitude += longitudeStep) {
      const x = Math.max(0, Math.min(LAND_WIDTH - 1, Math.round(((longitude + 180) / 360) * LAND_WIDTH)))
      const y = Math.max(0, Math.min(LAND_HEIGHT - 1, Math.round(((90 - latitude) / 180) * LAND_HEIGHT)))
      if (pixels[(y * LAND_WIDTH + x) * 4 + 3] > 120) points.push([longitude, latitude])
    }
  }

  return points
}

export function ImpactGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const points = sampleLandPoints()
    const projection = geoOrthographic()
      .translate([WIDTH / 2, HEIGHT / 2])
      .scale(170)
      .clipAngle(90)
      .precision(0.35)
    const graticule = geoGraticule10()
    let animationFrame = 0
    let start = performance.now()

    function resize() {
      if (!canvas) return
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(WIDTH * ratio)
      canvas.height = Math.round(HEIGHT * ratio)
    }

    function draw(elapsed: number) {
      if (!canvas) return
      const context = canvas.getContext("2d")
      if (!context) return

      const ratio = canvas.width / WIDTH
      const t = elapsed % 11
      // One full eastward turn per loop brings the three priority regions into focus:
      // the Americas first, Slovakia next, and Australia at the seeded six-second frame.
      projection.rotate([75 - t * (360 / 11), -16])
      const path = geoPath(projection, context)
      const center = projection.invert?.([WIDTH / 2, HEIGHT / 2]) as Coordinate

      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, WIDTH, HEIGHT)

      const atmosphere = context.createRadialGradient(
        WIDTH / 2,
        HEIGHT / 2,
        0,
        WIDTH / 2,
        HEIGHT / 2,
        170 * 1.12,
      )
      atmosphere.addColorStop(0, "rgba(20,45,90,.28)")
      atmosphere.addColorStop(0.86, "rgba(47,139,255,.14)")
      atmosphere.addColorStop(1, "rgba(47,139,255,0)")
      context.fillStyle = atmosphere
      context.beginPath()
      context.arc(WIDTH / 2, HEIGHT / 2, 170 * 1.12, 0, Math.PI * 2)
      context.fill()

      context.beginPath()
      path({ type: "Sphere" })
      context.fillStyle = "#081226"
      context.fill()
      context.strokeStyle = "rgba(110,160,230,.25)"
      context.lineWidth = 1
      context.stroke()

      context.beginPath()
      path(graticule)
      context.strokeStyle = "rgba(90,120,170,.07)"
      context.lineWidth = 1
      context.stroke()

      for (const point of points) {
        const distance = geoDistance(point, center)
        if (distance > Math.PI / 2) continue
        const projected = projection(point)
        if (!projected) continue
        const fade = clamp(1 - distance / (Math.PI / 2))
        context.beginPath()
        context.arc(projected[0], projected[1], 0.85 + fade * 0.55, 0, Math.PI * 2)
        context.fillStyle = `rgba(140,175,225,${0.14 + fade * 0.5})`
        context.fill()
      }

      context.save()
      context.lineCap = "round"
      context.strokeStyle = "rgba(47,139,255,.55)"
      context.lineWidth = 1.1
      context.shadowBlur = 6
      context.shadowColor = "rgba(47,139,255,.9)"
      DESTINATIONS.forEach((destination, index) => {
        const phase = clamp((t - 0.15 * index) / 1.4)
        if (phase <= 0) return
        const interpolate = geoInterpolate(ORIGIN, destination)
        const samples = Math.max(2, Math.ceil(40 * phase))
        const arc = {
          type: "LineString" as const,
          coordinates: Array.from({ length: samples }, (_, sample) =>
            interpolate((sample / (samples - 1)) * phase),
          ),
        }
        context.beginPath()
        path(arc)
        context.stroke()
      })
      context.restore()

      DESTINATIONS.forEach((destination, index) => {
        const phase = clamp((t - 0.15 * index) / 1.4)
        if (phase < 1 || geoDistance(destination, center) > Math.PI / 2) return
        const projected = projection(destination)
        if (!projected) return
        const pulse = (t * 0.9 + index * 0.37) % 1

        context.save()
        context.shadowBlur = 8
        context.shadowColor = "#2f8bff"
        context.fillStyle = "#63aaff"
        context.beginPath()
        context.arc(projected[0], projected[1], 2, 0, Math.PI * 2)
        context.fill()
        context.restore()

        context.strokeStyle = `rgba(99,170,255,${1 - pulse})`
        context.lineWidth = 1
        context.beginPath()
        context.arc(projected[0], projected[1], 2.5 + pulse * 9, 0, Math.PI * 2)
        context.stroke()
      })

      if (geoDistance(ORIGIN, center) <= Math.PI / 2) {
        const projected = projection(ORIGIN)
        if (projected) {
          const pulse = (t % 1.25) / 1.25
          context.save()
          context.shadowBlur = 12
          context.shadowColor = "#fff"
          context.fillStyle = "#fff"
          context.beginPath()
          context.arc(projected[0], projected[1], 3, 0, Math.PI * 2)
          context.fill()
          context.restore()
          context.strokeStyle = `rgba(255,255,255,${1 - pulse})`
          context.lineWidth = 1.2
          context.beginPath()
          context.arc(projected[0], projected[1], 3 + pulse * 10, 0, Math.PI * 2)
          context.stroke()
        }
      }
    }

    function animate(now: number) {
      draw((now - start) / 1000)
      animationFrame = requestAnimationFrame(animate)
    }

    resize()
    draw(6)
    start = performance.now()
    animationFrame = requestAnimationFrame(animate)

    const onResize = () => {
      resize()
      draw((performance.now() - start) / 1000)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <div className="mt-10 min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-[#050b18] p-2 sm:p-4">
      <div className="flex items-center justify-between gap-4 px-3 pt-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Global reach</p>
          <p className="mt-1 text-xs text-muted-foreground">One expert, connected worldwide</p>
        </div>
        <span className="shrink-0 text-xs uppercase tracking-[0.12em] text-[#63aaff]">Live network</span>
      </div>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        aria-label="Animated globe showing MYO'S reach from New York to destinations worldwide"
        className="block h-auto w-full max-w-full"
      />
    </div>
  )
}
