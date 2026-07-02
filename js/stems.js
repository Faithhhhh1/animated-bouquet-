import {
    createGroup,
    createPath,
    appendChildren
} from "./svg.js";

/* ============================================================================
   CONSTANTS
============================================================================ */

export const STEM_COLORS = Object.freeze({
    BASE: "#4F7152",
    DARK: "#355238",
    LIGHT: "#739679",
    HIGHLIGHT: "#8DBA92",
    SHADOW: "#29402C"
});

export const STEM_WIDTHS = Object.freeze({
    THIN: 2,
    SMALL: 3,
    MEDIUM: 5,
    LARGE: 7,
    HERO: 9
});

export const STEM_ORIGIN = Object.freeze({
    x: 540,
    y: 1760
});

export const STEM_LIMITS = Object.freeze({
    DEFAULT: 14
});

/* ============================================================================
   GEOMETRY HELPERS
============================================================================ */

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function quadraticPath(start, control, end) {
    return `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
}

function createControl(start, end) {
    return {
        x: (start.x + end.x) / 2 + (Math.random() - 0.5) * 120,
        y: (start.y + end.y) / 2 - Math.random() * 80
    };
}

/* ============================================================================
   CORE STEM
============================================================================ */

function createStem(start, control, end, attrs = {}) {

    const path = createPath(
        quadraticPath(start, control, end),
        {
            stroke: STEM_COLORS.BASE,
            strokeWidth: STEM_WIDTHS.MEDIUM,
            fill: "none",
            strokeLinecap: "round",
            ...attrs
        }
    );

    return path;
}

function createBranch(start, control, end, attrs = {}) {
    return createStem(start, control, end, {
        strokeWidth: STEM_WIDTHS.SMALL,
        stroke: STEM_COLORS.DARK,
        ...attrs
    });
}

function createHeroStem(start, control, end) {

    const g = createGroup({ class: "hero-stem" });

    const shadow = createStem(start, control, end, {
        stroke: STEM_COLORS.SHADOW,
        strokeWidth: STEM_WIDTHS.HERO,
        opacity: 0.2
    });

    const main = createStem(start, control, end, {
        strokeWidth: STEM_WIDTHS.HERO
    });

    appendChildren(g, shadow, main);

    return g;
}

/* ============================================================================
   STEM GENERATION
============================================================================ */

function generateStem(type = "main") {

    const start = { ...STEM_ORIGIN };

    const end = {
        x: STEM_ORIGIN.x + (Math.random() - 0.5) * 300,
        y: STEM_ORIGIN.y - (500 + Math.random() * 300)
    };

    const control = createControl(start, end);

    if (type === "hero") return createHeroStem(start, control, end);
    if (type === "branch") return createBranch(start, control, end);

    return createStem(start, control, end);
}

function generateStemField(count = STEM_LIMITS.DEFAULT) {

    const group = createGroup({ id: "generated-stems" });

    const stems = [];

    for (let i = 0; i < count; i++) {

        const type =
            i === 0 ? "hero" :
            i % 4 === 0 ? "branch" :
            "main";

        stems.push(generateStem(type));
    }

    appendChildren(group, stems);

    return group;
}

/* ============================================================================
   MAIN EXPORT
============================================================================ */

export function createStemLayer() {

    const group = createGroup({
        id: "stems"
    });

    appendChildren(group, generateStemField());

    return group;
}
