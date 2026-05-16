"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const EVENT_LABELS: Record<string, string> = {
  BATCH_CREATED: "Registered at Farm",
  PICKUP: "Dispatched from Farm",
  CHECKPOINT_PASSED: "Checkpoint Cleared",
  WAREHOUSE_ENTRY: "Arrived at Warehouse",
  WAREHOUSE_EXIT: "Left Warehouse",
  DELIVERED: "Delivered to Buyer",
  QUALITY_CHECK: "Quality Check",
}

const dotIcon = (color: string, size: number) =>
  L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 1px 5px rgba(0,0,0,0.35)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  })

const pastIcon = dotIcon("#6b7280", 12)
const latestIcon = dotIcon("#f4a935", 16)

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(L.latLngBounds(positions), { padding: [48, 48] })
    } else if (positions.length === 1) {
      map.setView(positions[0], 10)
    }
  }, [map, positions])
  return null
}

type MapEvent = {
  id: string
  eventType: string
  locationName: string
  lat: number | null
  lon: number | null
  timestamp: string
}

function fmt(ts: string) {
  return new Date(ts).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export default function TraceMap({ events }: { events: MapEvent[] }) {
  const valid = events.filter(
    (e): e is MapEvent & { lat: number; lon: number } => e.lat != null && e.lon != null
  )
  const positions: [number, number][] = valid.map((e) => [e.lat, e.lon])

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: "420px", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {valid.map((e, i) => (
        <Marker
          key={e.id}
          position={[e.lat, e.lon]}
          icon={i === valid.length - 1 ? latestIcon : pastIcon}
        >
          <Popup>
            <div style={{ minWidth: 160, fontFamily: "sans-serif" }}>
              <div style={{ fontWeight: 700, color: "#1a4d2e", fontSize: 13 }}>
                {EVENT_LABELS[e.eventType] || e.eventType}
              </div>
              <div style={{ color: "#555", fontSize: 12, marginTop: 3 }}>{e.locationName}</div>
              <div style={{ color: "#888", fontSize: 11, marginTop: 2 }}>{fmt(e.timestamp)}</div>
            </div>
          </Popup>
        </Marker>
      ))}

      {positions.length > 1 && (
        <Polyline
          positions={positions}
          pathOptions={{ color: "#1a4d2e", dashArray: "10 7", weight: 2.5, opacity: 0.75 }}
        />
      )}

      {positions.length > 0 && <FitBounds positions={positions} />}
    </MapContainer>
  )
}
