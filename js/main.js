console.log("MAIN JS IS RUNNING");

import { createStemLayer } from "./stems.js";
import { attachLilyToStem } from "./lily.js";
import { attachTulipToStem } from "./tulip.js";
import { attachSunflowerToStem } from "./sunflower.js";
import { attachBlueFlowerToStem } from "./blueFlower.js";

import { attachLeavesToStem } from "./leaves.js";
import { createIntroMessage } from "./messages.js";

const bouquetLayer = document.getElementById("bouquet-layer");

if (!bouquetLayer) {
    console.error("bouquet-layer not found");
    throw new Error("Missing bouquet-layer");
}

const stems = createStemLayer();
bouquetLayer.appendChild(stems);

function getPoint() {
    return {
        x: 540 + (Math.random() - 0.5) * 300,
        y: 900 + Math.random() * 300
    };
}

const factories = [
    attachLilyToStem,
    attachTulipToStem,
    attachSunflowerToStem,
    attachBlueFlowerToStem
];

const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
group.setAttribute("id", "flowers");

for (let i = 0; i < 18; i++) {

    const { x, y } = getPoint();

    const flower = factories[i % factories.length](x, y);
    group.appendChild(flower);

    const leaves = attachLeavesToStem([{ x, y }]);
    group.appendChild(leaves);
}

stems.appendChild(group);
stems.appendChild(createIntroMessage());
