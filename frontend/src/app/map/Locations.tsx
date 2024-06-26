import React, { useCallback, useEffect, useState } from "react";
import L from "leaflet";
import { Marker, useMap } from "react-leaflet";
import useCluster from "@/hooks/use-cluster";
import { useRouter } from "next/navigation";
import { debounce } from "@/lib/utils";


const markerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png`,
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const icons: any = {};
const fetchIcon = (feature: any) => {
  const count = feature.properties.point_count;
  const size = count < 100 ? "small" : count < 1000 ? "medium" : "large";
  return L.divIcon({
    html: `<div><span>${feature.properties.point_count_abbreviated}</span></div>`,
    className: `marker-cluster marker-cluster-${size}`,
    iconSize: L.point(40, 40),
  });
};

export default function Locations() {
  const maxZoom = 22;
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [zoom, setZoom] = useState(13);
  const map = useMap();
  const router = useRouter();

  // get map bounds
  const updateMap = useCallback(() => {
    const b = map.getBounds();
    setBounds(b);
    setZoom(map.getZoom());
  }, [map]);

  const debouncedUpdateMap = useCallback(debounce(updateMap, 500), [updateMap]);

  const onMove = useCallback(() => {
    debouncedUpdateMap();
  }, [debouncedUpdateMap]);

  useEffect(() => {
    updateMap(); // Initial update
  }, [map, updateMap]);

  useEffect(() => {
    map.on("move", onMove);
    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  const { data, loading, error } = useCluster(
    {
      west: bounds?.getWest(),
      south: bounds?.getSouth(),
      east: bounds?.getEast(),
      north: bounds?.getNorth(),
    },
    zoom
  );

  return (
    <>
      {data &&
        data.map((cluster) => {
          // every cluster point has coordinates
          const [longitude, latitude] = cluster.geometry.coordinates;
          // the point may be either a cluster or a merchant point
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

          // we have a cluster to render
          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                position={[latitude, longitude]}
                icon={fetchIcon(cluster)}
              />
            );
          }

          // we have a single point (merchant) to render
          return (
            <Marker
              key={`merchant-${cluster.properties.merchant_id}`}
              position={[latitude, longitude]}
              icon={markerIcon}
              eventHandlers={{
                click: (e) => {
                  if (!!cluster.properties.merchant_id) {
                    router.push(`/merchant/${cluster.properties?.merchant_id}`);
                  }
                },
              }}
            />
          );
        })}
    </>
  );
}
