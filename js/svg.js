/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: SVG Namespace Constants
 * ============================================================================
 */

/**
 * SVG Namespace
 */
export const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * XLink Namespace
 * (Still useful for compatibility with some SVG features.)
 */
export const XLINK_NS = "http://www.w3.org/1999/xlink";

/**
 * XML Namespace
 */
export const XML_NS = "http://www.w3.org/XML/1998/namespace";

/**
 * XMLNS Namespace
 */
export const XMLNS_NS = "http://www.w3.org/2000/xmlns/";

/**
 * Default ViewBox
 */
export const VIEWBOX = Object.freeze({

    x: 0,
    y: 0,

    width: 1080,
    height: 1920

});

/**
 * SVG Defaults
 */
export const SVG_DEFAULTS = Object.freeze({

    width: "100%",
    height: "100%",

    preserveAspectRatio: "xMidYMid meet",

    focusable: "false",

    "aria-hidden": "true",

    role: "presentation",

    version: "1.1"

});

/**
 * Layer Names
 */
export const LAYERS = Object.freeze({

    BACKGROUND: "background-render-layer",

    LIGHTING: "lighting-render-layer",

    VIGNETTE: "vignette-render-layer",

    PARTICLES: "particle-container",

    FIREFLIES: "firefly-container",

    STEMS: "stem-layer",

    LEAVES: "leaf-layer",

    FLOWERS: "flower-layer",

    FLOWER_CENTERS: "flower-center-layer",

    HIGHLIGHTS: "highlight-layer",

    GLOW: "glow-layer",

    OVERLAY: "overlay-effects"

});

/**
 * Default IDs
 */
export const IDS = Object.freeze({

    SVG: "bouquet-svg",

    ROOT: "bouquet-root",

    DEFS: "svg-defs"

});

/**
 * ============================================================================
 * SVG Engine
 * File: svg.js
 * Section: createSVGElement()
 * ============================================================================
 */

/**
 * ============================================================================
 * SVG Engine
 * File: svg.js
 * Section: createGroup()
 * ============================================================================
 */

/**
 * Create an SVG <g> element.
 *
 * @param {Object} [attributes={}]
 * @param {Array<Node>|Node|null} [children=[]]
 * @returns {SVGGElement}
 */
export function createGroup(
    attributes = {},
    children = []
) {
    const group = createSVGElement("g");

    setAttributes(group, attributes);

    appendChildren(group, children);

    return group;
}

/**
 * Create an SVG element.
 *
 * @param {string} tag - SVG tag name.
 * @param {Object} [attributes={}] - Attributes to apply.
 * @param {Array<Node>|Node|null} [children=null] - Child node(s).
 *
 * @returns {SVGElement}
 */
export function createSVGElement(
    tag,
    attributes = {},
    children = null
) {

    if (typeof tag !== "string" || tag.trim() === "") {
        throw new TypeError("createSVGElement(): 'tag' must be a non-empty string.");
    }

    const element = document.createElementNS(SVG_NS, tag);

    Object.entries(attributes).forEach(([name, value]) => {

        if (
            value === undefined ||
            value === null ||
            value === false
        ) {
            return;
        }

        switch (name) {

            case "href":
                element.setAttributeNS(XLINK_NS, "href", value);
                break;

            case "xlink:href":
                element.setAttributeNS(XLINK_NS, "href", value);
                break;

            case "xml:space":
                element.setAttributeNS(XML_NS, "space", value);
                break;

            default:
                element.setAttribute(name, String(value));

        }

    });

    if (children) {

        const list = Array.isArray(children)
            ? children
            : [children];

        list.forEach(child => {

            if (child instanceof Node) {
                element.appendChild(child);
            }

        });

    }

    return element;

}

/**
 * ============================================================================
 * SVG Engine
 * File: svg.js
 * Section: setAttributes()
 * ============================================================================
 */

import {
    XLINK_NS,
    XML_NS
} from "./constants.js";

/**
 * Apply multiple attributes to an SVG element.
 *
 * Automatically handles:
 * - Normal attributes
 * - xlink:href
 * - href
 * - xml:space
 * - Boolean attributes
 * - Numeric values
 *
 * @param {SVGElement} element
 * @param {Object} attributes
 *
 * @returns {SVGElement}
 */
export function setAttributes(
    element,
    attributes = {}
) {

    if (!(element instanceof Element)) {
        throw new TypeError(
            "setAttributes(): first argument must be an Element."
        );
    }

    if (
        attributes === null ||
        typeof attributes !== "object"
    ) {
        return element;
    }

    for (const [name, value] of Object.entries(attributes)) {

        // Ignore null & undefined

        if (value === undefined || value === null) {
            continue;
        }

        // Remove attribute when false

        if (value === false) {
            element.removeAttribute(name);
            continue;
        }

        // Boolean attributes

        if (value === true) {
            element.setAttribute(name, "");
            continue;
        }

        switch (name) {

            case "href":
            case "xlink:href":

                element.setAttributeNS(
                    XLINK_NS,
                    "href",
                    String(value)
                );

                break;

            case "xml:space":

                element.setAttributeNS(
                    XML_NS,
                    "space",
                    String(value)
                );

                break;

            default:

                element.setAttribute(
                    name,
                    String(value)
                );

        }

    }

    return element;

}

