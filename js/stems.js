import {
    createGroup,
    createPath,
    appendChildren
} from "./svg.js";

import { STEM_COLORS, STEM_WIDTHS, STEM_ORIGIN } from "./constants.js";

/* ============================================================================
   GEOMETRY HELPERS
============================================================================ */

function createControlPoint(start, end) {
    return {
        x: (start.x + end.x) / 2 + (Math.random() - 0.5) * 120,
        y: (start.y + end.y) / 2 - Math.random() * 100
    };
}

function buildPath(start, control, end) {
    return `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
}

/* ============================================================================
   STEM CREATION
============================================================================ */

function createStem(start, control, end, extra = {}) {

    return createPath(buildPath(start, control, end), {
        fill: "none",
        stroke: STEM_COLORS.BASE,
        strokeWidth: STEM_WIDTHS.MEDIUM,
        strokeLinecap: "round",
        ...extra
    });
}

function createBranch(start, control, end) {

    return createStem(start, control, end, {
        stroke: STEM_COLORS.DARK,
        strokeWidth: STEM_WIDTHS.SMALL
    });
}

function createHeroStem(start, control, end) {

    const g = createGroup({ class: "hero-stem" });

    const shadow = createStem(start, control, end, {
        stroke: STEM_COLORS.SHADOW,
        strokeWidth: STEM_WIDTHS.HERO,
        opacity: 0.25
    });

    const main = createStem(start, control, end, {
        strokeWidth: STEM_WIDTHS.HERO,
        stroke: STEM_COLORS.BASE
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

    const control = createControlPoint(start, end);

    if (type === "hero") return createHeroStem(start, control, end);
    if (type === "branch") return createBranch(start, control, end);

    return createStem(start, control, end);
}

function generateStemField(count = 14) {

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
   PUBLIC API
============================================================================ */

export function createStemLayer() {

    const root = createGroup({
        id: "stems-layer"
    });

    appendChildren(root, generateStemField());

    return root;
}
