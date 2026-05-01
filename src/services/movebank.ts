import { MovebankEvent, MovebankAnimal, MovebankStudy, AnimalTrack, MovebankTag, MovebankDeployment } from '../types/movebank';

const MOVEAPI_BASE = 'https://www.movebank.org/movebank/service/direct-read';

export class MovebankService {
  private apiToken?: string;
  private username?: string;
  private password?: string;

  constructor(apiToken?: string, username?: string, password?: string) {
    this.apiToken = apiToken;
    this.username = username;
    this.password = password;
  }

  private async fetchCSV(url: string): Promise<string> {
    const urlObj = new URL(url);
    
    // Add API token if available
    if (this.apiToken) {
      urlObj.searchParams.set('api-token', this.apiToken);
    }

    const response = await fetch(urlObj.toString());
    
    if (!response.ok) {
      throw new Error(`Movebank API error: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  private parseCSV(csvText: string): Record<string, string>[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split('|').map(h => h.trim());
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('|').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    return rows;
  }

  async requestToken(username: string, password: string): Promise<string> {
    const url = `${MOVEAPI_BASE}?service=request-token`;
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${username}:${password}`)
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to request token');
    }

    const token = await response.text();
    this.apiToken = token.trim();
    return this.apiToken;
  }

  async getPublicStudies(limit: number = 50): Promise<MovebankStudy[]> {
    const url = `${MOVEAPI_BASE}?entity_type=study&limit=${limit}`;
    const csv = await this.fetchCSV(url);
    const rows = this.parseCSV(csv);
    
    return rows.map(row => ({
      id: parseInt(row['id'] || '0'),
      name: row['name'] || '',
      citation: row['citation'] || undefined,
      number_of_individuals: row['number_of_individuals'] ? parseInt(row['number_of_individuals']) : undefined,
      number_of_deployed_locations: row['number_of_deployed_locations'] ? parseInt(row['number_of_deployed_locations']) : undefined,
      taxon_ids: row['taxon_ids'] || undefined,
      sensor_type_ids: row['sensor_type_ids'] || undefined,
      principal_investigator_name: row['principal_investigator_name'] || undefined,
      description: row['description'] || undefined,
      study_objective: row['study_objective'] || undefined,
      contact_person_name: row['contact_person_name'] || undefined,
    }));
  }

  async getStudyById(studyId: number): Promise<MovebankStudy | null> {
    const url = `${MOVEAPI_BASE}?entity_type=study&study_id=${studyId}`;
    const csv = await this.fetchCSV(url);
    const rows = this.parseCSV(csv);
    
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return {
      id: parseInt(row['id'] || '0'),
      name: row['name'] || '',
      citation: row['citation'] || undefined,
      number_of_individuals: row['number_of_individuals'] ? parseInt(row['number_of_individuals']) : undefined,
      number_of_deployed_locations: row['number_of_deployed_locations'] ? parseInt(row['number_of_deployed_locations']) : undefined,
      taxon_ids: row['taxon_ids'] || undefined,
      sensor_type_ids: row['sensor_type_ids'] || undefined,
      principal_investigator_name: row['principal_investigator_name'] || undefined,
      description: row['description'] || undefined,
      study_objective: row['study_objective'] || undefined,
      contact_person_name: row['contact_person_name'] || undefined,
    };
  }

  async getAnimalsInStudy(studyId: number): Promise<MovebankAnimal[]> {
    const url = `${MOVEAPI_BASE}?entity_type=individual&study_id=${studyId}`;
    const csv = await this.fetchCSV(url);
    const rows = this.parseCSV(csv);
    
    return rows.map(row => ({
      id: parseInt(row['id'] || '0'),
      local_identifier: row['local_identifier'] || row['individual_local_identifier'] || '',
      individual_taxon_canonical_name: row['individual_taxon_canonical_name'] || undefined,
      timestamp_start: row['timestamp_start'] || undefined,
      timestamp_end: row['timestamp_end'] || undefined,
      number_of_events: row['number_of_events'] ? parseInt(row['number_of_events']) : undefined,
    }));
  }

