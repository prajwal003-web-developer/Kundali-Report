'use client'
import useKundaliStores from "@/app/Stores/KundaliStores";
import { LoaderIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// ─── Sample / Demo Data ───────────────────────────────────────────────────────
const DEMO_DATA = {
  success: true,
  meta: {
    name: "Arjun Sharma",
    gender: "male",
    dob: { ad: "1990-05-15", bs: "2047-02-01", original: "1990-05-15", dobType: "AD" },
    time: "06:30",
    timezone: 5.75,
    location: { country: "Nepal", region: "Bagmati", lat: 27.7172, lon: 85.3240, elevation: 1400 },
    ayanamsa: "Lahiri (Chitrapaksha)",
    houseSystem: "Whole Sign",
    julianDay: 2448027.229167,
    calculatedAt: "2024-01-01T06:00:00.000Z",
  },
  summary: {
    lagna: { rashi: { en: "Aries", ne: "मेष", isoEn: "Mesha" }, lord: "Mars", lordHouse: 1 },
    moonSign: { en: "Cancer", ne: "कर्कट" },
    moonNakshatra: { en: "Pushya", ne: "पुष्य" },
    moonNakshatraLord: "Saturn",
    sunSign: { en: "Taurus", ne: "वृषभ" },
    yogakaraka: { en: "Mars", ne: "मङ्गल", isoEn: "Mangal" },
    exaltedPlanets: [{ en: "Jupiter", ne: "बृहस्पति" }],
    debilitatedPlanets: [{ en: "Saturn", ne: "शनि" }],
    retrogradePlanets: [{ en: "Mercury", ne: "बुध" }, { en: "Venus", ne: "शुक्र" }],
    vargottamaPlanets: [{ en: "Sun", ne: "सूर्य" }],
  },
  ascendant: {
    longitude: 12.4521,
    rashiIndex: 0,
    rashi: { en: "Aries", ne: "मेष", isoEn: "Mesha" },
    rashiLord: "Mars",
    degreeInRashi: 12.4521,
    dms: `12°27'07"`,
    nakshatra: { en: "Ashwini", ne: "अश्विनी" },
    nakshatraLord: "Ketu",
    pada: 2,
  },
  planets: [
    { name: { en: "Sun",     ne: "सूर्य"      }, longitude: 34.2,  rashi: { en: "Taurus",      ne: "वृषभ"      }, rashiLord: "Venus",   degreeInRashi: 4.2,  dms: `4°12'00"`,  nakshatra: { en: "Krittika",  ne: "कृत्तिका"  }, nakshatraLord: "Sun",     pada: 2, dignity: { en: "Neutral",    ne: "सम"         }, house: 2,  isRetrograde: false, speed: 0.9589  },
    { name: { en: "Moon",    ne: "चन्द्र"      }, longitude: 103.5, rashi: { en: "Cancer",      ne: "कर्कट"     }, rashiLord: "Moon",    degreeInRashi: 13.5, dms: `13°30'00"`, nakshatra: { en: "Pushya",    ne: "पुष्य"     }, nakshatraLord: "Saturn",  pada: 3, dignity: { en: "Neutral",    ne: "सम"         }, house: 4,  isRetrograde: false, speed: 13.2   },
    { name: { en: "Mars",    ne: "मङ्गल"       }, longitude: 12.1,  rashi: { en: "Aries",       ne: "मेष"       }, rashiLord: "Mars",    degreeInRashi: 12.1, dms: `12°06'00"`, nakshatra: { en: "Ashwini",   ne: "अश्विनी"   }, nakshatraLord: "Ketu",    pada: 2, dignity: { en: "Own Sign",   ne: "स्वग्रह"   }, house: 1,  isRetrograde: false, speed: 0.524  },
    { name: { en: "Mercury", ne: "बुध"          }, longitude: 18.7,  rashi: { en: "Aries",       ne: "मेष"       }, rashiLord: "Mars",    degreeInRashi: 18.7, dms: `18°42'00"`, nakshatra: { en: "Bharani",   ne: "भरणी"      }, nakshatraLord: "Venus",   pada: 4, dignity: { en: "Neutral",    ne: "सम"         }, house: 1,  isRetrograde: true,  speed: -0.412 },
    { name: { en: "Jupiter", ne: "बृहस्पति"    }, longitude: 95.3,  rashi: { en: "Cancer",      ne: "कर्कट"     }, rashiLord: "Moon",    degreeInRashi: 5.3,  dms: `5°18'00"`,  nakshatra: { en: "Punarvasu", ne: "पुनर्वसु"  }, nakshatraLord: "Jupiter", pada: 1, dignity: { en: "Exalted",    ne: "उच्च"       }, house: 4,  isRetrograde: false, speed: 0.102  },
    { name: { en: "Venus",   ne: "शुक्र"        }, longitude: 48.9,  rashi: { en: "Taurus",      ne: "वृषभ"      }, rashiLord: "Venus",   degreeInRashi: 18.9, dms: `18°54'00"`, nakshatra: { en: "Rohini",    ne: "रोहिणी"    }, nakshatraLord: "Moon",    pada: 4, dignity: { en: "Own Sign",   ne: "स्वग्रह"   }, house: 2,  isRetrograde: true,  speed: -0.289 },
    { name: { en: "Saturn",  ne: "शनि"          }, longitude: 275.6, rashi: { en: "Capricorn",   ne: "मकर"       }, rashiLord: "Saturn",  degreeInRashi: 5.6,  dms: `5°36'00"`,  nakshatra: { en: "Uttara Ashadha", ne: "उत्तराषाढा" }, nakshatraLord: "Sun",  pada: 2, dignity: { en: "Debilitated", ne: "नीच"        }, house: 10, isRetrograde: false, speed: 0.032  },
    { name: { en: "Rahu",    ne: "राहु"         }, longitude: 298.4, rashi: { en: "Aquarius",    ne: "कुम्भ"     }, rashiLord: "Saturn",  degreeInRashi: 28.4, dms: `28°24'00"`, nakshatra: { en: "Purva Bhadrapada", ne: "पूर्वभाद्रपदा" }, nakshatraLord: "Jupiter", pada: 4, dignity: { en: "Neutral", ne: "सम" }, house: 11, isRetrograde: true, speed: -0.053 },
    { name: { en: "Ketu",    ne: "केतु"         }, longitude: 118.4, rashi: { en: "Leo",         ne: "सिंह"      }, rashiLord: "Sun",     degreeInRashi: 28.4, dms: `28°24'00"`, nakshatra: { en: "Magha",     ne: "मघा"       }, nakshatraLord: "Ketu",    pada: 4, dignity: { en: "Neutral",    ne: "सम"         }, house: 5,  isRetrograde: true,  speed: -0.053 },
  ],
  houses: Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    cuspLongitude: (i * 30 + 12.45),
    rashi: [
      { en: "Aries", ne: "मेष" }, { en: "Taurus", ne: "वृषभ" }, { en: "Gemini", ne: "मिथुन" },
      { en: "Cancer", ne: "कर्कट" }, { en: "Leo", ne: "सिंह" }, { en: "Virgo", ne: "कन्या" },
      { en: "Libra", ne: "तुला" }, { en: "Scorpio", ne: "वृश्चिक" }, { en: "Sagittarius", ne: "धनु" },
      { en: "Capricorn", ne: "मकर" }, { en: "Aquarius", ne: "कुम्भ" }, { en: "Pisces", ne: "मीन" },
    ][i],
    rashiLord: ["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"][i],
    degreeInRashi: 12.45,
    dms: `12°27'00"`,
    meaning: { en: ["Self, Personality, Body","Wealth, Family, Speech","Siblings, Courage","Home, Mother","Children, Education","Enemies, Health","Marriage, Partnerships","Transformation","Luck, Dharma","Career, Status","Gains, Friends","Loss, Liberation"][i], ne: ["स्वयं","धन","भाइबहिनी","घर","सन्तान","शत्रु","विवाह","परिवर्तन","भाग्य","करियर","लाभ","हानि"][i] },
  })),
  d9: {
    ascendant: { rashiIndex: 3, en: "Cancer", ne: "कर्कट", isoEn: "Karkata", lord: "Moon" },
    planets: [
      { name: { en: "Sun", ne: "सूर्य" }, d1Rashi: { en: "Taurus", ne: "वृषभ" }, rashi: { en: "Taurus", ne: "वृषभ", isoEn: "Vrishabha" }, rashiLord: "Venus", dignity: { en: "Neutral", ne: "सम" }, house: 11, isVargottama: true },
      { name: { en: "Moon", ne: "चन्द्र" }, d1Rashi: { en: "Cancer", ne: "कर्कट" }, rashi: { en: "Scorpio", ne: "वृश्चिक", isoEn: "Vrishchika" }, rashiLord: "Mars", dignity: { en: "Debilitated", ne: "नीच" }, house: 5, isVargottama: false },
      { name: { en: "Mars", ne: "मङ्गल" }, d1Rashi: { en: "Aries", ne: "मेष" }, rashi: { en: "Leo", ne: "सिंह", isoEn: "Simha" }, rashiLord: "Sun", dignity: { en: "Neutral", ne: "सम" }, house: 2, isVargottama: false },
      { name: { en: "Mercury", ne: "बुध" }, d1Rashi: { en: "Aries", ne: "मेष" }, rashi: { en: "Gemini", ne: "मिथुन", isoEn: "Mithuna" }, rashiLord: "Mercury", dignity: { en: "Neutral", ne: "सम" }, house: 12, isVargottama: false },
      { name: { en: "Jupiter", ne: "बृहस्पति" }, d1Rashi: { en: "Cancer", ne: "कर्कट" }, rashi: { en: "Pisces", ne: "मीन", isoEn: "Meena" }, rashiLord: "Jupiter", dignity: { en: "Own Sign", ne: "स्वग्रह" }, house: 9, isVargottama: false },
      { name: { en: "Venus", ne: "शुक्र" }, d1Rashi: { en: "Taurus", ne: "वृषभ" }, rashi: { en: "Capricorn", ne: "मकर", isoEn: "Makara" }, rashiLord: "Saturn", dignity: { en: "Neutral", ne: "सम" }, house: 7, isVargottama: false },
      { name: { en: "Saturn", ne: "शनि" }, d1Rashi: { en: "Capricorn", ne: "मकर" }, rashi: { en: "Libra", ne: "तुला", isoEn: "Tula" }, rashiLord: "Venus", dignity: { en: "Exalted", ne: "उच्च" }, house: 4, isVargottama: false },
      { name: { en: "Rahu", ne: "राहु" }, d1Rashi: { en: "Aquarius", ne: "कुम्भ" }, rashi: { en: "Aries", ne: "मेष", isoEn: "Mesha" }, rashiLord: "Mars", dignity: { en: "Neutral", ne: "सम" }, house: 10, isVargottama: false },
      { name: { en: "Ketu", ne: "केतु" }, d1Rashi: { en: "Leo", ne: "सिंह" }, rashi: { en: "Libra", ne: "तुला", isoEn: "Tula" }, rashiLord: "Venus", dignity: { en: "Neutral", ne: "सम" }, house: 4, isVargottama: false },
    ],
    vargottamaPlanets: [{ en: "Sun", ne: "सूर्य" }],
  },
  dasha: {
    current: { mahadasha: "Jupiter", antardasha: "Saturn", pratyantardasha: "Mercury", pratyantardashaEndDate: "2024-08-12" },
    dashas: [
      { planet: { en: "Moon", ne: "चन्द्र" }, startDate: "1990-03-10", endDate: "2000-03-10", durationYears: 10, isActive: false, antardashas: [] },
      { planet: { en: "Mars", ne: "मङ्गल" }, startDate: "2000-03-10", endDate: "2007-03-10", durationYears: 7, isActive: false, antardashas: [] },
      { planet: { en: "Rahu", ne: "राहु" }, startDate: "2007-03-10", endDate: "2025-03-10", durationYears: 18, isActive: false, antardashas: [] },
      {
        planet: { en: "Jupiter", ne: "बृहस्पति" }, startDate: "2025-03-10", endDate: "2041-03-10", durationYears: 16, isActive: true,
        antardashas: [
          { planet: { en: "Jupiter", ne: "बृहस्पति" }, startDate: "2025-03-10", endDate: "2027-01-18", durationYears: 1.8844, isActive: false },
          { planet: { en: "Saturn",  ne: "शनि"       }, startDate: "2027-01-18", endDate: "2029-06-20", durationYears: 2.4,    isActive: true  },
          { planet: { en: "Mercury", ne: "बुध"        }, startDate: "2029-06-20", endDate: "2031-09-16", durationYears: 2.2667, isActive: false },
          { planet: { en: "Ketu",    ne: "केतु"       }, startDate: "2031-09-16", endDate: "2032-09-12", durationYears: 0.9333, isActive: false },
          { planet: { en: "Venus",   ne: "शुक्र"      }, startDate: "2032-09-12", endDate: "2035-05-12", durationYears: 2.6667, isActive: false },
          { planet: { en: "Sun",     ne: "सूर्य"      }, startDate: "2035-05-12", endDate: "2036-03-18", durationYears: 0.8,    isActive: false },
          { planet: { en: "Moon",    ne: "चन्द्र"     }, startDate: "2036-03-18", endDate: "2037-07-18", durationYears: 1.3333, isActive: false },
          { planet: { en: "Mars",    ne: "मङ्गल"      }, startDate: "2037-07-18", endDate: "2038-07-12", durationYears: 0.9333, isActive: false },
          { planet: { en: "Rahu",    ne: "राहु"       }, startDate: "2038-07-12", endDate: "2041-03-10", durationYears: 2.6667, isActive: false },
        ],
      },
      { planet: { en: "Saturn", ne: "शनि" }, startDate: "2041-03-10", endDate: "2060-03-10", durationYears: 19, isActive: false, antardashas: [] },
    ],
  },
};

