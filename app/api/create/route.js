/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║         VEDIC KUNDALI API — Next.js App Router                         ║
 * ║         Library : @fusionstrings/panchangam@0.2.1                      ║
 * ║         Ayanamsa: Lahiri (Chitrapaksha) — Sidereal                     ║
 * ║         Region  : Nepal / India   |   Bilingual: Nepali + English      ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * POST /api/kundali
 *
 * Request body (JSON):
 * ┌─────────────┬───────────────────────────────────────────────────────────┐
 * │ name        │ string              (optional)                            │
 * │ gender      │ "male"|"female"     (optional)                            │
 * │ dob         │ "YYYY-MM-DD"        REQUIRED                              │
 * │ dobType     │ "AD" | "BS"         default "AD"                          │
 * │ time        │ "HH:MM"|"HH-MM"    REQUIRED                               │
 * │ ampm        │ "am"|"pm"           omit for 24-hr                        │
 * │ timezone    │ number (UTC offset) default 5.75 = NPT +05:45             │
 * │ lat         │ number              REQUIRED                              │
 * │ lon         │ number              REQUIRED                              │
 * │ elevation   │ number metres       default 0                             │
 * │ country     │ string              (optional, meta only)                 │
 * │ region      │ string              (optional, meta only)                 │
 * └─────────────┴───────────────────────────────────────────────────────────┘
 *
 * Response shape:
 *   { success, meta, summary, ascendant, planets, houses, d9, dasha }
 */

import {
  calculate_houses,
  calculate_planets,
  calculate_vimshottari,
  Location,
  p_julday,
} from "@fusionstrings/panchangam";
import { ADToBS, BSToAD } from "bikram-sambat-js";

// ═══════════════════════════════════════════════════════════════════════════
//  BILINGUAL LOOK-UP TABLES  (English + Nepali / Sanskrit)
// ═══════════════════════════════════════════════════════════════════════════

/** 12 Rashis — index 0 = Mesh (Aries) … 11 = Meen (Pisces) */
const RASHIS = [
  { en: "Aries",        ne: "मेष",        isoEn: "Mesha"       },
  { en: "Taurus",       ne: "वृषभ",       isoEn: "Vrishabha"   },
  { en: "Gemini",       ne: "मिथुन",      isoEn: "Mithuna"     },
  { en: "Cancer",       ne: "कर्कट",      isoEn: "Karkata"     },
  { en: "Leo",          ne: "सिंह",       isoEn: "Simha"       },
  { en: "Virgo",        ne: "कन्या",      isoEn: "Kanya"       },
  { en: "Libra",        ne: "तुला",       isoEn: "Tula"        },
  { en: "Scorpio",      ne: "वृश्चिक",    isoEn: "Vrishchika"  },
  { en: "Sagittarius",  ne: "धनु",        isoEn: "Dhanu"       },
  { en: "Capricorn",    ne: "मकर",        isoEn: "Makara"      },
  { en: "Aquarius",     ne: "कुम्भ",      isoEn: "Kumbha"      },
  { en: "Pisces",       ne: "मीन",        isoEn: "Meena"       },
];

