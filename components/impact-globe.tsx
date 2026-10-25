"use client"

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react"
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
// Abu Dhabi is the network hub. Keep this list intentionally focused on the
// locations where MYO'S currently wants to show an active connection.
const ORIGIN: Coordinate = [54.3773, 24.4539]
const DESTINATIONS: Coordinate[] = [
  [13.405, 52.52], // Germany · Berlin
  [14.4378, 50.0755], // Czechia · Prague
  [12.4964, 41.9028], // Italy · Rome
  [-122.4194, 37.7749], // San Francisco
  [-73.9857, 40.7484], // United States · New York
  [16.3738, 48.2082], // Austria · Vienna
  [17.1077, 48.1486], // Slovakia · Bratislava
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

export interface ImpactGlobeHandle {
  setProgress: (progress: number) => void
}

export const ImpactGlobe = forwardRef<
  ImpactGlobeHandle,
  { scrollDriven?: boolean; className?: string }
>(function ImpactGlobe({ scrollDriven = false, className = "" }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef<(elapsed: number) => void>(() => undefined)
  const elapsedRef = useRef(0)
  const autoRotationRef = useRef(0)
  const rotationOffsetRef = useRef<Coordinate>([0, 0])
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null)
  const interactingRef = useRef(false)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useImperativeHandle(ref, () => ({
    setProgress(progress: number) {
      // The complete network animation spans one deterministic eleven-second turn.
      elapsedRef.current = clamp(progress) * 10.999
      drawRef.current(elapsedRef.current)
    },
  }), [])

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
      // One full eastward turn per loop brings the UAE, Europe, and US connections into view.
      projection.rotate([
        75 - t * (360 / 11) + autoRotationRef.current + rotationOffsetRef.current[0],
        -16 + rotationOffsetRef.current[1],
      ])
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

    drawRef.current = draw

    let lastFrame = performance.now()
    function animate(now: number) {
      const delta = Math.min((now - lastFrame) / 1000, 0.1)
      lastFrame = now

      if (!interactingRef.current) {
        if (scrollDriven) {
          // Scroll controls the network sequence; idle time adds a gentle globe rotation.
          autoRotationRef.current -= delta * 7
        } else {
          elapsedRef.current = (elapsedRef.current + delta) % 11
        }
        draw(elapsedRef.current)
      }
      animationFrame = requestAnimationFrame(animate)
    }

    resize()
    elapsedRef.current = scrollDriven ? elapsedRef.current : 6
    draw(elapsedRef.current)
    start = performance.now()
    animationFrame = requestAnimationFrame(animate)

    const onResize = () => {
      resize()
      if (!scrollDriven) elapsedRef.current = (performance.now() - start) / 1000
      draw(elapsedRef.current)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", onResize)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [scrollDriven])

  function redraw() {
    drawRef.current(elapsedRef.current)
  }

  function pauseAutoRotation() {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = null
    interactingRef.current = true
  }

  function resumeAutoRotation() {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      interactingRef.current = false
      resumeTimerRef.current = null
    }, 650)
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    pauseAutoRotation()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
    setIsDragging(true)
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.x
    const deltaY = event.clientY - drag.y
    rotationOffsetRef.current = [
      rotationOffsetRef.current[0] + deltaX * 0.35,
      Math.max(-70, Math.min(70, rotationOffsetRef.current[1] - deltaY * 0.3)),
    ]
    drag.x = event.clientX
    drag.y = event.clientY
    redraw()
  }

  function handlePointerEnd(event: PointerEvent<HTMLCanvasElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    setIsDragging(false)
    resumeAutoRotation()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLCanvasElement>) {
    const step = event.shiftKey ? 15 : 6
    let [longitude, latitude] = rotationOffsetRef.current
    if (event.key === "ArrowLeft") longitude -= step
    else if (event.key === "ArrowRight") longitude += step
    else if (event.key === "ArrowUp") latitude = Math.min(70, latitude + step)
    else if (event.key === "ArrowDown") latitude = Math.max(-70, latitude - step)
    else if (event.key === "Home") [longitude, latitude] = [0, 0]
    else return

    event.preventDefault()
    pauseAutoRotation()
    rotationOffsetRef.current = [longitude, latitude]
    redraw()
    resumeAutoRotation()
  }

  function resetRotation() {
    pauseAutoRotation()
    rotationOffsetRef.current = [0, 0]
    redraw()
    resumeAutoRotation()
  }

  return (
    <div className={`mt-10 min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-[#050b18] p-2 sm:p-4 ${className}`}>
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
        role="img"
        tabIndex={0}
        aria-label="Interactive globe showing connections from the UAE to Germany, Czechia, Italy, San Francisco, the United States, Austria, and Slovakia. Drag to rotate, use arrow keys to move, or press Home to reset."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onDoubleClick={resetRotation}
        onKeyDown={handleKeyDown}
        className={`block h-auto w-full max-w-full touch-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#63aaff] ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      />
      <p className="px-3 text-center text-xs font-medium text-[#a9cfff]">
        In Collaboration with mMEDCON
      </p>
      <p className="mt-1 px-3 pb-1 text-center text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground/70">
        Drag to explore · Double-click to reset
      </p>
    </div>
  )
})