// ─── Zodiac SVG symbols ───────────────────────────────────────────────────────
const ZODIAC_SYMBOLS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
const PLANET_SYMBOLS = { Sun:"☉", Moon:"☽", Mars:"♂", Mercury:"☿", Jupiter:"♃", Venus:"♀", Saturn:"♄", Rahu:"☊", Ketu:"☋" };
const PLANET_COLORS = {
  Sun:"#D97706", Moon:"#6366F1", Mars:"#DC2626", Mercury:"#059669",
  Jupiter:"#D97706", Venus:"#BE185D", Saturn:"#7C3AED", Rahu:"#374151", Ketu:"#92400E",
};
const DIGNITY_COLORS = {
  "Exalted":      { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  "Debilitated":  { bg: "#FEE2E2", text: "#991B1B", border: "#F87171" },
  "Own Sign":     { bg: "#DCFCE7", text: "#14532D", border: "#4ADE80" },
  "Mulatrikona":  { bg: "#EDE9FE", text: "#4C1D95", border: "#A78BFA" },
  "Neutral":      { bg: "#F3F4F6", text: "#374151", border: "#D1D5DB" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const dignityStyle = (en) => DIGNITY_COLORS[en] || DIGNITY_COLORS["Neutral"];

// ─── North-Indian Kundali Grid ────────────────────────────────────────────────
// Layout: fixed 4×4 diamond grid (12 houses + center)
// House positions in the grid (row, col) — North Indian style
const GRID_POSITIONS = [
  { house: 1,  row: 0, col: 2 }, // top center-right
  { house: 2,  row: 0, col: 3 }, // top right
  { house: 3,  row: 1, col: 3 }, // right top
  { house: 4,  row: 2, col: 3 }, // right bottom
  { house: 5,  row: 3, col: 3 }, // bottom right
  { house: 6,  row: 3, col: 2 }, // bottom center-right
  { house: 7,  row: 3, col: 1 }, // bottom center-left
  { house: 8,  row: 3, col: 0 }, // bottom left
  { house: 9,  row: 2, col: 0 }, // left bottom
  { house: 10, row: 1, col: 0 }, // left top
  { house: 11, row: 0, col: 0 }, // top left
  { house: 12, row: 0, col: 1 }, // top center-left
];

function KundaliGrid({ planets, houses, title, ascendant }) {
  const housePlanets = {};
  for (let h = 1; h <= 12; h++) housePlanets[h] = [];
  planets?.forEach((p) => {
    if (p.house >= 1 && p.house <= 12) housePlanets[p.house].push(p);
  });

  return (
    <div style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>
      <div style={{ textAlign:"center", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#78350F", letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(4, 1fr)",
        width: "100%", aspectRatio: "1/1", border: "2px solid #D97706",
        background: "#FFFBF0", position: "relative", borderRadius: 4,
      }}>
        {/* Diagonal lines for center diamond */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:1 }} viewBox="0 0 400 400" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="200" y2="200" stroke="#D97706" strokeWidth="1.5" opacity="0.5" />
          <line x1="400" y1="0" x2="200" y2="200" stroke="#D97706" strokeWidth="1.5" opacity="0.5" />
          <line x1="0" y1="400" x2="200" y2="200" stroke="#D97706" strokeWidth="1.5" opacity="0.5" />
          <line x1="400" y1="400" x2="200" y2="200" stroke="#D97706" strokeWidth="1.5" opacity="0.5" />
          <rect x="100" y="100" width="200" height="200" fill="#FEF9EC" stroke="#D97706" strokeWidth="1.5" opacity="0.7" transform="rotate(0 200 200)" />
        </svg>

        {/* 12 houses */}
        {GRID_POSITIONS.map(({ house, row, col }) => {
          const h = houses?.[house - 1];
          const pList = housePlanets[house] || [];
          const isAsc = house === 1;
          return (
            <div key={house} style={{
              gridColumn: col + 1, gridRow: row + 1,
              border: "1px solid #E5C87D",
              padding: "4px 5px", position: "relative", zIndex: 2,
              background: isAsc ? "#FEF3C7" : "transparent",
              minHeight: 0, overflow: "hidden",
              display: "flex", flexDirection: "column", gap: 2,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <span style={{ fontSize: 9, color: "#92400E", fontWeight: 700, lineHeight: 1 }}>{house}</span>
                <span style={{ fontSize: 10, color: "#B45309", lineHeight: 1 }}>{h ? ZODIAC_SYMBOLS[h.rashi ? ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"].indexOf(h.rashi.en) : 0] : ""}</span>
              </div>
              <div style={{ fontSize: 8, color: "#6B7280", lineHeight: 1.2, fontFamily: "sans-serif" }}>{h?.rashi?.ne}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap: 1, marginTop: "auto" }}>
                {pList.map((p) => (
                  <span key={p.name.en} title={`${p.name.en} — ${p.rashi.en} ${p.dms}`} style={{
                    fontSize: 8.5, fontWeight: 700, lineHeight: 1,
                    color: PLANET_COLORS[p.name.en] || "#374151",
                    fontFamily: "sans-serif",
                    whiteSpace: "nowrap",
                  }}>
                    {PLANET_SYMBOLS[p.name.en]}{p.isRetrograde ? "®" : ""}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        {/* Center cell — Lagna info */}
        <div style={{
          gridColumn: "2 / 4", gridRow: "2 / 4",
          zIndex: 3, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: 6, pointerEvents: "none",
        }}>
          <div style={{ fontSize: 9, color: "#92400E", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "sans-serif" }}>लग्न</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#78350F", marginTop: 2 }}>{ascendant?.rashi?.ne}</div>
          <div style={{ fontSize: 9, color: "#B45309", fontFamily: "sans-serif", marginTop: 1 }}>{ascendant?.rashi?.en}</div>
          <div style={{ fontSize: 8, color: "#92400E", marginTop: 3, fontFamily: "sans-serif" }}>{ascendant?.dms}</div>
        </div>
      </div>
      {/* Legend */}
      <div style={{ display:"flex", flexWrap:"wrap", gap: "4px 10px", marginTop: 8, justifyContent:"center" }}>
        {Object.entries(PLANET_SYMBOLS).map(([p, sym]) => (
          <span key={p} style={{ fontSize: 10, color: PLANET_COLORS[p], fontFamily:"sans-serif", fontWeight:600 }}>
            {sym} {p}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, icon }) {
  return (
    <div style={{ marginBottom: 20, borderBottom: "2px solid #F59E0B", paddingBottom: 10 }}>
      <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#78350F", fontFamily:"'Playfair Display', serif", letterSpacing: "0.02em" }}>{title}</h2>
          {subtitle && <p style={{ margin: 0, fontSize: 12, color: "#92400E", fontFamily:"sans-serif", marginTop: 2 }}>{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ text, color = "#F59E0B", bg = "#FEF3C7" }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, color, background: bg,
      border: `1px solid ${color}`, fontFamily:"sans-serif", letterSpacing:"0.03em",
    }}>{text}</span>
  );
}

// ─── Planet Row ───────────────────────────────────────────────────────────────
function PlanetRow({ planet, index }) {
  const ds = dignityStyle(planet.dignity?.en);
  return (
    <div style={{
      display:"grid", gridTemplateColumns: "28px 1fr 1fr 1fr 90px 40px 40px",
      alignItems:"center", gap: 8, padding: "10px 14px",
      background: index % 2 === 0 ? "#FFFBF0" : "#FEF9E7",
      borderBottom: "1px solid #FDE68A",
      fontFamily:"sans-serif", fontSize: 12,
    }}>
      <span style={{ fontSize: 18, textAlign:"center", color: PLANET_COLORS[planet.name.en] }}>
        {PLANET_SYMBOLS[planet.name.en]}
      </span>
      <div>
        <div style={{ fontWeight: 700, color: "#1C1917", fontSize: 13 }}>{planet.name.ne}</div>
        <div style={{ color: "#78716C", fontSize: 11 }}>{planet.name.en}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600, color: "#292524" }}>{planet.rashi?.ne}</div>
        <div style={{ color: "#78716C", fontSize: 11 }}>{planet.rashi?.en}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600, color: "#292524" }}>{planet.nakshatra?.ne}</div>
        <div style={{ color: "#78716C", fontSize: 11 }}>{planet.nakshatra?.en} — P{planet.pada}</div>
      </div>
      <span style={{
        padding:"3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
        background: ds.bg, color: ds.text, border: `1px solid ${ds.border}`,
        textAlign:"center",
      }}>{planet.dignity?.ne}</span>
      <div style={{ textAlign:"center", color:"#44403C", fontSize: 11 }}>H{planet.house}</div>
      <div style={{ textAlign:"center" }}>
        {planet.isRetrograde && <span style={{ color:"#DC2626", fontSize: 13, fontWeight:800 }} title="Retrograde">®</span>}
      </div>
    </div>
  );
}

// ─── Dasha Timeline ───────────────────────────────────────────────────────────
function DashaRow({ dasha, current, isLast }) {
  const [open, setOpen] = useState(dasha.isActive);
  const pColor = PLANET_COLORS[dasha.planet.en] || "#78350F";

  const fmt = (d) => { try { return new Date(d).toLocaleDateString("en-IN", { year:"numeric", month:"short" }); } catch { return d; } };

  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid #FDE68A" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display:"flex", alignItems:"center", gap: 12, padding:"11px 16px",
          cursor:"pointer", background: dasha.isActive ? "#FEF3C7" : "transparent",
          transition:"background 0.2s",
        }}
      >
        <span style={{ fontSize: 18, color: pColor, width: 24, textAlign:"center" }}>{PLANET_SYMBOLS[dasha.planet.en]}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display:"flex", alignItems:"center", gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#1C1917", fontFamily:"sans-serif" }}>{dasha.planet.ne}</span>
            <span style={{ fontSize: 12, color:"#78716C", fontFamily:"sans-serif" }}>{dasha.planet.en}</span>
            {dasha.isActive && <Badge text="सक्रिय / Active" color="#D97706" bg="#FEF3C7" />}
          </div>
          <div style={{ fontSize: 11, color:"#78716C", marginTop: 3, fontFamily:"sans-serif" }}>
            {fmt(dasha.startDate)} → {fmt(dasha.endDate)} &nbsp;·&nbsp; {dasha.durationYears} yrs
          </div>
        </div>
        {/* Bar */}
        <div style={{ width: 80, height: 6, background:"#FDE68A", borderRadius: 3, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${(dasha.durationYears / 20) * 100}%`, background: pColor, borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: 12, color:"#78716C", transform: open?"rotate(180deg)":"rotate(0)", transition:"0.2s", fontFamily:"sans-serif" }}>▾</span>
      </div>

      {open && dasha.antardashas?.length > 0 && (
        <div style={{ background:"#FFFBF0", borderTop:"1px solid #FDE68A" }}>
          {dasha.antardashas.map((ad, i) => {
            const adColor = PLANET_COLORS[ad.planet.en] || "#78350F";
            return (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap: 10, padding:"8px 16px 8px 52px",
                borderBottom: i < dasha.antardashas.length - 1 ? "1px solid #FEF3C7" : "none",
                background: ad.isActive ? "#FFFBEF" : "transparent",
              }}>
                <span style={{ fontSize: 14, color: adColor }}>{PLANET_SYMBOLS[ad.planet.en]}</span>
                <div style={{ flex: 1, fontFamily:"sans-serif" }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color:"#292524" }}>{ad.planet.ne} </span>
                  <span style={{ fontSize: 11, color:"#78716C" }}>{ad.planet.en}</span>
                  {ad.isActive && <Badge text="अन्तर्दशा" color="#059669" bg="#DCFCE7" />}
                </div>
                <div style={{ fontSize: 11, color:"#78716C", fontFamily:"sans-serif", textAlign:"right" }}>
                  {fmt(ad.startDate)} → {fmt(ad.endDate)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function KundaliDisplay() {

    const [Loading, setLoading] = useState(true)

    const [data, setdata] = useState({})

    const navigate = useRouter()

    const params = useParams()
    const id = params.id

    const {KundaliDatas} = useKundaliStores()
    
//here we write code
    const fetchData = async()=>{
        setLoading(true)
        console.log(KundaliDatas)
        try {
      const data = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(KundaliDatas[id-1]),
      });

      const res = await data.json();
      if(res.status==500){
        // navigate("/")
        throw new Error(res.error)
      }
      toast.success("We Got Something Here");

      console.log(res)

      setdata(res)
    } catch (error) {
      toast.error(error?.message || "Failed To Create");
    } finally {
      setLoading(false);
    }
    }

    useEffect(()=>{
        fetchData()
    },[params.id])
  const [activeTab, setActiveTab] = useState("overview");
  const d = data;

  if(Loading){
    return  <div className='flex justify-center items-center h-[100dvh]'>
        <LoaderIcon className='duratio-700 animate-spin' size={64}/>
      </div>
  }

  if (!d?.success) {
    return (
      <div style={{ padding: 40, textAlign:"center", color:"#DC2626", fontFamily:"sans-serif" }}>
        <div style={{ fontSize: 40 }}>⚠</div>
        <div style={{ fontWeight: 600, marginTop: 12 }}>Chart data unavailable</div>
        <div style={{ fontSize: 13, marginTop: 6, color:"#78716C" }}>{d?.error || "No data provided"}</div>
      </div>
    );
  }

  const { meta, summary, ascendant, planets, houses, d9, dasha } = d;

  const tabs = [
    { id: "overview",  label: "Overview",  labelNe: "सारांश",  icon: "🪐" },
    { id: "planets",   label: "Planets",   labelNe: "ग्रह",    icon: "✨" },
    { id: "charts",    label: "Charts",    labelNe: "कुण्डली", icon: "◈" },
    { id: "d9",        label: "Navamsa",   labelNe: "नवांश",   icon: "◇" },
    { id: "houses",    label: "Houses",    labelNe: "भाव",     icon: "⌂" },
    { id: "dasha",     label: "Dasha",     labelNe: "दशा",     icon: "⏳" },
  ];

  const card = (children, style = {}) => (
    <div style={{
      background:"#FFFEF7", border:"1px solid #FDE68A", borderRadius: 10,
      padding: 20, boxShadow:"0 1px 6px rgba(212,135,0,0.08)",
      ...style,
    }}>{children}</div>
  );

  const labelVal = (label, value, valueStyle = {}) => (
    <div style={{ display:"flex", flexDirection:"column", gap: 2, fontFamily:"sans-serif" }}>
      <span style={{ fontSize: 10, fontWeight: 700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color:"#1C1917", ...valueStyle }}>{value}</span>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FFFBF0 0%, #FEF3C7 40%, #FFFBF0 100%)",
      fontFamily: "'Noto Serif', 'Noto Serif Devanagari', Georgia, serif",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=Noto+Serif:wght@400;600&family=Noto+Serif+Devanagari:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #FEF3C7; }
        ::-webkit-scrollbar-thumb { background: #F59E0B; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #78350F 0%, #92400E 50%, #B45309 100%)",
        color: "#FEF3C7", padding: "28px 24px 24px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative mandala circles */}
        <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", border:"1px solid rgba(254,243,199,0.15)" }} />
        <div style={{ position:"absolute", top:-40, right:-40, width:140, height:140, borderRadius:"50%", border:"1px solid rgba(254,243,199,0.1)" }} />
        <div style={{ position:"absolute", bottom:-80, left:-80, width:240, height:240, borderRadius:"50%", border:"1px solid rgba(254,243,199,0.1)" }} />

        <div style={{ maxWidth: 900, margin:"0 auto", position:"relative" }}>
          {/* Top ornament */}
          <div style={{ textAlign:"center", marginBottom: 6, opacity:0.7, fontSize: 18, letterSpacing: 6 }}>✦ ॐ ✦</div>

          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-end", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing:"0.2em", textTransform:"uppercase", opacity:0.8, marginBottom: 6, fontFamily:"sans-serif" }}>
                वैदिक जन्मपत्रिका / Vedic Birth Chart
              </div>
              <h1 style={{ margin: 0, fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 800, fontFamily:"'Playfair Display', serif", color:"#FEF3C7", letterSpacing:"0.01em" }}>
                {meta?.name || "Birth Chart"}
              </h1>
              <div style={{ marginTop: 8, opacity:0.85, fontSize: 13, display:"flex", flexWrap:"wrap", gap:"6px 20px", fontFamily:"sans-serif" }}>
                <span>📅 {meta?.dob?.ad} <span style={{ opacity:0.7, fontSize:11 }}>(AD)</span></span>
                {meta?.dob?.bs && <span>📅 {meta?.dob?.bs} <span style={{ opacity:0.7, fontSize:11 }}>(BS)</span></span>}
                <span>⏰ {meta?.time}</span>
                <span>📍 {meta?.location?.country}{meta?.location?.region ? `, ${meta.location.region}` : ""}</span>
              </div>
            </div>
            <div style={{ textAlign:"right", opacity:0.85, fontFamily:"sans-serif", fontSize: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color:"#FEF3C7", marginBottom: 4 }}>
                लग्न: {summary?.lagna?.rashi?.ne}
              </div>
              <div>Ayanamsa: {meta?.ayanamsa}</div>
              <div>{meta?.houseSystem} Houses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:"#FEF3C7", borderBottom:"2px solid #F59E0B", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", overflowX:"auto", padding:"0 16px" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding:"12px 16px", border:"none", background:"none", cursor:"pointer",
                borderBottom: activeTab === t.id ? "3px solid #D97706" : "3px solid transparent",
                color: activeTab === t.id ? "#92400E" : "#78716C",
                fontWeight: activeTab === t.id ? 700 : 500,
                fontSize: 13, fontFamily:"sans-serif", whiteSpace:"nowrap",
                display:"flex", alignItems:"center", gap: 5,
                transition:"all 0.15s",
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              <span style={{ fontSize: 11, opacity:0.7 }}>{t.labelNe}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 16px 48px" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div style={{ display:"flex", flexDirection:"column", gap: 20 }}>
            <SectionHeader title="Chart Summary — जन्मपत्र सारांश" icon="🪐" subtitle="Key positions and planetary status" />

            {/* Summary cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              {card(<>
                <div style={{ fontSize: 10, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, fontFamily:"sans-serif" }}>लग्न / Ascendant</div>
                <div style={{ fontSize: 28, fontWeight:800, color:"#78350F", fontFamily:"'Playfair Display', serif" }}>{summary?.lagna?.rashi?.ne}</div>
                <div style={{ fontSize: 15, color:"#92400E", marginTop:2 }}>{summary?.lagna?.rashi?.en} ({summary?.lagna?.rashi?.isoEn})</div>
                <div style={{ marginTop:10, fontSize: 12, color:"#78716C", fontFamily:"sans-serif" }}>Lord: <b style={{color:"#78350F"}}>{summary?.lagna?.lord}</b> in House {summary?.lagna?.lordHouse}</div>
              </>)}

              {card(<>
                <div style={{ fontSize: 10, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, fontFamily:"sans-serif" }}>चन्द्र / Moon</div>
                <div style={{ fontSize: 22, fontWeight:800, color:"#78350F", fontFamily:"'Playfair Display', serif" }}>{summary?.moonSign?.ne}</div>
                <div style={{ fontSize: 13, color:"#92400E", marginTop:2 }}>{summary?.moonSign?.en}</div>
                <div style={{ marginTop:8, fontSize: 12, color:"#78716C", fontFamily:"sans-serif" }}>
                  Nakshatra: <b style={{color:"#78350F"}}>{summary?.moonNakshatra?.ne}</b><br/>
                  <span style={{fontSize:11}}>{summary?.moonNakshatra?.en} · Lord: {summary?.moonNakshatraLord}</span>
                </div>
              </>)}

              {card(<>
                <div style={{ fontSize: 10, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, fontFamily:"sans-serif" }}>सूर्य / Sun</div>
                <div style={{ fontSize: 22, fontWeight:800, color:"#78350F", fontFamily:"'Playfair Display', serif" }}>{summary?.sunSign?.ne}</div>
                <div style={{ fontSize: 13, color:"#92400E", marginTop:2 }}>{summary?.sunSign?.en}</div>
                <div style={{ marginTop:8, fontSize: 12, color:"#78716C", fontFamily:"sans-serif" }}>Solar Sign (Vedic Sidereal)</div>
              </>)}

              {summary?.yogakaraka && card(<>
                <div style={{ fontSize: 10, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, fontFamily:"sans-serif" }}>योगकारक / Yogakaraka</div>
                <div style={{ fontSize: 22, fontWeight:800, color:"#78350F", fontFamily:"'Playfair Display', serif" }}>{summary?.yogakaraka?.ne}</div>
                <div style={{ fontSize: 13, color:"#92400E", marginTop:2 }}>{summary?.yogakaraka?.en}</div>
                <div style={{ marginTop:8, fontSize: 12, color:"#78716C", fontFamily:"sans-serif" }}>Kendra + Trikona lord — most benefic planet</div>
              </>)}
            </div>

            {/* Planet status groups */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              {[
                { label:"उच्च / Exalted", planets: summary?.exaltedPlanets, color:"#D97706", bg:"#FEF3C7", border:"#F59E0B" },
                { label:"नीच / Debilitated", planets: summary?.debilitatedPlanets, color:"#DC2626", bg:"#FEE2E2", border:"#F87171" },
                { label:"वक्री / Retrograde", planets: summary?.retrogradePlanets, color:"#7C3AED", bg:"#EDE9FE", border:"#A78BFA" },
                { label:"वर्गोत्तम / Vargottama", planets: summary?.vargottamaPlanets, color:"#059669", bg:"#DCFCE7", border:"#4ADE80" },
              ].map(({ label, planets: ps, color, bg, border }) => (
                <div key={label} style={{ background: bg, border:`1px solid ${border}`, borderRadius: 10, padding:"14px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight:700, color, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom: 8, fontFamily:"sans-serif" }}>{label}</div>
                  {ps?.length > 0
                    ? <div style={{ display:"flex", flexWrap:"wrap", gap: 6 }}>{ps.map((p) => <Badge key={p.en} text={`${p.ne} · ${p.en}`} color={color} bg="#FFFFFF" />)}</div>
                    : <div style={{ fontSize: 12, color:"#78716C", fontFamily:"sans-serif" }}>None</div>
                  }
                </div>
              ))}
            </div>

            {/* Current Dasha spotlight */}
            {dasha?.current && card(
              <div>
                <div style={{ fontSize: 10, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom: 12, fontFamily:"sans-serif" }}>वर्तमान दशा / Current Dasha Period</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap: 16, alignItems:"center" }}>
                  {[
                    { label:"महादशा", val: dasha.current.mahadasha },
                    { label:"अन्तर्दशा", val: dasha.current.antardasha },
                    { label:"प्रत्यन्तर्दशा", val: dasha.current.pratyantardasha },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ fontFamily:"sans-serif" }}>
                      <div style={{ fontSize: 10, color:"#92400E", fontWeight:600, marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 18, fontWeight:800, color: PLANET_COLORS[val] || "#78350F" }}>
                        {PLANET_SYMBOLS[val]} {val}
                      </div>
                    </div>
                  ))}
                  <div style={{ fontFamily:"sans-serif", marginLeft:"auto" }}>
                    <div style={{ fontSize: 10, color:"#92400E", fontWeight:600, marginBottom: 2 }}>Ends</div>
                    <div style={{ fontSize: 14, fontWeight:700, color:"#78350F" }}>{dasha.current.pratyantardashaEndDate}</div>
                  </div>
                </div>
              </div>
            , { borderLeft:"4px solid #F59E0B" })}

            {/* Meta info */}
            {card(
              <div>
                <div style={{ fontSize: 10, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom: 12, fontFamily:"sans-serif" }}>जन्म विवरण / Birth Details</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
                  {labelVal("Date (AD)", meta?.dob?.ad)}
                  {meta?.dob?.bs && labelVal("Date (BS)", meta?.dob?.bs)}
                  {labelVal("Time", meta?.time)}
                  {labelVal("Timezone", `UTC +${meta?.timezone}`)}
                  {labelVal("Latitude", meta?.location?.lat)}
                  {labelVal("Longitude", meta?.location?.lon)}
                  {labelVal("Elevation", `${meta?.location?.elevation || 0} m`)}
                  {labelVal("Julian Day", meta?.julianDay)}
                  {labelVal("Ayanamsa", meta?.ayanamsa)}
                  {labelVal("House System", meta?.houseSystem)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PLANETS TAB */}
        {activeTab === "planets" && (
          <div style={{ display:"flex", flexDirection:"column", gap: 20 }}>
            <SectionHeader title="Planetary Positions — ग्रह स्थिति" icon="✨" subtitle="All 9 Grahas — Sidereal (Lahiri Ayanamsa)" />
            {card(
              <div style={{ overflowX:"auto" }}>
                <div style={{ display:"grid", gridTemplateColumns:"28px 1fr 1fr 1fr 90px 40px 40px", gap: 8, padding:"8px 14px 10px", background:"#FEF3C7", borderRadius:"6px 6px 0 0", borderBottom:"2px solid #F59E0B", fontFamily:"sans-serif", fontSize: 11, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  <span></span><span>ग्रह / Planet</span><span>राशि / Sign</span><span>नक्षत्र / Nakshatra</span><span>स्थिति / Dignity</span><span>भाव</span><span>R</span>
                </div>
                <div style={{ borderRadius:"0 0 6px 6px", overflow:"hidden", border:"1px solid #FDE68A", borderTop:"none" }}>
                  {planets?.map((p, i) => <PlanetRow key={p.name.en} planet={p} index={i} />)}
                </div>
              </div>
            , { padding: 0, overflow:"hidden" })}

            {/* Detailed cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {planets?.map((p) => {
                const ds = dignityStyle(p.dignity?.en);
                return (
                  <div key={p.name.en} style={{ background:"#FFFEF7", border:`2px solid ${PLANET_COLORS[p.name.en]}30`, borderRadius: 10, padding:"16px", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:10, right:14, fontSize: 36, opacity:0.08, color: PLANET_COLORS[p.name.en], fontFamily:"sans-serif" }}>{PLANET_SYMBOLS[p.name.en]}</div>
                    <div style={{ display:"flex", alignItems:"center", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 26, color: PLANET_COLORS[p.name.en] }}>{PLANET_SYMBOLS[p.name.en]}</span>
                      <div>
                        <div style={{ fontWeight:800, fontSize: 16, color:"#1C1917", fontFamily:"sans-serif" }}>{p.name.ne}</div>
                        <div style={{ fontSize: 12, color:"#78716C", fontFamily:"sans-serif" }}>{p.name.en} {p.isRetrograde && <span style={{color:"#DC2626", fontWeight:700}}>® Retrograde</span>}</div>
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 8 }}>
                      {[
                        { l:"राशि", v: p.rashi?.ne, v2: p.rashi?.en },
                        { l:"नक्षत्र", v: p.nakshatra?.ne, v2: `${p.nakshatra?.en} P${p.pada}` },
                        { l:"भाव", v: `House ${p.house}`, v2: "" },
                        { l:"अंश", v: p.dms, v2: "" },
                      ].map(({ l, v, v2 }) => (
                        <div key={l} style={{ fontFamily:"sans-serif" }}>
                          <div style={{ fontSize:10, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:2 }}>{l}</div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#1C1917" }}>{v}</div>
                          {v2 && <div style={{ fontSize:11, color:"#78716C" }}>{v2}</div>}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, padding:"6px 10px", borderRadius: 6, background: ds.bg, border:`1px solid ${ds.border}`, display:"inline-block" }}>
                      <span style={{ fontSize:12, fontWeight:700, color: ds.text, fontFamily:"sans-serif" }}>{p.dignity?.ne} — {p.dignity?.en}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHARTS TAB */}
        {activeTab === "charts" && (
          <div style={{ display:"flex", flexDirection:"column", gap: 24 }}>
            <SectionHeader title="D1 Rashi Chart — लग्न कुण्डली" icon="◈" subtitle="Birth Chart (North Indian Diamond Style)" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              <div style={{ background:"#FFFEF7", border:"1px solid #FDE68A", borderRadius:10, padding:20, boxShadow:"0 1px 6px rgba(212,135,0,0.08)" }}>
                <KundaliGrid planets={planets} houses={houses} ascendant={ascendant} title="D1 — Lagna Kundali · लग्न कुण्डली" />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap: 14 }}>
                <div style={{ background:"#FEF3C7", border:"1px solid #F59E0B", borderRadius:10, padding:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, fontFamily:"sans-serif" }}>Ascendant Detail</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, fontFamily:"sans-serif" }}>
                    {[
                      ["Lagna / लग्न", `${ascendant?.rashi?.ne} (${ascendant?.rashi?.en})`],
                      ["Lagna Lord", ascendant?.rashiLord],
                      ["Degree", ascendant?.dms],
                      ["Nakshatra", `${ascendant?.nakshatra?.ne}`],
                      ["Nak. Lord", ascendant?.nakshatraLord],
                      ["Pada", `${ascendant?.pada}`],
                    ].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.06em" }}>{l}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:"#1C1917", marginTop:2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background:"#FFFEF7", border:"1px solid #FDE68A", borderRadius:10, padding:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, fontFamily:"sans-serif" }}>Planet → House Map</div>
                  {planets?.map((p) => (
                    <div key={p.name.en} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #FEF3C7", fontFamily:"sans-serif", fontSize:13 }}>
                      <span style={{ color: PLANET_COLORS[p.name.en], fontWeight:600 }}>{PLANET_SYMBOLS[p.name.en]} {p.name.ne}</span>
                      <span style={{ color:"#78716C", fontSize:11 }}>{p.rashi?.ne} · H{p.house}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* D9 TAB */}
        {activeTab === "d9" && (
          <div style={{ display:"flex", flexDirection:"column", gap: 24 }}>
            <SectionHeader title="D9 Navamsa Chart — नवांश कुण्डली" icon="◇" subtitle="9th divisional chart — Marriage, inner strength, Dharma" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              <div style={{ background:"#FFFEF7", border:"1px solid #FDE68A", borderRadius:10, padding:20 }}>
                <KundaliGrid
                  planets={d9?.planets?.map(p => ({ ...p, rashi: p.rashi, house: p.house, longitude: 0, dms: "", nakshatra: { en:"", ne:"" }, isRetrograde: false }))}
                  houses={Array.from({ length: 12 }, (_, i) => {
                    const idx = (i + d9?.ascendant?.rashiIndex) % 12;
                    return { house: i+1, rashi: ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][idx] ? { en: ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][idx], ne: ["मेष","वृषभ","मिथुन","कर्कट","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुम्भ","मीन"][idx] } : null };
                  })}
                  ascendant={{ rashi: d9?.ascendant, dms: "" }}
                  title="D9 — Navamsa Kundali · नवांश कुण्डली"
                />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ background:"#FEF3C7", border:"1px solid #F59E0B", borderRadius:10, padding:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, fontFamily:"sans-serif" }}>D9 Ascendant</div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#78350F", fontFamily:"'Playfair Display', serif" }}>{d9?.ascendant?.ne}</div>
                  <div style={{ fontSize:13, color:"#92400E", marginTop:4, fontFamily:"sans-serif" }}>{d9?.ascendant?.en} · Lord: {d9?.ascendant?.lord}</div>
                </div>
                {d9?.vargottamaPlanets?.length > 0 && (
                  <div style={{ background:"#DCFCE7", border:"1px solid #4ADE80", borderRadius:10, padding:16 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#14532D", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, fontFamily:"sans-serif" }}>वर्गोत्तम / Vargottama Planets</div>
                    <div style={{ fontSize:12, color:"#166534", marginBottom:8, fontFamily:"sans-serif" }}>Same sign in D1 and D9 — exceptionally strong</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{d9.vargottamaPlanets.map(p => <Badge key={p.en} text={`${p.ne} · ${p.en}`} color="#059669" bg="#F0FDF4" />)}</div>
                  </div>
                )}
                <div style={{ background:"#FFFEF7", border:"1px solid #FDE68A", borderRadius:10, padding:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, fontFamily:"sans-serif" }}>D1 → D9 Rashi Mapping</div>
                  {d9?.planets?.map((p, i) => {
                    const ds = dignityStyle(p.dignity?.en);
                    return (
                      <div key={p.name.en} style={{ display:"grid", gridTemplateColumns:"26px 1fr auto auto", gap:8, alignItems:"center", padding:"6px 0", borderBottom: i < d9.planets.length-1 ? "1px solid #FEF3C7":"none", fontFamily:"sans-serif", fontSize:12 }}>
                        <span style={{ color: PLANET_COLORS[p.name.en], fontSize:15 }}>{PLANET_SYMBOLS[p.name.en]}</span>
                        <span style={{ fontWeight:600, color:"#1C1917" }}>{p.name.ne} <span style={{color:"#78716C",fontSize:11}}>{p.name.en}</span></span>
                        <span style={{ color:"#78716C", fontSize:11 }}>{p.rashi?.ne} H{p.house}</span>
                        <span style={{ padding:"2px 6px", borderRadius:4, fontSize:10, fontWeight:700, background:ds.bg, color:ds.text, border:`1px solid ${ds.border}` }}>{p.dignity?.en === "Own Sign" ? "Own" : p.dignity?.en}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HOUSES TAB */}
        {activeTab === "houses" && (
          <div style={{ display:"flex", flexDirection:"column", gap: 20 }}>
            <SectionHeader title="12 Houses — भाव विवरण" icon="⌂" subtitle="House cusps with rashi, lord, and significances" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {houses?.map((h) => {
                const planets_in = planets?.filter(p => p.house === h.house) || [];
                return (
                  <div key={h.house} style={{ background:"#FFFEF7", border:"1px solid #FDE68A", borderRadius:10, padding:16, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:10, right:12, fontSize:32, opacity:0.07, fontFamily:"sans-serif", fontWeight:800, color:"#D97706" }}>{h.house}</div>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:32, height:32, background:"#FEF3C7", border:"2px solid #F59E0B", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#92400E", fontFamily:"sans-serif", fontSize:14 }}>{h.house}</div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:15, color:"#1C1917", fontFamily:"sans-serif" }}>{h.rashi?.ne}</div>
                          <div style={{ fontSize:11, color:"#78716C", fontFamily:"sans-serif" }}>{h.rashi?.en} · Lord: {h.rashiLord}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize:12, color:"#78716C", fontFamily:"sans-serif", marginBottom:8, fontStyle:"italic" }}>
                      {h.meaning?.en}
                      {h.meaning?.ne && <span style={{ display:"block", color:"#B45309" }}>{h.meaning?.ne}</span>}
                    </div>
                    <div style={{ fontSize:11, color:"#92400E", fontFamily:"sans-serif", marginBottom:8 }}>Cusp: {h.dms} ({h.cuspLongitude?.toFixed(2)}°)</div>
                    {planets_in.length > 0 && (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                        {planets_in.map(p => (
                          <span key={p.name.en} style={{ fontSize:11, fontWeight:700, color: PLANET_COLORS[p.name.en], fontFamily:"sans-serif", background:`${PLANET_COLORS[p.name.en]}18`, padding:"2px 7px", borderRadius:4 }}>
                            {PLANET_SYMBOLS[p.name.en]} {p.name.ne}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DASHA TAB */}
        {activeTab === "dasha" && (
          <div style={{ display:"flex", flexDirection:"column", gap: 20 }}>
            <SectionHeader title="Vimshottari Dasha — विंशोत्तरी दशा" icon="⏳" subtitle="120-year planetary period system based on Moon's nakshatra" />

            {/* Current period highlight */}
            {dasha?.current && (
              <div style={{ background:"linear-gradient(135deg, #FEF3C7, #FFFBF0)", border:"2px solid #F59E0B", borderRadius:12, padding:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14, fontFamily:"sans-serif" }}>🔮 वर्तमान समय / Current Period</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:20 }}>
                  {[
                    { label:"महादशा\nMahadasha", val: dasha.current.mahadasha, size: 28 },
                    { label:"अन्तर्दशा\nAntardasha", val: dasha.current.antardasha, size: 22 },
                    { label:"प्रत्यन्तर्दशा\nPratyantardasha", val: dasha.current.pratyantardasha, size: 18 },
                  ].map(({ label, val, size }) => (
                    <div key={label} style={{ fontFamily:"sans-serif", textAlign:"center", flex:1, minWidth:100 }}>
                      <div style={{ fontSize:10, color:"#92400E", fontWeight:700, whiteSpace:"pre-line", lineHeight:1.4, marginBottom:6 }}>{label}</div>
                      <div style={{ fontSize:size, fontWeight:800, color: PLANET_COLORS[val] || "#78350F" }}>{PLANET_SYMBOLS[val]} {val}</div>
                    </div>
                  ))}
                  <div style={{ fontFamily:"sans-serif", textAlign:"center", flex:1, minWidth:100 }}>
                    <div style={{ fontSize:10, color:"#92400E", fontWeight:700, marginBottom:6 }}>समाप्ति\nEnds</div>
                    <div style={{ fontSize:16, fontWeight:700, color:"#78350F" }}>{dasha.current.pratyantardashaEndDate}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Dasha timeline */}
            <div style={{ background:"#FFFEF7", border:"1px solid #FDE68A", borderRadius:10, overflow:"hidden" }}>
              <div style={{ background:"#FEF3C7", padding:"10px 16px", borderBottom:"2px solid #F59E0B", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#92400E", fontFamily:"sans-serif", textTransform:"uppercase", letterSpacing:"0.08em" }}>Full Dasha Timeline</span>
                <span style={{ fontSize:11, color:"#78716C", fontFamily:"sans-serif" }}>Click to expand Antardashas</span>
              </div>
              {dasha?.dashas?.map((d, i) => (
                <DashaRow key={d.planet.en} dasha={d} current={dasha.current} isLast={i === dasha.dashas.length - 1} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ background:"#78350F", color:"#FEF3C7", textAlign:"center", padding:"16px 24px", fontSize:12, fontFamily:"sans-serif", opacity:0.9 }}>
        <div style={{ letterSpacing:6, marginBottom:4, opacity:0.7 }}>✦ ॐ ✦</div>
        <div>Vedic Kundali · Lahiri Ayanamsa · {meta?.houseSystem} Houses · Calculated: {meta?.calculatedAt?.split("T")[0]}</div>
      </div>
    </div>
  );
}