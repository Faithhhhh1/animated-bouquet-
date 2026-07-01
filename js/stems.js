import {
    createGroup,
    createPath,
    appendChildren
} from "./svg.js";
/**
 * ============================================================================
 * Animated Bouquet
 * File: stems.js
 * Section: Constants & Configuration
 * ============================================================================
 */

import {
    createGroup,
    createPath,
    createLinearGradient
} from "./svg.js";

/* ============================================================================
   Stem Colors
============================================================================ */

/**
 * Default stem color palette.
 */
export const STEM_COLORS = Object.freeze({

    BASE: "#4F7152",

    DARK: "#355238",

    LIGHT: "#739679",

    HIGHLIGHT: "#8DBA92",

    SHADOW: "#29402C"

});


/* ============================================================================
   Stem Widths
============================================================================ */

/**
 * Stroke widths used throughout the bouquet.
 */
export const STEM_WIDTHS = Object.freeze({

    THIN: 2,

    SMALL: 3,

    MEDIUM: 5,

    LARGE: 7,

    HERO: 9

});


/* ============================================================================
   Stem Lengths
============================================================================ */

/**
 * Approximate stem lengths.
 *
 * Units are SVG user units.
 */
export const STEM_LENGTHS = Object.freeze({

    SHORT: 320,

    MEDIUM: 480,

    LONG: 650,

    HERO: 820

});


/* ============================================================================
   Stem Curvature
============================================================================ */

/**
 * Curvature multipliers.
 *
 * Higher values produce stronger curves.
 */
export const STEM_CURVATURE = Object.freeze({

    SUBTLE: 0.15,

    NORMAL: 0.30,

    STRONG: 0.45,

    DRAMATIC: 0.65

});


/* ============================================================================
   Stem Defaults
============================================================================ */

/**
 * Default configuration applied to every stem.
 */
export const STEM_DEFAULTS = Object.freeze({

    stroke: STEM_COLORS.BASE,

    strokeWidth: STEM_WIDTHS.MEDIUM,

    strokeLinecap: "round",

    strokeLinejoin: "round",

    fill: "none",

    opacity: 1,

filter: "url(#stem-softening)"

});


/* ============================================================================
   Bouquet Layout
============================================================================ */

/**
 * Default bouquet origin.
 */
export const STEM_ORIGIN = Object.freeze({

    x: 540,

    y: 1760

});


/**
 * Angle presets.
 *
 * Degrees relative to vertical.
 */
export const STEM_ANGLES = Object.freeze({

    FAR_LEFT: -40,

    LEFT: -22,

    CENTER: 0,

    RIGHT: 22,

    FAR_RIGHT: 40

});


/* ============================================================================
   Stem Layer IDs
============================================================================ */

/**
 * Layer names used by stems.js.
 */
export const STEM_LAYER_IDS = Object.freeze({

    BACKGROUND: "background-stems",

    MAIN: "main-stems",

    FOREGROUND: "foreground-stems"

});


/* ============================================================================
   Animation Defaults
============================================================================ */

/**
 * Animation timing values.
 */
export const STEM_ANIMATION = Object.freeze({

    DRAW_DURATION: 2.5,

    GROW_DURATION: 1.8,

    SWAY_DURATION: 6,

    DELAY_STEP: 0.15,

    EASING: "ease-in-out"

});


/* ============================================================================
   Rendering Limits
============================================================================ */

/**
 * Maximum stem counts.
 */
export const STEM_LIMITS = Object.freeze({

    MIN: 8,

    DEFAULT: 14,

    MAX: 24

});

/**
 * ============================================================================
 * Animated Bouquet
 * File: stems.js
 * Section: Geometry Helpers
 * ============================================================================
 */


/* ============================================================================
   lerp()
============================================================================ */

/**
 * Linear interpolation.
 *
 * @param {number} start
 * @param {number} end
 * @param {number} t
 *
 * @returns {number}
 */
export function lerp(start, end, t) {

    return start + (end - start) * t;

}


/* ============================================================================
   quadraticBezierPoint()
============================================================================ */