/**
 * ============================================================================
 * SVG Engine
 * File: svg.js
 * Section: appendChildren()
 * ============================================================================
 */

/**
 * Append one or more child nodes to a parent element.
 *
 * Supports:
 * - Single Node
 * - Array of Nodes
 * - Nested Arrays
 * - DocumentFragment
 *
 * Ignores:
 * - null
 * - undefined
 * - false
 *
 * @param {Node} parent
 * @param {...(Node|Node[]|DocumentFragment|null|undefined|false)} children
 *
 * @returns {Node}
 */
export function appendChildren(parent, ...children) {

    if (!(parent instanceof Node)) {
        throw new TypeError(
            "appendChildren(): parent must be a DOM Node."
        );
    }

    /**
     * Recursively append child nodes.
     *
     * @param {*} child
     */
    function append(child) {

        if (
            child === null ||
            child === undefined ||
            child === false
        ) {
            return;
        }

        // Flatten nested arrays

        if (Array.isArray(child)) {

            child.forEach(append);

            return;

        }

        // Append DOM Nodes

        if (child instanceof Node) {

            parent.appendChild(child);

            return;

        }

        throw new TypeError(
            "appendChildren(): child must be a DOM Node."
        );

    }

    children.forEach(append);

    return parent;

}

/**
 * ============================================================================
 * SVG Engine
 * File: svg.js
 * Section: removeChildren()
 * ============================================================================
 */

/**
 * Remove all child nodes from a parent element.
 *
 * Uses replaceChildren() when available for optimal performance,
 * with a fallback for older browsers.
 *
 * @param {Node} parent
 * @returns {Node}
 */
export function removeChildren(parent) {

    if (!(parent instanceof Node)) {
        throw new TypeError(
            "removeChildren(): parent must be a DOM Node."
        );
    }

    // Modern browsers
    if (typeof parent.replaceChildren === "function") {

        parent.replaceChildren();

        return parent;

    }

    // Fallback
    while (parent.firstChild) {

        parent.removeChild(parent.firstChild);

    }

    return parent;

}


/**
 * ============================================================================
 * SVG Engine
 * File: svg.js
 * Section: createPath()
 * ============================================================================
 */

/**
 * Create an SVG path.
 *
 * @param {String} d
 * @param {Object} [attributes={}]
 *
 * @returns {SVGPathElement}
 */
export function createPath(
    d = "",
    attributes = {}
) {

    const path = createSVGElement("path");

    setAttributes(

        path,

        {

            d,

            ...attributes

        }

    );

    return path;

}

/**
 * ============================================================================
 * SVG Engine
 * File: svg.js
 * Section: createCircle()
 * ============================================================================
 */

/**
 * Create an SVG circle.
 *
 * @param {Number} cx
 * @param {Number} cy
 * @param {Number} r
 * @param {Object} [attributes={}]
 *
 * @returns {SVGCircleElement}
 */
export function createCircle(
    cx = 0,
    cy = 0,
    r = 1,
    attributes = {}
) {

    const circle = createSVGElement("circle");

    setAttributes(circle, {

        cx,
        cy,
        r,

        ...attributes

    });

    return circle;

}

/**
 * ============================================================================
 * SVG Engine
 * File: svg.js
 * Section: createEllipse()
 * ============================================================================
 */

/**
 * Create an SVG ellipse.
 *
 * @param {Number} cx
 * @param {Number} cy
 * @param {Number} rx
 * @param {Number} ry
 * @param {Object} [attributes={}]
 *
 * @returns {SVGEllipseElement}
 */
export function createEllipse(
    cx = 0,
    cy = 0,
    rx = 1,
    ry = 1,
    attributes = {}
) {

    const ellipse = createSVGElement("ellipse");

    setAttributes(ellipse, {

        cx,
        cy,
        rx,
        ry,

        ...attributes

    });

    return ellipse;

}

/**
 * ============================================================================
 * SVG Engine
 * File: svg.js
 * Section: createRect()
 * ============================================================================
 */

/**
 * Create an SVG rectangle.
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @param {Object} [attributes={}]
 *
 * @returns {SVGRectElement}
 */
