/**
 * ============================================================================
 * Animated Bouquet
 * File: messages.js
 * ============================================================================
 */

import {
    createGroup,
    createPath,
    appendChildren
} from "./svg.js";

/* ============================================================================
   Message Config
============================================================================ */

export const MESSAGE_CONFIG = Object.freeze({

    FONT_SIZE: 24,

    COLOR: "#2A2A2A",

    FADE_DURATION: 2.5,

    Y_OFFSET: 80

});

/* ============================================================================
   Create Text Path (SVG text fallback shape)
============================================================================ */

export function createTextPath(x, y, text) {

    return {
        x,
        y,
        text
    };

}

/* ============================================================================
   Message Bubble (SVG group wrapper)
============================================================================ */

export function createMessageBubble(x, y, text) {

    const group = createGroup({

        class: "message"

    });

    const textNode = createPath("", {

        fill: MESSAGE_CONFIG.COLOR,

        stroke: "none"

    });

    textNode.textContent = text;

    group.appendChild(textNode);

    return group;
}

/* ============================================================================
   Floating Message Above Bouquet
============================================================================ */

export function createFloatingMessage(text, x = 540, y = 200) {

    return createMessageBubble(
        x,
        y - MESSAGE_CONFIG.Y_OFFSET,
        text
    );

}

/* ============================================================================
   Message Attach to Flower
============================================================================ */

export function attachMessageToFlower(text, flowerX, flowerY) {

    const msg = createMessageBubble(
        flowerX,
        flowerY - 60,
        text
    );

    return msg;
}

/* ============================================================================
   Bouquet Intro Message
============================================================================ */

export function createIntroMessage() {

    return createFloatingMessage("A Bouquet of Animation ✨");

}
