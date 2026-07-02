/**
 * ============================================================================
 * Animated Bouquet
 * File: 
 * ============================================================================
 */

import {
    createGroup,
    createPath,
    appendChildren
} from "./svg.js";

import {
    STEM_COLORS
} from "./stems.js";

/* ============================================================================
   Tulip Configuration
============================================================================ */

export const TULIP_CONFIG = Object.freeze({

    PETAL_HEIGHT: 110,

    PETAL_WIDTH: 55,

    PETAL_COUNT: 3,

    STEM_ATTACH_OFFSET: -25

});

/* ============================================================================
   Tulip Petal Shape
============================================================================ */

/**
 * Creates a single tulip petal (cup-like curve).
 */
export function createTulipPetalPath(x, y, height, width) {

    const topX = x;
    const topY = y - height;

    const leftX = x - width;
    const rightX = x + width;

    return `
        M ${x} ${y}

        C ${leftX} ${y - height * 0.4},
          ${leftX} ${y - height * 0.8},
          ${topX} ${topY}

        C ${rightX} ${y - height * 0.8},
          ${rightX} ${y - height * 0.4},
          ${x} ${y}
    `;
}

/* ============================================================================
   Create Tulip Petal
============================================================================ */

export function createTulipPetal(x, y, index = 0) {

    const path = createTulipPetalPath(
        x,
        y,
        TULIP_CONFIG.PETAL_HEIGHT,
        TULIP_CONFIG.PETAL_WIDTH
    );

    const colors = [
        STEM_COLORS.BASE,
        STEM_COLORS.HIGHLIGHT,
        STEM_COLORS.DARK
    ];

    return createPath(path, {

        fill: colors[index % colors.length],
        stroke: STEM_COLORS.DARK,
        strokeWidth: 1,
        opacity: 0.95

    });

}

/* ============================================================================
   Create Full Tulip
============================================================================ */

export function createTulip(x, y, scale = 1) {

    const group = createGroup({

        class: "tulip-flower"

    });

    const petals = [];

    for (let i = 0; i < TULIP_CONFIG.PETAL_COUNT; i++) {

        petals.push(
            createTulipPetal(x, y, i)
        );

    }

    appendChildren(
        group,
        ...petals
    );

    return group;
}

/* ============================================================================
   Attach Tulip to Stem
============================================================================ */

export function attachTulipToStem(stemEndX, stemEndY) {

    return createTulip(
        stemEndX,
        stemEndY + TULIP_CONFIG.STEM_ATTACH_OFFSET
    );
}
