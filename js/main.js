/**
 * ============================================================================
 * Animated Bouquet
 * File: main.js
 * Version: 1.0.0
 *
 * Entry point for the application.
 *
 * Responsibilities:
 * - Wait for DOM readiness
 * - Initialize the scene
 * - Create all bouquet components
 * - Start animations
 * ============================================================================
 */

import { createScene } from "./svg.js";
import { createStems } from "./stems.js";
import { createLeaves } from "./leaves.js";
import { createLilies } from "./lily.js";
import { createTulips } from "./tulip.js";
import { createSunflowers } from "./sunflower.js";
import { createRedFlowers } from "./redFlower.js";
import { createParticles } from "./particles.js";
import { createMessage } from "./messages.js";
import { startAnimation } from "./animation.js";

/**
 * Application controller.
 */
class AnimatedBouquet {

    constructor() {

        this.scene = null;

    }

    /**
     * Initialize the application.
     */
    init() {

        this.scene = createScene();

        createStems(this.scene);

        createLeaves(this.scene);

        createLilies(this.scene);

        createTulips(this.scene);

        createSunflowers(this.scene);

        createRedFlowers(this.scene);

        createParticles(this.scene);

        createMessage(this.scene);

        startAnimation(this.scene);

    }

}

/**
 * Bootstrap the application.
 */
document.addEventListener("DOMContentLoaded", () => {

    const app = new AnimatedBouquet();

    app.init();

});
