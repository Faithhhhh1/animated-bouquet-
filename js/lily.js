/**
 * ============================================================================
 * Animated Bouquet
 * File: lily.js
 * ============================================================================
 */
import {
    createGroup,
    createPath,
    appendChildren
} from "./svg.js";

import { STEM_COLORS } from "./constants.js";

/* ============================================================================
   Lily Configuration
============================================================================ */

export const LILY_CONFIG = Object.freeze({

    PETAL_COUNT: 6,

    PETAL_LENGTH: 90,

    PETAL_WIDTH: 35,

    CENTER_RADIUS: 12,

    STEM_ATTACH_OFFSET: -20

});

/* ============================================================================
   Petal Shape Generator
============================================================================ */

/**
 * Creates a single lily petal using cubic Bézier curves.
 */
export function createLilyPetalPath(cx, cy, length, width, angle) {

    const tipX = cx;
    const tipY = cy - length;

    const leftX = cx - width;
    const rightX = cx + width;

    return `
        M ${cx} ${cy}

        C ${leftX} ${cy - length * 0.3},
          ${leftX} ${cy - length * 0.7},
          ${tipX} ${tipY}

        C ${rightX} ${cy - length * 0.7},
          ${rightX} ${cy - length * 0.3},
          ${cx} ${cy}
    `;
}

/* ============================================================================
   Create Single Petal
============================================================================ */

export function createLilyPetal(cx, cy, angle = 0) {

    const path = createLilyPetalPath(
        cx,
        cy,
        LILY_CONFIG.PETAL_LENGTH,
        LILY_CONFIG.PETAL_WIDTH,
        angle
    );

    return createPath(path, {

        fill: STEM_COLORS.HIGHLIGHT,
        stroke: STEM_COLORS.DARK,
        strokeWidth: 1,
        opacity: 0.9,
        transform: `rotate(${angle} ${cx} ${cy})`

    });

}

/* ============================================================================
   Lily Center (stamen core)
============================================================================ */

export function createLilyCenter(cx, cy) {

    const circle = createPath(`
        M ${cx} ${cy}
        m -${LILY_CONFIG.CENTER_RADIUS}, 0
        a ${LILY_CONFIG.CENTER_RADIUS},${LILY_CONFIG.CENTER_RADIUS} 0 1,0 ${LILY_CONFIG.CENTER_RADIUS * 2},0
        a ${LILY_CONFIG.CENTER_RADIUS},${LILY_CONFIG.CENTER_RADIUS} 0 1,0 -${LILY_CONFIG.CENTER_RADIUS * 2},0
    `, {

        fill: STEM_COLORS.BASE,
        stroke: STEM_COLORS.DARK,
        strokeWidth: 1

    });

    return circle;

}

/* ============================================================================
   Create Full Lily Flower
============================================================================ */

/**
 * Builds a full lily flower at a given position.
 */
export function createLily(x, y, scale = 1) {

    const group = createGroup({

        class: "lily-flower"

    });

    const petals = [];

    const angleStep = 360 / LILY_CONFIG.PETAL_COUNT;

    for (let i = 0; i < LILY_CONFIG.PETAL_COUNT; i++) {

        const angle = i * angleStep;

        petals.push(
            createLilyPetal(x, y, angle)
        );

    }

    const center = createLilyCenter(x, y);

    appendChildren(
        group,
        ...petals,
        center
    );

    return group;
}

/* ============================================================================
   Attach Lily to Stem
============================================================================ */

export function attachLilyToStem(stemEndX, stemEndY) {

    return createLily(
        stemEndX,
        stemEndY + LILY_CONFIG.STEM_ATTACH_OFFSET
    );

}
