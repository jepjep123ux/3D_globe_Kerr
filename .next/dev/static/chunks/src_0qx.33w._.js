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
"[project]/src/components/globe/Globe.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COUNTRIES",
    ()=>COUNTRIES,
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
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
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
            const countryPositions = COUNTRIES.map({
                "CountryConnections.useMemo[connections].countryPositions": (c, i)=>({
                        pos: latLngToVector3(c.lat, c.lng, radius),
                        idx: i
                    })
            }["CountryConnections.useMemo[connections].countryPositions"]);
            for(let i = 0; i < countryPositions.length; i++){
                const current = countryPositions[i];
                const distances = [];
                for(let j = 0; j < countryPositions.length; j++){
                    if (i === j) continue;
                    const dist = current.pos.distanceTo(countryPositions[j].pos);
                    distances.push({
                        dist,
                        idx: j
                    });
                }
                distances.sort({
                    "CountryConnections.useMemo[connections]": (a, b)=>a.dist - b.dist
                }["CountryConnections.useMemo[connections]"]);
                for(let k = 0; k < Math.min(3, distances.length); k++){
                    const otherIdx = distances[k].idx;
                    if (otherIdx > i) {
                        lines.push([
                            current.pos,
                            countryPositions[otherIdx].pos
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
                lineWidth: 2,
                transparent: true,
                opacity: 0.12
            }, idx, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(CountryConnections, "Zvjsv1bAan0MOjsoovBU+8GLYsM=");
_c = CountryConnections;
function CountryMarkers({ selectedCountry, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: COUNTRIES.map((country, idx)=>{
            const position = latLngToVector3(country.lat, country.lng, 1.53);
            const isSelected = selectedCountry === idx;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: position,
                    onClick: (e)=>{
                        e.stopPropagation();
                        onSelect(isSelected ? null : idx);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                0.02,
                                12,
                                12
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/globe/Globe.tsx",
                            lineNumber: 68,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#00aaff",
                            emissive: "#00aaff",
                            emissiveIntensity: isSelected ? 8 : 5
                        }, void 0, false, {
                            fileName: "[project]/src/components/globe/Globe.tsx",
                            lineNumber: 69,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/globe/Globe.tsx",
                    lineNumber: 64,
                    columnNumber: 13
                }, this)
            }, idx, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 63,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c1 = CountryMarkers;
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
        name: "Afghanistan",
        official_name: "Islamic Republic of Afghanistan",
        iso2: "AF",
        iso3: "AFG",
        capital: "Kabul",
        continent: "Asia",
        region: "Southern Asia",
        population: "38.9M",
        area_km2: "652230",
        gdp_usd: "$14.8B",
        currency: "Afghan afghani",
        languages: "Dari, Pashto",
        lat: 33.9391,
        lng: 67.7100
    },
    {
        name: "Albania",
        official_name: "Republic of Albania",
        iso2: "AL",
        iso3: "ALB",
        capital: "Tirana",
        continent: "Europe",
        region: "Southern Europe",
        population: "2.8M",
        area_km2: "28748",
        gdp_usd: "$18.3B",
        currency: "Albanian lek",
        languages: "Albanian",
        lat: 41.1533,
        lng: 20.1683
    },
    {
        name: "Algeria",
        official_name: "People's Democratic Republic of Algeria",
        iso2: "DZ",
        iso3: "DZA",
        capital: "Algiers",
        continent: "Africa",
        region: "Northern Africa",
        population: "44.7M",
        area_km2: "2381741",
        gdp_usd: "$187.0B",
        currency: "Algerian dinar",
        languages: "Arabic, Berber",
        lat: 28.0339,
        lng: 1.6596
    },
    {
        name: "Andorra",
        official_name: "Principality of Andorra",
        iso2: "AD",
        iso3: "AND",
        capital: "Andorra la Vella",
        continent: "Europe",
        region: "Southern Europe",
        population: "77K",
        area_km2: "468",
        gdp_usd: "$3.3B",
        currency: "Euro",
        languages: "Catalan",
        lat: 42.5063,
        lng: 1.5218
    },
    {
        name: "Angola",
        official_name: "Republic of Angola",
        iso2: "AO",
        iso3: "AGO",
        capital: "Luanda",
        continent: "Africa",
        region: "Middle Africa",
        population: "35.6M",
        area_km2: "1246700",
        gdp_usd: "$106.7B",
        currency: "Angolan kwanza",
        languages: "Portuguese",
        lat: -11.2027,
        lng: 17.8739
    },
    {
        name: "Antigua and Barbuda",
        official_name: "Antigua and Barbuda",
        iso2: "AG",
        iso3: "ATG",
        capital: "St. John's",
        continent: "North America",
        region: "Caribbean",
        population: "93K",
        area_km2: "442",
        gdp_usd: "$1.8B",
        currency: "East Caribbean dollar",
        languages: "English",
        lat: 17.0608,
        lng: -61.7964
    },
    {
        name: "Argentina",
        official_name: "Argentine Republic",
        iso2: "AR",
        iso3: "ARG",
        capital: "Buenos Aires",
        continent: "South America",
        region: "South America",
        population: "45.8M",
        area_km2: "2780400",
        gdp_usd: "$632.8B",
        currency: "Argentine peso",
        languages: "Spanish",
        lat: -38.4161,
        lng: -63.6167
    },
    {
        name: "Armenia",
        official_name: "Republic of Armenia",
        iso2: "AM",
        iso3: "ARM",
        capital: "Yerevan",
        continent: "Asia",
        region: "Western Asia",
        population: "2.8M",
        area_km2: "29743",
        gdp_usd: "$19.5B",
        currency: "Armenian dram",
        languages: "Armenian",
        lat: 40.0691,
        lng: 45.0382
    },
    {
        name: "Australia",
        official_name: "Commonwealth of Australia",
        iso2: "AU",
        iso3: "AUS",
        capital: "Canberra",
        continent: "Oceania",
        region: "Australia and New Zealand",
        population: "25.9M",
        area_km2: "7692024",
        gdp_usd: "$1.7T",
        currency: "Australian dollar",
        languages: "English",
        lat: -25.2744,
        lng: 133.7751
    },
    {
        name: "Austria",
        official_name: "Republic of Austria",
        iso2: "AT",
        iso3: "AUT",
        capital: "Vienna",
        continent: "Europe",
        region: "Central Europe",
        population: "9.1M",
        area_km2: "83871",
        gdp_usd: "$471.4B",
        currency: "Euro",
        languages: "German",
        lat: 47.5162,
        lng: 14.5501
    },
    {
        name: "Azerbaijan",
        official_name: "Republic of Azerbaijan",
        iso2: "AZ",
        iso3: "AZE",
        capital: "Baku",
        continent: "Asia",
        region: "Western Asia",
        population: "10.1M",
        area_km2: "86600",
        gdp_usd: "$78.7B",
        currency: "Azerbaijani manat",
        languages: "Azerbaijani",
        lat: 40.1431,
        lng: 47.5769
    },
    {
        name: "Bahamas",
        official_name: "Commonwealth of the Bahamas",
        iso2: "BS",
        iso3: "BHS",
        capital: "Nassau",
        continent: "North America",
        region: "Caribbean",
        population: "400K",
        area_km2: "13943",
        gdp_usd: "$15.1B",
        currency: "Bahamian dollar",
        languages: "English",
        lat: 25.0343,
        lng: -77.3963
    },
    {
        name: "Bahrain",
        official_name: "Kingdom of Bahrain",
        iso2: "BH",
        iso3: "BHR",
        capital: "Manama",
        continent: "Asia",
        region: "Western Asia",
        population: "1.5M",
        area_km2: "765",
        gdp_usd: "$44.4B",
        currency: "Bahraini dinar",
        languages: "Arabic",
        lat: 25.9304,
        lng: 50.6378
    },
    {
        name: "Bangladesh",
        official_name: "People's Republic of Bangladesh",
        iso2: "BD",
        iso3: "BGD",
        capital: "Dhaka",
        continent: "Asia",
        region: "Southern Asia",
        population: "169.4M",
        area_km2: "147570",
        gdp_usd: "$460.2B",
        currency: "Bangladeshi taka",
        languages: "Bengali",
        lat: 23.6849,
        lng: 90.3563
    },
    {
        name: "Barbados",
        official_name: "Barbados",
        iso2: "BB",
        iso3: "BRB",
        capital: "Bridgetown",
        continent: "North America",
        region: "Caribbean",
        population: "281K",
        area_km2: "430",
        gdp_usd: "$6.1B",
        currency: "Barbadian dollar",
        languages: "English",
        lat: 13.1939,
        lng: -59.5432
    },
    {
        name: "Belarus",
        official_name: "Republic of Belarus",
        iso2: "BY",
        iso3: "BLR",
        capital: "Minsk",
        continent: "Europe",
        region: "Eastern Europe",
        population: "9.4M",
        area_km2: "207600",
        gdp_usd: "$73.1B",
        currency: "Belarusian ruble",
        languages: "Belarusian, Russian",
        lat: 53.7098,
        lng: 27.9534
    },
    {
        name: "Belgium",
        official_name: "Kingdom of Belgium",
        iso2: "BE",
        iso3: "BEL",
        capital: "Brussels",
        continent: "Europe",
        region: "Western Europe",
        population: "11.6M",
        area_km2: "30528",
        gdp_usd: "$578.6B",
        currency: "Euro",
        languages: "Dutch, French, German",
        lat: 50.5039,
        lng: 4.4699
    },
    {
        name: "Belize",
        official_name: "Belize",
        iso2: "BZ",
        iso3: "BLZ",
        capital: "Belmopan",
        continent: "North America",
        region: "Central America",
        population: "405K",
        area_km2: "22966",
        gdp_usd: "$2.5B",
        currency: "Belize dollar",
        languages: "English",
        lat: 17.1899,
        lng: -88.4976
    },
    {
        name: "Benin",
        official_name: "Republic of Benin",
        iso2: "BJ",
        iso3: "BEN",
        capital: "Porto-Novo",
        continent: "Africa",
        region: "Western Africa",
        population: "13.4M",
        area_km2: "112622",
        gdp_usd: "$17.4B",
        currency: "West African CFA franc",
        languages: "French",
        lat: 9.3077,
        lng: 2.3158
    },
    {
        name: "Bhutan",
        official_name: "Kingdom of Bhutan",
        iso2: "BT",
        iso3: "BTN",
        capital: "Thimphu",
        continent: "Asia",
        region: "Southern Asia",
        population: "782K",
        area_km2: "38394",
        gdp_usd: "$2.5B",
        currency: "Bhutanese ngultrum",
        languages: "Dzongkha",
        lat: 27.5142,
        lng: 90.4336
    },
    {
        name: "Bolivia",
        official_name: "Plurinational State of Bolivia",
        iso2: "BO",
        iso3: "BOL",
        capital: "Sucre",
        continent: "South America",
        region: "South America",
        population: "12.2M",
        area_km2: "1098581",
        gdp_usd: "$44.0B",
        currency: "Boliviano",
        languages: "Spanish, Quechua, Aymara",
        lat: -16.2902,
        lng: -63.5887
    },
    {
        name: "Bosnia and Herzegovina",
        official_name: "Bosnia and Herzegovina",
        iso2: "BA",
        iso3: "BIH",
        capital: "Sarajevo",
        continent: "Europe",
        region: "Southern Europe",
        population: "3.2M",
        area_km2: "51197",
        gdp_usd: "$22.6B",
        currency: "Bosnia and Herzegovina convertible mark",
        languages: "Bosnian, Croatian, Serbian",
        lat: 43.9159,
        lng: 17.6791
    },
    {
        name: "Botswana",
        official_name: "Republic of Botswana",
        iso2: "BW",
        iso3: "BWA",
        capital: "Gaborone",
        continent: "Africa",
        region: "Southern Africa",
        population: "2.6M",
        area_km2: "581730",
        gdp_usd: "$18.3B",
        currency: "Botswana pula",
        languages: "English, Tswana",
        lat: -22.3285,
        lng: 24.6849
    },
    {
        name: "Brazil",
        official_name: "Federative Republic of Brazil",
        iso2: "BR",
        iso3: "BRA",
        capital: "Brasília",
        continent: "South America",
        region: "South America",
        population: "215.3M",
        area_km2: "8515767",
        gdp_usd: "$1.9T",
        currency: "Brazilian real",
        languages: "Portuguese",
        lat: -14.2350,
        lng: -51.9253
    },
    {
        name: "Brunei",
        official_name: "Brunei Darussalam",
        iso2: "BN",
        iso3: "BRN",
        capital: "Bandar Seri Begawan",
        continent: "Asia",
        region: "South-Eastern Asia",
        population: "449K",
        area_km2: "5765",
        gdp_usd: "$14.0B",
        currency: "Brunei dollar",
        languages: "Malay, English",
        lat: 4.5353,
        lng: 114.7277
    },
    {
        name: "Bulgaria",
        official_name: "Republic of Bulgaria",
        iso2: "BG",
        iso3: "BGR",
        capital: "Sofia",
        continent: "Europe",
        region: "Eastern Europe",
        population: "6.4M",
        area_km2: "110879",
        gdp_usd: "$89.5B",
        currency: "Bulgarian lev",
        languages: "Bulgarian",
        lat: 42.7339,
        lng: 25.4858
    },
    {
        name: "Burkina Faso",
        official_name: "Burkina Faso",
        iso2: "BF",
        iso3: "BFA",
        capital: "Ouagadougou",
        continent: "Africa",
        region: "Western Africa",
        population: "22.7M",
        area_km2: "274200",
        gdp_usd: "$19.7B",
        currency: "West African CFA franc",
        languages: "French",
        lat: 12.2383,
        lng: -1.5616
    },
    {
        name: "Burundi",
        official_name: "Republic of Burundi",
        iso2: "BI",
        iso3: "BDI",
        capital: "Gitega",
        continent: "Africa",
        region: "Eastern Africa",
        population: "12.9M",
        area_km2: "27834",
        gdp_usd: "$3.1B",
        currency: "Burundian franc",
        languages: "Kirundi, French",
        lat: -3.3731,
        lng: 29.9189
    },
    {
        name: "Cambodia",
        official_name: "Kingdom of Cambodia",
        iso2: "KH",
        iso3: "KHM",
        capital: "Phnom Penh",
        continent: "Asia",
        region: "South-Eastern Asia",
        population: "16.9M",
        area_km2: "181035",
        gdp_usd: "$29.6B",
        currency: "Cambodian riel",
        languages: "Khmer",
        lat: 12.5657,
        lng: 104.9910
    },
    {
        name: "Cameroon",
        official_name: "Republic of Cameroon",
        iso2: "CM",
        iso3: "CMR",
        capital: "Yaoundé",
        continent: "Africa",
        region: "Middle Africa",
        population: "27.9M",
        area_km2: "475442",
        gdp_usd: "$44.3B",
        currency: "Central African CFA franc",
        languages: "French, English",
        lat: 7.3697,
        lng: 12.3547
    },
    {
        name: "Canada",
        official_name: "Canada",
        iso2: "CA",
        iso3: "CAN",
        capital: "Ottawa",
        continent: "North America",
        region: "Northern America",
        population: "38.9M",
        area_km2: "9984670",
        gdp_usd: "$2.1T",
        currency: "Canadian dollar",
        languages: "English, French",
        lat: 56.1304,
        lng: -106.3468
    },
    {
        name: "Cape Verde",
        official_name: "Republic of Cabo Verde",
        iso2: "CV",
        iso3: "CPV",
        capital: "Praia",
        continent: "Africa",
        region: "Western Africa",
        population: "593K",
        area_km2: "4033",
        gdp_usd: "$2.0B",
        currency: "Cape Verdean escudo",
        languages: "Portuguese",
        lat: 16.0021,
        lng: -24.0132
    },
    {
        name: "Central African Republic",
        official_name: "Central African Republic",
        iso2: "CF",
        iso3: "CAF",
        capital: "Bangui",
        continent: "Africa",
        region: "Middle Africa",
        population: "5.6M",
        area_km2: "622984",
        gdp_usd: "$2.4B",
        currency: "Central African CFA franc",
        languages: "French, Sango",
        lat: 6.6111,
        lng: 20.9394
    },
    {
        name: "Chad",
        official_name: "Republic of Chad",
        iso2: "TD",
        iso3: "TCD",
        capital: "N'Djamena",
        continent: "Africa",
        region: "Middle Africa",
        population: "17.7M",
        area_km2: "1284000",
        gdp_usd: "$11.8B",
        currency: "Central African CFA franc",
        languages: "French, Arabic",
        lat: 15.4542,
        lng: 18.7322
    },
    {
        name: "Chile",
        official_name: "Republic of Chile",
        iso2: "CL",
        iso3: "CHL",
        capital: "Santiago",
        continent: "South America",
        region: "South America",
        population: "19.5M",
        area_km2: "756102",
        gdp_usd: "$300.7B",
        currency: "Chilean peso",
        languages: "Spanish",
        lat: -35.6751,
        lng: -71.5430
    },
    {
        name: "China",
        official_name: "People's Republic of China",
        iso2: "CN",
        iso3: "CHN",
        capital: "Beijing",
        continent: "Asia",
        region: "Eastern Asia",
        population: "1.41B",
        area_km2: "9596961",
        gdp_usd: "$17.9T",
        currency: "Renminbi",
        languages: "Standard Chinese",
        lat: 35.8617,
        lng: 104.1954
    },
    {
        name: "Colombia",
        official_name: "Republic of Colombia",
        iso2: "CO",
        iso3: "COL",
        capital: "Bogotá",
        continent: "South America",
        region: "South America",
        population: "51.9M",
        area_km2: "1141748",
        gdp_usd: "$334.7B",
        currency: "Colombian peso",
        languages: "Spanish",
        lat: 4.5709,
        lng: -74.2973
    },
    {
        name: "Comoros",
        official_name: "Union of the Comoros",
        iso2: "KM",
        iso3: "COM",
        capital: "Moroni",
        continent: "Africa",
        region: "Eastern Africa",
        population: "836K",
        area_km2: "1862",
        gdp_usd: "$1.3B",
        currency: "Comorian franc",
        languages: "Comorian, French, Arabic",
        lat: -11.6455,
        lng: 43.3333
    },
    {
        name: "Congo (Brazzaville)",
        official_name: "Republic of the Congo",
        iso2: "CG",
        iso3: "COG",
        capital: "Brazzaville",
        continent: "Africa",
        region: "Middle Africa",
        population: "6.1M",
        area_km2: "342000",
        gdp_usd: "$13.5B",
        currency: "Central African CFA franc",
        languages: "French",
        lat: -0.2280,
        lng: 15.8277
    },
    {
        name: "Congo (Kinshasa)",
        official_name: "Democratic Republic of the Congo",
        iso2: "CD",
        iso3: "COD",
        capital: "Kinshasa",
        continent: "Africa",
        region: "Middle Africa",
        population: "102.3M",
        area_km2: "2344858",
        gdp_usd: "$55.4B",
        currency: "Congolese franc",
        languages: "French",
        lat: -4.0383,
        lng: 21.7587
    },
    {
        name: "Costa Rica",
        official_name: "Republic of Costa Rica",
        iso2: "CR",
        iso3: "CRI",
        capital: "San José",
        continent: "North America",
        region: "Central America",
        population: "5.2M",
        area_km2: "51100",
        gdp_usd: "$68.4B",
        currency: "Costa Rican colón",
        languages: "Spanish",
        lat: 9.7489,
        lng: -83.7534
    },
    {
        name: "Croatia",
        official_name: "Republic of Croatia",
        iso2: "HR",
        iso3: "HRV",
        capital: "Zagreb",
        continent: "Europe",
        region: "Southern Europe",
        population: "3.8M",
        area_km2: "56594",
        gdp_usd: "$71.3B",
        currency: "Euro",
        languages: "Croatian",
        lat: 45.1000,
        lng: 15.2000
    },
    {
        name: "Cuba",
        official_name: "Republic of Cuba",
        iso2: "CU",
        iso3: "CUB",
        capital: "Havana",
        continent: "North America",
        region: "Caribbean",
        population: "11.1M",
        area_km2: "109884",
        gdp_usd: "$107.4B",
        currency: "Cuban peso",
        languages: "Spanish",
        lat: 21.5218,
        lng: -77.7812
    },
    {
        name: "Cyprus",
        official_name: "Republic of Cyprus",
        iso2: "CY",
        iso3: "CYP",
        capital: "Nicosia",
        continent: "Europe",
        region: "Southern Europe",
        population: "1.3M",
        area_km2: "9251",
        gdp_usd: "$28.5B",
        currency: "Euro",
        languages: "Greek, Turkish",
        lat: 35.1264,
        lng: 33.4299
    },
    {
        name: "Czechia",
        official_name: "Czech Republic",
        iso2: "CZ",
        iso3: "CZE",
        capital: "Prague",
        continent: "Europe",
        region: "Central Europe",
        population: "10.5M",
        area_km2: "78867",
        gdp_usd: "$290.9B",
        currency: "Czech koruna",
        languages: "Czech",
        lat: 49.8175,
        lng: 15.4730
    },
    {
        name: "Denmark",
        official_name: "Kingdom of Denmark",
        iso2: "DK",
        iso3: "DNK",
        capital: "Copenhagen",
        continent: "Europe",
        region: "Northern Europe",
        population: "5.9M",
        area_km2: "43094",
        gdp_usd: "$395.4B",
        currency: "Danish krone",
        languages: "Danish",
        lat: 56.2639,
        lng: 9.5018
    },
    {
        name: "Djibouti",
        official_name: "Republic of Djibouti",
        iso2: "DJ",
        iso3: "DJI",
        capital: "Djibouti",
        continent: "Africa",
        region: "Eastern Africa",
        population: "1.1M",
        area_km2: "23200",
        gdp_usd: "$3.4B",
        currency: "Djiboutian franc",
        languages: "French, Arabic",
        lat: 11.5890,
        lng: 43.1456
    },
    {
        name: "Dominica",
        official_name: "Commonwealth of Dominica",
        iso2: "DM",
        iso3: "DMA",
        capital: "Roseau",
        continent: "North America",
        region: "Caribbean",
        population: "72K",
        area_km2: "751",
        gdp_usd: "$632M",
        currency: "East Caribbean dollar",
        languages: "English",
        lat: 15.4150,
        lng: -61.3710
    },
    {
        name: "Dominican Republic",
        official_name: "Dominican Republic",
        iso2: "DO",
        iso3: "DOM",
        capital: "Santo Domingo",
        continent: "North America",
        region: "Caribbean",
        population: "11.2M",
        area_km2: "48671",
        gdp_usd: "$113.6B",
        currency: "Dominican peso",
        languages: "Spanish",
        lat: 18.7357,
        lng: -70.1627
    },
    {
        name: "Ecuador",
        official_name: "Republic of Ecuador",
        iso2: "EC",
        iso3: "ECU",
        capital: "Quito",
        continent: "South America",
        region: "South America",
        population: "18.0M",
        area_km2: "276841",
        gdp_usd: "$115.0B",
        currency: "United States dollar",
        languages: "Spanish",
        lat: -1.8312,
        lng: -78.1834
    },
    {
        name: "Egypt",
        official_name: "Arab Republic of Egypt",
        iso2: "EG",
        iso3: "EGY",
        capital: "Cairo",
        continent: "Africa",
        region: "Northern Africa",
        population: "109.3M",
        area_km2: "1002450",
        gdp_usd: "$476.7B",
        currency: "Egyptian pound",
        languages: "Arabic",
        lat: 26.8206,
        lng: 30.8025
    },
    {
        name: "El Salvador",
        official_name: "Republic of El Salvador",
        iso2: "SV",
        iso3: "SLV",
        capital: "San Salvador",
        continent: "North America",
        region: "Central America",
        population: "6.3M",
        area_km2: "21041",
        gdp_usd: "$32.5B",
        currency: "United States dollar",
        languages: "Spanish",
        lat: 13.7942,
        lng: -88.8965
    },
    {
        name: "Equatorial Guinea",
        official_name: "Republic of Equatorial Guinea",
        iso2: "GQ",
        iso3: "GNQ",
        capital: "Malabo",
        continent: "Africa",
        region: "Middle Africa",
        population: "1.7M",
        area_km2: "28051",
        gdp_usd: "$12.5B",
        currency: "Central African CFA franc",
        languages: "Spanish, French, Portuguese",
        lat: 1.6508,
        lng: 10.2679
    },
    {
        name: "Eritrea",
        official_name: "State of Eritrea",
        iso2: "ER",
        iso3: "ERI",
        capital: "Asmara",
        continent: "Africa",
        region: "Eastern Africa",
        population: "3.7M",
        area_km2: "117600",
        gdp_usd: "$2.1B",
        currency: "Eritrean nakfa",
        languages: "Tigrinya, Arabic, English",
        lat: 15.1794,
        lng: 39.7823
    },
    {
        name: "Estonia",
        official_name: "Republic of Estonia",
        iso2: "EE",
        iso3: "EST",
        capital: "Tallinn",
        continent: "Europe",
        region: "Northern Europe",
        population: "1.4M",
        area_km2: "45228",
        gdp_usd: "$38.1B",
        currency: "Euro",
        languages: "Estonian",
        lat: 58.5953,
        lng: 25.0136
    },
    {
        name: "Eswatini",
        official_name: "Kingdom of Eswatini",
        iso2: "SZ",
        iso3: "SWZ",
        capital: "Mbabane",
        continent: "Africa",
        region: "Southern Africa",
        population: "1.2M",
        area_km2: "17364",
        gdp_usd: "$4.7B",
        currency: "Lilangeni",
        languages: "English, Swazi",
        lat: -26.5225,
        lng: 31.4659
    },
    {
        name: "Ethiopia",
        official_name: "Federal Democratic Republic of Ethiopia",
        iso2: "ET",
        iso3: "ETH",
        capital: "Addis Ababa",
        continent: "Africa",
        region: "Eastern Africa",
        population: "126.5M",
        area_km2: "1104300",
        gdp_usd: "$126.8B",
        currency: "Ethiopian birr",
        languages: "Amharic",
        lat: 9.1450,
        lng: 40.4897
    },
    {
        name: "Fiji",
        official_name: "Republic of Fiji",
        iso2: "FJ",
        iso3: "FJI",
        capital: "Suva",
        continent: "Oceania",
        region: "Melanesia",
        population: "929K",
        area_km2: "18274",
        gdp_usd: "$5.0B",
        currency: "Fijian dollar",
        languages: "English, Fijian, Hindi",
        lat: -17.7134,
        lng: 178.0650
    },
    {
        name: "Finland",
        official_name: "Republic of Finland",
        iso2: "FI",
        iso3: "FIN",
        capital: "Helsinki",
        continent: "Europe",
        region: "Northern Europe",
        population: "5.5M",
        area_km2: "338424",
        gdp_usd: "$297.3B",
        currency: "Euro",
        languages: "Finnish, Swedish",
        lat: 61.9241,
        lng: 25.7482
    },
    {
        name: "France",
        official_name: "French Republic",
        iso2: "FR",
        iso3: "FRA",
        capital: "Paris",
        continent: "Europe",
        region: "Western Europe",
        population: "68.0M",
        area_km2: "640679",
        gdp_usd: "$2.8T",
        currency: "Euro",
        languages: "French",
        lat: 46.6034,
        lng: 1.8883
    },
    {
        name: "Gabon",
        official_name: "Gabonese Republic",
        iso2: "GA",
        iso3: "GAB",
        capital: "Libreville",
        continent: "Africa",
        region: "Middle Africa",
        population: "2.4M",
        area_km2: "267668",
        gdp_usd: "$20.2B",
        currency: "Central African CFA franc",
        languages: "French",
        lat: -0.8037,
        lng: 11.6094
    },
    {
        name: "Gambia",
        official_name: "Republic of the Gambia",
        iso2: "GM",
        iso3: "GMB",
        capital: "Banjul",
        continent: "Africa",
        region: "Western Africa",
        population: "2.7M",
        area_km2: "10689",
        gdp_usd: "$2.0B",
        currency: "Dalasi",
        languages: "English",
        lat: 13.4432,
        lng: -15.3101
    },
    {
        name: "Georgia",
        official_name: "Georgia",
        iso2: "GE",
        iso3: "GEO",
        capital: "Tbilisi",
        continent: "Asia",
        region: "Western Asia",
        population: "3.7M",
        area_km2: "69700",
        gdp_usd: "$24.6B",
        currency: "Georgian lari",
        languages: "Georgian",
        lat: 42.3154,
        lng: 43.3569
    },
    {
        name: "Germany",
        official_name: "Federal Republic of Germany",
        iso2: "DE",
        iso3: "DEU",
        capital: "Berlin",
        continent: "Europe",
        region: "Western Europe",
        population: "84.4M",
        area_km2: "357022",
        gdp_usd: "$4.1T",
        currency: "Euro",
        languages: "German",
        lat: 51.1657,
        lng: 10.4515
    },
    {
        name: "Ghana",
        official_name: "Republic of Ghana",
        iso2: "GH",
        iso3: "GHA",
        capital: "Accra",
        continent: "Africa",
        region: "Western Africa",
        population: "33.5M",
        area_km2: "238533",
        gdp_usd: "$72.8B",
        currency: "Ghanaian cedi",
        languages: "English",
        lat: 7.9465,
        lng: -1.0232
    },
    {
        name: "Greece",
        official_name: "Hellenic Republic",
        iso2: "GR",
        iso3: "GRC",
        capital: "Athens",
        continent: "Europe",
        region: "Southern Europe",
        population: "10.4M",
        area_km2: "131957",
        gdp_usd: "$219.1B",
        currency: "Euro",
        languages: "Greek",
        lat: 39.0742,
        lng: 21.8243
    },
    {
        name: "Grenada",
        official_name: "Grenada",
        iso2: "GD",
        iso3: "GRD",
        capital: "St. George's",
        continent: "North America",
        region: "Caribbean",
        population: "126K",
        area_km2: "344",
        gdp_usd: "$1.2B",
        currency: "East Caribbean dollar",
        languages: "English",
        lat: 12.1165,
        lng: -61.6790
    },
    {
        name: "Guatemala",
        official_name: "Republic of Guatemala",
        iso2: "GT",
        iso3: "GTM",
        capital: "Guatemala City",
        continent: "North America",
        region: "Central America",
        population: "17.6M",
        area_km2: "108889",
        gdp_usd: "$95.0B",
        currency: "Guatemalan quetzal",
        languages: "Spanish",
        lat: 15.7835,
        lng: -90.2308
    },
    {
        name: "Guinea",
        official_name: "Republic of Guinea",
        iso2: "GN",
        iso3: "GIN",
        capital: "Conakry",
        continent: "Africa",
        region: "Western Africa",
        population: "13.9M",
        area_km2: "245857",
        gdp_usd: "$16.1B",
        currency: "Guinean franc",
        languages: "French",
        lat: 9.9456,
        lng: -9.6966
    },
    {
        name: "Guinea-Bissau",
        official_name: "Republic of Guinea-Bissau",
        iso2: "GW",
        iso3: "GNB",
        capital: "Bissau",
        continent: "Africa",
        region: "Western Africa",
        population: "2.1M",
        area_km2: "36125",
        gdp_usd: "$1.6B",
        currency: "West African CFA franc",
        languages: "Portuguese",
        lat: 11.8037,
        lng: -15.1804
    },
    {
        name: "Guyana",
        official_name: "Co-operative Republic of Guyana",
        iso2: "GY",
        iso3: "GUY",
        capital: "Georgetown",
        continent: "South America",
        region: "South America",
        population: "808K",
        area_km2: "21496",
        gdp_usd: "$14.2B",
        currency: "Guyanese dollar",
        languages: "English",
        lat: 4.8606,
        lng: -58.9302
    },
    {
        name: "Haiti",
        official_name: "Republic of Haiti",
        iso2: "HT",
        iso3: "HTI",
        capital: "Port-au-Prince",
        continent: "North America",
        region: "Caribbean",
        population: "11.7M",
        area_km2: "27750",
        gdp_usd: "$20.3B",
        currency: "Haitian gourde",
        languages: "French, Haitian Creole",
        lat: 18.9712,
        lng: -72.2852
    },
    {
        name: "Honduras",
        official_name: "Republic of Honduras",
        iso2: "HN",
        iso3: "HND",
        capital: "Tegucigalpa",
        continent: "North America",
        region: "Central America",
        population: "10.4M",
        area_km2: "112492",
        gdp_usd: "$31.7B",
        currency: "Honduran lempira",
        languages: "Spanish",
        lat: 15.1998,
        lng: -86.2419
    },
    {
        name: "Hungary",
        official_name: "Hungary",
        iso2: "HU",
        iso3: "HUN",
        capital: "Budapest",
        continent: "Europe",
        region: "Central Europe",
        population: "9.6M",
        area_km2: "93028",
        gdp_usd: "$188.4B",
        currency: "Hungarian forint",
        languages: "Hungarian",
        lat: 47.1625,
        lng: 19.5033
    },
    {
        name: "Iceland",
        official_name: "Republic of Iceland",
        iso2: "IS",
        iso3: "ISL",
        capital: "Reykjavik",
        continent: "Europe",
        region: "Northern Europe",
        population: "375K",
        area_km2: "103000",
        gdp_usd: "$27.8B",
        currency: "Icelandic króna",
        languages: "Icelandic",
        lat: 64.9631,
        lng: -19.0208
    },
    {
        name: "India",
        official_name: "Republic of India",
        iso2: "IN",
        iso3: "IND",
        capital: "New Delhi",
        continent: "Asia",
        region: "Southern Asia",
        population: "1.42B",
        area_km2: "3287263",
        gdp_usd: "$3.4T",
        currency: "Indian rupee",
        languages: "Hindi, English",
        lat: 20.5937,
        lng: 78.9629
    },
    {
        name: "Indonesia",
        official_name: "Republic of Indonesia",
        iso2: "ID",
        iso3: "IDN",
        capital: "Jakarta",
        continent: "Asia",
        region: "South-Eastern Asia",
        population: "275.5M",
        area_km2: "1904569",
        gdp_usd: "$1.3T",
        currency: "Indonesian rupiah",
        languages: "Indonesian",
        lat: -0.7893,
        lng: 113.9213
    },
    {
        name: "Iran",
        official_name: "Islamic Republic of Iran",
        iso2: "IR",
        iso3: "IRN",
        capital: "Tehran",
        continent: "Asia",
        region: "Southern Asia",
        population: "87.9M",
        area_km2: "1648195",
        gdp_usd: "$388.5B",
        currency: "Iranian rial",
        languages: "Persian",
        lat: 32.4279,
        lng: 53.6880
    },
    {
        name: "Iraq",
        official_name: "Republic of Iraq",
        iso2: "IQ",
        iso3: "IRQ",
        capital: "Baghdad",
        continent: "Asia",
        region: "Western Asia",
        population: "43.5M",
        area_km2: "438317",
        gdp_usd: "$264.2B",
        currency: "Iraqi dinar",
        languages: "Arabic, Kurdish",
        lat: 33.2232,
        lng: 43.6793
    },
    {
        name: "Ireland",
        official_name: "Republic of Ireland",
        iso2: "IE",
        iso3: "IRL",
        capital: "Dublin",
        continent: "Europe",
        region: "Northern Europe",
        population: "5.1M",
        area_km2: "70273",
        gdp_usd: "$529.2B",
        currency: "Euro",
        languages: "English, Irish",
        lat: 53.1424,
        lng: -7.6921
    },
    {
        name: "Israel",
        official_name: "State of Israel",
        iso2: "IL",
        iso3: "ISR",
        capital: "Jerusalem",
        continent: "Asia",
        region: "Western Asia",
        population: "9.6M",
        area_km2: "20770",
        gdp_usd: "$525.0B",
        currency: "Israeli new shekel",
        languages: "Hebrew, Arabic",
        lat: 31.0461,
        lng: 34.8516
    },
    {
        name: "Italy",
        official_name: "Italian Republic",
        iso2: "IT",
        iso3: "ITA",
        capital: "Rome",
        continent: "Europe",
        region: "Southern Europe",
        population: "58.9M",
        area_km2: "301340",
        gdp_usd: "$2.0T",
        currency: "Euro",
        languages: "Italian",
        lat: 41.8719,
        lng: 12.5674
    },
    {
        name: "Ivory Coast",
        official_name: "Republic of Côte d'Ivoire",
        iso2: "CI",
        iso3: "CIV",
        capital: "Yamoussoukro",
        continent: "Africa",
        region: "Western Africa",
        population: "28.2M",
        area_km2: "322463",
        gdp_usd: "$70.0B",
        currency: "West African CFA franc",
        languages: "French",
        lat: 7.5400,
        lng: -5.5471
    },
    {
        name: "Jamaica",
        official_name: "Jamaica",
        iso2: "JM",
        iso3: "JAM",
        capital: "Kingston",
        continent: "North America",
        region: "Caribbean",
        population: "2.8M",
        area_km2: "10991",
        gdp_usd: "$17.1B",
        currency: "Jamaican dollar",
        languages: "English",
        lat: 18.1096,
        lng: -77.2975
    },
    {
        name: "Japan",
        official_name: "State of Japan",
        iso2: "JP",
        iso3: "JPN",
        capital: "Tokyo",
        continent: "Asia",
        region: "Eastern Asia",
        population: "125.1M",
        area_km2: "377975",
        gdp_usd: "$4.2T",
        currency: "Japanese yen",
        languages: "Japanese",
        lat: 36.2048,
        lng: 138.2529
    },
    {
        name: "Jordan",
        official_name: "Hashemite Kingdom of Jordan",
        iso2: "JO",
        iso3: "JOR",
        capital: "Amman",
        continent: "Asia",
        region: "Western Asia",
        population: "11.3M",
        area_km2: "89342",
        gdp_usd: "$47.5B",
        currency: "Jordanian dinar",
        languages: "Arabic",
        lat: 30.5852,
        lng: 36.2384
    },
    {
        name: "Kazakhstan",
        official_name: "Republic of Kazakhstan",
        iso2: "KZ",
        iso3: "KAZ",
        capital: "Astana",
        continent: "Asia",
        region: "Central Asia",
        population: "19.4M",
        area_km2: "2724900",
        gdp_usd: "$220.6B",
        currency: "Kazakhstani tenge",
        languages: "Kazakh, Russian",
        lat: 48.0196,
        lng: 66.9237
    },
    {
        name: "Kenya",
        official_name: "Republic of Kenya",
        iso2: "KE",
        iso3: "KEN",
        capital: "Nairobi",
        continent: "Africa",
        region: "Eastern Africa",
        population: "55.1M",
        area_km2: "580367",
        gdp_usd: "$113.4B",
        currency: "Kenyan shilling",
        languages: "Swahili, English",
        lat: -0.0236,
        lng: 37.9062
    },
    {
        name: "Kiribati",
        official_name: "Republic of Kiribati",
        iso2: "KI",
        iso3: "KIR",
        capital: "South Tarawa",
        continent: "Oceania",
        region: "Micronesia",
        population: "133K",
        area_km2: "811",
        gdp_usd: "$222M",
        currency: "Kiribati dollar",
        languages: "English, Gilbertese",
        lat: 1.8709,
        lng: -157.3634
    },
    {
        name: "Kuwait",
        official_name: "State of Kuwait",
        iso2: "KW",
        iso3: "KWT",
        capital: "Kuwait City",
        continent: "Asia",
        region: "Western Asia",
        population: "4.3M",
        area_km2: "17818",
        gdp_usd: "$184.6B",
        currency: "Kuwaiti dinar",
        languages: "Arabic",
        lat: 29.3117,
        lng: 47.4818
    },
    {
        name: "Kyrgyzstan",
        official_name: "Kyrgyz Republic",
        iso2: "KG",
        iso3: "KGZ",
        capital: "Bishkek",
        continent: "Asia",
        region: "Central Asia",
        population: "6.7M",
        area_km2: "199951",
        gdp_usd: "$10.9B",
        currency: "Kyrgyzstani som",
        languages: "Kyrgyz, Russian",
        lat: 41.2044,
        lng: 74.7661
    },
    {
        name: "Laos",
        official_name: "Lao People's Democratic Republic",
        iso2: "LA",
        iso3: "LAO",
        capital: "Vientiane",
        continent: "Asia",
        region: "South-Eastern Asia",
        population: "7.5M",
        area_km2: "236800",
        gdp_usd: "$14.1B",
        currency: "Lao kip",
        languages: "Lao",
        lat: 19.8563,
        lng: 102.4955
    },
    {
        name: "Latvia",
        official_name: "Republic of Latvia",
        iso2: "LV",
        iso3: "LVA",
        capital: "Riga",
        continent: "Europe",
        region: "Northern Europe",
        population: "1.8M",
        area_km2: "64589",
        gdp_usd: "$41.2B",
        currency: "Euro",
        languages: "Latvian",
        lat: 56.8796,
        lng: 24.6032
    },
    {
        name: "Lebanon",
        official_name: "Lebanese Republic",
        iso2: "LB",
        iso3: "LBN",
        capital: "Beirut",
        continent: "Asia",
        region: "Western Asia",
        population: "5.5M",
        area_km2: "10452",
        gdp_usd: "$18.3B",
        currency: "Lebanese pound",
        languages: "Arabic",
        lat: 33.8547,
        lng: 35.8623
    },
    {
        name: "Lesotho",
        official_name: "Kingdom of Lesotho",
        iso2: "LS",
        iso3: "LSO",
        capital: "Maseru",
        continent: "Africa",
        region: "Southern Africa",
        population: "2.3M",
        area_km2: "30355",
        gdp_usd: "$2.5B",
        currency: "Loti",
        languages: "Sesotho, English",
        lat: -29.6099,
        lng: 28.2336
    },
    {
        name: "Liberia",
        official_name: "Republic of Liberia",
        iso2: "LR",
        iso3: "LBR",
        capital: "Monrovia",
        continent: "Africa",
        region: "Western Africa",
        population: "5.4M",
        area_km2: "111369",
        gdp_usd: "$4.1B",
        currency: "Liberian dollar",
        languages: "English",
        lat: 6.4281,
        lng: -9.4295
    },
    {
        name: "Libya",
        official_name: "State of Libya",
        iso2: "LY",
        iso3: "LBY",
        capital: "Tripoli",
        continent: "Africa",
        region: "Northern Africa",
        population: "7.0M",
        area_km2: "1759540",
        gdp_usd: "$42.8B",
        currency: "Libyan dinar",
        languages: "Arabic",
        lat: 26.3351,
        lng: 17.2283
    },
    {
        name: "Liechtenstein",
        official_name: "Principality of Liechtenstein",
        iso2: "LI",
        iso3: "LIE",
        capital: "Vaduz",
        continent: "Europe",
        region: "Western Europe",
        population: "39K",
        area_km2: "160",
        gdp_usd: "$6.2B",
        currency: "Swiss franc",
        languages: "German",
        lat: 47.1660,
        lng: 9.5554
    },
    {
        name: "Lithuania",
        official_name: "Republic of Lithuania",
        iso2: "LT",
        iso3: "LTU",
        capital: "Vilnius",
        continent: "Europe",
        region: "Northern Europe",
        population: "2.8M",
        area_km2: "65300",
        gdp_usd: "$67.4B",
        currency: "Euro",
        languages: "Lithuanian",
        lat: 55.1694,
        lng: 23.8813
    },
    {
        name: "Luxembourg",
        official_name: "Grand Duchy of Luxembourg",
        iso2: "LU",
        iso3: "LUX",
        capital: "Luxembourg",
        continent: "Europe",
        region: "Western Europe",
        population: "655K",
        area_km2: "2586",
        gdp_usd: "$82.2B",
        currency: "Euro",
        languages: "Luxembourgish, French, German",
        lat: 49.8153,
        lng: 6.1296
    },
    {
        name: "Madagascar",
        official_name: "Republic of Madagascar",
        iso2: "MG",
        iso3: "MDG",
        capital: "Antananarivo",
        continent: "Africa",
        region: "Eastern Africa",
        population: "29.6M",
        area_km2: "587041",
        gdp_usd: "$14.5B",
        currency: "Malagasy ariary",
        languages: "Malagasy, French",
        lat: -18.7669,
        lng: 46.8691
    },
    {
        name: "Malawi",
        official_name: "Republic of Malawi",
        iso2: "MW",
        iso3: "MWI",
        capital: "Lilongwe",
        continent: "Africa",
        region: "Eastern Africa",
        population: "20.4M",
        area_km2: "118484",
        gdp_usd: "$12.6B",
        currency: "Malawian kwacha",
        languages: "English, Chichewa",
        lat: -13.2543,
        lng: 34.3015
    },
    {
        name: "Malaysia",
        official_name: "Malaysia",
        iso2: "MY",
        iso3: "MYS",
        capital: "Kuala Lumpur",
        continent: "Asia",
        region: "South-Eastern Asia",
        population: "33.9M",
        area_km2: "329847",
        gdp_usd: "$407.0B",
        currency: "Malaysian ringgit",
        languages: "Malay",
        lat: 4.2105,
        lng: 101.9758
    },
    {
        name: "Maldives",
        official_name: "Republic of Maldives",
        iso2: "MV",
        iso3: "MDV",
        capital: "Malé",
        continent: "Asia",
        region: "Southern Asia",
        population: "521K",
        area_km2: "298",
        gdp_usd: "$5.4B",
        currency: "Maldivian rufiyaa",
        languages: "Dhivehi",
        lat: 3.2028,
        lng: 73.2207
    },
    {
        name: "Mali",
        official_name: "Republic of Mali",
        iso2: "ML",
        iso3: "MLI",
        capital: "Bamako",
        continent: "Africa",
        region: "Western Africa",
        population: "22.6M",
        area_km2: "1240192",
        gdp_usd: "$19.1B",
        currency: "West African CFA franc",
        languages: "French",
        lat: 17.5707,
        lng: -4.0000
    },
    {
        name: "Malta",
        official_name: "Republic of Malta",
        iso2: "MT",
        iso3: "MLT",
        capital: "Valletta",
        continent: "Europe",
        region: "Southern Europe",
        population: "533K",
        area_km2: "316",
        gdp_usd: "$18.4B",
        currency: "Euro",
        languages: "Maltese, English",
        lat: 35.9375,
        lng: 14.3754
    },
    {
        name: "Marshall Islands",
        official_name: "Republic of the Marshall Islands",
        iso2: "MH",
        iso3: "MHL",
        capital: "Majuro",
        continent: "Oceania",
        region: "Micronesia",
        population: "42K",
        area_km2: "181",
        gdp_usd: "$271M",
        currency: "United States dollar",
        languages: "Marshallese, English",
        lat: 7.1315,
        lng: 171.1845
    },
    {
        name: "Mauritania",
        official_name: "Islamic Republic of Mauritania",
        iso2: "MR",
        iso3: "MRT",
        capital: "Nouakchott",
        continent: "Africa",
        region: "Western Africa",
        population: "4.9M",
        area_km2: "1030700",
        gdp_usd: "$9.7B",
        currency: "Ouguiya",
        languages: "Arabic",
        lat: 21.0079,
        lng: -10.9408
    },
    {
        name: "Mauritius",
        official_name: "Republic of Mauritius",
        iso2: "MU",
        iso3: "MUS",
        capital: "Port Louis",
        continent: "Africa",
        region: "Eastern Africa",
        population: "1.2M",
        area_km2: "2040",
        gdp_usd: "$13.2B",
        currency: "Mauritian rupee",
        languages: "English, French",
        lat: -20.3484,
        lng: 57.5522
    },
    {
        name: "Mexico",
        official_name: "United Mexican States",
        iso2: "MX",
        iso3: "MEX",
        capital: "Mexico City",
        continent: "North America",
        region: "Central America",
        population: "128.9M",
        area_km2: "1964375",
        gdp_usd: "$1.3T",
        currency: "Mexican peso",
        languages: "Spanish",
        lat: 23.6345,
        lng: -102.5528
    },
    {
        name: "Micronesia",
        official_name: "Federated States of Micronesia",
        iso2: "FM",
        iso3: "FSM",
        capital: "Palikir",
        continent: "Oceania",
        region: "Micronesia",
        population: "115K",
        area_km2: "702",
        gdp_usd: "$409M",
        currency: "United States dollar",
        languages: "English",
        lat: 7.4256,
        lng: 150.5508
    },
    {
        name: "Moldova",
        official_name: "Republic of Moldova",
        iso2: "MD",
        iso3: "MDA",
        capital: "Chișinău",
        continent: "Europe",
        region: "Eastern Europe",
        population: "2.6M",
        area_km2: "33846",
        gdp_usd: "$14.6B",
        currency: "Moldovan leu",
        languages: "Moldovan (Romanian)",
        lat: 47.4116,
        lng: 28.3699
    },
    {
        name: "Monaco",
        official_name: "Principality of Monaco",
        iso2: "MC",
        iso3: "MCO",
        capital: "Monaco",
        continent: "Europe",
        region: "Western Europe",
        population: "39K",
        area_km2: "2.0",
        gdp_usd: "$10.4B",
        currency: "Euro",
        languages: "French",
        lat: 43.7384,
        lng: 7.4246
    },
    {
        name: "Mongolia",
        official_name: "Mongolia",
        iso2: "MN",
        iso3: "MNG",
        capital: "Ulaanbaatar",
        continent: "Asia",
        region: "Eastern Asia",
        population: "3.4M",
        area_km2: "1564110",
        gdp_usd: "$17.2B",
        currency: "Mongolian tögrög",
        languages: "Mongolian",
        lat: 46.8625,
        lng: 103.8467
    },
    {
        name: "Montenegro",
        official_name: "Montenegro",
        iso2: "ME",
        iso3: "MNE",
        capital: "Podgorica",
        continent: "Europe",
        region: "Southern Europe",
        population: "616K",
        area_km2: "13812",
        gdp_usd: "$6.1B",
        currency: "Euro",
        languages: "Montenegrin",
        lat: 42.7087,
        lng: 19.3744
    },
    {
        name: "Morocco",
        official_name: "Kingdom of Morocco",
        iso2: "MA",
        iso3: "MAR",
        capital: "Rabat",
        continent: "Africa",
        region: "Northern Africa",
        population: "37.5M",
        area_km2: "446550",
        gdp_usd: "$134.2B",
        currency: "Moroccan dirham",
        languages: "Arabic, Berber",
        lat: 31.7917,
        lng: -7.0926
    },
    {
        name: "Mozambique",
        official_name: "Republic of Mozambique",
        iso2: "MZ",
        iso3: "MOZ",
        capital: "Maputo",
        continent: "Africa",
        region: "Eastern Africa",
        population: "33.9M",
        area_km2: "801590",
        gdp_usd: "$15.9B",
        currency: "Mozambican metical",
        languages: "Portuguese",
        lat: -18.6657,
        lng: 35.5296
    },
    {
        name: "Myanmar",
        official_name: "Republic of the Union of Myanmar",
        iso2: "MM",
        iso3: "MMR",
        capital: "Naypyidaw",
        continent: "Asia",
        region: "South-Eastern Asia",
        population: "54.4M",
        area_km2: "676578",
        gdp_usd: "$59.4B",
        currency: "Myanmar kyat",
        languages: "Burmese",
        lat: 21.9130,
        lng: 95.9560
    },
    {
        name: "Namibia",
        official_name: "Republic of Namibia",
        iso2: "NA",
        iso3: "NAM",
        capital: "Windhoek",
        continent: "Africa",
        region: "Southern Africa",
        population: "2.6M",
        area_km2: "825615",
        gdp_usd: "$12.2B",
        currency: "Namibian dollar",
        languages: "English",
        lat: -22.9576,
        lng: 18.4904
    },
    {
        name: "Nauru",
        official_name: "Republic of Nauru",
        iso2: "NR",
        iso3: "NRU",
        capital: "Yaren",
        continent: "Oceania",
        region: "Micronesia",
        population: "12K",
        area_km2: "21",
        gdp_usd: "$150M",
        currency: "Australian dollar",
        languages: "English, Nauruan",
        lat: -0.5228,
        lng: 166.9315
    },
    {
        name: "Nepal",
        official_name: "Federal Democratic Republic of Nepal",
        iso2: "NP",
        iso3: "NPL",
        capital: "Kathmandu",
        continent: "Asia",
        region: "Southern Asia",
        population: "30.9M",
        area_km2: "147516",
        gdp_usd: "$40.8B",
        currency: "Nepalese rupee",
        languages: "Nepali",
        lat: 28.3949,
        lng: 84.1240
    },
    {
        name: "Netherlands",
        official_name: "Kingdom of the Netherlands",
        iso2: "NL",
        iso3: "NLD",
        capital: "Amsterdam",
        continent: "Europe",
        region: "Western Europe",
        population: "17.7M",
        area_km2: "41543",
        gdp_usd: "$1.0T",
        currency: "Euro",
        languages: "Dutch",
        lat: 52.1326,
        lng: 5.2913
    },
    {
        name: "New Zealand",
        official_name: "New Zealand",
        iso2: "NZ",
        iso3: "NZL",
        capital: "Wellington",
        continent: "Oceania",
        region: "Australia and New Zealand",
        population: "5.2M",
        area_km2: "270467",
        gdp_usd: "$247.2B",
        currency: "New Zealand dollar",
        languages: "English, Māori",
        lat: -40.9006,
        lng: 174.8860
    },
    {
        name: "Nicaragua",
        official_name: "Republic of Nicaragua",
        iso2: "NI",
        iso3: "NIC",
        capital: "Managua",
        continent: "North America",
        region: "Central America",
        population: "7.0M",
        area_km2: "130373",
        gdp_usd: "$15.7B",
        currency: "Nicaraguan córdoba",
        languages: "Spanish",
        lat: 12.8654,
        lng: -85.2072
    },
    {
        name: "Niger",
        official_name: "Republic of the Niger",
        iso2: "NE",
        iso3: "NER",
        capital: "Niamey",
        continent: "Africa",
        region: "Western Africa",
        population: "26.2M",
        area_km2: "1267000",
        gdp_usd: "$14.9B",
        currency: "West African CFA franc",
        languages: "French",
        lat: 17.6078,
        lng: 8.0817
    },
    {
        name: "Nigeria",
        official_name: "Federal Republic of Nigeria",
        iso2: "NG",
        iso3: "NGA",
        capital: "Abuja",
        continent: "Africa",
        region: "Western Africa",
        population: "223.8M",
        area_km2: "923768",
        gdp_usd: "$477.4B",
        currency: "Nigerian naira",
        languages: "English",
        lat: 9.0820,
        lng: 8.6753
    },
    {
        name: "North Korea",
        official_name: "Democratic People's Republic of Korea",
        iso2: "KP",
        iso3: "PRK",
        capital: "Pyongyang",
        continent: "Asia",
        region: "Eastern Asia",
        population: "26.0M",
        area_km2: "120538",
        gdp_usd: "$18.0B",
        currency: "North Korean won",
        languages: "Korean",
        lat: 40.3399,
        lng: 127.5101
    },
    {
        name: "North Macedonia",
        official_name: "Republic of North Macedonia",
        iso2: "MK",
        iso3: "MKD",
        capital: "Skopje",
        continent: "Europe",
        region: "Southern Europe",
        population: "1.8M",
        area_km2: "25713",
        gdp_usd: "$13.7B",
        currency: "Macedonian denar",
        languages: "Macedonian",
        lat: 41.5089,
        lng: 21.7453
    },
    {
        name: "Norway",
        official_name: "Kingdom of Norway",
        iso2: "NO",
        iso3: "NOR",
        capital: "Oslo",
        continent: "Europe",
        region: "Northern Europe",
        population: "5.4M",
        area_km2: "323802",
        gdp_usd: "$579.3B",
        currency: "Norwegian krone",
        languages: "Norwegian",
        lat: 60.4720,
        lng: 8.4689
    },
    {
        name: "Oman",
        official_name: "Sultanate of Oman",
        iso2: "OM",
        iso3: "OMN",
        capital: "Muscat",
        continent: "Asia",
        region: "Western Asia",
        population: "4.6M",
        area_km2: "309500",
        gdp_usd: "$104.9B",
        currency: "Omani rial",
        languages: "Arabic",
        lat: 21.5126,
        lng: 55.9233
    },
    {
        name: "Pakistan",
        official_name: "Islamic Republic of Pakistan",
        iso2: "PK",
        iso3: "PAK",
        capital: "Islamabad",
        continent: "Asia",
        region: "Southern Asia",
        population: "231.4M",
        area_km2: "881913",
        gdp_usd: "$340.6B",
        currency: "Pakistani rupee",
        languages: "Urdu, English",
        lat: 30.3753,
        lng: 69.3451
    },
    {
        name: "Palau",
        official_name: "Republic of Palau",
        iso2: "PW",
        iso3: "PLW",
        capital: "Ngerulmud",
        continent: "Oceania",
        region: "Micronesia",
        population: "18K",
        area_km2: "459",
        gdp_usd: "$261M",
        currency: "United States dollar",
        languages: "Palauan, English",
        lat: 7.5150,
        lng: 134.5825
    },
    {
        name: "Palestine",
        official_name: "State of Palestine",
        iso2: "PS",
        iso3: "PSE",
        capital: "Ramallah",
        continent: "Asia",
        region: "Western Asia",
        population: "5.5M",
        area_km2: "6020",
        gdp_usd: "$15.3B",
        currency: "Israeli new shekel, Jordanian dinar",
        languages: "Arabic",
        lat: 31.9522,
        lng: 35.2332
    },
    {
        name: "Panama",
        official_name: "Republic of Panama",
        iso2: "PA",
        iso3: "PAN",
        capital: "Panama City",
        continent: "North America",
        region: "Central America",
        population: "4.4M",
        area_km2: "75417",
        gdp_usd: "$76.5B",
        currency: "United States dollar",
        languages: "Spanish",
        lat: 8.5380,
        lng: -80.7821
    },
    {
        name: "Papua New Guinea",
        official_name: "Independent State of Papua New Guinea",
        iso2: "PG",
        iso3: "PNG",
        capital: "Port Moresby",
        continent: "Oceania",
        region: "Melanesia",
        population: "10.3M",
        area_km2: "462840",
        gdp_usd: "$30.6B",
        currency: "Papua New Guinean kina",
        languages: "English, Tok Pisin, Hiri Motu",
        lat: -6.3150,
        lng: 143.9555
    },
    {
        name: "Paraguay",
        official_name: "Republic of Paraguay",
        iso2: "PY",
        iso3: "PRY",
        capital: "Asunción",
        continent: "South America",
        region: "South America",
        population: "7.4M",
        area_km2: "406752",
        gdp_usd: "$43.0B",
        currency: "Paraguayan guaraní",
        languages: "Spanish, Guaraní",
        lat: -23.4425,
        lng: -58.4438
    },
    {
        name: "Peru",
        official_name: "Republic of Peru",
        iso2: "PE",
        iso3: "PER",
        capital: "Lima",
        continent: "South America",
        region: "South America",
        population: "34.0M",
        area_km2: "1285216",
        gdp_usd: "$242.6B",
        currency: "Peruvian sol",
        languages: "Spanish",
        lat: -9.1900,
        lng: -75.0152
    },
    {
        name: "Philippines",
        official_name: "Republic of the Philippines",
        iso2: "PH",
        iso3: "PHL",
        capital: "Manila",
        continent: "Asia",
        region: "South-Eastern Asia",
        population: "117.3M",
        area_km2: "300000",
        gdp_usd: "$404.3B",
        currency: "Philippine peso",
        languages: "Filipino, English",
        lat: 12.8797,
        lng: 121.7740
    },
    {
        name: "Poland",
        official_name: "Republic of Poland",
        iso2: "PL",
        iso3: "POL",
        capital: "Warsaw",
        continent: "Europe",
        region: "Central Europe",
        population: "36.8M",
        area_km2: "312696",
        gdp_usd: "$688.2B",
        currency: "Polish złoty",
        languages: "Polish",
        lat: 51.9194,
        lng: 19.1451
    },
    {
        name: "Portugal",
        official_name: "Portuguese Republic",
        iso2: "PT",
        iso3: "PRT",
        capital: "Lisbon",
        continent: "Europe",
        region: "Southern Europe",
        population: "10.3M",
        area_km2: "92212",
        gdp_usd: "$252.2B",
        currency: "Euro",
        languages: "Portuguese",
        lat: 39.3999,
        lng: -8.2245
    },
    {
        name: "Qatar",
        official_name: "State of Qatar",
        iso2: "QA",
        iso3: "QAT",
        capital: "Doha",
        continent: "Asia",
        region: "Western Asia",
        population: "2.7M",
        area_km2: "11586",
        gdp_usd: "$221.4B",
        currency: "Qatari riyal",
        languages: "Arabic",
        lat: 25.3548,
        lng: 51.1839
    },
    {
        name: "Romania",
        official_name: "Romania",
        iso2: "RO",
        iso3: "ROU",
        capital: "Bucharest",
        continent: "Europe",
        region: "Eastern Europe",
        population: "19.0M",
        area_km2: "238397",
        gdp_usd: "$301.3B",
        currency: "Romanian leu",
        languages: "Romanian",
        lat: 45.9432,
        lng: 24.9668
    },
    {
        name: "Russia",
        official_name: "Russian Federation",
        iso2: "RU",
        iso3: "RUS",
        capital: "Moscow",
        continent: "Europe",
        region: "Eastern Europe",
        population: "144.2M",
        area_km2: "17098242",
        gdp_usd: "$1.8T",
        currency: "Russian ruble",
        languages: "Russian",
        lat: 61.5240,
        lng: 105.3188
    },
    {
        name: "Rwanda",
        official_name: "Republic of Rwanda",
        iso2: "RW",
        iso3: "RWA",
        capital: "Kigali",
        continent: "Africa",
        region: "Eastern Africa",
        population: "13.9M",
        area_km2: "26338",
        gdp_usd: "$13.3B",
        currency: "Rwandan franc",
        languages: "Kinyarwanda, English, French",
        lat: -1.9403,
        lng: 29.8739
    },
    {
        name: "Saint Kitts and Nevis",
        official_name: "Federation of Saint Kitts and Nevis",
        iso2: "KN",
        iso3: "KNA",
        capital: "Basseterre",
        continent: "North America",
        region: "Caribbean",
        population: "47K",
        area_km2: "261",
        gdp_usd: "$1.0B",
        currency: "East Caribbean dollar",
        languages: "English",
        lat: 17.3578,
        lng: -62.7830
    },
    {
        name: "Saint Lucia",
        official_name: "Saint Lucia",
        iso2: "LC",
        iso3: "LCA",
        capital: "Castries",
        continent: "North America",
        region: "Caribbean",
        population: "180K",
        area_km2: "617",
        gdp_usd: "$1.9B",
        currency: "East Caribbean dollar",
        languages: "English",
        lat: 13.9094,
        lng: -60.9789
    },
    {
        name: "Saint Vincent and the Grenadines",
        official_name: "Saint Vincent and the Grenadines",
        iso2: "VC",
        iso3: "VCT",
        capital: "Kingstown",
        continent: "North America",
        region: "Caribbean",
        population: "110K",
        area_km2: "389",
        gdp_usd: "$930M",
        currency: "East Caribbean dollar",
        languages: "English",
        lat: 12.9843,
        lng: -61.2872
    },
    {
        name: "Samoa",
        official_name: "Independent State of Samoa",
        iso2: "WS",
        iso3: "WSM",
        capital: "Apia",
        continent: "Oceania",
        region: "Polynesia",
        population: "222K",
        area_km2: "2842",
        gdp_usd: "$850M",
        currency: "Samoan tala",
        languages: "Samoan, English",
        lat: -13.7590,
        lng: -172.1046
    },
    {
        name: "San Marino",
        official_name: "Republic of San Marino",
        iso2: "SM",
        iso3: "SMR",
        capital: "San Marino",
        continent: "Europe",
        region: "Southern Europe",
        population: "34K",
        area_km2: "61",
        gdp_usd: "$1.9B",
        currency: "Euro",
        languages: "Italian",
        lat: 43.9424,
        lng: 12.4578
    },
    {
        name: "São Tomé and Príncipe",
        official_name: "Democratic Republic of São Tomé and Príncipe",
        iso2: "ST",
        iso3: "STP",
        capital: "São Tomé",
        continent: "Africa",
        region: "Middle Africa",
        population: "227K",
        area_km2: "964",
        gdp_usd: "$522M",
        currency: "Dobra",
        languages: "Portuguese",
        lat: 0.1864,
        lng: 6.6131
    },
    {
        name: "Saudi Arabia",
        official_name: "Kingdom of Saudi Arabia",
        iso2: "SA",
        iso3: "SAU",
        capital: "Riyadh",
        continent: "Asia",
        region: "Western Asia",
        population: "36.4M",
        area_km2: "2149690",
        gdp_usd: "$1.1T",
        currency: "Saudi riyal",
        languages: "Arabic",
        lat: 23.8859,
        lng: 45.0792
    },
    {
        name: "Senegal",
        official_name: "Republic of Senegal",
        iso2: "SN",
        iso3: "SEN",
        capital: "Dakar",
        continent: "Africa",
        region: "Western Africa",
        population: "17.7M",
        area_km2: "196722",
        gdp_usd: "$27.6B",
        currency: "West African CFA franc",
        languages: "French",
        lat: 14.4974,
        lng: -14.4524
    },
    {
        name: "Serbia",
        official_name: "Republic of Serbia",
        iso2: "RS",
        iso3: "SRB",
        capital: "Belgrade",
        continent: "Europe",
        region: "Southern Europe",
        population: "6.6M",
        area_km2: "77474",
        gdp_usd: "$63.1B",
        currency: "Serbian dinar",
        languages: "Serbian",
        lat: 44.0165,
        lng: 21.0059
    },
    {
        name: "Seychelles",
        official_name: "Republic of Seychelles",
        iso2: "SC",
        iso3: "SYC",
        capital: "Victoria",
        continent: "Africa",
        region: "Eastern Africa",
        population: "119K",
        area_km2: "452",
        gdp_usd: "$1.6B",
        currency: "Seychellois rupee",
        languages: "Seychellois Creole, English, French",
        lat: -4.6796,
        lng: 55.4920
    },
    {
        name: "Sierra Leone",
        official_name: "Republic of Sierra Leone",
        iso2: "SL",
        iso3: "SLE",
        capital: "Freetown",
        continent: "Africa",
        region: "Western Africa",
        population: "8.6M",
        area_km2: "71740",
        gdp_usd: "$4.1B",
        currency: "Sierra Leonean leone",
        languages: "English",
        lat: 8.4606,
        lng: -11.7799
    },
    {
        name: "Singapore",
        official_name: "Republic of Singapore",
        iso2: "SG",
        iso3: "SGP",
        capital: "Singapore",
        continent: "Asia",
        region: "South-Eastern Asia",
        population: "5.9M",
        area_km2: "728",
        gdp_usd: "$397.0B",
        currency: "Singapore dollar",
        languages: "English, Malay, Mandarin, Tamil",
        lat: 1.3521,
        lng: 103.8198
    },
    {
        name: "Slovakia",
        official_name: "Slovak Republic",
        iso2: "SK",
        iso3: "SVK",
        capital: "Bratislava",
        continent: "Europe",
        region: "Central Europe",
        population: "5.4M",
        area_km2: "49037",
        gdp_usd: "$115.5B",
        currency: "Euro",
        languages: "Slovak",
        lat: 48.6690,
        lng: 19.6990
    },
    {
        name: "Slovenia",
        official_name: "Republic of Slovenia",
        iso2: "SI",
        iso3: "SVN",
        capital: "Ljubljana",
        continent: "Europe",
        region: "Southern Europe",
        population: "2.1M",
        area_km2: "20273",
        gdp_usd: "$63.2B",
        currency: "Euro",
        languages: "Slovenian",
        lat: 46.1512,
        lng: 14.9955
    },
    {
        name: "Solomon Islands",
        official_name: "Solomon Islands",
        iso2: "SB",
        iso3: "SLB",
        capital: "Honiara",
        continent: "Oceania",
        region: "Melanesia",
        population: "733K",
        area_km2: "28896",
        gdp_usd: "$1.5B",
        currency: "Solomon Islands dollar",
        languages: "English, Solomon Islands Pijin",
        lat: -9.6457,
        lng: 160.1562
    },
    {
        name: "Somalia",
        official_name: "Federal Republic of Somalia",
        iso2: "SO",
        iso3: "SOM",
        capital: "Mogadishu",
        continent: "Africa",
        region: "Eastern Africa",
        population: "17.6M",
        area_km2: "637657",
        gdp_usd: "$8.1B",
        currency: "Somali shilling",
        languages: "Somali, Arabic",
        lat: 5.1521,
        lng: 46.1996
    },
    {
        name: "South Africa",
        official_name: "Republic of South Africa",
        iso2: "ZA",
        iso3: "ZAF",
        capital: "Pretoria",
        continent: "Africa",
        region: "Southern Africa",
        population: "60.4M",
        area_km2: "1221037",
        gdp_usd: "$399.0B",
        currency: "South African rand",
        languages: "Zulu, Xhosa, Afrikaans, English, etc.",
        lat: -30.5595,
        lng: 22.9375
    },
    {
        name: "South Korea",
        official_name: "Republic of Korea",
        iso2: "KR",
        iso3: "KOR",
        capital: "Seoul",
        continent: "Asia",
        region: "Eastern Asia",
        population: "51.7M",
        area_km2: "100210",
        gdp_usd: "$1.7T",
        currency: "South Korean won",
        languages: "Korean",
        lat: 35.9078,
        lng: 127.7669
    },
    {
        name: "South Sudan",
        official_name: "Republic of South Sudan",
        iso2: "SS",
        iso3: "SSD",
        capital: "Juba",
        continent: "Africa",
        region: "Eastern Africa",
        population: "11.0M",
        area_km2: "619745",
        gdp_usd: "$11.9B",
        currency: "South Sudanese pound",
        languages: "English",
        lat: 6.8770,
        lng: 31.3070
    },
    {
        name: "Spain",
        official_name: "Kingdom of Spain",
        iso2: "ES",
        iso3: "ESP",
        capital: "Madrid",
        continent: "Europe",
        region: "Southern Europe",
        population: "47.4M",
        area_km2: "505992",
        gdp_usd: "$1.4T",
        currency: "Euro",
        languages: "Spanish",
        lat: 40.4637,
        lng: -3.7492
    },
    {
        name: "Sri Lanka",
        official_name: "Democratic Socialist Republic of Sri Lanka",
        iso2: "LK",
        iso3: "LKA",
        capital: "Colombo",
        continent: "Asia",
        region: "Southern Asia",
        population: "22.2M",
        area_km2: "65610",
        gdp_usd: "$67.5B",
        currency: "Sri Lankan rupee",
        languages: "Sinhala, Tamil",
        lat: 7.8731,
        lng: 80.7718
    },
    {
        name: "Sudan",
        official_name: "Republic of the Sudan",
        iso2: "SD",
        iso3: "SDN",
        capital: "Khartoum",
        continent: "Africa",
        region: "Northern Africa",
        population: "46.9M",
        area_km2: "1886068",
        gdp_usd: "$26.1B",
        currency: "Sudanese pound",
        languages: "Arabic, English",
        lat: 12.8628,
        lng: 30.2176
    },
    {
        name: "Suriname",
        official_name: "Republic of Suriname",
        iso2: "SR",
        iso3: "SUR",
        capital: "Paramaribo",
        continent: "South America",
        region: "South America",
        population: "618K",
        area_km2: "163820",
        gdp_usd: "$3.6B",
        currency: "Surinamese dollar",
        languages: "Dutch",
        lat: 3.9193,
        lng: -56.0278
    },
    {
        name: "Sweden",
        official_name: "Kingdom of Sweden",
        iso2: "SE",
        iso3: "SWE",
        capital: "Stockholm",
        continent: "Europe",
        region: "Northern Europe",
        population: "10.5M",
        area_km2: "450295",
        gdp_usd: "$585.9B",
        currency: "Swedish krona",
        languages: "Swedish",
        lat: 60.1282,
        lng: 18.6435
    },
    {
        name: "Switzerland",
        official_name: "Swiss Confederation",
        iso2: "CH",
        iso3: "CHE",
        capital: "Bern",
        continent: "Europe",
        region: "Western Europe",
        population: "8.8M",
        area_km2: "41285",
        gdp_usd: "$807.7B",
        currency: "Swiss franc",
        languages: "German, French, Italian, Romansh",
        lat: 46.8182,
        lng: 8.2275
    },
    {
        name: "Syria",
        official_name: "Syrian Arab Republic",
        iso2: "SY",
        iso3: "SYR",
        capital: "Damascus",
        continent: "Asia",
        region: "Western Asia",
        population: "22.1M",
        area_km2: "185180",
        gdp_usd: "$11.0B",
        currency: "Syrian pound",
        languages: "Arabic",
        lat: 34.8021,
        lng: 39.0968
    },
    {
        name: "Taiwan",
        official_name: "Republic of China (Taiwan)",
        iso2: "TW",
        iso3: "TWN",
        capital: "Taipei",
        continent: "Asia",
        region: "Eastern Asia",
        population: "23.9M",
        area_km2: "36193",
        gdp_usd: "$774.5B",
        currency: "New Taiwan dollar",
        languages: "Mandarin",
        lat: 23.6978,
        lng: 120.9605
    },
    {
        name: "Tajikistan",
        official_name: "Republic of Tajikistan",
        iso2: "TJ",
        iso3: "TJK",
        capital: "Dushanbe",
        continent: "Asia",
        region: "Central Asia",
        population: "10.1M",
        area_km2: "143100",
        gdp_usd: "$10.5B",
        currency: "Tajikistani somoni",
        languages: "Tajik, Russian",
        lat: 38.8610,
        lng: 71.2761
    },
    {
        name: "Tanzania",
        official_name: "United Republic of Tanzania",
        iso2: "TZ",
        iso3: "TZA",
        capital: "Dodoma",
        continent: "Africa",
        region: "Eastern Africa",
        population: "65.5M",
        area_km2: "945087",
        gdp_usd: "$75.7B",
        currency: "Tanzanian shilling",
        languages: "Swahili, English",
        lat: -6.3690,
        lng: 34.8888
    },
    {
        name: "Thailand",
        official_name: "Kingdom of Thailand",
        iso2: "TH",
        iso3: "THA",
        capital: "Bangkok",
        continent: "Asia",
        region: "South-Eastern Asia",
        population: "71.8M",
        area_km2: "513120",
        gdp_usd: "$536.2B",
        currency: "Thai baht",
        languages: "Thai",
        lat: 15.8700,
        lng: 100.9925
    },
    {
        name: "Timor-Leste",
        official_name: "Democratic Republic of Timor-Leste",
        iso2: "TL",
        iso3: "TLS",
        capital: "Dili",
        continent: "Asia",
        region: "South-Eastern Asia",
        population: "1.4M",
        area_km2: "14874",
        gdp_usd: "$1.9B",
        currency: "United States dollar",
        languages: "Portuguese, Tetum",
        lat: -8.8742,
        lng: 125.7275
    },
    {
        name: "Togo",
        official_name: "Togolese Republic",
        iso2: "TG",
        iso3: "TGO",
        capital: "Lomé",
        continent: "Africa",
        region: "Western Africa",
        population: "8.9M",
        area_km2: "56785",
        gdp_usd: "$8.1B",
        currency: "West African CFA franc",
        languages: "French",
        lat: 8.6195,
        lng: 0.8248
    },
    {
        name: "Tonga",
        official_name: "Kingdom of Tonga",
        iso2: "TO",
        iso3: "TON",
        capital: "Nuku'alofa",
        continent: "Oceania",
        region: "Polynesia",
        population: "107K",
        area_km2: "747",
        gdp_usd: "$507M",
        currency: "Pa'anga",
        languages: "Tongan, English",
        lat: -21.1789,
        lng: -175.1982
    },
    {
        name: "Trinidad and Tobago",
        official_name: "Republic of Trinidad and Tobago",
        iso2: "TT",
        iso3: "TTO",
        capital: "Port of Spain",
        continent: "North America",
        region: "Caribbean",
        population: "1.5M",
        area_km2: "5131",
        gdp_usd: "$29.6B",
        currency: "Trinidad and Tobago dollar",
        languages: "English",
        lat: 10.6918,
        lng: -61.2225
    },
    {
        name: "Tunisia",
        official_name: "Republic of Tunisia",
        iso2: "TN",
        iso3: "TUN",
        capital: "Tunis",
        continent: "Africa",
        region: "Northern Africa",
        population: "12.5M",
        area_km2: "163610",
        gdp_usd: "$46.3B",
        currency: "Tunisian dinar",
        languages: "Arabic",
        lat: 33.8869,
        lng: 9.5375
    },
    {
        name: "Turkey",
        official_name: "Republic of Türkiye",
        iso2: "TR",
        iso3: "TUR",
        capital: "Ankara",
        continent: "Asia",
        region: "Western Asia",
        population: "85.3M",
        area_km2: "783562",
        gdp_usd: "$905.8B",
        currency: "Turkish lira",
        languages: "Turkish",
        lat: 38.9637,
        lng: 35.2433
    },
    {
        name: "Turkmenistan",
        official_name: "Turkmenistan",
        iso2: "TM",
        iso3: "TKM",
        capital: "Ashgabat",
        continent: "Asia",
        region: "Central Asia",
        population: "6.5M",
        area_km2: "488100",
        gdp_usd: "$45.2B",
        currency: "Turkmenistan manat",
        languages: "Turkmen",
        lat: 38.9697,
        lng: 59.5563
    },
    {
        name: "Tuvalu",
        official_name: "Tuvalu",
        iso2: "TV",
        iso3: "TUV",
        capital: "Funafuti",
        continent: "Oceania",
        region: "Polynesia",
        population: "11K",
        area_km2: "26",
        gdp_usd: "$63M",
        currency: "Tuvaluan dollar, Australian dollar",
        languages: "Tuvaluan, English",
        lat: -7.4785,
        lng: 178.6800
    },
    {
        name: "Uganda",
        official_name: "Republic of Uganda",
        iso2: "UG",
        iso3: "UGA",
        capital: "Kampala",
        continent: "Africa",
        region: "Eastern Africa",
        population: "48.6M",
        area_km2: "241038",
        gdp_usd: "$45.6B",
        currency: "Ugandan shilling",
        languages: "English, Swahili",
        lat: 1.3733,
        lng: 32.2903
    },
    {
        name: "Ukraine",
        official_name: "Ukraine",
        iso2: "UA",
        iso3: "UKR",
        capital: "Kyiv",
        continent: "Europe",
        region: "Eastern Europe",
        population: "37.0M",
        area_km2: "603500",
        gdp_usd: "$160.5B",
        currency: "Ukrainian hryvnia",
        languages: "Ukrainian",
        lat: 48.3794,
        lng: 31.1656
    },
    {
        name: "United Arab Emirates",
        official_name: "United Arab Emirates",
        iso2: "AE",
        iso3: "ARE",
        capital: "Abu Dhabi",
        continent: "Asia",
        region: "Western Asia",
        population: "9.4M",
        area_km2: "83600",
        gdp_usd: "$507.5B",
        currency: "United Arab Emirates dirham",
        languages: "Arabic",
        lat: 23.4241,
        lng: 53.8478
    },
    {
        name: "United Kingdom",
        official_name: "United Kingdom of Great Britain and Northern Ireland",
        iso2: "GB",
        iso3: "GBR",
        capital: "London",
        continent: "Europe",
        region: "Northern Europe",
        population: "67.7M",
        area_km2: "242495",
        gdp_usd: "$3.1T",
        currency: "Pound sterling",
        languages: "English",
        lat: 55.3781,
        lng: -3.4360
    },
    {
        name: "United States",
        official_name: "United States of America",
        iso2: "US",
        iso3: "USA",
        capital: "Washington, D.C.",
        continent: "North America",
        region: "Northern America",
        population: "331.9M",
        area_km2: "9833520",
        gdp_usd: "$25.5T",
        currency: "United States dollar",
        languages: "English",
        lat: 37.0902,
        lng: -95.7129
    },
    {
        name: "Uruguay",
        official_name: "Eastern Republic of Uruguay",
        iso2: "UY",
        iso3: "URY",
        capital: "Montevideo",
        continent: "South America",
        region: "South America",
        population: "3.4M",
        area_km2: "176215",
        gdp_usd: "$71.2B",
        currency: "Uruguayan peso",
        languages: "Spanish",
        lat: -32.5228,
        lng: -55.7658
    },
    {
        name: "Uzbekistan",
        official_name: "Republic of Uzbekistan",
        iso2: "UZ",
        iso3: "UZB",
        capital: "Tashkent",
        continent: "Asia",
        region: "Central Asia",
        population: "35.6M",
        area_km2: "447400",
        gdp_usd: "$80.4B",
        currency: "Uzbekistani so'm",
        languages: "Uzbek",
        lat: 41.3775,
        lng: 64.5853
    },
    {
        name: "Vanuatu",
        official_name: "Republic of Vanuatu",
        iso2: "VU",
        iso3: "VUT",
        capital: "Port Vila",
        continent: "Oceania",
        region: "Melanesia",
        population: "326K",
        area_km2: "12189",
        gdp_usd: "$960M",
        currency: "Vanuatu vatu",
        languages: "Bislama, English, French",
        lat: -15.3767,
        lng: 166.9592
    },
    {
        name: "Vatican City",
        official_name: "Vatican City State",
        iso2: "VA",
        iso3: "VAT",
        capital: "Vatican City",
        continent: "Europe",
        region: "Southern Europe",
        population: "800",
        area_km2: "0.44",
        gdp_usd: "$N/A",
        currency: "Euro",
        languages: "Italian, Latin",
        lat: 41.9029,
        lng: 12.4534
    },
    {
        name: "Venezuela",
        official_name: "Bolivarian Republic of Venezuela",
        iso2: "VE",
        iso3: "VEN",
        capital: "Caracas",
        continent: "South America",
        region: "South America",
        population: "28.4M",
        area_km2: "916445",
        gdp_usd: "$92.9B",
        currency: "Venezuelan bolívar",
        languages: "Spanish",
        lat: 6.4238,
        lng: -66.5897
    },
    {
        name: "Vietnam",
        official_name: "Socialist Republic of Vietnam",
        iso2: "VN",
        iso3: "VNM",
        capital: "Hanoi",
        continent: "Asia",
        region: "South-Eastern Asia",
        population: "99.5M",
        area_km2: "331212",
        gdp_usd: "$408.8B",
        currency: "Vietnamese đồng",
        languages: "Vietnamese",
        lat: 14.0583,
        lng: 108.2772
    },
    {
        name: "Yemen",
        official_name: "Republic of Yemen",
        iso2: "YE",
        iso3: "YEM",
        capital: "Sana'a",
        continent: "Asia",
        region: "Western Asia",
        population: "33.7M",
        area_km2: "527968",
        gdp_usd: "$21.6B",
        currency: "Yemeni rial",
        languages: "Arabic",
        lat: 15.5527,
        lng: 48.5164
    },
    {
        name: "Zambia",
        official_name: "Republic of Zambia",
        iso2: "ZM",
        iso3: "ZMB",
        capital: "Lusaka",
        continent: "Africa",
        region: "Eastern Africa",
        population: "20.0M",
        area_km2: "752612",
        gdp_usd: "$29.8B",
        currency: "Zambian kwacha",
        languages: "English",
        lat: -13.1339,
        lng: 27.8493
    },
    {
        name: "Zimbabwe",
        official_name: "Republic of Zimbabwe",
        iso2: "ZW",
        iso3: "ZWE",
        capital: "Harare",
        continent: "Africa",
        region: "Eastern Africa",
        population: "16.0M",
        area_km2: "390757",
        gdp_usd: "$28.5B",
        currency: "United States dollar, Zimbabwean dollar",
        languages: "English, Shona, Ndebele",
        lat: -19.0154,
        lng: 29.1549
    }
];
function latLngToVector3(lat, lng, radius = 1.51) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}
function AnimalPath({ track, progress, onAnimalSelect: onAnimalSelect1, isSelected }) {
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
                        lineNumber: 355,
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
                        lineNumber: 362,
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
                    if (onAnimalSelect1) onAnimalSelect1(track.animalId);
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
                        lineNumber: 378,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: track.color,
                        emissive: track.color,
                        emissiveIntensity: isSelected ? 3 : isHovered ? 2 : 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 379,
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
                                lineNumber: 386,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                                color: track.color,
                                transparent: true,
                                opacity: 0.6
                            }, void 0, false, {
                                fileName: "[project]/src/components/globe/Globe.tsx",
                                lineNumber: 387,
                                columnNumber: 16
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 385,
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
                                    lineNumber: 407,
                                    columnNumber: 17
                                }, this),
                                lastPoint.timestamp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: new Date(lastPoint.timestamp).toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/globe/Globe.tsx",
                                    lineNumber: 409,
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
                                    lineNumber: 411,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/globe/Globe.tsx",
                            lineNumber: 397,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 391,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 372,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 352,
        columnNumber: 5
    }, this);
}
_s1(AnimalPath, "QDAevxXcic9KJByN40zqhrr2dTw=");
_c2 = AnimalPath;
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
                        lineNumber: 457,
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
                        lineNumber: 458,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 456,
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
                        lineNumber: 467,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        map: cloudsTexture,
                        transparent: true,
                        opacity: 0.15,
                        depthWrite: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/globe/Globe.tsx",
                        lineNumber: 468,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 466,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 455,
        columnNumber: 5
    }, this);
}
_s2(Earth, "MZG009nMTQJ0hj1vDzPPW1eNe/g=");
_c3 = Earth;
const CameraController = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const speed = props.rotationSpeed !== undefined ? props.rotationSpeed : props.isPlaying !== false ? 0.3 : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"], {
        ref: ref,
        enablePan: true,
        enableZoom: true,
        enableRotate: true,
        minDistance: 1.5,
        maxDistance: 20,
        autoRotate: speed !== 0,
        autoRotateSpeed: speed,
        enableDamping: true,
        dampingFactor: 0.05
    }, void 0, false, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 482,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c4 = CameraController;
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
_c5 = CameraAutoFit;
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
                lineNumber: 533,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                color: "#001133",
                wireframe: true
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 534,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 532,
        columnNumber: 5
    }, this);
}
_c6 = LoadingFallback;
function Globe({ selectedCountry, onCountrySelect, isPlaying, rotationSpeed }) {
    _s4();
    const [showHeatmap, setShowHeatmap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const controlsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const prevCameraState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const searchResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Globe.useMemo[searchResults]": ()=>{
            if (!searchTerm.trim()) return [];
            const term = searchTerm.toLowerCase();
            return COUNTRIES.map({
                "Globe.useMemo[searchResults]": (c, i)=>({
                        ...c,
                        idx: i
                    })
            }["Globe.useMemo[searchResults]"]).filter({
                "Globe.useMemo[searchResults]": (c)=>c.name.toLowerCase().includes(term)
            }["Globe.useMemo[searchResults]"]).slice(0, 5);
        }
    }["Globe.useMemo[searchResults]"], [
        searchTerm
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Globe.useEffect": ()=>{
            if (selectedCountry === null) {
                if (prevCameraState.current && controlsRef.current) {
                    const controls = controlsRef.current;
                    const { position, target } = prevCameraState.current;
                    const duration = 1000;
                    const startPos = controls.object.position.clone();
                    const startTarget = controls.target.clone();
                    const startTime = Date.now();
                    const animateBack = {
                        "Globe.useEffect.animateBack": ()=>{
                            const elapsed = Date.now() - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = progress * (2 - progress);
                            controls.object.position.lerpVectors(startPos, position, eased);
                            controls.target.lerpVectors(startTarget, target, eased);
                            controls.update();
                            if (progress < 1) {
                                requestAnimationFrame(animateBack);
                            }
                        }
                    }["Globe.useEffect.animateBack"];
                    animateBack();
                }
                return;
            }
            const country = COUNTRIES[selectedCountry];
            if (!country || !controlsRef.current) return;
            const controls = controlsRef.current;
            if (!prevCameraState.current) {
                prevCameraState.current = {
                    position: controls.object.position.clone(),
                    target: controls.target.clone()
                };
            }
            const targetVec = latLngToVector3(country.lat, country.lng, 1.53);
            const duration = 1000;
            const startPos = controls.object.position.clone();
            const startTarget = controls.target.clone();
            const offset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0.3, 0.2, 0.5).multiplyScalar(2);
            const newCameraPos = targetVec.clone().add(offset);
            const startTime = Date.now();
            const animate = {
                "Globe.useEffect.animate": ()=>{
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = progress * (2 - progress);
                    controls.object.position.lerpVectors(startPos, newCameraPos, eased);
                    controls.target.lerpVectors(startTarget, targetVec, eased);
                    controls.update();
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }
            }["Globe.useEffect.animate"];
            animate();
            setSearchTerm('');
        }
    }["Globe.useEffect"], [
        selectedCountry
    ]);
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
                    controls.object.position.lerpVectors(startPos, newCameraPos, eased);
                    controls.target.lerpVectors(startTarget, target, eased);
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
                lineNumber: 658,
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
                lineNumber: 659,
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
                lineNumber: 660,
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
                lineNumber: 661,
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
                lineNumber: 662,
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
                lineNumber: 663,
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
                lineNumber: 672,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingFallback, {}, void 0, false, {
                    fileName: "[project]/src/components/globe/Globe.tsx",
                    lineNumber: 674,
                    columnNumber: 27
                }, this),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Earth, {}, void 0, false, {
                    fileName: "[project]/src/components/globe/Globe.tsx",
                    lineNumber: 675,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 674,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CountryConnections, {}, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 678,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CountryMarkers, {
                selectedCountry: selectedCountry,
                onSelect: onCountrySelect
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 680,
                columnNumber: 7
            }, this),
            showHeatmap && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Heatmap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                tracks: animalTracks,
                intensity: 0.5
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 682,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                center: true,
                position: [
                    0,
                    -1.5,
                    0
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: 'relative'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: searchTerm,
                                    onChange: (e)=>setSearchTerm(e.target.value),
                                    placeholder: "Search country...",
                                    style: {
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(0,170,255,0.5)',
                                        background: 'rgba(0,0,0,0.8)',
                                        color: 'white',
                                        fontSize: '12px',
                                        width: '200px',
                                        outline: 'none'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/globe/Globe.tsx",
                                    lineNumber: 687,
                                    columnNumber: 13
                                }, this),
                                searchResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: 'rgba(0,0,0,0.9)',
                                        border: '1px solid rgba(0,170,255,0.5)',
                                        borderRadius: '8px',
                                        marginTop: '4px',
                                        overflow: 'hidden',
                                        zIndex: 1000
                                    },
                                    children: searchResults.map((country)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>{
                                                onCountrySelect(country.idx);
                                            },
                                            style: {
                                                padding: '8px 12px',
                                                color: 'white',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid rgba(255,255,255,0.1)'
                                            },
                                            onMouseEnter: (e)=>{
                                                e.currentTarget.style.background = 'rgba(0,170,255,0.3)';
                                            },
                                            onMouseLeave: (e)=>{
                                                e.currentTarget.style.background = 'transparent';
                                            },
                                            children: country.name
                                        }, country.idx, false, {
                                            fileName: "[project]/src/components/globe/Globe.tsx",
                                            lineNumber: 717,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/globe/Globe.tsx",
                                    lineNumber: 704,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/globe/Globe.tsx",
                            lineNumber: 686,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowHeatmap(!showHeatmap),
                            className: `px-3 py-1 rounded text-xs transition-colors ${showHeatmap ? 'bg-orange-500/50 text-white border border-orange-400' : 'bg-black/50 text-white/70 border border-white/20 hover:border-white/40'}`,
                            children: [
                                "🌡️ Heatmap ",
                                showHeatmap ? 'ON' : 'OFF'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/globe/Globe.tsx",
                            lineNumber: 738,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/globe/Globe.tsx",
                    lineNumber: 685,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 684,
                columnNumber: 7
            }, this),
            animalTracks.map((track)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AnimalPath, {
                    track: track,
                    progress: playbackProgress,
                    onAnimalSelect: onAnimalSelect,
                    isSelected: selectedAnimal === track.animalId
                }, track.animalId, false, {
                    fileName: "[project]/src/components/globe/Globe.tsx",
                    lineNumber: 752,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CameraAutoFit, {
                tracks: animalTracks,
                controlsRef: controlsRef
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 761,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CameraController, {
                ref: controlsRef,
                isPlaying: isPlaying,
                rotationSpeed: rotationSpeed
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 762,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EffectComposer"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$postprocessing$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bloom"], {
                    intensity: 1.5,
                    luminanceThreshold: 0.1,
                    luminanceSmoothing: 0.5
                }, void 0, false, {
                    fileName: "[project]/src/components/globe/Globe.tsx",
                    lineNumber: 765,
                    columnNumber: 10
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/globe/Globe.tsx",
                lineNumber: 764,
                columnNumber: 8
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/globe/Globe.tsx",
        lineNumber: 653,
        columnNumber: 5
    }, this);
}
_s4(Globe, "ATtf91ktzWX5n0BYaFynFrQdDfs=");
_c7 = Globe;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "CountryConnections");
__turbopack_context__.k.register(_c1, "CountryMarkers");
__turbopack_context__.k.register(_c2, "AnimalPath");
__turbopack_context__.k.register(_c3, "Earth");
__turbopack_context__.k.register(_c4, "CameraController");
__turbopack_context__.k.register(_c5, "CameraAutoFit");
__turbopack_context__.k.register(_c6, "LoadingFallback");
__turbopack_context__.k.register(_c7, "Globe");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/globe/Globe.tsx [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const Globe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/globe/Globe.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/globe/Globe.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-full flex items-center justify-center text-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
                lineNumber: 12,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 11,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
});
_c = Globe;
function Home() {
    _s();
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rotationSpeed, setRotationSpeed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedCountryIdx, setSelectedCountryIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            document.title = 'WorldView 3D';
        }
    }["Home.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "w-full h-screen bg-[#0a0a1a] relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Globe, {
                    selectedCountry: selectedCountryIdx,
                    onCountrySelect: (idx)=>setSelectedCountryIdx(idx),
                    isPlaying: isPlaying,
                    rotationSpeed: rotationSpeed
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold text-white tracking-wide",
                    style: {
                        textShadow: '0 0 20px rgba(0,136,255,0.8), 0 0 40px rgba(0,136,255,0.4)'
                    },
                    children: "WorldView 3D"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            selectedCountryIdx !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center",
                onClick: ()=>setSelectedCountryIdx(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    onClick: (e)=>e.stopPropagation(),
                    style: {
                        color: '#00aaff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        whiteSpace: 'normal',
                        userSelect: 'none',
                        background: 'rgba(0, 20, 40, 0.85)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        padding: '30px',
                        borderRadius: '20px',
                        border: '1px solid rgba(0, 170, 255, 0.5)',
                        minWidth: '500px',
                        maxWidth: '600px',
                        boxShadow: '0 20px 60px rgba(0, 170, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px',
                                borderBottom: '1px solid rgba(0, 170, 255, 0.4)',
                                paddingBottom: '10px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '24px',
                                        textShadow: '0 0 20px #00aaff'
                                    },
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedCountryIdx(null),
                                    style: {
                                        background: 'rgba(0, 170, 255, 0.4)',
                                        border: '1px solid rgba(0, 170, 255, 0.6)',
                                        color: '#00aaff',
                                        cursor: 'pointer',
                                        fontSize: '28px',
                                        lineHeight: '1',
                                        padding: '6px 16px',
                                        borderRadius: '10px',
                                        backdropFilter: 'blur(4px)'
                                    },
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 79,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontWeight: 'normal',
                                fontSize: '15px',
                                lineHeight: '2',
                                color: 'rgba(255, 255, 255, 1)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: '8px',
                                        fontSize: '12px',
                                        color: 'rgba(0, 170, 255, 1)'
                                    },
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].official_name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 99,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'auto 1fr',
                                        gap: '6px 16px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'rgba(0, 170, 255, 0.8)'
                                            },
                                            children: "ISO:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 101,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].iso2,
                                                " / ",
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].iso3
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 101,
                                            columnNumber: 78
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'rgba(0, 170, 255, 0.8)'
                                            },
                                            children: "Capital:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 102,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].capital
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 102,
                                            columnNumber: 82
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'rgba(0, 170, 255, 0.8)'
                                            },
                                            children: "Continent:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 103,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].continent
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 103,
                                            columnNumber: 84
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'rgba(0, 170, 255, 0.8)'
                                            },
                                            children: "Region:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 104,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].region
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 104,
                                            columnNumber: 81
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'rgba(0, 170, 255, 0.8)'
                                            },
                                            children: "Population:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 105,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].population
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 105,
                                            columnNumber: 85
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'rgba(0, 170, 255, 0.8)'
                                            },
                                            children: "Area:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 106,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].area_km2,
                                                " km²"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 106,
                                            columnNumber: 79
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'rgba(0, 170, 255, 0.8)'
                                            },
                                            children: "GDP:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].gdp_usd
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 107,
                                            columnNumber: 78
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'rgba(0, 170, 255, 0.8)'
                                            },
                                            children: "Currency:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 108,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].currency
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 108,
                                            columnNumber: 83
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 100,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: '12px',
                                        paddingTop: '12px',
                                        borderTop: '1px solid rgba(0, 170, 255, 0.4)',
                                        fontSize: '14px',
                                        color: 'rgba(255, 255, 255, 0.9)'
                                    },
                                    children: [
                                        "Languages: ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$globe$2f$Globe$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"][selectedCountryIdx].languages
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 98,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 59,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(Home, "UmJ5DC1HeZ6h2OivDfbtCBfusNs=");
_c1 = Home;
var _c, _c1;
__turbopack_context__.k.register(_c, "Globe");
__turbopack_context__.k.register(_c1, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0qx.33w._.js.map