/**
 * Returns a point on a quadratic Bézier curve.
 *
 * @param {{x:number,y:number}} p0
 * @param {{x:number,y:number}} p1
 * @param {{x:number,y:number}} p2
 * @param {number} t
 *
 * @returns {{x:number,y:number}}
 */
export function quadraticBezierPoint(
    p0,
    p1,
    p2,
    t
) {

    const mt = 1 - t;

    return {

        x:
            mt * mt * p0.x +
            2 * mt * t * p1.x +
            t * t * p2.x,

        y:
            mt * mt * p0.y +
            2 * mt * t * p1.y +
            t * t * p2.y

    };

}


/* ============================================================================
   cubicBezierPoint()
============================================================================ */

/**
 * Returns a point on a cubic Bézier curve.
 *
 * @param {{x:number,y:number}} p0
 * @param {{x:number,y:number}} p1
 * @param {{x:number,y:number}} p2
 * @param {{x:number,y:number}} p3
 * @param {number} t
 *
 * @returns {{x:number,y:number}}
 */
export function cubicBezierPoint(
    p0,
    p1,
    p2,
    p3,
    t
) {

    const mt = 1 - t;

    return {

        x:
            mt * mt * mt * p0.x +
            3 * mt * mt * t * p1.x +
            3 * mt * t * t * p2.x +
            t * t * t * p3.x,

        y:
            mt * mt * mt * p0.y +
            3 * mt * mt * t * p1.y +
            3 * mt * t * t * p2.y +
            t * t * t * p3.y

    };

}


/* ============================================================================
   createStemPathData()
============================================================================ */

/**
 * Creates a smooth quadratic stem path.
 *
 * @param {{x:number,y:number}} start
 * @param {{x:number,y:number}} control
 * @param {{x:number,y:number}} end
 *
 * @returns {string}
 */
export function createStemPathData(
    start,
    control,
    end
) {

    return [

        `M ${start.x} ${start.y}`,

        `Q ${control.x} ${control.y}`,

        `${end.x} ${end.y}`

    ].join(" ");

}


/* ============================================================================
   createCurvedStemData()
============================================================================ */

/**
 * Creates a smooth cubic stem path.
 *
 * @param {{x:number,y:number}} start
 * @param {{x:number,y:number}} control1
 * @param {{x:number,y:number}} control2
 * @param {{x:number,y:number}} end
 *
 * @returns {string}
 */
export function createCurvedStemData(
    start,
    control1,
    control2,
    end
) {

    return [

        `M ${start.x} ${start.y}`,

        `C`,

        `${control1.x} ${control1.y},`,

        `${control2.x} ${control2.y},`,

        `${end.x} ${end.y}`

    ].join(" ");

}


/* ============================================================================
   calculateStemAngle()
============================================================================ */

/**
 * Calculates the angle (degrees) between two points.
 *
 * @param {{x:number,y:number}} start
 * @param {{x:number,y:number}} end
 *
 * @returns {number}
 */
export function calculateStemAngle(
    start,
    end
) {

    return Math.atan2(

        end.y - start.y,

        end.x - start.x

    ) * (180 / Math.PI);

}


/* ============================================================================
   calculateStemLength()
============================================================================ */

/**
 * Calculates the distance between two points.
 *
 * @param {{x:number,y:number}} start
 * @param {{x:number,y:number}} end
 *
 * @returns {number}
 */
export function calculateStemLength(
    start,
    end
) {

    const dx = end.x - start.x;

    const dy = end.y - start.y;

    return Math.sqrt(dx * dx + dy * dy);

}


/* ============================================================================
   interpolateStemWidth()
============================================================================ */

/**
 * Interpolates stem width from base to tip.
 *
 * @param {number} baseWidth
 * @param {number} tipWidth
 * @param {number} t
 *
 * @returns {number}
 */