  async getDeploymentsInStudy(studyId: number): Promise<MovebankDeployment[]> {
    const url = `${MOVEAPI_BASE}?entity_type=deployment&study_id=${studyId}`;
    const csv = await this.fetchCSV(url);
    const rows = this.parseCSV(csv);
    
    return rows.map(row => ({
      id: parseInt(row['id'] || '0'),
      local_identifier: row['local_identifier'] || row['deployment_local_identifier'] || '',
      individual_local_identifier: row['individual_local_identifier'] || undefined,
      tag_local_identifier: row['tag_local_identifier'] || undefined,
      deploy_on_timestamp: row['deploy_on_timestamp'] || undefined,
      deploy_off_timestamp: row['deploy_off_timestamp'] || undefined,
    }));
  }

  async getTagsInStudy(studyId: number): Promise<MovebankTag[]> {
    const url = `${MOVEAPI_BASE}?entity_type=tag&study_id=${studyId}`;
    const csv = await this.fetchCSV(url);
    const rows = this.parseCSV(csv);
    
    return rows.map(row => ({
      id: parseInt(row['id'] || '0'),
      local_identifier: row['local_identifier'] || row['tag_local_identifier'] || '',
      tag_type: row['tag_type'] || undefined,
      manufacturer_name: row['manufacturer_name'] || undefined,
    }));
  }

  async getStudyEvents(studyId: number, limit: number = 2000, attributes?: string): Promise<MovebankEvent[]> {
    let url = `${MOVEAPI_BASE}?entity_type=event&study_id=${studyId}&limit=${limit}`;
    
    if (attributes) {
      url += `&attributes=${attributes}`;
    } else {
      url += `&attributes=individual_local_identifier,timestamp,location_long,location_lat,visible,individual_taxon_canonical_name,ground_speed,heading,height_above_ellipsoid,external_temperature`;
    }

    const csv = await this.fetchCSV(url);
    const rows = this.parseCSV(csv);
    
    return rows
      .filter(row => row['location_lat'] && row['location_long'])
      .map(row => ({
        timestamp: row['timestamp'] || '',
        location_lat: parseFloat(row['location_lat'] || '0'),
        location_long: parseFloat(row['location_long'] || '0'),
        individual_id: parseInt(row['individual_id'] || '0'),
        tag_id: parseInt(row['tag_id'] || '0'),
        individual_local_identifier: row['individual_local_identifier'] || undefined,
        individual_taxon_canonical_name: row['individual_taxon_canonical_name'] || undefined,
        ground_speed: row['ground_speed'] ? parseFloat(row['ground_speed']) : undefined,
        heading: row['heading'] ? parseFloat(row['heading']) : undefined,
        height_above_ellipsoid: row['height_above_ellipsoid'] ? parseFloat(row['height_above_ellipsoid']) : undefined,
        external_temperature: row['external_temperature'] ? parseFloat(row['external_temperature']) : undefined,
        visible: row['visible'] === 'true',
      }))
      .filter(e => e.location_lat !== 0 && e.location_long !== 0);
  }

  transformToAnimalTracks(events: MovebankEvent[]): AnimalTrack[] {
    const animalGroups: Map<string, MovebankEvent[]> = new Map();

    events.forEach(event => {
      const key = event.individual_local_identifier || event.individual_id.toString();
      if (!animalGroups.has(key)) {
        animalGroups.set(key, []);
      }
      animalGroups.get(key)!.push(event);
    });

    const colors = ['#00ff88', '#0088ff', '#ff0088', '#ffaa00', '#88ff00', '#ff00ff', '#00ffff', '#ff6600', '#66ff33', '#ff3399'];
    let colorIndex = 0;

    const tracks: AnimalTrack[] = [];

    animalGroups.forEach((events, animalId) => {
      const sortedEvents = events.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const species = events[0]?.individual_taxon_canonical_name;
      const firstEvent = events[0];

      tracks.push({
        animalId,
        animalName: firstEvent?.individual_local_identifier || animalId,
        species,
        points: sortedEvents.map(e => ({
          lat: e.location_lat,
          lng: e.location_long,
          timestamp: e.timestamp,
          speed: e.ground_speed,
          heading: e.heading,
          altitude: e.height_above_ellipsoid,
          temperature: e.external_temperature,
        })),
        color: colors[colorIndex % colors.length],
      });

      colorIndex++;
    });

    return tracks;
  }

  async getSensorTypes(): Promise<Array<{id: string, name: string}>> {
    const url = `${MOVEAPI_BASE}?entity_type=tag_type`;
    const csv = await this.fetchCSV(url);
    const rows = this.parseCSV(csv);
    
    return rows.map(row => ({
      id: row['id'] || '',
      name: row['name'] || '',
    }));
  }
}

// Initialize with ability to set token
export const movebankService = new MovebankService();
