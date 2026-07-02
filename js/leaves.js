/**
 * ============================================================================
 * Animated Bouquet
 * File: leaves.js (FIXED)
 * ============================================================================
 */

import {
    createGroup,
    createPath,
    appendChildren
} from "./svg.js";

/* ============================================================================
   LOCAL COLORS (NO STEM DEPENDENCY)
============================================================================ */

const LEAF_COLORS = {
    LIGHT: "#8DBA92",
    DARK: "#355238"
};

/* ============================================================================
   CONFIG
============================================================================ */

export const LEAF_CONFIG = Object.freeze({
    SIZE_MIN: 18,
    SIZE_MAX: 42,
    SPREAD_X: 18,
    SPREAD_Y: 40
});

/* ============================================================================
   LEAF SHAPE
============================================================================ */

function createLeafPath(x, y, size) {

    const half = size / 2;

    return `
        M ${x} ${y}
        C ${x - half} ${y - half},
          ${x - half} ${y + half},
          ${x} ${y + size}

        C ${x + half} ${y + half},
          ${x + half} ${y - half},
          ${x} ${y}
    `;
}

/* ============================================================================
   SINGLE LEAF
============================================================================ */

function createLeaf(x, y, size, side = 1) {

    const path = createLeafPath(x, y, size);

    return createPath(path, {
        fill: LEAF_COLORS.LIGHT,
        stroke: LEAF_COLORS.DARK,
        strokeWidth: 1,
        opacity: 0.85,
        transform: `rotate(${side * 25} ${x} ${y})`
    });
}

/* ============================================================================
   LEAF PAIR
============================================================================ */

function createLeafPair(x, y) {

    const size =
        LEAF_CONFIG.SIZE_MIN +
        Math.random() * (LEAF_CONFIG.SIZE_MAX - LEAF_CONFIG.SIZE_MIN);

    return [
        createLeaf(x, y, size, 1),
        createLeaf(x, y, size, -1)
    ];
}

/* ============================================================================
   ATTACH TO STEM POINTS
============================================================================ */

export function attachLeavesToStem(points = []) {

    const group = createGroup({
        class: "leaves"
    });

    const leaves = [];

    for (let i = 0; i < points.length; i++) {

        const p = points[i];
        if (!p) continue;

        if (i % 2 !== 0) continue;

        const offsetX = (Math.random() - 0.5) * LEAF_CONFIG.SPREAD_X;
        const offsetY = Math.random() * LEAF_CONFIG.SPREAD_Y;

        leaves.push(
            ...createLeafPair(
                p.x + offsetX,
                p.y - offsetY
            )
        );
    }

    appendChildren(group, leaves);

    return group;
}