export function interpolateStemWidth(
    baseWidth,
    tipWidth,
    t
) {

    return lerp(baseWidth, tipWidth, t);

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: stems.js
 * Section: Stem Builders
 * ============================================================================
 */

import {

    createGroup,
    createPath

} from "./svg.js";

/* ============================================================================
   createStem()
============================================================================ */

/**
 * Creates a simple quadratic stem.
 *
 * @param {Object} start
 * @param {Object} control
 * @param {Object} end
 * @param {Object} [attributes={}]
 *
 * @returns {SVGPathElement}
 */
export function createStem(

    start,
    control,
    end,
    attributes = {}

) {

    const d = createStemPathData(

        start,
        control,
        end

    );

    return createPath(

        d,

        {

            ...STEM_DEFAULTS,

            stroke: STEM_COLORS.BASE,

            strokeWidth: STEM_WIDTHS.MEDIUM,

            ...attributes

        }

    );

}


/* ============================================================================
   createCurvedStem()
============================================================================ */

/**
 * Creates a cubic Bézier stem.
 *
 * @param {Object} start
 * @param {Object} control1
 * @param {Object} control2
 * @param {Object} end
 * @param {Object} [attributes={}]
 *
 * @returns {SVGPathElement}
 */
export function createCurvedStem(

    start,
    control1,
    control2,
    end,
    attributes = {}

) {

    const d = createCurvedStemData(

        start,
        control1,
        control2,
        end

    );

    return createPath(

        d,

        {

            ...STEM_DEFAULTS,

            stroke: STEM_COLORS.BASE,

            strokeWidth: STEM_WIDTHS.MEDIUM,

            ...attributes

        }

    );

}


/* ============================================================================
   createBranch()
============================================================================ */

/**
 * Creates a thinner branch.
 *
 * Used for:
 * • Side stems
 * • Leaf stems
 * • Flower branches
 *
 * @param {Object} start
 * @param {Object} control
 * @param {Object} end
 * @param {Object} [attributes={}]
 *
 * @returns {SVGPathElement}
 */
export function createBranch(

    start,
    control,
    end,
    attributes = {}

) {

    return createStem(

        start,

        control,

        end,

        {

            strokeWidth: STEM_WIDTHS.SMALL,

            stroke: STEM_COLORS.DARK,

            ...attributes

        }

    );

}


/* ============================================================================
   createStemShadow()
============================================================================ */

/**
 * Creates a soft shadow behind a stem.
 *
 * @param {Object} start
 * @param {Object} control
 * @param {Object} end
 * @param {Object} [attributes={}]
 *
 * @returns {SVGPathElement}
 */
export function createStemShadow(

    start,
    control,
    end,
    attributes = {}

) {

    return createStem(

        start,

        control,

        end,

        {

            stroke: STEM_COLORS.SHADOW,

            strokeWidth: STEM_WIDTHS.LARGE,

            opacity: 0.22,

            filter: "url(#soft-blur)",

            ...attributes

        }

    );

}


/* ============================================================================
   createStemPair()
============================================================================ */

/**
 * Creates a stem and its shadow.
 *
 * Returns a reusable SVG group.
 *
 * @param {Object} start
 * @param {Object} control
 * @param {Object} end
 * @param {Object} [attributes={}]
 *
 * @returns {SVGGElement}
 */
export function createStemPair(

    start,
    control,
    end,
    attributes = {}

) {

    const group = createGroup({

        class: "stem"

    });

    const shadow = createStemShadow(

        start,
        control,
        end

    );

    const stem = createStem(

        start,
        control,
        end,
        attributes

    );

    group.append(

        shadow,
        stem

    );

    return group;

}


/* ============================================================================
   createHeroStem()
============================================================================ */

/**
 * Creates the primary center stem.
 *
 * @param {Object} start
 * @param {Object} control
 * @param {Object} end
 *
 * @returns {SVGGElement}
 */
export function createHeroStem(

    start,
    control,
    end

) {

    return createStemPair(

        start,

        control,

        end,

        {

            strokeWidth: STEM_WIDTHS.HERO,

            stroke: STEM_COLORS.BASE

        }

    );

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: stems.js
 * Section: Bouquet Layout
 * ============================================================================
 */


/* ============================================================================
   createCenterStem()
============================================================================ */

/**
 * Creates the main center stem.
 *
 * @returns {SVGGElement}
 */
export function createCenterStem() {

    return createHeroStem(

        {
            x: STEM_ORIGIN.x,
            y: STEM_ORIGIN.y
        },

        {
            x: STEM_ORIGIN.x,
            y: STEM_ORIGIN.y - 420
        },

        {
            x: STEM_ORIGIN.x,
            y: 520
        }

    );

}


/* ============================================================================
   createLeftStem()
============================================================================ */

/**
 * Creates a left-leaning bouquet stem.
 *
 * @returns {SVGGElement}
 */
export function createLeftStem() {

    return createStemPair(

        {
            x: STEM_ORIGIN.x,
            y: STEM_ORIGIN.y
        },

        {
            x: STEM_ORIGIN.x - 140,
            y: STEM_ORIGIN.y - 500
        },

        {
            x: STEM_ORIGIN.x - 220,
            y: 620
        },

        {
            strokeWidth: STEM_WIDTHS.MEDIUM
        }

    );

}


/* ============================================================================
   createRightStem()
============================================================================ */

/**
 * Creates a right-leaning bouquet stem.
 *
 * @returns {SVGGElement}
 */
export function createRightStem() {

    return createStemPair(

        {
            x: STEM_ORIGIN.x,
            y: STEM_ORIGIN.y
        },

        {
            x: STEM_ORIGIN.x + 140,
            y: STEM_ORIGIN.y - 500
        },

        {
            x: STEM_ORIGIN.x + 220,
            y: 620
        },

        {
            strokeWidth: STEM_WIDTHS.MEDIUM
        }

    );

}


/* ============================================================================
   createOuterLeftStem()
============================================================================ */

/**
 * Creates the far-left background stem.
 *
 * @returns {SVGGElement}
 */
export function createOuterLeftStem() {

    return createStemPair(

        {
            x: STEM_ORIGIN.x,
            y: STEM_ORIGIN.y
        },

        {
            x: STEM_ORIGIN.x - 240,
            y: STEM_ORIGIN.y - 620
        },

        {
            x: STEM_ORIGIN.x - 340,
            y: 700
        },

        {
            opacity: 0.85,

            strokeWidth: STEM_WIDTHS.SMALL
        }

    );

}


/* ============================================================================
   createOuterRightStem()
============================================================================ */

/**
 * Creates the far-right background stem.
 *
 * @returns {SVGGElement}
 */
export function createOuterRightStem() {

    return createStemPair(

        {
            x: STEM_ORIGIN.x,
            y: STEM_ORIGIN.y
        },

        {
            x: STEM_ORIGIN.x + 240,
            y: STEM_ORIGIN.y - 620
        },

        {
            x: STEM_ORIGIN.x + 340,
            y: 700
        },

        {
            opacity: 0.85,

            strokeWidth: STEM_WIDTHS.SMALL
        }

    );

}


/* ============================================================================
   createBackgroundStem()
============================================================================ */

/**
 * Creates a subtle background stem.
 *
 * @param {number} offsetX
 *
 * @returns {SVGGElement}
 */
export function createBackgroundStem(offsetX = 0) {

    return createStemPair(

        {
            x: STEM_ORIGIN.x + offsetX,
            y: STEM_ORIGIN.y
        },

        {
            x: STEM_ORIGIN.x + offsetX * 1.3,
            y: STEM_ORIGIN.y - 560
        },

        {
            x: STEM_ORIGIN.x + offsetX * 1.5,
            y: 760
        },

        {
            opacity: 0.45,

            strokeWidth: STEM_WIDTHS.THIN
        }

    );

}


/* ============================================================================
   createForegroundStem()
============================================================================ */

/**
 * Creates a foreground accent stem.
 *
 * @param {number} offsetX
 *
 * @returns {SVGGElement}
 */
export function createForegroundStem(offsetX = 0) {

    return createStemPair(

        {
            x: STEM_ORIGIN.x,
            y: STEM_ORIGIN.y
        },

        {
            x: STEM_ORIGIN.x + offsetX,
            y: STEM_ORIGIN.y - 420
        },

        {
            x: STEM_ORIGIN.x + offsetX * 0.8,
            y: 540
        },

        {
            strokeWidth: STEM_WIDTHS.LARGE
        }

    );

}


/* ============================================================================
   createBouquetStemLayout()
============================================================================ */

/**
 * Creates the complete bouquet stem arrangement.
 *
 * @returns {SVGGElement}
 */
   export function createBouquetStemLayout() {

    const group = createGroup({
        id: "bouquet-stems"
    });

    appendChildren(
        group,

        createBackgroundStem(-280),
        createBackgroundStem(280),
        createOuterLeftStem(),
        createLeftStem(),
        createCenterStem(),
        createRightStem(),
        createOuterRightStem(),
        createForegroundStem(-60),
        createForegroundStem(60)

    );

    return group;
}

/**
 * ============================================================================
 * Animated Bouquet
 * File: stems.js
 * Section: Stem Groups
 * ============================================================================
 */


/* ============================================================================
   createStemCluster()
============================================================================ */

/**
 * Creates the complete bouquet stem cluster.
 *
 * @returns {SVGGElement}
 */
export function createStemCluster() {

    const group = createGroup({

        id: "stem-cluster",

        class: "stem-cluster"

    });

    appendChildren(

        group,

        createBouquetStemLayout()

    );

    return group;

}


/* ============================================================================
   createBackgroundStems()
============================================================================ */

/**
 * Creates background stems.
 *
 * These sit behind the main bouquet.
 *
 * @returns {SVGGElement}
 */
export function createBackgroundStems() {

    const group = createGroup({

        id: STEM_LAYER_IDS.BACKGROUND,

        class: "background-stems"

    });

    appendChildren(

        group,

        createBackgroundStem(-340),

        createBackgroundStem(-240),

        createBackgroundStem(240),

        createBackgroundStem(340)

    );

    return group;

}


/* ============================================================================
   createMainStems()
============================================================================ */

/**
 * Creates the primary bouquet stems.
 *
 * @returns {SVGGElement}
 */
export function createMainStems() {

    const group = createGroup({

        id: STEM_LAYER_IDS.MAIN,

        class: "main-stems"

    });

    appendChildren(

        group,

        createOuterLeftStem(),

        createLeftStem(),

        createCenterStem(),

        createRightStem(),

        createOuterRightStem()

    );

    return group;

}


/* ============================================================================
   createForegroundStems()
============================================================================ */

/**
 * Creates stems rendered in front of the bouquet.
 *
 * @returns {SVGGElement}
 */
export function createForegroundStems() {

    const group = createGroup({

        id: STEM_LAYER_IDS.FOREGROUND,

        class: "foreground-stems"

    });

    appendChildren(

        group,

        createForegroundStem(-90),

        createForegroundStem(-40),

        createForegroundStem(40),

        createForegroundStem(90)

    );

    return group;

}


/* ============================================================================
   createStemSystem()
============================================================================ */

/**
 * Creates every stem layer.
 *
 * Rendering order:
 *
 * Background
 * Main
 * Foreground
 *
 * @returns {SVGGElement}
 */
export function createStemSystem() {

    const group = createGroup({

        id: "stem-system"

    });

    appendChildren(

        group,

        createBackgroundStems(),

        createMainStems(),

        createForegroundStems()

    );

    return group;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: stems.js
 * Section: Stem Generation Engine
 * ============================================================================
 */


/* ============================================================================
   randomRange()
============================================================================ */

/**
 * Returns a random number between min and max.
 *
 * @param {number} min
 * @param {number} max
 *
 * @returns {number}
 */
export function randomRange(min, max) {

    return Math.random() * (max - min) + min;

}


/* ============================================================================
   generateStemPoint()
============================================================================ */

/**
 * Generates a natural stem endpoint.
 *
 * @param {number} spreadX
 * @param {number} heightVariance
 *
 * @returns {{x:number,y:number}}
 */
export function generateStemPoint(spreadX, heightVariance) {

    return {

        x: STEM_ORIGIN.x + randomRange(-spreadX, spreadX),

        y: STEM_ORIGIN.y - randomRange(heightVariance * 0.7, heightVariance)

    };

}


/* ============================================================================
   generateStemControl()
============================================================================ */

/**
 * Generates a Bézier control point for natural curvature.
 *
 * @param {{x:number,y:number}} start
 * @param {{x:number,y:number}} end
 * @param {number} curvature
 *
 * @returns {{x:number,y:number}}
 */
export function generateStemControl(start, end, curvature) {

    const midX = (start.x + end.x) / 2;

    const midY = (start.y + end.y) / 2;

    return {

        x: midX + randomRange(-curvature, curvature),

        y: midY + randomRange(-curvature * 1.5, curvature)

    };

}


/* ============================================================================
   generateStem()
============================================================================ */

/**
 * Generates a fully procedural stem.
 *
 * @param {Object} options
 *
 * @returns {SVGGElement}
 */
export function generateStem(options = {}) {

    const {

        spreadX = 260,

        heightVariance = 600,

        curvature = 120,

        type = "main",

        opacity = 1

    } = options;

    const start = {

        x: STEM_ORIGIN.x,

        y: STEM_ORIGIN.y

    };

    const end = generateStemPoint(spreadX, heightVariance);

    const control = generateStemControl(start, end, curvature);

    if (type === "hero") {

        return createHeroStem(start, control, end);

    }

    if (type === "branch") {

        return createBranch(start, control, end, {

            opacity

        });

    }

    return createStem(start, control, end, {

        opacity

    });

}


/* ============================================================================
   generateStemField()
============================================================================ */

/**
 * Generates a field of procedural stems.
 *
 * @param {number} count
 * @param {Object} options
 *
 * @returns {SVGGElement}
 */
export function generateStemField(count = STEM_LIMITS.DEFAULT, options = {}) {

    const group = createGroup({

        id: "generated-stem-field"

    });

    const stems = [];

    for (let i = 0; i < count; i++) {

        const stemType =
            i === 0 ? "hero" :
            i % 4 === 0 ? "branch" :
            "main";

        stems.push(

            generateStem({

                ...options,

                type: stemType,

                spreadX: options.spreadX ?? 300,

                heightVariance: options.heightVariance ?? 650

            })

        );

    }

    appendChildren(group, stems);

    return group;

}


/* ============================================================================
   createStemLayer()
============================================================================ */

/**
 * Creates the final stem rendering layer.
 *
 * Combines:
 * - Static layout stems
 * - Procedural stems
 *
 * @returns {SVGGElement}
 */
export function createStemLayer() {

    const group = createGroup({
        id: "stems"
    });

    appendChildren(
        group,
        createStemSystem(),
        generateStemField()
    );

    return group;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: stems.js
 * Section: Public API
 * ============================================================================
 */


/* ============================================================================
   Internal vs Public Design
============================================================================ */

/**
 * INTERNAL FUNCTIONS
 * -------------------
 * These are NOT exported:
 * - lerp()
 * - cubicBezierPoint()
 * - generateStemPoint()
 * - generateStemControl()
 *
 * PUBLIC FUNCTIONS
 * ----------------
 * These ARE exported:
 * - createStem()
 * - createCurvedStem()
 * - createStemPair()
 * - createStemSystem()
 * - generateStem()
 * - generateStemField()
 * - createStemLayer()
 */


/* ============================================================================
   Public API Export
============================================================================ */

export {

    // Core builders
    createStem,
    createCurvedStem,
    createBranch,
    createStemShadow,
    createStemPair,
    createHeroStem,

    // Layout system
    createCenterStem,
    createLeftStem,
    createRightStem,
    createOuterLeftStem,
    createOuterRightStem,
    createBackgroundStem,
    createForegroundStem,
    createBouquetStemLayout,

    // Group system
    createStemCluster,
    createBackgroundStems,
    createMainStems,
    createForegroundStems,
    createStemSystem,

    // Procedural engine
    generateStem,
    generateStemField,
    createStemLayer

};

