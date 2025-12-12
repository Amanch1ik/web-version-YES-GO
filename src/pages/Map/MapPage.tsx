/* global L */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, Typography, Spin, Empty, Button } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { partnerService } from '@/services/partner.service'
import { Partner } from '@/types/partner'
import { resolveAssetUrl } from '@/utils/assets'
import './MapPage.css'

const { Title, Text } = Typography

const DEFAULT_CENTER: [number, number] = [42.8746, 74.5698] // Bishkek

declare const L: any

const MapPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markersLayer = useRef<any>(null)
  const [userPos, setUserPos] = useState<[number, number] | null>(null)

  const { data: partners, isLoading } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: partnerService.getPartners,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const partnerLocations = useMemo(() => {
    if (!partners) return []
    return partners.flatMap((p) => {
      if (p.locations && p.locations.length > 0) {
        return p.locations
          .filter((loc) => typeof loc.latitude === 'number' && typeof loc.longitude === 'number')
          .map((loc) => ({
            partnerId: p.id,
            name: p.name,
            description: p.description,
            logo: resolveAssetUrl(p.logoUrl || (p as any).logo),
            lat: loc.latitude,
            lon: loc.longitude,
          }))
      }
      return []
    })
  }, [partners])

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !(window as any).L) return
    mapRef.current = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current)
    markersLayer.current = L.layerGroup().addTo(mapRef.current)
  }, [])

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setUserPos(coords)
        if (mapRef.current) {
          mapRef.current.setView(coords, 14)
          L.marker(coords, {
            title: 'Вы здесь',
          }).addTo(markersLayer.current).bindPopup('Вы здесь')
        }
      },
      () => {
        // ignore errors, keep default center
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [])

  // Markers
  useEffect(() => {
    if (!markersLayer.current) return
    markersLayer.current.clearLayers()

    if (userPos) {
      L.marker(userPos, { title: 'Вы здесь' }).addTo(markersLayer.current).bindPopup('Вы здесь')
    }

    partnerLocations.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lon], {
        title: loc.name,
      })
      const popupHtml = `
        <div style="display:flex; align-items:center; gap:8px;">
          ${loc.logo ? `<img src="${loc.logo}" alt="${loc.name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" />` : ''}
          <div>
            <div style="font-weight:600;">${loc.name}</div>
            ${loc.description ? `<div style="font-size:12px;color:#666;">${loc.description}</div>` : ''}
          </div>
        </div>
        <div style="margin-top:6px;">
          <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lon}" target="_blank" rel="noreferrer">Маршрут</a>
        </div>
      `
      marker.bindPopup(popupHtml)
      marker.on('click', () => {
        // highlight or later navigate
      })
      marker.addTo(markersLayer.current)
    })
  }, [partnerLocations, userPos])

  return (
    <div className="map-page">
      <div className="map-header">
        <Title level={4} style={{ margin: 0 }}>Карта партнёров</Title>
        <Text type="secondary">OpenStreetMap</Text>
      </div>

      <div className="map-container">
        {!isLoading && partnerLocations.length === 0 ? (
          <Empty description="Партнёры с координатами не найдены" />
        ) : (
          <div ref={mapContainerRef} className="leaflet-container-embed">
            {!mapRef.current && <Spin style={{ marginTop: 16 }} />}
          </div>
        )}
      </div>

      <Card className="map-legend" size="small" variant="borderless">
        <div className="legend-row">
          <div className="legend-dot user" />
          <Text>Вы здесь</Text>
        </div>
        <div className="legend-row">
          <div className="legend-dot partner" />
          <Text>Партнёры</Text>
        </div>
        {userPos ? (
          <Button
            type="link"
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.setView(userPos, 14)
              }
            }}
          >
            Центрировать на мне
          </Button>
        ) : null}
      </Card>
    </div>
  )
}

export default MapPage

