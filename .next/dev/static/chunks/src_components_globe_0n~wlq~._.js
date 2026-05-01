(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/globe/Heatmap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createHeatmapTexture",
    ()=>createHeatmapTexture,
    "default",
    ()=>Heatmap,
    "generateHeatmapData",
    ()=>generateHeatmapData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function generateHeatmapData(tracks, resolution = 64) {
    const data = new Float32Array(resolution * resolution);
    tracks.forEach((track)=>{
        track.points.forEach((point)=>{
            // Convert lat/lng to grid coordinates
            const x = Math.floor((point.lng + 180) / 360 * resolution);
            const y = Math.floor((90 - point.lat) / 180 * resolution);
            if (x >= 0 && x < resolution && y >= 0 && y < resolution) {
                data[y * resolution + x] += 1;
            }
        });
    });
    // Normalize to 0-1
    const max = Math.max(...data);
    if (max > 0) {
        for(let i = 0; i < data.length; i++){
            data[i] = data[i] / max;
        }
    }
    return data;
}
function createHeatmapTexture(tracks, resolution = 64) {
    const data = generateHeatmapData(tracks, resolution);
    const rgba = new Uint8Array(resolution * resolution * 4);
    for(let i = 0; i < data.length; i++){
        const intensity = data[i];
        const idx = i * 4;
        // Color gradient: blue -> green -> yellow -> red
        if (intensity < 0.25) {
            rgba[idx] = 0; // R
            rgba[idx + 1] = intensity * 4 * 255; // G
            rgba[idx + 2] = 255; // B
        } else if (intensity < 0.5) {
            rgba[idx] = 0;
            rgba[idx + 1] = 255;
            rgba[idx + 2] = (1 - (intensity - 0.25) * 4) * 255;
        } else if (intensity < 0.75) {
            rgba[idx] = (intensity - 0.5) * 4 * 255;
            rgba[idx + 1] = 255;
            rgba[idx + 2] = 0;
        } else {
            rgba[idx] = 255;
            rgba[idx + 1] = (1 - (intensity - 0.75) * 4) * 255;
            rgba[idx + 2] = 0;
        }
        rgba[idx + 3] = intensity * 200; // Alpha
    }
    const texture = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTexture"](rgba, resolution, resolution, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RGBAFormat"]);
    texture.needsUpdate = true;
    return texture;
}
function Heatmap({ tracks, intensity = 0.5 }) {
    _s();
    const texture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Heatmap.useMemo[texture]": ()=>{
            return createHeatmapTexture(tracks);
        }
    }["Heatmap.useMemo[texture]"], [
        tracks
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                args: [
                    1.01,
                    64,
                    64
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Heatmap.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                map: texture,
                transparent: true,
                opacity: intensity * 0.6,
                depthWrite: false,
                blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"]
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Heatmap.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/globe/Heatmap.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_s(Heatmap, "8gOnhTeB3QuUGmcnMJiK9AvHfoY=");
_c = Heatmap;
var _c;
__turbopack_context__.k.register(_c, "Heatmap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/globe/CityMarkers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CityMarkers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/web/Html.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function latLngToVector3(lat, lng, radius = 1.02) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}
function CityMarkers({ cities, selectedAnimal }) {
    _s();
    const cityPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CityMarkers.useMemo[cityPoints]": ()=>cities.map({
                "CityMarkers.useMemo[cityPoints]": (city)=>({
                        ...city,
                        position: latLngToVector3(city.lat, city.lng)
                    })
            }["CityMarkers.useMemo[cityPoints]"])
    }["CityMarkers.useMemo[cityPoints]"], [
        cities
    ]);
    // Create lines between cities
    const connectionLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CityMarkers.useMemo[connectionLines]": ()=>{
            const lines = [];
            for(let i = 0; i < cityPoints.length; i++){
                for(let j = i + 1; j < cityPoints.length; j++){
                    lines.push({
                        start: cityPoints[i].position,
                        end: cityPoints[j].position
                    });
                }
            }
            return lines;
        }
    }["CityMarkers.useMemo[connectionLines]"], [
        cityPoints
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            connectionLines.map((line, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                    points: [
                        line.start,
                        line.end
                    ],
                    color: "#ffffff",
                    lineWidth: 0.5,
                    transparent: true,
                    opacity: 0.15,
                    dashed: true,
                    dashSize: 0.5,
                    gapSize: 0.5
                }, `connection-${idx}`, false, {
                    fileName: "[project]/src/components/globe/CityMarkers.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)),
            cityPoints.map((city, idx)=>{
                const size = Math.max(0.02, Math.min(0.08, (city.population || 1000000) / 50000000));
                const intensity = selectedAnimal ? 0.3 : 0.8;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: city.position,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                size,
                                16,
                                16
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/globe/CityMarkers.tsx",
                            lineNumber: 74,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#ffff00",
                            emissive: "#ffaa00",
                            emissiveIntensity: intensity * 2,
                            transparent: true,
                            opacity: intensity
                        }, void 0, false, {
                            fileName: "[project]/src/components/globe/CityMarkers.tsx",
                            lineNumber: 75,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                            position: [
                                0,
                                size + 0.02,
                                0
                            ],
                            center: true,
                            distanceFactor: 15,
                            style: {
                                pointerEvents: 'none'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: '#ffff00',
                                    fontSize: '8px',
                                    whiteSpace: 'nowrap',
                                    textShadow: '0 0 4px rgba(255,255,0,0.8)',
                                    fontWeight: city.population && city.population > 10000000 ? 'bold' : 'normal'
                                },
                                children: [
                                    city.name,
                                    city.population && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '6px',
                                            opacity: 0.7
                                        },
                                        children: [
                                            (city.population / 1000000).toFixed(1),
                                            "M"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/globe/CityMarkers.tsx",
                                        lineNumber: 98,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/globe/CityMarkers.tsx",
                                lineNumber: 89,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/globe/CityMarkers.tsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this)
                    ]
                }, `city-${idx}`, true, {
                    fileName: "[project]/src/components/globe/CityMarkers.tsx",
                    lineNumber: 73,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/globe/CityMarkers.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(CityMarkers, "kHsxLYylfvLf8qtKuUm38yLXEco=");
_c = CityMarkers;
var _c;
__turbopack_context__.k.register(_c, "CityMarkers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/globe/Globe.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Globe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-b389eeca.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/OrbitControls.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Stars$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Stars.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/web/Html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/postprocessing/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Heatmap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/globe/Heatmap.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$CityMarkers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/globe/CityMarkers.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
function CountryConnections() {
    _s();
    const connections = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CountryConnections.useMemo[connections]": ()=>{
            const lines = [];
            const radius = 1.52;
            for(let i = 0; i < COUNTRIES.length; i++){
                const country = COUNTRIES[i];
                const pos1 = latLngToVector3(country.lat, country.lng, radius);
                for(let j = i + 1; j < COUNTRIES.length; j++){
                    const other = COUNTRIES[j];
                    const pos2 = latLngToVector3(other.lat, other.lng, radius);
                    const dist = pos1.distanceTo(pos2);
                    if (dist < 1.2) {
                        lines.push([
                            pos1,
                            pos2
                        ]);
                    }
                }
            }
            return lines;
        }
    }["CountryConnections.useMemo[connections]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: connections.map((points, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                points: points,
                color: "#00aaff",
                lineWidth: 3,
                transparent: true,
                opacity: 0.15
            }, idx, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 35,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(CountryConnections, "Zvjsv1bAan0MOjsoovBU+8GLYsM=");
_c = CountryConnections;
const CITIES = [
    {
        name: 'New York',
        lat: 40.7128,
        lng: -74.0060,
        population: 8400000
    },
    {
        name: 'London',
        lat: 51.5074,
        lng: -0.1278,
        population: 9000000
    },
    {
        name: 'Tokyo',
        lat: 35.6762,
        lng: 139.6503,
        population: 14000000
    },
    {
        name: 'Sydney',
        lat: -33.8688,
        lng: 151.2093,
        population: 5300000
    },
    {
        name: 'Dubai',
        lat: 25.2048,
        lng: 55.2708,
        population: 3400000
    },
    {
        name: 'Sao Paulo',
        lat: -23.5505,
        lng: -46.6333,
        population: 12400000
    },
    {
        name: 'Mumbai',
        lat: 19.0760,
        lng: 72.8777,
        population: 21000000
    },
    {
        name: 'Singapore',
        lat: 1.3521,
        lng: 103.8198,
        population: 5900000
    },
    {
        name: 'Cape Town',
        lat: -33.9249,
        lng: 18.4241,
        population: 4600000
    }
];
const COUNTRIES = [
    {
        name: 'Afghanistan',
        lat: 33.9391,
        lng: 67.7100
    },
    {
        name: 'Albania',
        lat: 41.1533,
        lng: 20.1683
    },
    {
        name: 'Algeria',
        lat: 28.0339,
        lng: 1.6596
    },
    {
        name: 'Andorra',
        lat: 42.5063,
        lng: 1.5218
    },
    {
        name: 'Angola',
        lat: -11.2027,
        lng: 17.8739
    },
    {
        name: 'Antigua & Deps',
        lat: 17.0608,
        lng: -61.7964
    },
    {
        name: 'Argentina',
        lat: -38.4161,
        lng: -63.6167
    },
    {
        name: 'Armenia',
        lat: 40.0691,
        lng: 45.0382
    },
    {
        name: 'Australia',
        lat: -25.2744,
        lng: 133.7751
    },
    {
        name: 'Austria',
        lat: 47.5162,
        lng: 14.5501
    },
    {
        name: 'Azerbaijan',
        lat: 40.1431,
        lng: 47.5769
    },
    {
        name: 'Bahamas',
        lat: 25.0343,
        lng: -77.3963
    },
    {
        name: 'Bahrain',
        lat: 25.9304,
        lng: 50.6378
    },
    {
        name: 'Bangladesh',
        lat: 23.6849,
        lng: 90.3563
    },
    {
        name: 'Barbados',
        lat: 13.1939,
        lng: -59.5432
    },
    {
        name: 'Belarus',
        lat: 53.7098,
        lng: 27.9534
    },
    {
        name: 'Belgium',
        lat: 50.5039,
        lng: 4.4699
    },
    {
        name: 'Belize',
        lat: 17.1899,
        lng: -88.4976
    },
    {
        name: 'Benin',
        lat: 9.3077,
        lng: 2.3158
    },
    {
        name: 'Bhutan',
        lat: 27.5142,
        lng: 90.4336
    },
    {
        name: 'Bolivia',
        lat: -16.2902,
        lng: -63.5887
    },
    {
        name: 'Bosnia Herzegovina',
        lat: 43.9159,
        lng: 17.6791
    },
    {
        name: 'Botswana',
        lat: -22.3285,
        lng: 24.6849
    },
    {
        name: 'Brazil',
        lat: -14.2350,
        lng: -51.9253
    },
    {
        name: 'Brunei',
        lat: 4.5353,
        lng: 114.7277
    },
    {
        name: 'Bulgaria',
        lat: 42.7339,
        lng: 25.4858
    },
    {
        name: 'Burkina',
        lat: 12.2383,
        lng: -1.5616
    },
    {
        name: 'Burundi',
        lat: -3.3731,
        lng: 29.9189
    },
    {
        name: 'Cambodia',
        lat: 12.5657,
        lng: 104.9910
    },
    {
        name: 'Cameroon',
        lat: 7.3697,
        lng: 12.3547
    },
    {
        name: 'Canada',
        lat: 56.1304,
        lng: -106.3468
    },
    {
        name: 'Cape Verde',
        lat: 16.0021,
        lng: -24.0132
    },
    {
        name: 'Central African Rep',
        lat: 6.6111,
        lng: 20.9394
    },
    {
        name: 'Chad',
        lat: 15.4542,
        lng: 18.7322
    },
    {
        name: 'Chile',
        lat: -35.6751,
        lng: -71.5430
    },
    {
        name: 'China',
        lat: 35.8617,
        lng: 104.1954
    },
    {
        name: 'Colombia',
        lat: 4.5709,
        lng: -74.2973
    },
    {
        name: 'Comoros',
        lat: -11.6455,
        lng: 43.3333
    },
    {
        name: 'Congo',
        lat: -0.2280,
        lng: 15.8277
    },
    {
        name: 'Congo {Democratic Rep}',
        lat: -4.0383,
        lng: 21.7587
    },
    {
        name: 'Costa Rica',
        lat: 9.7489,
        lng: -83.7534
    },
    {
        name: 'Croatia',
        lat: 45.1000,
        lng: 15.2000
    },
    {
        name: 'Cuba',
        lat: 21.5218,
        lng: -77.7812
    },
    {
        name: 'Cyprus',
        lat: 35.1264,
        lng: 33.4299
    },
    {
        name: 'Czech Republic',
        lat: 49.8175,
        lng: 15.4730
    },
    {
        name: 'Denmark',
        lat: 56.2639,
        lng: 9.5018
    },
    {
        name: 'Djibouti',
        lat: 11.5890,
        lng: 43.1456
    },
    {
        name: 'Dominica',
        lat: 15.4150,
        lng: -61.3710
    },
    {
        name: 'Dominican Republic',
        lat: 18.7357,
        lng: -70.1627
    },
    {
        name: 'East Timor',
        lat: -8.8742,
        lng: 125.7275
    },
    {
        name: 'Ecuador',
        lat: -1.8312,
        lng: -78.1834
    },
    {
        name: 'Egypt',
        lat: 26.8206,
        lng: 30.8025
    },
    {
        name: 'El Salvador',
        lat: 13.7942,
        lng: -88.8965
    },
    {
        name: 'Equatorial Guinea',
        lat: 1.6508,
        lng: 10.2679
    },
    {
        name: 'Eritrea',
        lat: 15.1794,
        lng: 39.7823
    },
    {
        name: 'Estonia',
        lat: 58.5953,
        lng: 25.0136
    },
    {
        name: 'Ethiopia',
        lat: 9.1450,
        lng: 40.4897
    },
    {
        name: 'Fiji',
        lat: -17.7134,
        lng: 178.0650
    },
    {
        name: 'Finland',
        lat: 61.9241,
        lng: 25.7482
    },
    {
        name: 'France',
        lat: 46.6034,
        lng: 1.8883
    },
    {
        name: 'Gabon',
        lat: -0.8037,
        lng: 11.6094
    },
    {
        name: 'Gambia',
        lat: 13.4432,
        lng: -15.3101
    },
    {
        name: 'Georgia',
        lat: 42.3154,
        lng: 43.3569
    },
    {
        name: 'Germany',
        lat: 51.1657,
        lng: 10.4515
    },
    {
        name: 'Ghana',
        lat: 7.9465,
        lng: -1.0232
    },
    {
        name: 'Greece',
        lat: 39.0742,
        lng: 21.8243
    },
    {
        name: 'Grenada',
        lat: 12.1165,
        lng: -61.6790
    },
    {
        name: 'Guatemala',
        lat: 15.7835,
        lng: -90.2308
    },
    {
        name: 'Guinea',
        lat: 9.9456,
        lng: -9.6966
    },
    {
        name: 'Guinea-Bissau',
        lat: 11.8037,
        lng: -15.1804
    },
    {
        name: 'Guyana',
        lat: 4.8606,
        lng: -58.9302
    },
    {
        name: 'Haiti',
        lat: 18.9712,
        lng: -72.2852
    },
    {
        name: 'Honduras',
        lat: 15.1998,
        lng: -86.2419
    },
    {
        name: 'Hungary',
        lat: 47.1625,
        lng: 19.5033
    },
    {
        name: 'Iceland',
        lat: 64.9631,
        lng: -19.0208
    },
    {
        name: 'India',
        lat: 20.5937,
        lng: 78.9629
    },
    {
        name: 'Indonesia',
        lat: -0.7893,
        lng: 113.9213
    },
    {
        name: 'Iran',
        lat: 32.4279,
        lng: 53.6880
    },
    {
        name: 'Iraq',
        lat: 33.2232,
        lng: 43.6793
    },
    {
        name: 'Ireland {Republic}',
        lat: 53.1424,
        lng: -7.6921
    },
    {
        name: 'Israel',
        lat: 31.0461,
        lng: 34.8516
    },
    {
        name: 'Italy',
        lat: 41.8719,
        lng: 12.5674
    },
    {
        name: 'Ivory Coast',
        lat: 7.5400,
        lng: -5.5471
    },
    {
        name: 'Jamaica',
        lat: 18.1096,
        lng: -77.2975
    },
    {
        name: 'Japan',
        lat: 36.2048,
        lng: 138.2529
    },
    {
        name: 'Jordan',
        lat: 30.5852,
        lng: 36.2384
    },
    {
        name: 'Kazakhstan',
        lat: 48.0196,
        lng: 66.9237
    },
    {
        name: 'Kenya',
        lat: -0.0236,
        lng: 37.9062
    },
    {
        name: 'Kiribati',
        lat: 1.8709,
        lng: -157.3634
    },
    {
        name: 'Korea North',
        lat: 40.3399,
        lng: 127.5101
    },
    {
        name: 'Korea South',
        lat: 35.9078,
        lng: 127.7669
    },
    {
        name: 'Kosovo',
        lat: 42.6026,
        lng: 20.9027
    },
    {
        name: 'Kuwait',
        lat: 29.3117,
        lng: 47.4818
    },
    {
        name: 'Kyrgyzstan',
        lat: 41.2044,
        lng: 74.7661
    },
    {
        name: 'Laos',
        lat: 19.8563,
        lng: 102.4955
    },
    {
        name: 'Latvia',
        lat: 56.8796,
        lng: 24.6032
    },
    {
        name: 'Lebanon',
        lat: 33.8547,
        lng: 35.8623
    },
    {
        name: 'Lesotho',
        lat: -29.6099,
        lng: 28.2336
    },
    {
        name: 'Liberia',
        lat: 6.4281,
        lng: -9.4295
    },
    {
        name: 'Libya',
        lat: 26.3351,
        lng: 17.2283
    },
    {
        name: 'Liechtenstein',
        lat: 47.1660,
        lng: 9.5554
    },
    {
        name: 'Lithuania',
        lat: 55.1694,
        lng: 23.8813
    },
    {
        name: 'Luxembourg',
        lat: 49.8153,
        lng: 6.1296
    },
    {
        name: 'Macedonia',
        lat: 41.5089,
        lng: 21.7453
    },
    {
        name: 'Madagascar',
        lat: -18.7669,
        lng: 46.8691
    },
    {
        name: 'Malawi',
        lat: -13.2543,
        lng: 34.3015
    },
    {
        name: 'Malaysia',
        lat: 4.2105,
        lng: 101.9758
    },
    {
        name: 'Maldives',
        lat: 3.2028,
        lng: 73.2207
    },
    {
        name: 'Mali',
        lat: 17.5707,
        lng: -4.0000
    },
    {
        name: 'Malta',
        lat: 35.9375,
        lng: 14.3754
    },
    {
        name: 'Marshall Islands',
        lat: 7.1315,
        lng: 171.1845
    },
    {
        name: 'Mauritania',
        lat: 21.0079,
        lng: -10.9408
    },
    {
        name: 'Mauritius',
        lat: -20.3484,
        lng: 57.5522
    },
    {
        name: 'Mexico',
        lat: 23.6345,
        lng: -102.5528
    },
    {
        name: 'Micronesia',
        lat: 7.4256,
        lng: 150.5508
    },
    {
        name: 'Moldova',
        lat: 47.4116,
        lng: 28.3699
    },
    {
        name: 'Monaco',
        lat: 43.7384,
        lng: 7.4246
    },
    {
        name: 'Mongolia',
        lat: 46.8625,
        lng: 103.8467
    },
    {
        name: 'Montenegro',
        lat: 42.7087,
        lng: 19.3744
    },
    {
        name: 'Morocco',
        lat: 31.7917,
        lng: -7.0926
    },
    {
        name: 'Mozambique',
        lat: -18.6657,
        lng: 35.5296
    },
    {
        name: 'Myanmar, {Burma}',
        lat: 21.9130,
        lng: 95.9560
    },
    {
        name: 'Namibia',
        lat: -22.9576,
        lng: 18.4904
    },
    {
        name: 'Nauru',
        lat: -0.5228,
        lng: 166.9315
    },
    {
        name: 'Nepal',
        lat: 28.3949,
        lng: 84.1240
    },
    {
        name: 'Netherlands',
        lat: 52.1326,
        lng: 5.2913
    },
    {
        name: 'New Zealand',
        lat: -40.9006,
        lng: 174.8860
    },
    {
        name: 'Nicaragua',
        lat: 12.8654,
        lng: -85.2072
    },
    {
        name: 'Niger',
        lat: 17.6078,
        lng: 8.0817
    },
    {
        name: 'Nigeria',
        lat: 9.0820,
        lng: 8.6753
    },
    {
        name: 'Norway',
        lat: 60.4720,
        lng: 8.4689
    },
    {
        name: 'Oman',
        lat: 21.5126,
        lng: 55.9233
    },
    {
        name: 'Pakistan',
        lat: 30.3753,
        lng: 69.3451
    },
    {
        name: 'Palau',
        lat: 7.5150,
        lng: 134.5825
    },
    {
        name: 'Panama',
        lat: 8.5380,
        lng: -80.7821
    },
    {
        name: 'Papua New Guinea',
        lat: -6.3150,
        lng: 143.9555
    },
    {
        name: 'Paraguay',
        lat: -23.4425,
        lng: -58.4438
    },
    {
        name: 'Peru',
        lat: -9.1900,
        lng: -75.0152
    },
    {
        name: 'Philippines',
        lat: 12.8797,
        lng: 121.7740
    },
    {
        name: 'Poland',
        lat: 51.9194,
        lng: 19.1451
    },
    {
        name: 'Portugal',
        lat: 39.3999,
        lng: -8.2245
    },
    {
        name: 'Qatar',
        lat: 25.3548,
        lng: 51.1839
    },
    {
        name: 'Romania',
        lat: 45.9432,
        lng: 24.9668
    },
    {
        name: 'Russian Federation',
        lat: 61.5240,
        lng: 105.3188
    },
    {
        name: 'Rwanda',
        lat: -1.9403,
        lng: 29.8739
    },
    {
        name: 'St Kitts & Nevis',
        lat: 17.3578,
        lng: -62.7830
    },
    {
        name: 'St Lucia',
        lat: 13.9094,
        lng: -60.9789
    },
    {
        name: 'Saint Vincent & the Grenadines',
        lat: 12.9843,
        lng: -61.2872
    },
    {
        name: 'Samoa',
        lat: -13.7590,
        lng: -172.1046
    },
    {
        name: 'San Marino',
        lat: 43.9424,
        lng: 12.4578
    },
    {
        name: 'Sao Tome & Principe',
        lat: 0.1864,
        lng: 6.6131
    },
    {
        name: 'Saudi Arabia',
        lat: 23.8859,
        lng: 45.0792
    },
    {
        name: 'Senegal',
        lat: 14.4974,
        lng: -14.4524
    },
    {
        name: 'Serbia',
        lat: 44.0165,
        lng: 21.0059
    },
    {
        name: 'Seychelles',
        lat: -4.6796,
        lng: 55.4920
    },
    {
        name: 'Sierra Leone',
        lat: 8.4606,
        lng: -11.7799
    },
    {
        name: 'Singapore',
        lat: 1.3521,
        lng: 103.8198
    },
    {
        name: 'Slovakia',
        lat: 48.6690,
        lng: 19.6990
    },
    {
        name: 'Slovenia',
        lat: 46.1512,
        lng: 14.9955
    },
    {
        name: 'Solomon Islands',
        lat: -9.6457,
        lng: 160.1562
    },
    {
        name: 'Somalia',
        lat: 5.1521,
        lng: 46.1996
    },
    {
        name: 'South Africa',
        lat: -30.5595,
        lng: 22.9375
    },
    {
        name: 'South Sudan',
        lat: 6.8770,
        lng: 31.3070
    },
    {
        name: 'Spain',
        lat: 40.4637,
        lng: -3.7492
    },
    {
        name: 'Sri Lanka',
        lat: 7.8731,
        lng: 80.7718
    },
    {
        name: 'Sudan',
        lat: 12.8628,
        lng: 30.2176
    },
    {
        name: 'Suriname',
        lat: 3.9193,
        lng: -56.0278
    },
    {
        name: 'Swaziland',
        lat: -26.5225,
        lng: 31.4659
    },
    {
        name: 'Sweden',
        lat: 60.1282,
        lng: 18.6435
    },
    {
        name: 'Switzerland',
        lat: 46.8182,
        lng: 8.2275
    },
    {
        name: 'Syria',
        lat: 34.8021,
        lng: 39.0968
    },
    {
        name: 'Taiwan',
        lat: 23.6978,
        lng: 120.9605
    },
    {
        name: 'Tajikistan',
        lat: 38.8610,
        lng: 71.2761
    },
    {
        name: 'Tanzania',
        lat: -6.3690,
        lng: 34.8888
    },
    {
        name: 'Thailand',
        lat: 15.8700,
        lng: 100.9925
    },
    {
        name: 'Togo',
        lat: 8.6195,
        lng: 0.8248
    },
    {
        name: 'Tonga',
        lat: -21.1789,
        lng: -175.1982
    },
    {
        name: 'Trinidad & Tobago',
        lat: 10.6918,
        lng: -61.2225
    },
    {
        name: 'Tunisia',
        lat: 33.8869,
        lng: 9.5375
    },
    {
        name: 'Turkey',
        lat: 38.9637,
        lng: 35.2433
    },
    {
        name: 'Turkmenistan',
        lat: 38.9697,
        lng: 59.5563
    },
    {
        name: 'Tuvalu',
        lat: -7.4785,
        lng: 178.6800
    },
    {
        name: 'Uganda',
        lat: 1.3733,
        lng: 32.2903
    },
    {
        name: 'Ukraine',
        lat: 48.3794,
        lng: 31.1656
    },
    {
        name: 'United Arab Emirates',
        lat: 23.4241,
        lng: 53.8478
    },
    {
        name: 'United Kingdom',
        lat: 55.3781,
        lng: -3.4360
    },
    {
        name: 'United States',
        lat: 37.0902,
        lng: -95.7129
    },
    {
        name: 'Uruguay',
        lat: -32.5228,
        lng: -55.7658
    },
    {
        name: 'Uzbekistan',
        lat: 41.3775,
        lng: 64.5853
    },
    {
        name: 'Vanuatu',
        lat: -15.3767,
        lng: 166.9592
    },
    {
        name: 'Vatican City',
        lat: 41.9029,
        lng: 12.4534
    },
    {
        name: 'Venezuela',
        lat: 6.4238,
        lng: -66.5897
    },
    {
        name: 'Vietnam',
        lat: 14.0583,
        lng: 108.2772
    },
    {
        name: 'Yemen',
        lat: 15.5527,
        lng: 48.5164
    },
    {
        name: 'Zambia',
        lat: -13.1339,
        lng: 27.8493
    },
    {
        name: 'Zimbabwe',
        lat: -19.0154,
        lng: 29.1549
    }
];
function latLngToVector3(lat, lng, radius = 1.51) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}
function AnimalPath({ track, progress, onAnimalSelect, isSelected }) {
    _s1();
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const points = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnimalPath.useMemo[points]": ()=>{
            const visibleCount = Math.floor(track.points.length * progress);
            return track.points.slice(0, Math.max(visibleCount, 1)).map({
                "AnimalPath.useMemo[points]": (p)=>latLngToVector3(p.lat, p.lng)
            }["AnimalPath.useMemo[points]"]);
        }
    }["AnimalPath.useMemo[points]"], [
        track.points,
        progress
    ]);
    const lastPoint = track.points[Math.floor(track.points.length * progress) - 1];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            points.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                        points: points,
                        color: track.color,
                        lineWidth: isSelected ? 20 : 15,
                        transparent: true,
                        opacity: isSelected ? 1 : 0.9
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 311,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                        points: points,
                        color: track.color,
                        lineWidth: isSelected ? 30 : 25,
                        transparent: true,
                        opacity: 0.3
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 318,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            points.length > 0 && lastPoint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: points[points.length - 1],
                onPointerOver: (e)=>{
                    e.stopPropagation();
                    setIsHovered(true);
                },
                onPointerOut: (e)=>{
                    e.stopPropagation();
                    setIsHovered(false);
                },
                onClick: (e)=>{
                    e.stopPropagation();
                    if (onAnimalSelect) onAnimalSelect(track.animalId);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            isSelected ? 0.04 : isHovered ? 0.03 : 0.02,
                            16,
                            16
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 334,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: track.color,
                        emissive: track.color,
                        emissiveIntensity: isSelected ? 3 : isHovered ? 2 : 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 335,
                        columnNumber: 11
                    }, this),
                    isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        rotation: [
                            Math.PI / 2,
                            0,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                                args: [
                                    0.06,
                                    0.008,
                                    16,
                                    32
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/globe/Globe.tsx",
                                lineNumber: 342,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                                color: track.color,
                                transparent: true,
                                opacity: 0.6
                            }, void 0, false, {
                                fileName: "[project]/src/components/globe/Globe.tsx",
                                lineNumber: 343,
                                columnNumber: 16
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 341,
                        columnNumber: 14
                    }, this),
                    isHovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                        position: [
                            0,
                            0.1,
                            0
                        ],
                        center: true,
                        distanceFactor: 10,
                        style: {
                            pointerEvents: 'none'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: 'rgba(0,0,0,0.8)',
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                border: `1px solid ${track.color}`,
                                backdropFilter: 'blur(4px)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontWeight: 'bold',
                                        marginBottom: '4px'
                                    },
                                    children: track.animalName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/globe/Globe.tsx",
                                    lineNumber: 363,
                                    columnNumber: 17
                                }, this),
                                lastPoint.timestamp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: new Date(lastPoint.timestamp).toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/globe/Globe.tsx",
                                    lineNumber: 365,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        "Lat: ",
                                        lastPoint.lat.toFixed(4),
                                        ", Lng: ",
                                        lastPoint.lng.toFixed(4)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/globe/Globe.tsx",
                                    lineNumber: 367,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/globe/Globe.tsx",
                            lineNumber: 353,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 347,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 328,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 308,
        columnNumber: 5
    }, this);
}
_s1(AnimalPath, "QDAevxXcic9KJByN40zqhrr2dTw=");
_c1 = AnimalPath;
function Earth() {
    _s2();
    const earthTexture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Earth.useMemo[earthTexture]": ()=>{
            const loader = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextureLoader"]();
            const texture = loader.load('/textures/earth-blue-marble.jpg');
            texture.anisotropy = 16;
            return texture;
        }
    }["Earth.useMemo[earthTexture]"], []);
    const bumpTexture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Earth.useMemo[bumpTexture]": ()=>{
            const loader = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextureLoader"]();
            return loader.load('/textures/earth-topology.png');
        }
    }["Earth.useMemo[bumpTexture]"], []);
    const cloudsTexture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Earth.useMemo[cloudsTexture]": ()=>{
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                for(let i = 0; i < 200; i++){
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const r = Math.random() * 30 + 10;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            const texture = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
            return texture;
        }
    }["Earth.useMemo[cloudsTexture]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            1.5,
                            64,
                            64
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 413,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        map: earthTexture,
                        bumpMap: bumpTexture,
                        bumpScale: 0.03,
                        roughness: 0.7,
                        metalness: 0.1
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 414,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 412,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            1.505,
                            64,
                            64
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 423,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        map: cloudsTexture,
                        transparent: true,
                        opacity: 0.15,
                        depthWrite: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 424,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 422,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 411,
        columnNumber: 5
    }, this);
}
_s2(Earth, "MZG009nMTQJ0hj1vDzPPW1eNe/g=");
_c2 = Earth;
const CameraController = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"], {
        ref: ref,
        enablePan: true,
        enableZoom: true,
        enableRotate: true,
        minDistance: 1.5,
        maxDistance: 20,
        autoRotate: true,
        autoRotateSpeed: 0.3,
        enableDamping: true,
        dampingFactor: 0.05
    }, void 0, false, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 437,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c3 = CameraController;
