module.exports = [
"[project]/src/services/movebank.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/components/ui/StudySelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StudySelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
'use client';
;
;
function StudySelector({ studies, selectedStudyIds, onStudySelect, loading }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: -20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.5
        },
        className: "glass-panel p-4 rounded-2xl w-80 text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-bold mb-3 text-blue-400",
                children: "Select Study"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/StudySelector.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-400",
                children: "Loading studies..."
            }, void 0, false, {
                fileName: "[project]/src/components/ui/StudySelector.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-h-60 overflow-y-auto space-y-2",
                children: studies.map((study, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                        initial: {
                            opacity: 0,
                            x: -20
                        },
                        animate: {
                            opacity: 1,
                            x: 0
                        },
                        transition: {
                            delay: index * 0.05
                        },
                        onClick: ()=>onStudySelect(study.id),
                        className: `w-full text-left p-3 rounded-lg transition-all ${selectedStudyIds.includes(study.id) ? 'bg-blue-500/30 border border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-semibold text-sm",
                                children: study.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/StudySelector.tsx",
                                lineNumber: 45,
                                columnNumber: 15
                            }, this),
                            study.number_of_individuals && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-400 mt-1",
                                children: [
                                    study.number_of_individuals,
                                    " animals • ",
                                    study.number_of_deployed_locations || 0,
                                    " locations"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/StudySelector.tsx",
                                lineNumber: 47,
                                columnNumber: 17
                            }, this)
                        ]
                    }, `${study.id}-${index}`, true, {
                        fileName: "[project]/src/components/ui/StudySelector.tsx",
                        lineNumber: 33,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/StudySelector.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/StudySelector.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/analytics.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeMovement",
    ()=>analyzeMovement,
    "calculateDistance",
    ()=>calculateDistance,
    "detectAnomalies",
    ()=>detectAnomalies,
    "generateSmartSummary",
    ()=>generateSmartSummary
]);
const EARTH_RADIUS_KM = 6371;
function calculateDistance(lat1, lng1, lat2, lng2) {
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
}
function toRad(deg) {
    return deg * (Math.PI / 180);
}
function getCompassDirection(lat1, lng1, lat2, lng2) {
    const dLng = lng2 - lng1;
    const dLat = lat2 - lat1;
    let angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    const directions = [
        'N',
        'NNE',
        'NE',
        'ENE',
        'E',
        'ESE',
        'SE',
        'SSE',
        'S',
        'SSW',
        'SW',
        'WSW',
        'W',
        'WNW',
        'NW',
        'NNW'
    ];
    const index = Math.round(angle / 22.5) % 16;
    return directions[index];
}
function analyzeMovement(points) {
    if (points.length < 2) {
        return {
            totalDistance: 0,
            avgSpeed: 0,
            maxSpeed: 0,
            totalDuration: 0,
            stopCount: 0,
            migrationSegments: [],
            behaviorPeriods: []
        };
    }
    let totalDistance = 0;
    let maxSpeed = 0;
    let stopCount = 0;
    const migrationSegments = [];
    const behaviorPeriods = [];
    let currentSegment = null;
    let currentBehavior = null;
    for(let i = 1; i < points.length; i++){
        const prev = points[i - 1];
        const curr = points[i];
        const dist = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
        totalDistance += dist;
        const timeDiff = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000 / 3600; // hours
        const speed = timeDiff > 0 ? dist / timeDiff : 0;
        maxSpeed = Math.max(maxSpeed, speed);
        // Detect stops (speed < 0.5 km/h for > 1 hour)
        if (speed < 0.5 && timeDiff > 1) {
            stopCount++;
        }
        // Migration segment detection (movement > 50km in consistent direction)
        if (dist > 1) {
            if (!currentSegment) {
                currentSegment = {
                    start: prev.timestamp,
                    points: [
                        prev
                    ]
                };
            }
            currentSegment.points.push(curr);
        } else {
            if (currentSegment && currentSegment.points.length > 10) {
                const startPoint = currentSegment.points[0];
                const endPoint = currentSegment.points[currentSegment.points.length - 1];
                const segDist = calculateDistance(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng);
                if (segDist > 50) {
                    migrationSegments.push({
                        start: currentSegment.start,
                        end: curr.timestamp,
                        distance: segDist,
                        direction: getCompassDirection(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng)
                    });
                }
            }
            currentSegment = null;
        }
        // Behavior classification
        const behavior = classifyBehavior(speed, dist, timeDiff);
        if (!currentBehavior || currentBehavior.type !== behavior) {
            if (currentBehavior) {
                const duration = (new Date(curr.timestamp).getTime() - new Date(currentBehavior.start).getTime()) / 1000 / 3600;
                behaviorPeriods.push({
                    type: currentBehavior.type,
                    start: currentBehavior.start,
                    end: curr.timestamp,
                    duration
                });
            }
            currentBehavior = {
                type: behavior,
                start: prev.timestamp,
                points: [
                    prev
                ]
            };
        }
        currentBehavior.points.push(curr);
    }
    // Close last segment/behavior
    if (currentSegment && currentSegment.points.length > 10) {
        const startPoint = currentSegment.points[0];
        const endPoint = currentSegment.points[currentSegment.points.length - 1];
        const segDist = calculateDistance(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng);
        if (segDist > 50) {
            migrationSegments.push({
                start: currentSegment.start,
                end: points[points.length - 1].timestamp,
                distance: segDist,
                direction: getCompassDirection(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng)
            });
        }
    }
    if (currentBehavior) {
        const duration = (new Date(points[points.length - 1].timestamp).getTime() - new Date(currentBehavior.start).getTime()) / 1000 / 3600;
        behaviorPeriods.push({
            type: currentBehavior.type,
            start: currentBehavior.start,
            end: points[points.length - 1].timestamp,
            duration
        });
    }
    const totalDuration = (new Date(points[points.length - 1].timestamp).getTime() - new Date(points[0].timestamp).getTime()) / 1000 / 3600;
    const avgSpeed = totalDuration > 0 ? totalDistance / totalDuration : 0;
    return {
        totalDistance: Math.round(totalDistance * 100) / 100,
        avgSpeed: Math.round(avgSpeed * 100) / 100,
        maxSpeed: Math.round(maxSpeed * 100) / 100,
        totalDuration: Math.round(totalDuration * 100) / 100,
        stopCount,
        migrationSegments,
        behaviorPeriods
    };
}
function classifyBehavior(speed, distance, timeDiff) {
    if (speed < 0.5) return 'resting';
    if (speed > 30) return 'migrating';
    if (speed < 5 && distance < 10) return 'foraging';
    if (speed > 10) return 'migrating';
    return 'nomadic';
}
function detectAnomalies(points) {
    const anomalies = [];
    if (points.length < 2) return anomalies;
    // Detect sudden stops (possible mortality)
    for(let i = 1; i < points.length; i++){
        const prev = points[i - 1];
        const curr = points[i];
        const timeDiff = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000 / 3600;
        const dist = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
        const speed = timeDiff > 0 ? dist / timeDiff : 0;
        // Animal stopped moving for > 48 hours
        if (speed < 0.1 && timeDiff > 48) {
            anomalies.push({
                type: 'mortality_risk',
                timestamp: curr.timestamp,
                description: `Animal stopped moving for ${Math.round(timeDiff)} hours at this location`,
                severity: 'high',
                location: {
                    lat: curr.lat,
                    lng: curr.lng
                }
            });
        }
        // Erratic movement (speed > 100 km/h - likely GPS error)
        if (speed > 100) {
            anomalies.push({
                type: 'erratic_movement',
                timestamp: curr.timestamp,
                description: `Unusually high speed detected: ${Math.round(speed)} km/h`,
                severity: 'medium',
                location: {
                    lat: curr.lat,
                    lng: curr.lng
                }
            });
        }
        // Large distance jump in short time (> 500km in < 2 hours)
        if (dist > 500 && timeDiff < 2) {
            anomalies.push({
                type: 'erratic_movement',
                timestamp: curr.timestamp,
                description: `Large distance jump: ${Math.round(dist)}km in ${Math.round(timeDiff * 60)} minutes`,
                severity: 'medium',
                location: {
                    lat: curr.lat,
                    lng: curr.lng
                }
            });
        }
    }
    return anomalies;
}
function generateSmartSummary(stats, species) {
    const parts = [];
    if (stats.totalDistance > 0) {
        parts.push(`This ${species || 'animal'} traveled ${stats.totalDistance} km over ${stats.totalDuration} hours`);
    }
    if (stats.avgSpeed > 0) {
        parts.push(`with an average speed of ${stats.avgSpeed} km/h`);
    }
    if (stats.migrationSegments.length > 0) {
        const totalMig = stats.migrationSegments.reduce((sum, s)=>sum + s.distance, 0);
        parts.push(`and completed ${stats.migrationSegments.length} migration segment(s) covering ${Math.round(totalMig)} km`);
    }
    if (stats.stopCount > 0) {
        parts.push(`Made ${stats.stopCount} significant stops during the journey`);
    }
    const behaviorCounts = stats.behaviorPeriods.reduce((acc, p)=>{
        acc[p.type] = (acc[p.type] || 0) + p.duration;
        return acc;
    }, {});
    const mainBehavior = Object.entries(behaviorCounts).sort((a, b)=>b[1] - a[1])[0];
    if (mainBehavior) {
        parts.push(`Primary behavior: ${mainBehavior[0]} (${Math.round(mainBehavior[1])} hours)`);
    }
    return parts.join(', ') + '.';
}
}),
"[project]/src/lib/prediction.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractMovementPattern",
    ()=>extractMovementPattern,
    "generateSmartPredictionSummary",
    ()=>generateSmartPredictionSummary,
    "predictNextLocations",
    ()=>predictNextLocations
]);
function extractMovementPattern(points) {
    if (points.length < 3) {
        return {
            direction: 0,
            avgSpeed: 0,
            dayTimePrefrence: 'mixed',
            seasonalTrend: 'stable'
        };
    }
    // Calculate average direction
    let totalAngle = 0;
    let speedSum = 0;
    let dayCount = 0;
    let nightCount = 0;
    for(let i = 1; i < points.length; i++){
        const prev = points[i - 1];
        const curr = points[i];
        const date = new Date(curr.timestamp);
        const hour = date.getHours();
        if (hour >= 6 && hour < 18) dayCount++;
        else nightCount++;
        // Direction calculation (simplified)
        const dLng = curr.lng - prev.lng;
        const dLat = curr.lat - prev.lat;
        const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
        totalAngle += angle;
        // Speed
        const timeDiff = (date.getTime() - new Date(prev.timestamp).getTime()) / 1000 / 3600;
        if (timeDiff > 0) {
            const dist = calculateDistanceSimple(prev.lat, prev.lng, curr.lat, curr.lng);
            speedSum += dist / timeDiff;
        }
    }
    const avgDirection = totalAngle / (points.length - 1);
    const avgSpeed = speedSum / (points.length - 1);
    const dayTimePrefrence = dayCount > nightCount * 1.5 ? 'day' : nightCount > dayCount * 1.5 ? 'night' : 'mixed';
    // Seasonal trend (check if moving generally north/south/east/west)
    const latDiff = points[points.length - 1].lat - points[0].lat;
    const lngDiff = points[points.length - 1].lng - points[0].lng;
    let seasonalTrend = 'stable';
    if (Math.abs(latDiff) > Math.abs(lngDiff)) {
        seasonalTrend = latDiff > 0 ? 'north' : 'south';
    } else {
        seasonalTrend = lngDiff > 0 ? 'east' : 'west';
    }
    return {
        direction: avgDirection,
        avgSpeed,
        dayTimePrefrence,
        seasonalTrend
    };
}
function calculateDistanceSimple(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function predictNextLocations(points, steps = 10, hoursAhead = 24) {
    if (points.length < 2) {
        return {
            predictedPath: [],
            confidence: 0,
            summary: 'Insufficient data for prediction'
        };
    }
    const pattern = extractMovementPattern(points);
    const lastPoint = points[points.length - 1];
    const lastDate = new Date(lastPoint.timestamp);
    const predictions = [];
    // Simple linear extrapolation based on recent movement
    const recentPoints = points.slice(-10); // Last 10 points
    let avgSpeed = pattern.avgSpeed;
    let avgDirection = pattern.direction;
    if (recentPoints.length >= 2) {
        // Calculate recent trend
        const speeds = [];
        let angleSum = 0;
        for(let i = 1; i < recentPoints.length; i++){
            const prev = recentPoints[i - 1];
            const curr = recentPoints[i];
            const timeDiff = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000 / 3600;
            if (timeDiff > 0) {
                const dist = calculateDistanceSimple(prev.lat, prev.lng, curr.lat, curr.lng);
                speeds.push(dist / timeDiff);
            }
            const dLng = curr.lng - prev.lng;
            const dLat = curr.lat - prev.lat;
            angleSum += Math.atan2(dLng, dLat) * (180 / Math.PI);
        }
        if (speeds.length > 0) {
            avgSpeed = speeds.reduce((a, b)=>a + b, 0) / speeds.length;
        }
        avgDirection = angleSum / (recentPoints.length - 1);
    }
    // Generate predictions
    const timeStep = hoursAhead * 3600000 / steps; // milliseconds per step
    let currentLat = lastPoint.lat;
    let currentLng = lastPoint.lng;
    for(let i = 1; i <= steps; i++){
        const distance = avgSpeed * (timeStep / 3600000); // km to travel in this step
        const directionRad = avgDirection * (Math.PI / 180);
        // Convert distance and direction to lat/lng change
        const latChange = distance / 111.32 * Math.cos(directionRad); // ~111.32 km per degree lat
        const lngChange = distance / (111.32 * Math.cos(currentLat * (Math.PI / 180))) * Math.sin(directionRad);
        currentLat += latChange;
        currentLng += lngChange;
        const predTime = new Date(lastDate.getTime() + timeStep * i);
        const probability = Math.max(0.3, 1 - i / steps * 0.7); // Decreasing confidence over time
        predictions.push({
            lat: currentLat,
            lng: currentLng,
            timestamp: predTime.toISOString(),
            probability
        });
    }
    const confidence = Math.min(0.9, points.length / 100); // More data = higher confidence
    const nextLocation = predictions[0];
    const summary = `Based on ${points.length} tracking points, this ${pattern.seasonalTrend}ward trending animal ` + `is predicted to travel at ~${avgSpeed.toFixed(1)} km/h ` + `towards ${degreesToCompass(avgDirection)}. ` + `Next location estimated: ${nextLocation?.lat.toFixed(4)}, ${nextLocation?.lng.toFixed(4)} ` + `(${confidence * 100}% confidence).`;
    return {
        predictedPath: predictions,
        confidence,
        summary,
        nextLocation
    };
}
function degreesToCompass(deg) {
    const directions = [
        'N',
        'NNE',
        'NE',
        'ENE',
        'E',
        'ESE',
        'SE',
        'SSE',
        'S',
        'SSW',
        'SW',
        'WSW',
        'W',
        'WNW',
        'NW',
        'NNW'
    ];
    const index = Math.round((deg % 360 + 360) % 360 / 22.5) % 16;
    return directions[index];
}
function generateSmartPredictionSummary(result) {
    if (!result.nextLocation) return result.summary;
    const parts = [];
    parts.push(`Predicted movement: ${result.confidence * 100}% confidence`);
    if (result.predictedPath.length > 1) {
        const totalDist = calculateDistanceSimple(result.predictedPath[0].lat, result.predictedPath[0].lng, result.predictedPath[result.predictedPath.length - 1].lat, result.predictedPath[result.predictedPath.length - 1].lng);
        parts.push(`Estimated distance in next 24h: ${totalDist.toFixed(1)} km`);
    }
    return parts.join('. ') + '.';
}
}),
"[project]/src/components/ui/AnimalProfile.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnimalProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prediction$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prediction.ts [app-ssr] (ecmascript)");
;
;
;
;
function AnimalProfile({ track, onClose, playbackProgress }) {
    if (!track) return null;
    const visiblePoints = track.points.slice(0, Math.floor(track.points.length * playbackProgress));
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analyzeMovement"])(visiblePoints);
    const anomalies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["detectAnomalies"])(visiblePoints);
    const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSmartSummary"])(stats, track.species);
    const prediction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prediction$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["predictNextLocations"])(visiblePoints, 10, 24);
    const predictionSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prediction$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSmartPredictionSummary"])(prediction);
    const behaviorCounts = stats.behaviorPeriods.reduce((acc, p)=>{
        acc[p.type] = (acc[p.type] || 0) + p.duration;
        return acc;
    }, {});
    const totalBehaviorTime = Object.values(behaviorCounts).reduce((a, b)=>a + b, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            x: 50
        },
        animate: {
            opacity: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            x: 50
        },
        className: "glass-panel p-4 rounded-2xl w-80 text-white max-h-[80vh] overflow-y-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-bold text-blue-400",
                        children: track.animalName
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "text-gray-400 hover:text-white transition-colors",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            track.species && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-gray-300 mb-2",
                children: [
                    "Species: ",
                    track.species
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-gray-400 mb-4 italic",
                children: summary
            }, void 0, false, {
                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-semibold text-blue-300 mb-2",
                                children: "Movement Statistics"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2 text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/5 p-2 rounded",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-400",
                                                children: "Total Distance"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 54,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg font-bold text-blue-400",
                                                children: [
                                                    stats.totalDistance,
                                                    " km"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 55,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 53,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/5 p-2 rounded",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-400",
                                                children: "Avg Speed"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 58,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg font-bold text-green-400",
                                                children: [
                                                    stats.avgSpeed,
                                                    " km/h"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 59,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 57,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/5 p-2 rounded",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-400",
                                                children: "Max Speed"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 62,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg font-bold text-yellow-400",
                                                children: [
                                                    stats.maxSpeed,
                                                    " km/h"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 63,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 61,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/5 p-2 rounded",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-400",
                                                children: "Duration"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 66,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg font-bold text-purple-400",
                                                children: [
                                                    stats.totalDuration,
                                                    "h"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 67,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 65,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    stats.migrationSegments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-semibold text-blue-300 mb-2",
                                children: "Migration Segments"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1 max-h-32 overflow-y-auto",
                                children: stats.migrationSegments.map((seg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/5 p-2 rounded text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-blue-400",
                                                        children: seg.direction
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                        lineNumber: 79,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-400",
                                                        children: [
                                                            seg.distance,
                                                            " km"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                        lineNumber: 80,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 78,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-500 text-xs mt-1",
                                                children: [
                                                    new Date(seg.start).toLocaleDateString(),
                                                    " → ",
                                                    new Date(seg.end).toLocaleDateString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 82,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 77,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this),
                    stats.behaviorPeriods.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-semibold text-blue-300 mb-2",
                                children: "Behavior Distribution"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: Object.entries(behaviorCounts).map(([type, duration])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-3 h-3 rounded-full ${type === 'resting' ? 'bg-blue-500' : type === 'foraging' ? 'bg-green-500' : type === 'migrating' ? 'bg-yellow-500' : 'bg-purple-500'}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 97,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs capitalize flex-1",
                                                children: type
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 102,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-400",
                                                children: [
                                                    Math.round(duration),
                                                    "h (",
                                                    Math.round(duration / totalBehaviorTime * 100),
                                                    "%)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 103,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, type, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 96,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 94,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this),
                    anomalies.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-semibold text-red-400 mb-2",
                                children: "⚠️ Anomalies Detected"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1 max-h-32 overflow-y-auto",
                                children: anomalies.slice(0, 5).map((anomaly, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-2 rounded text-xs ${anomaly.severity === 'high' ? 'bg-red-900/50 border border-red-500' : anomaly.severity === 'medium' ? 'bg-yellow-900/50 border border-yellow-500' : 'bg-blue-900/50 border border-blue-500'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-semibold",
                                                children: anomaly.type.replace('_', ' ').toUpperCase()
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 122,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-300 mt-1",
                                                children: anomaly.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 123,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-500 text-xs mt-1",
                                                children: new Date(anomaly.timestamp).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 124,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 117,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this),
                    prediction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-semibold text-cyan-400 mb-2",
                                children: "🔮 Prediction"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-cyan-900/30 border border-cyan-500/50 p-2 rounded text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-gray-300",
                                        children: predictionSummary
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this),
                                    prediction.nextLocation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 text-cyan-300",
                                        children: [
                                            "Next: ",
                                            prediction.nextLocation.lat.toFixed(4),
                                            ", ",
                                            prediction.nextLocation.lng.toFixed(4),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-500 text-xs",
                                                children: new Date(prediction.nextLocation.timestamp).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                                lineNumber: 141,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 139,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-gray-500",
                                        children: [
                                            "Confidence: ",
                                            Math.round(prediction.confidence * 100),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-semibold text-blue-300 mb-2",
                                children: "Location Info"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this),
                            visiblePoints.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Current: ",
                                            visiblePoints[visiblePoints.length - 1]?.lat.toFixed(4),
                                            ", ",
                                            visiblePoints[visiblePoints.length - 1]?.lng.toFixed(4)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1",
                                        children: [
                                            "Points tracked: ",
                                            visiblePoints.length
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, this),
                                    visiblePoints[visiblePoints.length - 1]?.timestamp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1",
                                        children: [
                                            "Last update: ",
                                            new Date(visiblePoints[visiblePoints.length - 1].timestamp).toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                        lineNumber: 160,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/AnimalProfile.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/AnimalProfile.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/alerts.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_RULES",
    ()=>DEFAULT_RULES,
    "checkAlerts",
    ()=>checkAlerts,
    "clearAlerts",
    ()=>clearAlerts,
    "getUnreadCount",
    ()=>getUnreadCount,
    "loadAlertRules",
    ()=>loadAlertRules,
    "loadAlerts",
    ()=>loadAlerts,
    "markAlertRead",
    ()=>markAlertRead,
    "saveAlertRules",
    ()=>saveAlertRules,
    "saveAlerts",
    ()=>saveAlerts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics.ts [app-ssr] (ecmascript)");
;
const DEFAULT_RULES = [
    {
        id: 'stop-alert',
        type: 'stop',
        enabled: true,
        severity: 'medium',
        message: 'Animal has stopped moving for > 48 hours',
        threshold: 48
    },
    {
        id: 'mortality-alert',
        type: 'mortality_risk',
        enabled: true,
        severity: 'high',
        message: 'Possible mortality detected - no movement for > 72 hours',
        threshold: 72
    },
    {
        id: 'speed-alert',
        type: 'speed_limit',
        enabled: true,
        severity: 'low',
        message: 'Animal moving at unusually high speed',
        threshold: 100
    },
    {
        id: 'battery-alert',
        type: 'battery_low',
        enabled: false,
        severity: 'low',
        message: 'Device battery low (simulated)'
    }
];
// Storage keys
const RULES_KEY = 'movebank-alert-rules';
const ALERTS_KEY = 'movebank-active-alerts';
function loadAlertRules() {
    if ("TURBOPACK compile-time truthy", 1) return DEFAULT_RULES;
    //TURBOPACK unreachable
    ;
    const stored = undefined;
}
function saveAlertRules(rules) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function loadAlerts() {
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
    const stored = undefined;
}
function saveAlerts(alerts) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function checkAlerts(track, rules) {
    const alerts = [];
    const anomalies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["detectAnomalies"])(track.points);
    rules.forEach((rule)=>{
        if (!rule.enabled) return;
        if (rule.type === 'stop' || rule.type === 'mortality_risk') {
            // Check for long stops
            const thresholdHours = rule.threshold || (rule.type === 'stop' ? 48 : 72);
            anomalies.forEach((anomaly)=>{
                if (anomaly.type === 'stop' && anomaly.severity === 'high') {
                    const hours = parseInt(anomaly.description.match(/\d+/)?.[0] || '0');
                    if (hours >= thresholdHours) {
                        alerts.push({
                            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                            ruleId: rule.id,
                            animalId: track.animalId,
                            animalName: track.animalName,
                            timestamp: anomaly.timestamp,
                            type: rule.type,
                            severity: rule.severity,
                            message: `${rule.message} (${hours} hours)`,
                            location: anomaly.location,
                            isRead: false
                        });
                    }
                }
            });
        }
        if (rule.type === 'speed_limit') {
            anomalies.forEach((anomaly)=>{
                if (anomaly.type === 'erratic_movement' && anomaly.description.includes('speed')) {
                    alerts.push({
                        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        ruleId: rule.id,
                        animalId: track.animalId,
                        animalName: track.animalName,
                        timestamp: anomaly.timestamp,
                        type: rule.type,
                        severity: rule.severity,
                        message: anomaly.description,
                        location: anomaly.location,
                        isRead: false
                    });
                }
            });
        }
    });
    return alerts;
}
function markAlertRead(alertId) {
    const alerts = loadAlerts();
    const updated = alerts.map((a)=>a.id === alertId ? {
            ...a,
            isRead: true
        } : a);
    saveAlerts(updated);
}
function clearAlerts() {
    saveAlerts([]);
}
function getUnreadCount() {
    const alerts = loadAlerts();
    return alerts.filter((a)=>!a.isRead).length;
}
}),
"[project]/src/components/ui/AlertsPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AlertsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$alerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/alerts.ts [app-ssr] (ecmascript)");
;
;
;
;
function AlertsPanel({ tracks, onClose }) {
    const [rules, setRules] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$alerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadAlertRules"])());
    const [alerts, setAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$alerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadAlerts"])());
    const [showRules, setShowRules] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check for new alerts when tracks change
        const newAlerts = [];
        tracks.forEach((track)=>{
            const trackAlerts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$alerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkAlerts"])(track, rules);
            newAlerts.push(...trackAlerts);
        });
        if (newAlerts.length > 0) {
            const allAlerts = [
                ...newAlerts,
                ...alerts
            ];
            setAlerts(allAlerts);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$alerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveAlerts"])(allAlerts);
        }
    }, [
        tracks,
        rules
    ]); // eslint-disable-line react-hooks/exhaustive-deps
    const handleRuleToggle = (ruleId)=>{
        const updated = rules.map((r)=>r.id === ruleId ? {
                ...r,
                enabled: !r.enabled
            } : r);
        setRules(updated);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$alerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveAlertRules"])(updated);
    };
    const handleMarkRead = (alertId)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$alerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markAlertRead"])(alertId);
        setAlerts((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$alerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadAlerts"])());
    };
    const handleClearAll = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$alerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAlerts"])();
        setAlerts([]);
    };
    const unreadCount = alerts.filter((a)=>!a.isRead).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            x: 50
        },
        animate: {
            opacity: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            x: 50
        },
        className: "glass-panel p-4 rounded-2xl w-80 text-white max-h-[80vh] overflow-y-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-bold text-red-400",
                        children: [
                            "🚨 Alerts ",
                            unreadCount > 0 && `(${unreadCount})`
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "text-gray-400 hover:text-white transition-colors",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setShowRules(!showRules),
                    className: "text-xs px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors",
                    children: [
                        showRules ? 'Hide' : 'Show',
                        " Rules"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            showRules && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-sm font-semibold text-blue-300",
                        children: "Alert Rules"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    rules.map((rule)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between text-xs bg-white/5 p-2 rounded",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `${rule.enabled ? 'text-white' : 'text-gray-500'}`,
                                    children: rule.type.replace('_', ' ').toUpperCase()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                                    lineNumber: 86,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleRuleToggle(rule.id),
                                    className: `px-2 py-1 rounded text-xs transition-colors ${rule.enabled ? 'bg-green-500/30 text-green-400' : 'bg-gray-500/30 text-gray-400'}`,
                                    children: rule.enabled ? 'ON' : 'OFF'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                                    lineNumber: 89,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, rule.id, true, {
                            fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-sm font-semibold text-blue-300",
                                children: [
                                    "Active Alerts (",
                                    alerts.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            alerts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleClearAll,
                                className: "text-xs px-2 py-1 rounded bg-red-500/30 hover:bg-red-500/50 text-red-400 transition-colors",
                                children: "Clear All"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    alerts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-500 text-center py-4",
                        children: "No alerts triggered yet."
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this) : alerts.slice(0, 10).map((alert)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: -10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            className: `p-2 rounded text-xs ${alert.severity === 'high' ? 'bg-red-900/50 border border-red-500' : alert.severity === 'medium' ? 'bg-yellow-900/50 border border-yellow-500' : 'bg-blue-900/50 border border-blue-500'} ${alert.isRead ? 'opacity-50' : ''}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-start mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            children: alert.type.replace('_', ' ').toUpperCase()
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                                            lineNumber: 137,
                                            columnNumber: 17
                                        }, this),
                                        !alert.isRead && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleMarkRead(alert.id),
                                            className: "text-xs text-gray-400 hover:text-white",
                                            children: "Mark Read"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                                            lineNumber: 139,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                                    lineNumber: 136,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-300",
                                    children: alert.message
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                                    lineNumber: 147,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-500 text-xs mt-1",
                                    children: [
                                        alert.animalName,
                                        " • ",
                                        new Date(alert.timestamp).toLocaleString()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                                    lineNumber: 148,
                                    columnNumber: 15
                                }, this),
                                alert.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-500 text-xs",
                                    children: [
                                        "Location: ",
                                        alert.location.lat.toFixed(4),
                                        ", ",
                                        alert.location.lng.toFixed(4)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                                    lineNumber: 152,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, alert.id, true, {
                            fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                            lineNumber: 126,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/AlertsPanel.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/AlertsPanel.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/ComparisonPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ComparisonPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics.ts [app-ssr] (ecmascript)");
;
;
function ComparisonPanel({ tracks }) {
    if (tracks.length < 2) return null;
    const statsArray = tracks.map((track)=>({
            track,
            stats: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analyzeMovement"])(track.points)
        }));
    const maxDistance = Math.max(...statsArray.map((s)=>s.stats.totalDistance));
    const maxSpeed = Math.max(...statsArray.map((s)=>s.stats.maxSpeed));
    const maxDuration = Math.max(...statsArray.map((s)=>s.stats.totalDuration));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "text-sm font-bold text-blue-400",
                children: [
                    "Comparative Analysis (",
                    tracks.length,
                    " animals)"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-400 mb-2",
                        children: "Total Distance (km)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: statsArray.sort((a, b)=>b.stats.totalDistance - a.stats.totalDistance).map(({ track, stats })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate flex-1 mr-2",
                                                children: track.animalName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                lineNumber: 33,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-blue-400 font-bold",
                                                children: [
                                                    stats.totalDistance,
                                                    " km"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                lineNumber: 34,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                        lineNumber: 32,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full bg-white/10 rounded-full h-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full rounded-full transition-all",
                                            style: {
                                                backgroundColor: track.color,
                                                width: `${maxDistance > 0 ? stats.totalDistance / maxDistance * 100 : 0}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                            lineNumber: 37,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                        lineNumber: 36,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, track.animalId, true, {
                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                lineNumber: 31,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-400 mb-2",
                        children: "Max Speed (km/h)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: statsArray.sort((a, b)=>b.stats.maxSpeed - a.stats.maxSpeed).map(({ track, stats })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate flex-1 mr-2",
                                                children: track.animalName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                lineNumber: 59,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-yellow-400 font-bold",
                                                children: [
                                                    stats.maxSpeed,
                                                    " km/h"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                lineNumber: 60,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                        lineNumber: 58,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full bg-white/10 rounded-full h-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full rounded-full transition-all",
                                            style: {
                                                backgroundColor: track.color,
                                                width: `${maxSpeed > 0 ? stats.maxSpeed / maxSpeed * 100 : 0}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                            lineNumber: 63,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                        lineNumber: 62,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, track.animalId, true, {
                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                lineNumber: 57,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-400 mb-2",
                        children: "Tracking Duration (hours)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: statsArray.sort((a, b)=>b.stats.totalDuration - a.stats.totalDuration).map(({ track, stats })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate flex-1 mr-2",
                                                children: track.animalName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                lineNumber: 85,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-purple-400 font-bold",
                                                children: [
                                                    stats.totalDuration,
                                                    "h"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                lineNumber: 86,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                        lineNumber: 84,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full bg-white/10 rounded-full h-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full rounded-full transition-all",
                                            style: {
                                                backgroundColor: track.color,
                                                width: `${maxDuration > 0 ? stats.totalDuration / maxDuration * 100 : 0}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                            lineNumber: 89,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                        lineNumber: 88,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, track.animalId, true, {
                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                lineNumber: 83,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-400 mb-2",
                        children: "Behavior Distribution"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "text-gray-400",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "text-left font-normal",
                                                children: "Animal"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                lineNumber: 109,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "text-right font-normal",
                                                children: "Resting"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                lineNumber: 110,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "text-right font-normal",
                                                children: "Foraging"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                lineNumber: 111,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "text-right font-normal",
                                                children: "Migrating"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                lineNumber: 112,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                        lineNumber: 108,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: statsArray.map(({ track, stats })=>{
                                        const behaviorCounts = stats.behaviorPeriods.reduce((acc, p)=>{
                                            acc[p.type] = (acc[p.type] || 0) + p.duration;
                                            return acc;
                                        }, {});
                                        const total = Object.values(behaviorCounts).reduce((a, b)=>a + b, 0);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-t border-white/5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-1 truncate max-w-[100px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-block w-2 h-2 rounded-full mr-1",
                                                            style: {
                                                                backgroundColor: track.color
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                            lineNumber: 126,
                                                            columnNumber: 23
                                                        }, this),
                                                        track.animalName
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "text-right text-blue-400",
                                                    children: [
                                                        behaviorCounts['resting'] ? Math.round(behaviorCounts['resting'] / total * 100) : 0,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                    lineNumber: 129,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "text-right text-green-400",
                                                    children: [
                                                        behaviorCounts['foraging'] ? Math.round(behaviorCounts['foraging'] / total * 100) : 0,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "text-right text-yellow-400",
                                                    children: [
                                                        behaviorCounts['migrating'] ? Math.round(behaviorCounts['migrating'] / total * 100) : 0,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, track.animalId, true, {
                                            fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                            lineNumber: 124,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/5 p-2 rounded text-xs text-gray-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-bold text-white mb-1",
                        children: "Summary"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Fastest: ",
                            statsArray.sort((a, b)=>b.stats.maxSpeed - a.stats.maxSpeed)[0]?.track.animalName,
                            " (",
                            maxSpeed,
                            " km/h)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Longest distance: ",
                            statsArray.sort((a, b)=>b.stats.totalDistance - a.stats.totalDistance)[0]?.track.animalName,
                            " (",
                            maxDistance,
                            " km)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Most active: ",
                            statsArray.sort((a, b)=>b.stats.totalDuration - a.stats.totalDuration)[0]?.track.animalName,
                            " (",
                            maxDuration,
                            "h)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/ComparisonPanel.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/Charts.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Charts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics.ts [app-ssr] (ecmascript)");
;
;
function Charts({ track, playbackProgress }) {
    if (!track || track.points.length === 0) return null;
    const visiblePoints = track.points.slice(0, Math.floor(track.points.length * playbackProgress));
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analyzeMovement"])(visiblePoints);
    // Prepare data for charts
    const timeLabels = visiblePoints.map((p, i)=>{
        const d = new Date(p.timestamp);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const distances = visiblePoints.map((p, i)=>{
        if (i === 0) return 0;
        // Cumulative distance approximation
        return 0; // Placeholder - would need full calc
    });
    const speeds = visiblePoints.map((p)=>p.speed || 0);
    // Activity pie data
    const behaviorCounts = stats.behaviorPeriods.reduce((acc, p)=>{
        acc[p.type] = (acc[p.type] || 0) + p.duration;
        return acc;
    }, {});
    const pieData = Object.entries(behaviorCounts).map(([type, duration])=>({
            type,
            duration,
            color: type === 'resting' ? '#3b82f6' : type === 'foraging' ? '#22c55e' : type === 'migrating' ? '#eab308' : '#a855f7'
        }));
    const totalDuration = pieData.reduce((sum, d)=>sum + d.duration, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-sm font-semibold text-blue-300 mb-2",
                        children: "Speed Over Time"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Charts.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 rounded p-2 h-32",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 300 100",
                            className: "w-full h-full",
                            children: [
                                speeds.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                    points: speeds.map((s, i)=>{
                                        const x = i / (speeds.length - 1) * 280 + 10;
                                        const y = 90 - s / Math.max(...speeds) * 80;
                                        return `${x},${y}`;
                                    }).join(' '),
                                    fill: "none",
                                    stroke: "#22c55e",
                                    strokeWidth: "2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/Charts.tsx",
                                    lineNumber: 52,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "10",
                                    y1: "90",
                                    x2: "290",
                                    y2: "90",
                                    stroke: "#666",
                                    strokeWidth: "1"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/Charts.tsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "10",
                                    y1: "10",
                                    x2: "10",
                                    y2: "90",
                                    stroke: "#666",
                                    strokeWidth: "1"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/Charts.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                    x: "150",
                                    y: "105",
                                    fill: "#999",
                                    fontSize: "8",
                                    textAnchor: "middle",
                                    children: "Time →"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/Charts.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                    x: "5",
                                    y: "50",
                                    fill: "#999",
                                    fontSize: "8",
                                    textAnchor: "middle",
                                    transform: "rotate(-90 5,50)",
                                    children: "km/h"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/Charts.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/Charts.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Charts.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/Charts.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-sm font-semibold text-blue-300 mb-2",
                        children: "Activity Distribution"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Charts.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 rounded p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 100 100",
                                className: "w-24 h-24 mx-auto",
                                children: [
                                    pieData.map((d, i)=>{
                                        const startAngle = pieData.slice(0, i).reduce((sum, item)=>sum + item.duration / totalDuration * 360, 0);
                                        const endAngle = startAngle + d.duration / totalDuration * 360;
                                        const startRad = (startAngle - 90) * (Math.PI / 180);
                                        const endRad = (endAngle - 90) * (Math.PI / 180);
                                        const x1 = 50 + 40 * Math.cos(startRad);
                                        const y1 = 50 + 40 * Math.sin(startRad);
                                        const x2 = 50 + 40 * Math.cos(endRad);
                                        const y2 = 50 + 40 * Math.sin(endRad);
                                        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                                        const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: pathData,
                                            fill: d.color,
                                            opacity: 0.8
                                        }, i, false, {
                                            fileName: "[project]/src/components/ui/Charts.tsx",
                                            lineNumber: 88,
                                            columnNumber: 22
                                        }, this);
                                    }),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "50",
                                        cy: "50",
                                        r: "20",
                                        fill: "#0a0a1a"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "50",
                                        y: "50",
                                        fill: "white",
                                        fontSize: "8",
                                        textAnchor: "middle",
                                        dy: "3",
                                        children: [
                                            Math.round(totalDuration),
                                            "h"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/Charts.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1 mt-2",
                                children: pieData.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-3 h-3 rounded-full",
                                                style: {
                                                    backgroundColor: d.color
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/Charts.tsx",
                                                lineNumber: 98,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "capitalize flex-1",
                                                children: d.type
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/Charts.tsx",
                                                lineNumber: 99,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-400",
                                                children: [
                                                    Math.round(d.duration),
                                                    "h"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/Charts.tsx",
                                                lineNumber: 100,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 97,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/Charts.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/Charts.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/Charts.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-sm font-semibold text-blue-300 mb-2",
                        children: "Movement Summary"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Charts.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 rounded p-3 space-y-2 text-xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400",
                                        children: "Total Distance"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-blue-400 font-bold",
                                        children: [
                                            stats.totalDistance,
                                            " km"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/Charts.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400",
                                        children: "Avg Speed"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 115,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-green-400 font-bold",
                                        children: [
                                            stats.avgSpeed,
                                            " km/h"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 116,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/Charts.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400",
                                        children: "Max Speed"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-yellow-400 font-bold",
                                        children: [
                                            stats.maxSpeed,
                                            " km/h"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/Charts.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400",
                                        children: "Stops"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-purple-400 font-bold",
                                        children: stats.stopCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/Charts.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this),
                            stats.migrationSegments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-2 border-t border-white/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400",
                                        children: "Migrations: "
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-yellow-400 font-bold",
                                        children: stats.migrationSegments.length
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/Charts.tsx",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/Charts.tsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/Charts.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/Charts.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/Charts.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/PlaybackControls.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PlaybackControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
'use client';
;
;
function PlaybackControls({ isPlaying, progress, onPlayPause, onProgressChange, currentTime, totalTime, startDate, endDate }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 50
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.5,
            delay: 0.2
        },
        className: "glass-panel p-4 rounded-2xl w-full max-w-2xl text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                        whileHover: {
                            scale: 1.1
                        },
                        whileTap: {
                            scale: 0.95
                        },
                        onClick: onPlayPause,
                        className: "w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30 transition-all",
                        children: isPlaying ? '⏸' : '▶'
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/PlaybackControls.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "range",
                            min: "0",
                            max: "100",
                            value: progress * 100,
                            onChange: (e)=>onProgressChange(parseFloat(e.target.value) / 100),
                            className: "w-full accent-blue-500 cursor-pointer"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/PlaybackControls.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/PlaybackControls.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-300 min-w-[120px] text-right font-mono",
                        children: [
                            currentTime,
                            " / ",
                            totalTime
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/PlaybackControls.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/PlaybackControls.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            (startDate || endDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center gap-4 text-xs text-gray-400 mb-2",
                children: [
                    startDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "From: ",
                            new Date(startDate).toLocaleDateString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/PlaybackControls.tsx",
                        lineNumber: 63,
                        columnNumber: 13
                    }, this),
                    endDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "To: ",
                            new Date(endDate).toLocaleDateString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/PlaybackControls.tsx",
                        lineNumber: 66,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/PlaybackControls.tsx",
                lineNumber: 61,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-gray-400 text-center",
                children: "Tracking Playback • Drag slider or press play to animate"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/PlaybackControls.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/PlaybackControls.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/export.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exportToCSV",
    ()=>exportToCSV,
    "exportToGeoJSON",
    ()=>exportToGeoJSON,
    "exportToJSON",
    ()=>exportToJSON
]);
function exportToCSV(tracks, filename = 'wildlife-data.csv') {
    const allPoints = [];
    tracks.forEach((track)=>{
        track.points.forEach((point)=>{
            allPoints.push({
                animalId: track.animalId,
                animalName: track.animalName,
                species: track.species || 'unknown',
                timestamp: point.timestamp,
                lat: point.lat,
                lng: point.lng,
                speed: point.speed,
                heading: point.heading,
                altitude: point.altitude,
                temperature: point.temperature
            });
        });
    });
    const headers = [
        'animalId',
        'animalName',
        'species',
        'timestamp',
        'lat',
        'lng',
        'speed',
        'heading',
        'altitude',
        'temperature'
    ];
    const csvRows = [
        headers.join(','),
        ...allPoints.map((p)=>headers.map((h)=>JSON.stringify(p[h] ?? '')).join(','))
    ];
    const csvContent = csvRows.join('\n');
    downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}
function exportToJSON(tracks, filename = 'wildlife-data.json') {
    const data = tracks.map((track)=>({
            animalId: track.animalId,
            animalName: track.animalName,
            species: track.species,
            color: track.color,
            pointCount: track.points.length,
            points: track.points.map((p)=>({
                    timestamp: p.timestamp,
                    coordinates: [
                        p.lng,
                        p.lat
                    ],
                    speed: p.speed,
                    heading: p.heading,
                    altitude: p.altitude,
                    temperature: p.temperature
                }))
        }));
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, 'application/json');
}
function exportToGeoJSON(tracks, filename = 'wildlife-data.geojson') {
    const features = tracks.map((track)=>{
        const coordinates = track.points.map((p)=>[
                p.lng,
                p.lat,
                p.altitude || 0
            ]);
        const speeds = track.points.map((p)=>p.speed).filter(Boolean);
        const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b)=>a + b, 0) / speeds.length : 0;
        return {
            type: 'Feature',
            properties: {
                animalId: track.animalId,
                animalName: track.animalName,
                species: track.species,
                color: track.color,
                pointCount: track.points.length,
                avgSpeed: Math.round(avgSpeed * 100) / 100,
                timeRange: {
                    start: track.points[0]?.timestamp,
                    end: track.points[track.points.length - 1]?.timestamp
                }
            },
            geometry: {
                type: 'LineString',
                coordinates
            }
        };
    });
    const geojson = {
        type: 'FeatureCollection',
        features
    };
    const geojsonContent = JSON.stringify(geojson, null, 2);
    downloadFile(geojsonContent, filename, 'application/geo+json');
}
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([
        content
    ], {
        type: mimeType
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$movebank$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/movebank.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StudySelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/StudySelector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AnimalProfile$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/AnimalProfile.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AlertsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/AlertsPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ComparisonPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ComparisonPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Charts$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Charts.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$PlaybackControls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/PlaybackControls.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$export$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/export.ts [app-ssr] (ecmascript)");
;
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
const Globe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/src/components/globe/Globe.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-full flex items-center justify-center text-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                animate: {
                    rotate: 360
                },
                transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                },
                className: "text-4xl",
                children: "🌍"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 19,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
});
const DEFAULT_STUDY_ID = 2911040;
function Home() {
    const [studies, setStudies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedStudyIds, setSelectedStudyIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [animalTracks, setAnimalTracks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedAnimal, setSelectedAnimal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [comparisonMode, setComparisonMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [comparisonAnimals, setComparisonAnimals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [showCities, setShowCities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showAlerts, setShowAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [playbackProgress, setPlaybackProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedSpecies, setSelectedSpecies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadStudies();
        setSelectedStudyIds([
            DEFAULT_STUDY_ID
        ]);
        loadStudyData([
            DEFAULT_STUDY_ID
        ]);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let interval;
        if (isPlaying && playbackProgress < 1) {
            interval = setInterval(()=>{
                setPlaybackProgress((prev)=>Math.min(prev + 0.005, 1));
            }, 50);
        } else if (playbackProgress >= 1) {
            setIsPlaying(false);
        }
        return ()=>clearInterval(interval);
    }, [
        isPlaying,
        playbackProgress
    ]);
    async function loadStudies() {
        try {
            const res = await fetch('/api/movebank/studies?limit=50');
            const publicStudies = await res.json();
            setStudies(publicStudies);
        } catch (error) {
            console.error('Failed to load studies:', error);
        }
    }
    async function loadStudyData(studyIds) {
        setLoading(true);
        try {
            const allTracks = [];
            for (const studyId of studyIds){
                const res = await fetch(`/api/movebank/study-events?studyId=${studyId}&limit=2000`);
                if (!res.ok) {
                    console.error(`API error for study ${studyId}: ${res.status}`);
                    continue;
                }
                const events = await res.json();
                if (!Array.isArray(events)) {
                    console.error(`Expected array for study ${studyId}, got:`, events);
                    continue;
                }
                const tracks = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$movebank$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["movebankService"].transformToAnimalTracks(events);
                const tracksWithStudy = tracks.map((track)=>({
                        ...track,
                        animalId: `${studyId}-${track.animalId}`,
                        animalName: `${track.animalName} (Study: ${studies.find((s)=>s.id === studyId)?.name || studyId})`
                    }));
                allTracks.push(...tracksWithStudy);
            }
            setAnimalTracks(allTracks);
            setSelectedAnimal(null);
            setPlaybackProgress(1);
            setIsPlaying(false);
        } catch (error) {
            console.error('Failed to load study data:', error);
        } finally{
            setLoading(false);
        }
    }
    const handleStudySelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((studyId)=>{
        setSelectedStudyIds((prev)=>{
            const newIds = prev.includes(studyId) ? prev.filter((id)=>id !== studyId) : [
                ...prev,
                studyId
            ];
            loadStudyData(newIds);
            return newIds;
        });
    }, []);
    const handlePlayPause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (playbackProgress >= 1) {
            setPlaybackProgress(0);
        }
        setIsPlaying((prev)=>!prev);
    }, [
        playbackProgress
    ]);
    const handleProgressChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((value)=>{
        setPlaybackProgress(value);
        setIsPlaying(false);
    }, []);
    const handleAnimalClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((track)=>{
        if (comparisonMode) {
            setComparisonAnimals((prev)=>{
                const next = new Set(prev);
                if (next.has(track.animalId)) next.delete(track.animalId);
                else next.add(track.animalId);
                return next;
            });
        } else {
            setSelectedAnimal(track.animalId);
        }
    }, [
        comparisonMode
    ]);
    const speciesList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const species = new Set(animalTracks.map((t)=>t.species).filter(Boolean));
        return Array.from(species);
    }, [
        animalTracks
    ]);
    const filteredTracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return animalTracks.filter((track)=>{
            if (searchTerm && !track.animalName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            if (selectedSpecies && track.species !== selectedSpecies) return false;
            return true;
        });
    }, [
        animalTracks,
        searchTerm,
        selectedSpecies
    ]);
    const selectedTrack = filteredTracks.find((t)=>t.animalId === selectedAnimal) || null;
    const startDate = selectedTrack?.points[0]?.timestamp || '';
    const endDate = selectedTrack?.points[selectedTrack.points.length - 1]?.timestamp || '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "w-full h-screen bg-[#0a0a1a] relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-0",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full h-full flex items-center justify-center text-white",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: {
                            opacity: [
                                0.5,
                                1,
                                0.5
                            ]
                        },
                        transition: {
                            duration: 1.5,
                            repeat: Infinity
                        },
                        className: "text-xl",
                        children: "Loading wildlife tracking data..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 167,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 166,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Globe, {
                    animalTracks: filteredTracks,
                    selectedAnimal: selectedAnimal,
                    onAnimalSelect: setSelectedAnimal,
                    playbackProgress: playbackProgress,
                    showCities: showCities
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 176,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-6 left-6 z-10 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$StudySelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        studies: studies,
                        selectedStudyIds: selectedStudyIds,
                        onStudySelect: handleStudySelect,
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    selectedTrack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Charts$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            track: selectedTrack,
                            playbackProgress: playbackProgress
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 199,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    comparisonMode && comparisonAnimals.size >= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ComparisonPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            tracks: filteredTracks.filter((t)=>comparisonAnimals.has(t.animalId))
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 208,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, this),
                    showAlerts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AlertsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            tracks: filteredTracks,
                            onClose: ()=>setShowAlerts(false)
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-6 right-6 z-10 space-y-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AnimalProfile$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    track: selectedTrack,
                    onClose: ()=>setSelectedAnimal(null),
                    playbackProgress: playbackProgress
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 228,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-6 left-1/2 -translate-x-1/2 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$PlaybackControls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    isPlaying: isPlaying,
                    progress: playbackProgress,
                    onPlayPause: handlePlayPause,
                    onProgressChange: handleProgressChange,
                    currentTime: selectedTrack?.points[Math.floor(selectedTrack.points.length * playbackProgress)]?.timestamp ? new Date(selectedTrack.points[Math.floor(selectedTrack.points.length * playbackProgress)].timestamp).toLocaleTimeString() : '--:--:--',
                    totalTime: selectedTrack?.points[selectedTrack.points.length - 1]?.timestamp ? new Date(selectedTrack.points[selectedTrack.points.length - 1].timestamp).toLocaleTimeString() : '--:--:--',
                    startDate: startDate,
                    endDate: endDate
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 236,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-6 right-6 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        x: 50
                    },
                    animate: {
                        opacity: 1,
                        x: 0
                    },
                    transition: {
                        delay: 0.3
                    },
                    className: "glass-panel p-3 rounded-xl text-white text-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-bold text-blue-400",
                                    children: [
                                        "Animal Tracks (",
                                        filteredTracks.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 256,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowAlerts(!showAlerts),
                                            className: `px-2 py-1 rounded text-xs transition-colors ${showAlerts ? 'bg-red-500/50 text-white border border-red-400' : 'bg-black/50 text-white/70 border border-white/20'}`,
                                            children: [
                                                "🚨 ",
                                                showAlerts ? 'ON' : 'OFF'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setComparisonMode(!comparisonMode),
                                            className: `px-2 py-1 rounded text-xs transition-colors ${comparisonMode ? 'bg-purple-500/50 text-white border border-purple-400' : 'bg-white/10 hover:bg-white/20 border border-white/20'}`,
                                            children: [
                                                "Compare ",
                                                comparisonAnimals.size > 0 && `(${comparisonAnimals.size})`
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 268,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 257,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 255,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-1 mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$export$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["exportToCSV"])(filteredTracks),
                                    className: "px-2 py-1 bg-blue-500/30 hover:bg-blue-500/50 rounded text-xs transition-colors",
                                    children: "CSV"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 282,
                                    columnNumber: 14
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$export$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["exportToJSON"])(filteredTracks),
                                    className: "px-2 py-1 bg-green-500/30 hover:bg-green-500/50 rounded text-xs transition-colors",
                                    children: "JSON"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 288,
                                    columnNumber: 14
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$export$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["exportToGeoJSON"])(filteredTracks),
                                    className: "px-2 py-1 bg-purple-500/30 hover:bg-purple-500/50 rounded text-xs transition-colors",
                                    children: "GeoJSON"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 294,
                                    columnNumber: 14
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 281,
                            columnNumber: 12
                        }, this),
                        speciesList.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: selectedSpecies,
                            onChange: (e)=>setSelectedSpecies(e.target.value),
                            className: "w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs mb-2 focus:outline-none",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "All Species"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 308,
                                    columnNumber: 15
                                }, this),
                                speciesList.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: s,
                                        children: s
                                    }, s, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 310,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 303,
                            columnNumber: 13
                        }, this),
                        filteredTracks.slice(0, 8).map((track)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                whileHover: {
                                    scale: 1.05
                                },
                                className: "flex items-center gap-2 py-1 cursor-pointer",
                                onClick: ()=>handleAnimalClick(track),
                                children: [
                                    comparisonMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: comparisonAnimals.has(track.animalId),
                                        readOnly: true,
                                        className: "rounded border-white/20"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 323,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-3 h-3 rounded-full",
                                        style: {
                                            backgroundColor: track.color,
                                            boxShadow: `0 0 8px ${track.color}`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 330,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-300 text-xs truncate",
                                        children: track.animalName
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 335,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, track.animalId, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 316,
                                columnNumber: 13
                            }, this)),
                        filteredTracks.length > 8 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-gray-500 text-xs mt-1",
                            children: [
                                "+",
                                filteredTracks.length - 8,
                                " more"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 340,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: -20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: 0.7
                },
                className: "absolute top-6 left-1/2 -translate-x-1/2 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold text-white tracking-wide",
                    style: {
                        textShadow: '0 0 20px rgba(0,136,255,0.8), 0 0 40px rgba(0,136,255,0.4)'
                    },
                    children: "Wildlife Tracking Dashboard"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 351,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 345,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_0ohs4m4._.js.map