/** 27 Nakshatras — index 0 = Ashwini */
const NAKSHATRAS = [
  { en: "Ashwini",           ne: "अश्विनी",        lord: "Ketu"    },
  { en: "Bharani",           ne: "भरणी",           lord: "Venus"   },
  { en: "Krittika",          ne: "कृत्तिका",       lord: "Sun"     },
  { en: "Rohini",            ne: "रोहिणी",         lord: "Moon"    },
  { en: "Mrigashira",        ne: "मृगशिरा",        lord: "Mars"    },
  { en: "Ardra",             ne: "आर्द्रा",         lord: "Rahu"    },
  { en: "Punarvasu",         ne: "पुनर्वसु",        lord: "Jupiter" },
  { en: "Pushya",            ne: "पुष्य",           lord: "Saturn"  },
  { en: "Ashlesha",          ne: "आश्लेषा",         lord: "Mercury" },
  { en: "Magha",             ne: "मघा",            lord: "Ketu"    },
  { en: "Purva Phalguni",    ne: "पूर्व फाल्गुनी",  lord: "Venus"   },
  { en: "Uttara Phalguni",   ne: "उत्तर फाल्गुनी",  lord: "Sun"     },
  { en: "Hasta",             ne: "हस्त",            lord: "Moon"    },
  { en: "Chitra",            ne: "चित्रा",          lord: "Mars"    },
  { en: "Swati",             ne: "स्वाती",          lord: "Rahu"    },
  { en: "Vishakha",          ne: "विशाखा",          lord: "Jupiter" },
  { en: "Anuradha",          ne: "अनुराधा",         lord: "Saturn"  },
  { en: "Jyeshtha",          ne: "ज्येष्ठा",        lord: "Mercury" },
  { en: "Mula",              ne: "मूल",             lord: "Ketu"    },
  { en: "Purva Ashadha",     ne: "पूर्वाषाढा",      lord: "Venus"   },
  { en: "Uttara Ashadha",    ne: "उत्तराषाढा",      lord: "Sun"     },
  { en: "Shravana",          ne: "श्रवण",           lord: "Moon"    },
  { en: "Dhanishtha",        ne: "धनिष्ठा",         lord: "Mars"    },
  { en: "Shatabhisha",       ne: "शतभिषा",          lord: "Rahu"    },
  { en: "Purva Bhadrapada",  ne: "पूर्वभाद्रपदा",   lord: "Jupiter" },
  { en: "Uttara Bhadrapada", ne: "उत्तरभाद्रपदा",   lord: "Saturn"  },
  { en: "Revati",            ne: "रेवती",           lord: "Mercury" },
];

/** Rashi → lord (English planet name key) */
const RASHI_LORDS = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

/** Planet bilingual names keyed by English name */
const PLANET_NAMES = {
  Sun:     { en: "Sun",      ne: "सूर्य",      isoEn: "Surya"       },
  Moon:    { en: "Moon",     ne: "चन्द्र",      isoEn: "Chandra"     },
  Mars:    { en: "Mars",     ne: "मङ्गल",       isoEn: "Mangal"      },
  Mercury: { en: "Mercury",  ne: "बुध",          isoEn: "Budha"       },
  Jupiter: { en: "Jupiter",  ne: "बृहस्पति",    isoEn: "Brihaspati"  },
  Venus:   { en: "Venus",    ne: "शुक्र",        isoEn: "Shukra"      },
  Saturn:  { en: "Saturn",   ne: "शनि",          isoEn: "Shani"       },
  Rahu:    { en: "Rahu",     ne: "राहु",         isoEn: "Rahu"        },
  Ketu:    { en: "Ketu",     ne: "केतु",         isoEn: "Ketu"        },
};

/** Exaltation signs */
const EXALT = {
  Sun: "Aries", Moon: "Taurus", Mars: "Capricorn", Mercury: "Virgo",
  Jupiter: "Cancer", Venus: "Pisces", Saturn: "Libra",
  Rahu: "Gemini", Ketu: "Sagittarius",
};

/** Debilitation signs */
const DEBIL = {
  Sun: "Libra", Moon: "Scorpio", Mars: "Cancer", Mercury: "Pisces",
  Jupiter: "Capricorn", Venus: "Virgo", Saturn: "Aries",
  Rahu: "Sagittarius", Ketu: "Gemini",
};

/** Mulatrikona sign (classical Parashari) */
const MULA = {
  Sun: "Leo", Moon: "Taurus", Mars: "Aries", Mercury: "Virgo",
  Jupiter: "Sagittarius", Venus: "Libra", Saturn: "Aquarius",
};

/** Vimshottari years per planet (total = 120) */
const DASHA_YEARS = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

/** Fixed Vimshottari sequence */
const DASHA_ORDER = [
  "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury",
];

/** House meanings — bilingual */
const HOUSE_MEANINGS = [
  { en: "Self, Personality, Body",            ne: "स्वयं, व्यक्तित्व, शरीर"        },
  { en: "Wealth, Family, Speech",              ne: "धन, परिवार, वाणी"              },
  { en: "Siblings, Courage, Short Travels",   ne: "भाइबहिनी, साहस, छोटा यात्रा"   },
  { en: "Home, Mother, Happiness",             ne: "घर, आमा, सुख"                  },
  { en: "Children, Education, Intelligence",  ne: "सन्तान, शिक्षा, बुद्धि"        },
  { en: "Enemies, Health, Service",            ne: "शत्रु, स्वास्थ्य, सेवा"        },
  { en: "Marriage, Partnerships",              ne: "विवाह, साझेदारी"               },
  { en: "Transformation, Longevity",           ne: "परिवर्तन, दीर्घायु"            },
  { en: "Luck, Higher Learning, Dharma",       ne: "भाग्य, उच्च शिक्षा, धर्म"     },
  { en: "Career, Status, Father",              ne: "करियर, प्रतिष्ठा, पिता"        },
  { en: "Gains, Friends, Aspirations",         ne: "लाभ, मित्र, आकांक्षा"          },
  { en: "Loss, Liberation, Foreign Lands",     ne: "हानि, मोक्ष, विदेश"            },
];

