export interface MovebankEvent {
  timestamp: string;
  location_lat: number;
  location_long: number;
  individual_id: number;
  tag_id: number;
  individual_local_identifier?: string;
  tag_local_identifier?: string;
  visible?: boolean;
  individual_taxon_canonical_name?: string;
  ground_speed?: number;
  heading?: number;
  height_above_ellipsoid?: number;
  external_temperature?: number;
}

export interface MovebankAnimal {
  id: number;
  local_identifier: string;
  individual_taxon_canonical_name?: string;
  timestamp_start?: string;
  timestamp_end?: string;
  number_of_events?: number;
}

export interface MovebankStudy {
  id: number;
  name: string;
  citation?: string;
  number_of_individuals?: number;
  number_of_deployed_locations?: number;
  taxon_ids?: string;
  sensor_type_ids?: string;
  principal_investigator_name?: string;
  description?: string;
  study_objective?: string;
  contact_person_name?: string;
}

export interface MovebankTag {
  id: number;
  local_identifier: string;
  tag_type?: string;
  manufacturer_name?: string;
}

export interface MovebankDeployment {
  id: number;
  local_identifier: string;
  individual_local_identifier?: string;
  tag_local_identifier?: string;
  deploy_on_timestamp?: string;
  deploy_off_timestamp?: string;
}

export interface TrackingPoint {
  lat: number;
  lng: number;
  timestamp: string;
  speed?: number;
  heading?: number;
  altitude?: number;
  temperature?: number;
}

export interface AnimalTrack {
  animalId: string;
  animalName: string;
  species?: string;
  points: TrackingPoint[];
  color: string;
}
