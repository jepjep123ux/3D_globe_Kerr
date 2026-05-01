module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/services/movebank.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MovebankService",
    ()=>MovebankService,
    "movebankService",
    ()=>movebankService
]);
const MOVEAPI_BASE = 'https://www.movebank.org/movebank/service/direct-read';
class MovebankService {
    apiToken;
    username;
    password;
    constructor(apiToken, username, password){
        this.apiToken = apiToken;
        this.username = username;
        this.password = password;
    }
    async fetchCSV(url) {
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
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];
        const headers = lines[0].split('|').map((h)=>h.trim());
        const rows = [];
        for(let i = 1; i < lines.length; i++){
            const values = lines[i].split('|').map((v)=>v.trim().replace(/^"|"$/g, ''));
            const row = {};
            headers.forEach((header, index)=>{
                row[header] = values[index] || '';
            });
            rows.push(row);
        }
        return rows;
    }
    async requestToken(username, password) {
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
    async getPublicStudies(limit = 50) {
        const url = `${MOVEAPI_BASE}?entity_type=study&limit=${limit}`;
        const csv = await this.fetchCSV(url);
        const rows = this.parseCSV(csv);
        return rows.map((row)=>({
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
                contact_person_name: row['contact_person_name'] || undefined
            }));
    }
    async getStudyById(studyId) {
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
            contact_person_name: row['contact_person_name'] || undefined
        };
    }
    async getAnimalsInStudy(studyId) {
        const url = `${MOVEAPI_BASE}?entity_type=individual&study_id=${studyId}`;
        const csv = await this.fetchCSV(url);
        const rows = this.parseCSV(csv);
        return rows.map((row)=>({
                id: parseInt(row['id'] || '0'),
                local_identifier: row['local_identifier'] || row['individual_local_identifier'] || '',
                individual_taxon_canonical_name: row['individual_taxon_canonical_name'] || undefined,
                timestamp_start: row['timestamp_start'] || undefined,
                timestamp_end: row['timestamp_end'] || undefined,
                number_of_events: row['number_of_events'] ? parseInt(row['number_of_events']) : undefined
            }));
    }
    async getDeploymentsInStudy(studyId) {
        const url = `${MOVEAPI_BASE}?entity_type=deployment&study_id=${studyId}`;
        const csv = await this.fetchCSV(url);
        const rows = this.parseCSV(csv);
        return rows.map((row)=>({
                id: parseInt(row['id'] || '0'),
                local_identifier: row['local_identifier'] || row['deployment_local_identifier'] || '',
                individual_local_identifier: row['individual_local_identifier'] || undefined,
                tag_local_identifier: row['tag_local_identifier'] || undefined,
                deploy_on_timestamp: row['deploy_on_timestamp'] || undefined,
                deploy_off_timestamp: row['deploy_off_timestamp'] || undefined
            }));
    }
    async getTagsInStudy(studyId) {
        const url = `${MOVEAPI_BASE}?entity_type=tag&study_id=${studyId}`;
        const csv = await this.fetchCSV(url);
        const rows = this.parseCSV(csv);
        return rows.map((row)=>({
                id: parseInt(row['id'] || '0'),
                local_identifier: row['local_identifier'] || row['tag_local_identifier'] || '',
                tag_type: row['tag_type'] || undefined,
                manufacturer_name: row['manufacturer_name'] || undefined
            }));
    }
    async getStudyEvents(studyId, limit = 2000, attributes) {
        let url = `${MOVEAPI_BASE}?entity_type=event&study_id=${studyId}&limit=${limit}`;
        if (attributes) {
            url += `&attributes=${attributes}`;
        } else {
            url += `&attributes=individual_local_identifier,timestamp,location_long,location_lat,visible,individual_taxon_canonical_name,ground_speed,heading,height_above_ellipsoid,external_temperature`;
        }
        const csv = await this.fetchCSV(url);
        const rows = this.parseCSV(csv);
        return rows.filter((row)=>row['location_lat'] && row['location_long']).map((row)=>({
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
                visible: row['visible'] === 'true'
            })).filter((e)=>e.location_lat !== 0 && e.location_long !== 0);
    }
    transformToAnimalTracks(events) {
        const animalGroups = new Map();
        events.forEach((event)=>{
            const key = event.individual_local_identifier || event.individual_id.toString();
            if (!animalGroups.has(key)) {
                animalGroups.set(key, []);
            }
            animalGroups.get(key).push(event);
        });
        const colors = [
            '#00ff88',
            '#0088ff',
            '#ff0088',
            '#ffaa00',
            '#88ff00',
            '#ff00ff',
            '#00ffff',
            '#ff6600',
            '#66ff33',
            '#ff3399'
        ];
        let colorIndex = 0;
        const tracks = [];
        animalGroups.forEach((events, animalId)=>{
            const sortedEvents = events.sort((a, b)=>new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            const species = events[0]?.individual_taxon_canonical_name;
            const firstEvent = events[0];
            tracks.push({
                animalId,
                animalName: firstEvent?.individual_local_identifier || animalId,
                species,
                points: sortedEvents.map((e)=>({
                        lat: e.location_lat,
                        lng: e.location_long,
                        timestamp: e.timestamp,
                        speed: e.ground_speed,
                        heading: e.heading,
                        altitude: e.height_above_ellipsoid,
                        temperature: e.external_temperature
                    })),
                color: colors[colorIndex % colors.length]
            });
            colorIndex++;
        });
        return tracks;
    }
    async getSensorTypes() {
        const url = `${MOVEAPI_BASE}?entity_type=tag_type`;
        const csv = await this.fetchCSV(url);
        const rows = this.parseCSV(csv);
        return rows.map((row)=>({
                id: row['id'] || '',
                name: row['name'] || ''
            }));
    }
}
const movebankService = new MovebankService();
}),
"[project]/src/app/api/movebank/studies/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$movebank$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/movebank.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const apiToken = process.env.MOVE_BANK_API_TOKEN;
        const service = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$movebank$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MovebankService"](apiToken);
        const studies = await service.getPublicStudies(limit);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(studies);
    } catch (error) {
        console.error('Failed to fetch studies:', error.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0k20-my._.js.map