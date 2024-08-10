import { Locations } from '../repositories/Locations';
import Supercluster = require('supercluster');
import * as GeoJSON from 'geojson';

interface PointFeatureProperties {
    merchant_id: string;
  }
  
  type PointFeature = GeoJSON.Feature<GeoJSON.Point, PointFeatureProperties>;
  
  class LocationCluster {
    private locationRepository: Locations;
  
    constructor(locationsRepository: Locations) {
      this.locationRepository = locationsRepository;
    }
  
    async getClusteredPoint(
      west: number,
      south: number,
      east: number,
      north: number,
      zoom: number
    ): Promise<Array<Supercluster.ClusterFeature<PointFeatureProperties> | PointFeature>> {
      const [locations] = await Promise.all([
        this.locationRepository.getPointsInsideBoundingBox(
          String(west),
          String(south),
          String(east),
          String(north)
        ),
      ]);
  
      // Logging the raw data from the database
      console.log('Database locations:', locations.rows);
  
      if (locations.rows.length === 0) {
        console.log('No locations found within the bounding box.');
        return [];
      }
  
      // Converting to GeoJSON features array
      const geojson: PointFeature[] = locations.rows.map(point => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.x, point.y],
        },
        properties: {
          merchant_id: point.merchant_id,
          map_pin_url: point.map_pin_url,
        },
      }));
  
      console.log('GeoJSON:', geojson);
  
      const clustersIndexes = new Supercluster<PointFeatureProperties>({
        log: true,
        radius: 80,
        maxZoom: 17,
      });
  
      clustersIndexes.load(geojson);
  
      const clusters = clustersIndexes.getClusters([west, south, east, north], zoom);
  
      console.log('Clusters:', clusters);
  
      return clusters as Array<Supercluster.ClusterFeature<PointFeatureProperties> | PointFeature>;
    }
  }
  
  export { LocationCluster };