/** Yogakaraka by Lagna (classical Parashari — planet owning kendra + trikona) */
const YOGAKARAKA_MAP = {
  Cancer: "Mars", Leo: "Mars",
  Taurus: "Saturn", Libra: "Saturn",
  Capricorn: "Venus", Aquarius: "Venus",
};

// ═══════════════════════════════════════════════════════════════════════════
//  PURE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/** Normalise longitude to [0, 360) */
const norm360 = (lng) => ((lng % 360) + 360) % 360;

/** Decimal degrees → DMS string: "14°23'11\"" */
function toDMS(deg) {
  const d = Math.floor(deg);
  const mFull = (deg - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${d}°${String(m).padStart(2, "0")}'${String(s).padStart(2, "0")}"`;
}

/** Longitude → full rashi object (bilingual) */
function longitudeToRashi(longitude) {
  const lng = norm360(longitude);
  const idx = Math.floor(lng / 30);
  const degInRashi = lng % 30;
  const r = RASHIS[idx];
  return {
    rashiIndex: idx,
    en: r.en, ne: r.ne, isoEn: r.isoEn,
    lord: RASHI_LORDS[r.en],
    degreeInRashi: parseFloat(degInRashi.toFixed(4)),
    dms: toDMS(degInRashi),
  };
}

/** Longitude → full nakshatra object (bilingual) */
function longitudeToNakshatra(longitude) {
  const lng = norm360(longitude);
  const span = 360 / 27;          // 13.3333°
  const idx  = Math.floor(lng / span);
  const pada = Math.floor((lng % span) / (span / 4)) + 1;
  const n = NAKSHATRAS[idx];
  return { nakshatraIndex: idx, en: n.en, ne: n.ne, lord: n.lord, pada };
}

/** Classical Vedic dignity of a planet in a sign (English keys) */
function getDignity(planetName, rashiEn) {
  if (EXALT[planetName] === rashiEn) return { en: "Exalted",      ne: "उच्च"       };
  if (DEBIL[planetName] === rashiEn) return { en: "Debilitated",  ne: "नीच"        };
  if (RASHI_LORDS[rashiEn] === planetName) {
    if (MULA[planetName] === rashiEn)    return { en: "Mulatrikona",  ne: "मूलत्रिकोण" };
    return { en: "Own Sign",    ne: "स्वग्रह"    };
  }
  return { en: "Neutral",      ne: "सम"         };
}

// ═══════════════════════════════════════════════════════════════════════════
//  DATE + TIME PARSERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse DOB — AD or BS.
 * Returns { year, month, day, adDate "YYYY-MM-DD", bsDate "YYYY-MM-DD" | null }
 */
function parseDate(date, type) {
  let adDate = date.trim();
  let bsDate = null;

  if (type === "BS") {
    adDate = BSToAD(date.trim());           // bikram-sambat-js helper
    bsDate = date.trim();
  } else {
    try { bsDate = ADToBS(adDate); } catch { /* ignore */ }
  }

  const parts = adDate.split("-").map((p) => p.trim());
  if (parts.length !== 3)
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");

  const [year, month, day] = parts.map(Number);
  if ([year, month, day].some(isNaN))
    throw new Error("Date contains non-numeric parts.");
  if (month < 1 || month > 12) throw new Error("Month must be 1–12.");
  if (day   < 1 || day   > 31) throw new Error("Day must be 1–31.");

  return { year, month, day, adDate, bsDate };
}

/**
 * Parse time string.
 * Accepts: "14:30" | "14-30" | "1430" | "2:30 pm"
 * Returns { hour, minute, decimalHours, timeString }
 */
function parseTime(time, ampm) {
  const raw = time.trim();
  let hourStr, minuteStr;

  if (raw.includes(":")) {
    [hourStr, minuteStr] = raw.split(":");
  } else if (raw.includes("-")) {
    [hourStr, minuteStr] = raw.split("-");
  } else {
    const digits = raw.replace(/\D/g, "");
    hourStr   = digits.length >= 4 ? digits.slice(0, 2) : digits.slice(0, 1);
    minuteStr = digits.length >= 4 ? digits.slice(2, 4) : digits.slice(1, 3);
  }

  let hour   = parseInt(hourStr,   10);
  let minute = parseInt(minuteStr || "0", 10);

  if (isNaN(hour)   || hour   < 0 || hour   > 23) throw new Error(`Invalid hour: "${hourStr}".`);
  if (isNaN(minute) || minute < 0 || minute > 59) throw new Error(`Invalid minute: "${minuteStr}".`);

  if (ampm) {
    const p = ampm.toLowerCase().trim();
    if (p === "pm" && hour !== 12) hour += 12;
    if (p === "am" && hour === 12) hour  =  0;
  }

  return {
    hour, minute,
    decimalHours: hour + minute / 60,
    timeString: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  D9 NAVAMSA  (classical Parashari — computed manually, not from library)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * D9 starting rashi for each D1 rashi (0-indexed).
 * Rule:
 *   Fire  signs (0,4,8)  = Aries (0)
 *   Earth signs (1,5,9)  = Capricorn (9)
 *   Air   signs (2,6,10) = Libra (6)
 *   Water signs (3,7,11) = Cancer (3)
 */
const D9_START = [0, 9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3];

/** D9 rashi index for any ecliptic longitude */
function getD9RashiIdx(longitude) {
  const lng = norm360(longitude);
  const d1Idx      = Math.floor(lng / 30);
  const posInSign  = lng % 30;
  const navamsaNum = Math.floor(posInSign / (30 / 9)); // 0–8
  return (D9_START[d1Idx] + navamsaNum) % 12;
}

/** Build full D9 Navamsa chart from enriched D1 planets + ascendant */
function buildD9(enrichedPlanets, ascLng) {
  const d9AscIdx   = getD9RashiIdx(ascLng);
  const d9AscRashi = RASHIS[d9AscIdx];

  const planets = enrichedPlanets.map((p) => {
    const d9Idx   = getD9RashiIdx(p.longitude);
    const d9R     = RASHIS[d9Idx];
    const d9Lord  = RASHI_LORDS[d9R.en];
    const d9Dig   = getDignity(p.name.en, d9R.en);
    const house   = ((d9Idx - d9AscIdx + 12) % 12) + 1;
    const isVarg  = d9Idx === p.rashiIndex; // same rashi in D1 and D9

    return {
      name:        p.name,
      d1Rashi:     { en: p.rashi.en, ne: p.rashi.ne },
      d9RashiIndex: d9Idx,
      rashi:       { en: d9R.en, ne: d9R.ne, isoEn: d9R.isoEn },
      rashiLord:   d9Lord,
      dignity:     d9Dig,
      house,
      isVargottama: isVarg,
    };
  });

  return {
    ascendant: {
      rashiIndex: d9AscIdx,
      en: d9AscRashi.en, ne: d9AscRashi.ne, isoEn: d9AscRashi.isoEn,
      lord: RASHI_LORDS[d9AscRashi.en],
    },
    planets,
    vargottamaPlanets: planets.filter((p) => p.isVargottama).map((p) => p.name),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  PLANET ENRICHMENT  (D1)
// ═══════════════════════════════════════════════════════════════════════════

function enrichPlanet(rawPlanet, ascLng) {
  const lng   = parseFloat(rawPlanet.longitude) || 0;
  const speed = parseFloat(rawPlanet.speed)      || 0;

  const r = longitudeToRashi(lng);
  const n = longitudeToNakshatra(lng);
  const d = getDignity(rawPlanet.name, r.en);

  // Whole-sign house from ascendant
  const ascIdx = Math.floor(norm360(ascLng) / 30);
  const house  = ((r.rashiIndex - ascIdx + 12) % 12) + 1;

  const pName = PLANET_NAMES[rawPlanet.name]
    ?? { en: rawPlanet.name, ne: rawPlanet.name, isoEn: rawPlanet.name };

  return {
    name:           pName,
    longitude:      parseFloat(lng.toFixed(6)),
    latitude:       parseFloat((rawPlanet.latitude  || 0).toFixed(6)),
    speed:          parseFloat(speed.toFixed(6)),
    isRetrograde:   speed < 0,
    rashiIndex:     r.rashiIndex,
    rashi:          { en: r.en, ne: r.ne, isoEn: r.isoEn },
    rashiLord:      r.lord,
    degreeInRashi:  r.degreeInRashi,
    dms:            r.dms,
    nakshatra:      { en: n.en, ne: n.ne },
    nakshatraLord:  n.lord,
    pada:           n.pada,
    dignity:        d,
    house,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  HOUSE BUILDER
// ═══════════════════════════════════════════════════════════════════════════

function buildHouses(cusps) {
  // If library returned no cusps, return shape-consistent nulls
  if (!Array.isArray(cusps) || cusps.length < 12) {
    return Array.from({ length: 12 }, (_, i) => ({
      house: i + 1, cuspLongitude: null,
      rashi: null, rashiLord: null, degreeInRashi: null, dms: null,
      meaning: HOUSE_MEANINGS[i],
    }));
  }

  return cusps.slice(0, 12).map((raw, i) => {
    const lng = parseFloat(raw) || 0;
    const r   = longitudeToRashi(lng);
    return {
      house: i + 1,
      cuspLongitude:  parseFloat(lng.toFixed(6)),
      rashi:          { en: r.en, ne: r.ne, isoEn: r.isoEn },
      rashiLord:      r.lord,
      degreeInRashi:  r.degreeInRashi,
      dms:            r.dms,
      meaning:        HOUSE_MEANINGS[i],
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════
//  VIMSHOTTARI DASHA  (current periods from library + full timeline manually)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The library returns only the *current* period:
 *   { mahadasha, antardasha, pratyantardasha, pratyantardasha_end_date }
 *
 * We additionally calculate the entire 120-year Mahadasha + Antardasha
 * timeline from birth so the UI can render a full dasha table.
 */
function buildDasha(rawVim, moonLng, birthMs) {
  if (!rawVim) return null;

  const MS_PER_YEAR = 365.25 * 24 * 3600 * 1000;

  // ── Current running periods ──────────────────────────────────────────
  const current = {
    mahadasha:       rawVim.mahadasha       || null,
    antardasha:      rawVim.antardasha      || null,
    pratyantardasha: rawVim.pratyantardasha || null,
    pratyantardashaEndDate: rawVim.pratyantardasha_end_date
      ? new Date(rawVim.pratyantardasha_end_date).toISOString().split("T")[0]
      : null,
  };

  // ── Birth nakshatra → starting dasha planet ──────────────────────────
  const nLng         = norm360(moonLng);
  const naksIdx      = Math.floor(nLng / (360 / 27));
  const birthNakLord = NAKSHATRAS[naksIdx].lord;
  const startIdx     = DASHA_ORDER.indexOf(birthNakLord);

  // ── Fraction already elapsed in the very first dasha ────────────────
  const nakSpan    = 360 / 27;
  const posInNak   = nLng % nakSpan;
  const elapsed    = posInNak / nakSpan;               // 0–1
  const firstYears = DASHA_YEARS[birthNakLord] * (1 - elapsed);

  // ── Build 9 mahadashas ───────────────────────────────────────────────
  const dashas = [];
  let cursor = birthMs;

  for (let i = 0; i < 9; i++) {
    const mIdx   = (startIdx + i) % 9;
    const mPlanet = DASHA_ORDER[mIdx];
    const mYears  = i === 0 ? firstYears : DASHA_YEARS[mPlanet];
    const mMs     = mYears * MS_PER_YEAR;
    const mStart  = cursor;
    const mEnd    = cursor + mMs;

    // ── Antardashas (9 sub-periods) ──────────────────────────────────
    const antardashas = [];
    let adCursor = mStart;

    for (let j = 0; j < 9; j++) {
      const adIdx    = (mIdx + j) % 9;
      const adPlanet = DASHA_ORDER[adIdx];
      // Antardasha years = (Mahadasha full years × Antardasha years) / 120
      const adFull   = (DASHA_YEARS[mPlanet] * DASHA_YEARS[adPlanet]) / 120;
      // For the truncated first mahadasha, scale proportionally
      const adMs     = i === 0
        ? (adFull / DASHA_YEARS[mPlanet]) * mMs
        : adFull * MS_PER_YEAR;

      const adStart = adCursor;
      const adEnd   = adCursor + adMs;
      const adName  = PLANET_NAMES[adPlanet] ?? { en: adPlanet, ne: adPlanet };

      antardashas.push({
        planet:        adName,
        startDate:     new Date(adStart).toISOString().split("T")[0],
        endDate:       new Date(adEnd).toISOString().split("T")[0],
        durationYears: parseFloat(adFull.toFixed(4)),
        isActive:
          current.mahadasha === mPlanet &&
          current.antardasha === adPlanet,
      });
      adCursor = adEnd;
    }

    const mName = PLANET_NAMES[mPlanet] ?? { en: mPlanet, ne: mPlanet };
    dashas.push({
      planet:        mName,
      startDate:     new Date(mStart).toISOString().split("T")[0],
      endDate:       new Date(mEnd).toISOString().split("T")[0],
      durationYears: parseFloat(mYears.toFixed(4)),
      isActive:      current.mahadasha === mPlanet,
      antardashas,
    });
    cursor = mEnd;
  }

  return { current, dashas };
}

// ═══════════════════════════════════════════════════════════════════════════
//  SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

function buildSummary(enrichedPlanets, ascLng) {
  const asc     = longitudeToRashi(ascLng);
  const ascLord = asc.lord;

  const moon = enrichedPlanets.find((p) => p.name.en === "Moon");
  const sun  = enrichedPlanets.find((p) => p.name.en === "Sun");
  const lp   = enrichedPlanets.find((p) => p.name.en === ascLord);

  const exalted     = enrichedPlanets.filter((p) => p.dignity.en === "Exalted");
  const debilitated = enrichedPlanets.filter((p) => p.dignity.en === "Debilitated");
  const retrograde  = enrichedPlanets.filter((p) => p.isRetrograde);
  const vargottama  = enrichedPlanets.filter((p) => getD9RashiIdx(p.longitude) === p.rashiIndex);

  const yoga = YOGAKARAKA_MAP[asc.en]
    ? PLANET_NAMES[YOGAKARAKA_MAP[asc.en]] : null;

  return {
    lagna: {
      rashi:     { en: asc.en, ne: asc.ne, isoEn: asc.isoEn },
      lord:      ascLord,
      lordHouse: lp?.house ?? null,
    },
    moonSign:         moon ? { en: moon.rashi.en,    ne: moon.rashi.ne    } : null,
    moonNakshatra:    moon ? { en: moon.nakshatra.en, ne: moon.nakshatra.ne } : null,
    moonNakshatraLord: moon?.nakshatraLord ?? null,
    sunSign:          sun  ? { en: sun.rashi.en,     ne: sun.rashi.ne     } : null,
    yogakaraka:       yoga,
    exaltedPlanets:     exalted.map((p) => p.name),
    debilitatedPlanets: debilitated.map((p) => p.name),
    retrogradePlanets:  retrograde.map((p) => p.name),
    vargottamaPlanets:  vargottama.map((p) => p.name),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  ROUTE HANDLER
// ═══════════════════════════════════════════════════════════════════════════

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name      = null,
      gender    = null,
      dob,
      dobType   = "AD",
      time,
      ampm      = null,
      // Nepal Standard Time = UTC +5:45 = 5.75.  India IST = 5.5
      timezone  = 5.75,
      lat,
      lon,
      elevation = 0,
      country   = null,
      region    = null,
    } = body;

    // ── Validation ───────────────────────────────────────────────────────
    if (!dob)                       throw new Error("'dob' is required.");
    if (!time)                      throw new Error("'time' is required.");
    if (lat == null)                throw new Error("'lat' (latitude) is required.");
    if (lon == null)                throw new Error("'lon' (longitude) is required.");

    const tzOff = typeof timezone === "number" ? timezone : 5.75;

    // ── Parse inputs ─────────────────────────────────────────────────────
    const { year, month, day, adDate, bsDate } = parseDate(dob, dobType);
    const { hour, minute, decimalHours, timeString } = parseTime(time, ampm);

    // ── Julian Day (Universal Time) ──────────────────────────────────────
    // p_julday(year, month, day, UT_decimal_hours, 1 = Gregorian calendar)
    const utHours = decimalHours - tzOff;
    const jd      = p_julday(year, month, day, utHours, 1);

    // ── Location (used internally by house calc) ─────────────────────────
    // new Location(lat, lon, elevation_metres)
    const _location = new Location(lat, lon, elevation); // eslint-disable-line no-unused-vars

    // ── Planets — Lahiri sidereal (ayanamsa mode = 1) ────────────────────
    const rawPlanets = calculate_planets(jd, 1);
    if (!rawPlanets?.length)
      throw new Error("calculate_planets returned empty result.");

    // ── Houses ───────────────────────────────────────────────────────────
    // Try Whole Sign ("W") first — best for Vedic. Fall back to Placidus.
    let housesResult, houseSystem;
    try {
      housesResult = calculate_houses(jd, lat, lon, "W", 1);
      houseSystem  = "Whole Sign";
    } catch {
      housesResult = calculate_houses(jd, lat, lon, "P", 1);
      houseSystem  = "Placidus";
    }

    // Ascendant longitude — library exposes it as .ascendant (number)
    const ascLng =
      typeof housesResult?.ascendant === "number"
        ? housesResult.ascendant
        : (Array.isArray(housesResult?.cusps) ? housesResult.cusps[0] : 0);

    const rawCusps = Array.isArray(housesResult?.cusps)
      ? housesResult.cusps
      : [];

    // ── Enrich planets ───────────────────────────────────────────────────
    const enrichedPlanets = rawPlanets.map((p) => enrichPlanet(p, ascLng));

    // ── D1 house objects ─────────────────────────────────────────────────
    const housesData = buildHouses(rawCusps);

    // ── D9 Navamsa ───────────────────────────────────────────────────────
    const d9Data = buildD9(enrichedPlanets, ascLng);

    // ── Vimshottari Dasha ────────────────────────────────────────────────
    const moonRaw = rawPlanets.find((p) => p.name === "Moon");
    if (!moonRaw) throw new Error("Moon not found — cannot compute Dasha.");

    // Use Date.UTC so we are not affected by the server's local timezone
    const birthMs = Date.UTC(year, month - 1, day, hour, minute, 0);

    const rawVim = calculate_vimshottari(
      moonRaw.longitude,
      birthMs,
      Date.now()
    );
    const dashaData = buildDasha(rawVim, moonRaw.longitude, birthMs);

    // ── Summary ──────────────────────────────────────────────────────────
    const summary = buildSummary(enrichedPlanets, ascLng);

    // ── Ascendant full object ────────────────────────────────────────────
    const ar = longitudeToRashi(ascLng);
    const an = longitudeToNakshatra(ascLng);

    // ── Final response ───────────────────────────────────────────────────
    return Response.json({
      success: true,

      meta: {
        name, gender,
        dob: { ad: adDate, bs: bsDate, original: dob, dobType },
        time: timeString,
        ampm: ampm || null,
        timezone: tzOff,
        location: { country, region, lat, lon, elevation },
        ayanamsa:    "Lahiri (Chitrapaksha)",
        houseSystem,
        julianDay:   parseFloat(jd.toFixed(6)),
        calculatedAt: new Date().toISOString(),
      },

      summary,

      /** Ascendant / Lagna */
      ascendant: {
        longitude:     parseFloat(ascLng.toFixed(6)),
        rashiIndex:    ar.rashiIndex,
        rashi:         { en: ar.en, ne: ar.ne, isoEn: ar.isoEn },
        rashiLord:     ar.lord,
        degreeInRashi: ar.degreeInRashi,
        dms:           ar.dms,
        nakshatra:     { en: an.en, ne: an.ne },
        nakshatraLord: an.lord,
        pada:          an.pada,
      },

      /** D1 — Rashi / Birth Chart planets (9 Grahas) */
      planets: enrichedPlanets,

      /** D1 — 12 House cusps */
      houses: housesData,

      /** D9 — Navamsa chart */
      d9: d9Data,

      /** Vimshottari Dasha (current period + full 120-year timeline) */
      dasha: dashaData,
    });

  } catch (error) {
    console.error("[Kundali API]", error);
    return Response.json(
      {
        success: false,
        error: error?.message || "Unexpected error.",
        ...(process.env.NODE_ENV === "development" && { stack: error?.stack }),
      },
      { status: 500 }
    );
  }
}