CameraController.displayName = 'CameraController';
function CameraAutoFit({ tracks, controlsRef }) {
    _s3();
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CameraAutoFit.useEffect": ()=>{
            if (!controlsRef.current || tracks.length === 0) return;
            const controls = controlsRef.current;
            const allPoints = [];
            tracks.forEach({
                "CameraAutoFit.useEffect": (track)=>{
                    track.points.forEach({
                        "CameraAutoFit.useEffect": (p)=>{
                            allPoints.push(latLngToVector3(p.lat, p.lng));
                        }
                    }["CameraAutoFit.useEffect"]);
                }
            }["CameraAutoFit.useEffect"]);
            if (allPoints.length === 0) return;
            const box = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Box3"]().setFromPoints(allPoints);
            const center = box.getCenter(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]());
            const size = box.getSize(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]());
            const maxSize = Math.max(size.x, size.y, size.z);
            const radius = maxSize * 0.5;
            camera.position.copy(center.clone().add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, radius * 0.5, radius * 4)));
            controls.target.copy(center);
            controls.update();
        }
    }["CameraAutoFit.useEffect"], [
        tracks,
        camera,
        controlsRef
    ]);
    return null;
}
_s3(CameraAutoFit, "Wo14/kl28HhoRfDX+Cg7MK2EhFU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
_c4 = CameraAutoFit;
function LoadingFallback() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                args: [
                    1,
                    32,
                    32
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 488,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                color: "#001133",
                wireframe: true
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 489,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 487,
        columnNumber: 5
    }, this);
}
_c5 = LoadingFallback;
function Globe({ animalTracks, selectedAnimal, onAnimalSelect, playbackProgress }) {
    _s4();
    const [showHeatmap, setShowHeatmap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const controlsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Globe.useEffect": ()=>{
            if (!controlsRef.current || !selectedAnimal) return;
            const track = animalTracks.find({
                "Globe.useEffect.track": (t)=>t.animalId === selectedAnimal
            }["Globe.useEffect.track"]);
            if (!track || track.points.length === 0) return;
            const currentIndex = Math.floor(track.points.length * playbackProgress) - 1;
            const point = track.points[Math.max(currentIndex, 0)];
            if (!point) return;
            const target = latLngToVector3(point.lat, point.lng);
            const controls = controlsRef.current;
            // Smooth camera animation
            const duration = 1000;
            const startPos = controls.object.position.clone();
            const startTarget = controls.target.clone();
            const offset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0.5, 0.3, 1).multiplyScalar(3);
            const newCameraPos = target.clone().add(offset);
            const startTime = Date.now();
            const animate = {
                "Globe.useEffect.animate": ()=>{
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = progress * (2 - progress);
                    controls.object.position.lerp(startPos, newCameraPos, eased);
                    controls.target.lerp(startTarget, target, eased);
                    controls.update();
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }
            }["Globe.useEffect.animate"];
            animate();
        }
    }["Globe.useEffect"], [
        selectedAnimal,
        playbackProgress,
        animalTracks
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
        camera: {
            position: [
                0,
                1,
                5
            ],
            fov: 60
        },
        gl: {
            antialias: true,
            alpha: true
        },
        style: {
            background: 'transparent'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                intensity: 0.2,
                color: "#b0c4ff"
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 542,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                position: [
                    10,
                    10,
                    10
                ],
                intensity: 1.5,
                color: "#ffffff"
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 543,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                position: [
                    -10,
                    -10,
                    -5
                ],
                intensity: 0.6,
                color: "#0088ff"
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 544,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                position: [
                    5,
                    -5,
                    10
                ],
                intensity: 0.5,
                color: "#00ff88"
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 545,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                position: [
                    0,
                    15,
                    0
                ],
                intensity: 0.8,
                color: "#ffaa00"
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 546,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("spotLight", {
                position: [
                    0,
                    20,
                    0
                ],
                angle: 0.3,
                penumbra: 1,
                intensity: 0.5,
                color: "#ffffff",
                castShadow: true
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 547,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Stars$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stars"], {
                radius: 100,
                depth: 50,
                count: 3000,
                factor: 4,
                saturation: 0,
                fade: true,
                speed: 1
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 556,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingFallback, {}, void 0, false, {
                    fileName: "[project]/src/components/globe/Globe.tsx",
                    lineNumber: 558,
                    columnNumber: 27
                }, this),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Earth, {}, void 0, false, {
                    fileName: "[project]/src/components/globe/Globe.tsx",
                    lineNumber: 559,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 558,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CountryConnections, {}, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 562,
                columnNumber: 7
            }, this),
            showHeatmap && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Heatmap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                tracks: animalTracks,
                intensity: 0.5
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 564,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                center: true,
                position: [
                    0,
                    -1.5,
                    0
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setShowHeatmap(!showHeatmap),
                    className: `px-3 py-1 rounded text-xs transition-colors ${showHeatmap ? 'bg-orange-500/50 text-white border border-orange-400' : 'bg-black/50 text-white/70 border border-white/20 hover:border-white/40'}`,
                    children: [
                        "🌡️ Heatmap ",
                        showHeatmap ? 'ON' : 'OFF'
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/globe/Globe.tsx",
                    lineNumber: 567,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 566,
                columnNumber: 7
            }, this),
            animalTracks.map((track)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimalPath, {
                    track: track,
                    progress: playbackProgress,
                    onAnimalSelect: onAnimalSelect,
                    isSelected: selectedAnimal === track.animalId
                }, track.animalId, false, {
                    fileName: "[project]/src/components/globe/Globe.tsx",
                    lineNumber: 580,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$CityMarkers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                cities: CITIES,
                selectedAnimal: selectedAnimal
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 589,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CameraAutoFit, {
                tracks: animalTracks,
                controlsRef: controlsRef
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 591,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CameraController, {
                ref: controlsRef
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 592,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EffectComposer"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bloom"], {
                    intensity: 1.5,
                    luminanceThreshold: 0.1,
                    luminanceSmoothing: 0.5
                }, void 0, false, {
                    fileName: "[project]/src/components/globe/Globe.tsx",
                    lineNumber: 595,
                    columnNumber: 10
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 594,
                columnNumber: 8
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 537,
        columnNumber: 5
    }, this);
}
_s4(Globe, "9bQ4rw1vXK9uwHpiY/JdiX/rJrc=");
_c6 = Globe;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "CountryConnections");
__turbopack_context__.k.register(_c1, "AnimalPath");
__turbopack_context__.k.register(_c2, "Earth");
__turbopack_context__.k.register(_c3, "CameraController");
__turbopack_context__.k.register(_c4, "CameraAutoFit");
__turbopack_context__.k.register(_c5, "LoadingFallback");
__turbopack_context__.k.register(_c6, "Globe");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/globe/Globe.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/globe/Globe.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_globe_0n~wlq~._.js.map