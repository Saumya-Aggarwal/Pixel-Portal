"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Single registration point for GSAP plugins.
 *
 * ScrollTrigger and SplitText both ship free in the public package as of GSAP
 * 3.13 — no Club membership required. registerPlugin is idempotent, so every
 * client component can safely import from here.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText, useGSAP };