export function createRect(
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    attributes = {}
) {

    const rect = createSVGElement("rect");

    setAttributes(rect, {

        x,
        y,
        width,
        height,

        ...attributes

    });

    return rect;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createLine()
 * ============================================================================
 *
 * Creates an SVG <line> element.
 *
 * Used for:
 * • Leaf veins
 * • Flower stamens
 * • Decorative guides
 * • Construction helpers
 * • Ribbon folds
 *
 * ============================================================================
 */

/**
 * Create an SVG line.
 *
 * @param {Number} x1 - Starting X coordinate.
 * @param {Number} y1 - Starting Y coordinate.
 * @param {Number} x2 - Ending X coordinate.
 * @param {Number} y2 - Ending Y coordinate.
 * @param {Object} [attributes={}] - Additional SVG attributes.
 *
 * @returns {SVGLineElement}
 */
export function createLine(
    x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0,
    attributes = {}
) {

    const line = createSVGElement("line");

    setAttributes(line, {

        x1,
        y1,
        x2,
        y2,

        ...attributes

    });

    return line;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createPolyline()
 * ============================================================================
 *
 * Creates an SVG <polyline> element.
 *
 * Used for:
 * • Complex leaf veins
 * • Decorative ribbons
 * • Organic line details
 * • Sketch guides
 * • Floral wire accents
 *
 * ============================================================================
 */

/**
 * Convert an array of points into an SVG points string.
 *
 * Accepts either:
 *
 * [[x, y], [x, y], ...]
 *
 * or
 *
 * [{x, y}, {x, y}, ...]
 *
 * @param {Array} points
 * @returns {String}
 */
function serializePoints(points = []) {

    return points
        .map(point => {

            if (Array.isArray(point)) {

                return `${point[0]},${point[1]}`;

            }

            if (
                typeof point === "object" &&
                point !== null &&
                "x" in point &&
                "y" in point
            ) {

                return `${point.x},${point.y}`;

            }

            throw new TypeError(
                "createPolyline(): Invalid point format."
            );

        })
        .join(" ");

}

/**
 * Create an SVG polyline.
 *
 * @param {Array} points
 * @param {Object} [attributes={}]
 *
 * @returns {SVGPolylineElement}
 */
export function createPolyline(
    points = [],
    attributes = {}
) {

    const polyline = createSVGElement("polyline");

    setAttributes(polyline, {

        points: serializePoints(points),

        ...attributes

    });

    return polyline;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createPolygon()
 * ============================================================================
 *
 * Creates an SVG <polygon> element.
 *
 * Used for:
 * • Geometric petals
 * • Stars
 * • Highlights
 * • Decorative accents
 * • Abstract floral shapes
 *
 * ============================================================================
 */

/**
 * Create an SVG polygon.
 *
 * Accepts points in either format:
 *
 * [[x, y], [x, y], ...]
 *
 * or
 *
 * [{x, y}, {x, y}, ...]
 *
 * @param {Array} points
 * @param {Object} [attributes={}]
 *
 * @returns {SVGPolygonElement}
 */
export function createPolygon(
    points = [],
    attributes = {}
) {

    const polygon = createSVGElement("polygon");

    setAttributes(

        polygon,

        {

            points: serializePoints(points),

            ...attributes

        }

    );

    return polygon;

}

4. createDefs()

Creates

<defs>

    gradients

    filters

    masks

    clipPaths

    patterns

</defs>

This becomes the heart of the SVG.

  /**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createRootSVG()
 * ============================================================================
 *
 * Creates the root SVG element.
 *
 * Responsibilities
 * ----------------
 * • Create the root <svg>
 * • Apply default attributes
 * • Create and append <defs>
 * • Return the SVG element
 *
 * Does NOT:
 * • Create layers
 * • Create flowers
 * • Create particles
 * • Create animations
 *
 * ============================================================================
 */

/**
 * Create the root SVG element.
 *
 * @returns {SVGSVGElement}
 */
export function createRootSVG() {

    const svg = createSVGElement("svg");

    setAttributes(svg, {

        id: IDS.SVG,

        xmlns: SVG_NS,

        viewBox: `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.width} ${VIEWBOX.height}`,

        width: SVG_DEFAULTS.width,

        height: SVG_DEFAULTS.height,

        preserveAspectRatio: SVG_DEFAULTS.preserveAspectRatio,

        version: SVG_DEFAULTS.version,

        role: SVG_DEFAULTS.role,

        focusable: SVG_DEFAULTS.focusable,

        "aria-hidden": SVG_DEFAULTS["aria-hidden"]

    });

    // ---------------------------------------------------------------------
    // SVG Definitions
    // ---------------------------------------------------------------------

    const defs = createDefs();

    appendChildren(

        svg,

        defs

    );

    return svg;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createLayers()
 * ============================================================================
 *
 * Creates every rendering layer used by the bouquet.
 *
 * Rendering Order (Back → Front)
 *
 * Background
 * Lighting
 * Vignette
 * Particles
 * Fireflies
 * Stems
 * Leaves
 * Flowers
 * Flower Centers
 * Highlights
 * Glow
 * Overlay
 *
 * ============================================================================
 */

/**
 * Create all SVG rendering layers.
 *
 * @returns {Object}
 */
export function createLayers() {

    const background = createGroup({

        id: LAYERS.BACKGROUND

    });

    const lighting = createGroup({

        id: LAYERS.LIGHTING

    });

    const vignette = createGroup({

        id: LAYERS.VIGNETTE

    });

    const particles = createGroup({

        id: LAYERS.PARTICLES

    });

    const fireflies = createGroup({

        id: LAYERS.FIREFLIES

    });

    const stems = createGroup({

        id: LAYERS.STEMS,

        class: "stem-layer"

    });

    const leaves = createGroup({

        id: LAYERS.LEAVES,

        class: "leaf-layer"

    });

    const flowers = createGroup({

        id: LAYERS.FLOWERS,

        class: "flower-layer"

    });

    const centers = createGroup({

        id: LAYERS.FLOWER_CENTERS,

        class: "flower-center-layer"

    });

    const highlights = createGroup({

        id: LAYERS.HIGHLIGHTS,

        class: "highlight-layer"

    });

    const glow = createGroup({

        id: LAYERS.GLOW,

        class: "glow-layer"

    });

    const overlay = createGroup({

        id: LAYERS.OVERLAY

    });

    return Object.freeze({

        background,

        lighting,

        vignette,

        particles,

        fireflies,

        stems,

        leaves,

        flowers,

        centers,

        highlights,

        glow,

        overlay

    });

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: appendLayers()
 * ============================================================================
 *
 * Appends all rendering layers to the root SVG.
 *
 * Rendering Order (Back → Front)
 *
 * 1. Background
 * 2. Lighting
 * 3. Vignette
 * 4. Particles
 * 5. Fireflies
 * 6. Stems
 * 7. Leaves
 * 8. Flowers
 * 9. Flower Centers
 * 10. Highlights
 * 11. Glow
 * 12. Overlay
 *
 * NOTE
 * ----
 * <defs> is already appended by createRootSVG().
 *
 * ============================================================================
 */

/**
 * Append rendering layers to the SVG.
 *
 * @param {SVGSVGElement} svg
 * @param {Object} layers
 *
 * @returns {SVGSVGElement}
 */
export function appendLayers(svg, layers) {

    if (!(svg instanceof SVGSVGElement)) {

        throw new TypeError(
            "appendLayers(): svg must be an SVGSVGElement."
        );

    }

    if (!layers || typeof layers !== "object") {

        throw new TypeError(
            "appendLayers(): layers must be an object."
        );

    }

    appendChildren(

        svg,

        /* =======================================================
           Scene Background
        ======================================================= */

        layers.background,

        /* =======================================================
           Lighting
        ======================================================= */

        layers.lighting,

        /* =======================================================
           Vignette
        ======================================================= */

        layers.vignette,

        /* =======================================================
           Particles
        ======================================================= */

        layers.particles,

        /* =======================================================
           Fireflies
        ======================================================= */

        layers.fireflies,

        /* =======================================================
           Bouquet
        ======================================================= */

        layers.stems,

        layers.leaves,

        layers.flowers,

        layers.centers,

        layers.highlights,

        layers.glow,

        /* =======================================================
           Overlay
        ======================================================= */

        layers.overlay

    );

    return svg;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createScene()
 * ============================================================================
 *
 * Master SVG Scene Builder
 *
 * Responsibilities
 * ----------------
 * • Create the root SVG
 * • Create all rendering layers
 * • Append layers to the SVG
 * • Return a reusable scene object
 *
 * ============================================================================
 */

/**
 * Create the complete SVG scene.
 *
 * @returns {Object}
 */
export function createScene() {

    /* ---------------------------------------------------------------------
       Create Root SVG
    --------------------------------------------------------------------- */

    const svg = createRootSVG();

    /* ---------------------------------------------------------------------
       Access <defs>
    --------------------------------------------------------------------- */

    const defs = svg.querySelector("defs");

    /* ---------------------------------------------------------------------
       Create Rendering Layers
    --------------------------------------------------------------------- */

    const layers = createLayers();

    /* ---------------------------------------------------------------------
       Append Layers
    --------------------------------------------------------------------- */

    appendLayers(

        svg,

        layers

    );

    /* ---------------------------------------------------------------------
       Scene Object
    --------------------------------------------------------------------- */

    const scene = Object.freeze({

        svg,

        defs,

        layers

    });

    return scene;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createGradientStop()
 * ============================================================================
 *
 * Creates an SVG <stop> element.
 *
 * Used by:
 * • Linear Gradients
 * • Radial Gradients
 *
 * ============================================================================
 */

/**
 * Create an SVG gradient stop.
 *
 * @param {Number|String} offset
 *        Examples:
 *        0
 *        0.5
 *        "50%"
 *        "100%"
 *
 * @param {String} color
 *        Stop color.
 *
 * @param {Number} [opacity=1]
 *        Stop opacity.
 *
 * @param {Object} [attributes={}]
 *        Additional SVG attributes.
 *
 * @returns {SVGStopElement}
 */
export function createGradientStop(
    offset,
    color,
    opacity = 1,
    attributes = {}
) {

    if (offset === undefined || offset === null) {
        throw new TypeError(
            "createGradientStop(): offset is required."
        );
    }

    if (typeof color !== "string") {
        throw new TypeError(
            "createGradientStop(): color must be a string."
        );
    }

    const stop = createSVGElement("stop");

    setAttributes(stop, {

        offset,

        "stop-color": color,

        "stop-opacity": opacity,

        ...attributes

    });

    return stop;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createLinearGradient()
 * ============================================================================
 *
 * Creates an SVG <linearGradient>.
 *
 * Used by:
 * • Background gradients
 * • Leaf gradients
 * • Stem gradients
 * • Ribbon gradients
 * • Flower gradients
 *
 * ============================================================================
 */

/**
 * Create an SVG linear gradient.
 *
 * @param {String} id
 *        Gradient ID.
 *
 * @param {Array<SVGStopElement>} stops
 *        Gradient stops.
 *
 * @param {Object} [attributes={}]
 *        Additional SVG attributes.
 *
 * @returns {SVGLinearGradientElement}
 */
export function createLinearGradient(
    id,
    stops = [],
    attributes = {}
) {

    if (!id || typeof id !== "string") {

        throw new TypeError(
            "createLinearGradient(): id must be a non-empty string."
        );

    }

    if (!Array.isArray(stops)) {

        throw new TypeError(
            "createLinearGradient(): stops must be an array."
        );

    }

    const gradient = createSVGElement("linearGradient");

    setAttributes(

        gradient,

        {

            id,

            x1: "0%",
            y1: "0%",

            x2: "0%",
            y2: "100%",

            gradientUnits: "objectBoundingBox",

            ...attributes

        }

    );

    appendChildren(

        gradient,

        stops

    );

    return gradient;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createRadialGradient()
 * ============================================================================
 *
 * Creates an SVG <radialGradient>.
 *
 * Used by:
 * • Background gradients
 * • Ambient glow
 * • Vignette
 * • Flower centers
 * • Bloom effects
 *
 * ============================================================================
 */

/**
 * Create an SVG radial gradient.
 *
 * @param {String} id
 *        Gradient ID.
 *
 * @param {Array<SVGStopElement>} stops
 *        Gradient stops.
 *
 * @param {Object} [attributes={}]
 *        Additional SVG attributes.
 *
 * @returns {SVGRadialGradientElement}
 */
export function createRadialGradient(
    id,
    stops = [],
    attributes = {}
) {

    if (!id || typeof id !== "string") {

        throw new TypeError(
            "createRadialGradient(): id must be a non-empty string."
        );

    }

    if (!Array.isArray(stops)) {

        throw new TypeError(
            "createRadialGradient(): stops must be an array."
        );

    }

    const gradient = createSVGElement("radialGradient");

    setAttributes(

        gradient,

        {

            id,

            cx: "50%",
            cy: "50%",

            r: "50%",

            fx: "50%",
            fy: "50%",

            gradientUnits: "objectBoundingBox",

            ...attributes

        }

    );

    appendChildren(

        gradient,

        stops

    );

    return gradient;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createBackgroundGradient()
 * ============================================================================
 *
 * Creates the primary scene background gradient.
 *
 * Used by:
 * • Scene background
 * • Main SVG backdrop
 *
 * ============================================================================
 */

/**
 * Create the scene background radial gradient.
 *
 * @returns {SVGRadialGradientElement}
 */
export function createBackgroundGradient() {

    return createRadialGradient(

        "background-gradient",

        [

            createGradientStop(
                "0%",
                "#111111"
            ),

            createGradientStop(
                "45%",
                "#080808"
            ),

            createGradientStop(
                "100%",
                "#050505"
            )

        ],

        {

            cx: "50%",
            cy: "40%",

            r: "75%",

            fx: "50%",
            fy: "40%",

            gradientUnits: "objectBoundingBox"

        }

    );

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createAmbientGradient()
 * ============================================================================
 *
 * Creates the ambient lighting gradient behind the bouquet.
 *
 * Used by:
 * • Background lighting
 * • Ambient glow
 * • Soft scene illumination
 *
 * ============================================================================
 */

/**
 * Create the ambient radial gradient.
 *
 * @returns {SVGRadialGradientElement}
 */
export function createAmbientGradient() {

    return createRadialGradient(

        "ambient-gradient",

        [

            createGradientStop(
                "0%",
                "#FFFFFF",
                0.08
            ),

            createGradientStop(
                "30%",
                "#FFFFFF",
                0.05
            ),

            createGradientStop(
                "65%",
                "#FFFFFF",
                0.02
            ),

            createGradientStop(
                "100%",
                "#FFFFFF",
                0
            )

        ],

        {

            cx: "50%",
            cy: "42%",

            fx: "50%",
            fy: "42%",

            r: "65%",

            gradientUnits: "objectBoundingBox"

        }

    );

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createVignetteGradient()
 * ============================================================================
 *
 * Creates the vignette gradient.
 *
 * Used by:
 * • Edge darkening
 * • Cinematic composition
 * • Visual focus
 *
 * ============================================================================
 */

/**
 * Create the vignette radial gradient.
 *
 * @returns {SVGRadialGradientElement}
 */
export function createVignetteGradient() {

    return createRadialGradient(

        "vignette-gradient",

        [

            createGradientStop(
                "40%",
                "#000000",
                0
            ),

            createGradientStop(
                "70%",
                "#000000",
                0.18
            ),

            createGradientStop(
                "85%",
                "#000000",
                0.35
            ),

            createGradientStop(
                "100%",
                "#000000",
                0.55
            )

        ],

        {

            cx: "50%",
            cy: "50%",

            fx: "50%",
            fy: "50%",

            r: "75%",

            gradientUnits: "objectBoundingBox"

        }

    );

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createFlowerGradient()
 * ============================================================================
 *
 * Generic flower radial gradient.
 *
 * Can be reused by:
 * • Lily
 * • Tulip
 * • Rose
 * • Red Flower
 * • Any custom flower
 *
 * ============================================================================
 */

/**
 * Create a radial flower gradient.
 *
 * @param {String} id
 * @param {String} innerColor
 * @param {String} outerColor
 *
 * @returns {SVGRadialGradientElement}
 */
export function createFlowerGradient(
    id,
    innerColor,
    outerColor
) {

    if (!id) {
        throw new TypeError(
            "createFlowerGradient(): id is required."
        );
    }

    return createRadialGradient(

        id,

        [

            createGradientStop(
                "0%",
                innerColor
            ),

            createGradientStop(
                "65%",
                innerColor,
                0.95
            ),

            createGradientStop(
                "100%",
                outerColor
            )

        ],

        {

            cx: "50%",
            cy: "40%",

            fx: "50%",
            fy: "35%",

            r: "70%"

        }

    );

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createLeafGradient()
 * ============================================================================
 *
 * Generic leaf radial gradient.
 *
 * Can be reused by:
 * • Stem leaves
 * • Accent leaves
 * • Decorative foliage
 *
 * ============================================================================
 */

/**
 * Create a radial leaf gradient.
 *
 * @param {String} id
 * @param {String} innerColor
 * @param {String} outerColor
 *
 * @returns {SVGRadialGradientElement}
 */
export function createLeafGradient(
    id,
    innerColor,
    outerColor
) {

    if (!id || typeof id !== "string") {
        throw new TypeError(
            "createLeafGradient(): id must be a non-empty string."
        );
    }

    if (typeof innerColor !== "string" || typeof outerColor !== "string") {
        throw new TypeError(
            "createLeafGradient(): colors must be strings."
        );
    }

    return createRadialGradient(

        id,

        [

            createGradientStop(
                "0%",
                innerColor
            ),

            createGradientStop(
                "70%",
                innerColor,
                0.95
            ),

            createGradientStop(
                "100%",
                outerColor
            )

        ],

        {

            cx: "35%",
            cy: "30%",

            fx: "35%",
            fy: "30%",

            r: "80%",

            gradientUnits: "objectBoundingBox"

        }

    );

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createFilter()
 * ============================================================================
 *
 * Generic SVG filter factory.
 *
 * Used by:
 * • Ambient Glow
 * • Flower Glow
 * • Bloom
 * • Soft Blur
 * • Leaf Glow
 * • Stem Softening
 * • Particle Glow
 * • Firefly Glow
 *
 * ============================================================================
 */

/**
 * Create an SVG filter.
 *
 * @param {String} id
 * @param {Array<Node>} primitives
 * @param {Object} [attributes={}]
 *
 * @returns {SVGFilterElement}
 */
export function createFilter(
    id,
    primitives = [],
    attributes = {}
) {

    if (!id || typeof id !== "string") {

        throw new TypeError(
            "createFilter(): id must be a non-empty string."
        );

    }

    if (!Array.isArray(primitives)) {

        throw new TypeError(
            "createFilter(): primitives must be an array."
        );

    }

    const filter = createSVGElement("filter");

    setAttributes(

        filter,

        {

            id,

            x: "-50%",

            y: "-50%",

            width: "200%",

            height: "200%",

            filterUnits: "objectBoundingBox",

            primitiveUnits: "userSpaceOnUse",

            colorInterpolationFilters: "sRGB",

            ...attributes

        }

    );

    appendChildren(

        filter,

        primitives

    );

    return filter;

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createAmbientGlowFilter()
 * ============================================================================
 *
 * Creates a soft ambient glow used behind the bouquet.
 *
 * ============================================================================
 */

export function createAmbientGlowFilter() {

    const blur = createSVGElement("feGaussianBlur");

    setAttributes(blur, {

        in: "SourceGraphic",

        stdDeviation: 24,

        result: "blur"

    });

    const merge = createSVGElement("feMerge");

    appendChildren(

        merge,

        createSVGElement("feMergeNode", {

            in: "blur"

        }),

        createSVGElement("feMergeNode", {

            in: "SourceGraphic"

        })

    );

    return createFilter(

        "ambient-glow",

        [

            blur,

            merge

        ],

        {

            x: "-60%",

            y: "-60%",

            width: "220%",

            height: "220%"

        }

    );

}


/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createFlowerGlowFilter()
 * ============================================================================
 *
 * Creates the bloom surrounding every flower.
 *
 * ============================================================================
 */

export function createFlowerGlowFilter() {

    const blur = createSVGElement("feGaussianBlur");

    setAttributes(blur, {

        in: "SourceGraphic",

        stdDeviation: 8,

        result: "blur"

    });

    const colorMatrix = createSVGElement("feColorMatrix");

    setAttributes(colorMatrix, {

        in: "blur",

        result: "colored",

        type: "matrix",

        values: `
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 1.35 0
        `.trim()

    });

    const merge = createSVGElement("feMerge");

    appendChildren(

        merge,

        createSVGElement("feMergeNode", {

            in: "colored"

        }),

        createSVGElement("feMergeNode", {

            in: "SourceGraphic"

        })

    );

    return createFilter(

        "flower-glow",

        [

            blur,

            colorMatrix,

            merge

        ],

        {

            x: "-40%",

            y: "-40%",

            width: "180%",

            height: "180%"

        }

    );

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createBloomFilter()
 * ============================================================================
 *
 * Creates the cinematic bloom filter.
 *
 * Used by:
 * • Flower blooms
 * • Highlights
 * • Light overlays
 *
 * ============================================================================
 */

export function createBloomFilter() {

    const blur = createSVGElement("feGaussianBlur");

    setAttributes(blur, {

        in: "SourceGraphic",

        stdDeviation: 14,

        result: "blur"

    });

    const colorMatrix = createSVGElement("feColorMatrix");

    setAttributes(colorMatrix, {

        in: "blur",

        result: "bright",

        type: "matrix",

        values: `
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 1.65 0
        `.trim()

    });

    const merge = createSVGElement("feMerge");

    appendChildren(

        merge,

        createSVGElement("feMergeNode", {

            in: "bright"

        }),

        createSVGElement("feMergeNode", {

            in: "SourceGraphic"

        })

    );

    return createFilter(

        "bloom-filter",

        [

            blur,

            colorMatrix,

            merge

        ],

        {

            x: "-60%",

            y: "-60%",

            width: "220%",

            height: "220%"

        }

    );

}


/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createLeafGlowFilter()
 * ============================================================================
 *
 * Creates a subtle glow around leaves.
 *
 * Used by:
 * • Leaves
 * • Small foliage
 * • Accent greenery
 *
 * ============================================================================
 */

export function createLeafGlowFilter() {

    const blur = createSVGElement("feGaussianBlur");

    setAttributes(blur, {

        in: "SourceGraphic",

        stdDeviation: 3,

        result: "blur"

    });

    const merge = createSVGElement("feMerge");

    appendChildren(

        merge,

        createSVGElement("feMergeNode", {

            in: "blur"

        }),

        createSVGElement("feMergeNode", {

            in: "SourceGraphic"

        })

    );

    return createFilter(

        "leaf-glow",

        [

            blur,

            merge

        ],

        {

            x: "-25%",

            y: "-25%",

            width: "150%",

            height: "150%"

        }

    );

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createStemSofteningFilter()
 * ============================================================================
 *
 * Creates a subtle blur to soften stem edges.
 *
 * Used by:
 * • Stems
 * • Branches
 *
 * ============================================================================
 */

export function createStemSofteningFilter() {

    const blur = createSVGElement("feGaussianBlur");

    setAttributes(blur, {

        in: "SourceGraphic",

        stdDeviation: 0.6,

        result: "blur"

    });

    const merge = createSVGElement("feMerge");

    appendChildren(

        merge,

        createSVGElement("feMergeNode", {

            in: "blur"

        }),

        createSVGElement("feMergeNode", {

            in: "SourceGraphic"

        })

    );

    return createFilter(

        "stem-softening",

        [

            blur,

            merge

        ],

        {

            x: "-10%",

            y: "-10%",

            width: "120%",

            height: "120%"

        }

    );

}


/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createParticleGlowFilter()
 * ============================================================================
 *
 * Creates glow used by particles and fireflies.
 *
 * ============================================================================
 */

export function createParticleGlowFilter() {

    const blur = createSVGElement("feGaussianBlur");

    setAttributes(blur, {

        in: "SourceGraphic",

        stdDeviation: 4,

        result: "blur"

    });

    const colorMatrix = createSVGElement("feColorMatrix");

    setAttributes(colorMatrix, {

        in: "blur",

        result: "glow",

        type: "matrix",

        values: `
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 2.0 0
        `.trim()

    });

    const merge = createSVGElement("feMerge");

    appendChildren(

        merge,

        createSVGElement("feMergeNode", {

            in: "glow"

        }),

        createSVGElement("feMergeNode", {

            in: "SourceGraphic"

        })

    );

    return createFilter(

        "particle-glow",

        [

            blur,

            colorMatrix,

            merge

        ],

        {

            x: "-80%",

            y: "-80%",

            width: "260%",

            height: "260%"

        }

    );

}


/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: createSoftBlurFilter()
 * ============================================================================
 *
 * General-purpose soft blur.
 *
 * Used by:
 * • Background
 * • Overlay
 * • Highlights
 * • Lighting
 *
 * ============================================================================
 */

export function createSoftBlurFilter() {

    const blur = createSVGElement("feGaussianBlur");

    setAttributes(blur, {

        in: "SourceGraphic",

        stdDeviation: 6

    });

    return createFilter(

        "soft-blur",

        [

            blur

        ],

        {

            x: "-30%",

            y: "-30%",

            width: "160%",

            height: "160%"

        }

    );

}

/**
 * ============================================================================
 * Animated Bouquet
 * File: svg.js
 * Section: Masks • Clip Paths • Patterns
 * ============================================================================
 */



/* ============================================================================
   createMask()
============================================================================ */

/**
 * Creates an SVG <mask>.
 *
 * @param {String} id
 * @param {Array<Node>} children
 * @param {Object} attributes
 *
 * @returns {SVGMaskElement}
 */
export function createMask(
    id,
    children = [],
    attributes = {}
) {

    if (!id) {

        throw new TypeError(
            "createMask(): id is required."
        );

    }

    const mask = createSVGElement("mask");

    setAttributes(mask, {

        id,

        maskUnits: "objectBoundingBox",

        maskContentUnits: "userSpaceOnUse",

        ...attributes

    });

    appendChildren(

        mask,

        children

    );

    return mask;

}



/* ============================================================================
   createMasks()
============================================================================ */

/**
 * Creates all SVG masks.
 *
 * @returns {SVGGElement}
 */
export function createMasks() {

    const maskGroup = createGroup({

        id: "svg-masks"

    });

    const fadeMask = createMask(

        "fade-mask",

        [

            createRect(

                0,
                0,
                1080,
                1920,

                {

                    fill: "#ffffff"

                }

            )

        ]

    );

    appendChildren(

        maskGroup,

        fadeMask

    );

    return maskGroup;

}



/* ============================================================================
   createClipPath()
============================================================================ */

/**
 * Creates an SVG clipPath.
 *
 * @param {String} id
 * @param {Array<Node>} children
 * @param {Object} attributes
 *
 * @returns {SVGClipPathElement}
 */
export function createClipPath(
    id,
    children = [],
    attributes = {}
) {

    if (!id) {

        throw new TypeError(
            "createClipPath(): id is required."
        );

    }

    const clipPath = createSVGElement("clipPath");

    setAttributes(

        clipPath,

        {

            id,

            clipPathUnits: "userSpaceOnUse",

            ...attributes

        }

    );

    appendChildren(

        clipPath,

        children

    );

    return clipPath;

}



/* ============================================================================
   createClipPaths()
============================================================================ */

/**
 * Creates every clipPath used in the project.
 *
 * @returns {SVGGElement}
 */
export function createClipPaths() {

    const clipGroup = createGroup({

        id: "svg-clippaths"

    });

    const bouquetClip = createClipPath(

        "bouquet-clip",

        [

            createRect(

                0,
                0,
                1080,
                1920

            )

        ]

    );

    appendChildren(

        clipGroup,

        bouquetClip

    );

    return clipGroup;

}



/* ============================================================================
   createPattern()
============================================================================ */

/**
 * Creates an SVG pattern.
 *
 * @param {String} id
 * @param {Array<Node>} children
 * @param {Object} attributes
 *
 * @returns {SVGPatternElement}
 */
export function createPattern(
    id,
    children = [],
    attributes = {}
) {

    if (!id) {

        throw new TypeError(
            "createPattern(): id is required."
        );

    }

    const pattern = createSVGElement("pattern");

    setAttributes(

        pattern,

        {

            id,

            width: 20,

            height: 20,

            patternUnits: "userSpaceOnUse",

            ...attributes

        }

    );

    appendChildren(

        pattern,

        children

    );

    return pattern;

}



/* ============================================================================
   createPatterns()
============================================================================ */

/**
 * Creates reusable SVG patterns.
 *
 * @returns {SVGGElement}
 */
export function createPatterns() {

    const patternGroup = createGroup({

        id: "svg-patterns"

    });

    const dotPattern = createPattern(

        "dot-pattern",

        [

            createCircle(

                10,
                10,
                1.5,

                {

                    fill: "#ffffff",

                    opacity: .08

                }

            )

        ]

    );

    appendChildren(

        patternGroup,

        dotPattern

    );

    return patternGroup;

}

export function createDefs() {

    const defs = createSVGElement("defs");

    setAttributes(defs, {

        id: IDS.DEFS

    });

    appendChildren(

        defs,

        /* =======================================================
           Gradients
        ======================================================= */

        createBackgroundGradient(),

        createAmbientGradient(),

        createVignetteGradient(),

        /* Optional */

        createFlowerGradient(
            "flower-gradient",
            "#FFFFFF",
            "#E6E6E3"
        ),

        createLeafGradient(
            "leaf-gradient",
            "#739679",
            "#4F7152"
        ),

        /* =======================================================
           Filters
        ======================================================= */

        createAmbientGlowFilter(),

        createFlowerGlowFilter(),

        createBloomFilter(),

        createLeafGlowFilter(),

        createStemSofteningFilter(),

        createParticleGlowFilter(),

        createSoftBlurFilter(),

        /* =======================================================
           Masks
        ======================================================= */

        createMasks(),

        /* =======================================================
           Clip Paths
        ======================================================= */

        createClipPaths(),

        /* =======================================================
           Patterns
        ======================================================= */

        createPatterns()

    );

    return defs;

}
