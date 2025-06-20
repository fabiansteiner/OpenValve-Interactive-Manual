import React, { useRef, useEffect } from "react";
import "./WaterBackground.css";

// Number of particles (increased further)
const PARTICLE_COUNT = 220;
// Particle color
const PARTICLE_COLOR = "#2196f3";
// Particle radius range (smaller)
const RADIUS_MIN = 2.4;
const RADIUS_MAX = 3.4;
// Particle opacity (more visible)
const ALPHA_MIN = 0.40;
const ALPHA_MAX = 0.65;

// Centered vertical band for particles (fixed width, fixed offset from center in px)
const BAND_WIDTH = 15; // px
const BAND_OFFSET = 65; // px right from center

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

/**
 * Animated water background for valve state feedback.
 * @param {Object} props
 * @param {"OPEN"|"CLOSED"} props.valveState
 */
function WaterBackground({ valveState }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef();

  const getBand = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Band is always BAND_WIDTH wide and offset BAND_OFFSET px to the right from center
    const bandLeft = Math.round(width / 2 - BAND_WIDTH / 2 + BAND_OFFSET);
    return { width, height, bandWidth: BAND_WIDTH, bandLeft };
  };

 
  // Gradually spawn particles when valveState transitions to OPEN, only 1-2 per interval for smooth effect
  useEffect(() => {
    let spawnInterval;
    if (valveState === "OPEN") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const { width, bandWidth, bandLeft } = getBand();
      canvas.width = width * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = window.innerHeight + "px";
      // Gradually add particles up to PARTICLE_COUNT, but do not clear existing ones
      spawnInterval = setInterval(() => {
        if (particlesRef.current.length < PARTICLE_COUNT) {

            particlesRef.current.push({
              x: randomBetween(bandLeft, bandLeft + bandWidth),
              y: randomBetween(-20, 0),
              r: randomBetween(RADIUS_MIN, RADIUS_MAX),
              vy: randomBetween(2.4, 4.2),
              alpha: randomBetween(ALPHA_MIN, ALPHA_MAX),
            });
        } else {
          clearInterval(spawnInterval);
        }
      }, 25); // spawn every 12ms for a fast but smooth effect
    }
    return () => clearInterval(spawnInterval);
  }, [valveState]);

  // Animate particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");
    function draw() {
      const { width, bandWidth, bandLeft } = getBand();
      const bandTop = 0;
      const bandHeight = 500; // Set band height to 500px
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x * dpr, p.y * dpr, p.r * dpr, 0, 2 * Math.PI);
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.shadowColor = PARTICLE_COLOR;
        ctx.shadowBlur = 8 * dpr;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    }
    function update() {
      const bandTop = 0;
      const bandHeight = 500; // Set band height to 500px
      const { bandWidth, bandLeft } = getBand();
      // Update particle positions and remove those that leave the band
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.y += p.vy;
        if (p.y > bandTop + bandHeight + p.r) {
          if (valveState === "OPEN") {
            // Respawn at the top if open
            p.y = bandTop - p.r;
            p.x = randomBetween(bandLeft, bandLeft + bandWidth);
          } else {
            // Remove particle if closed
            particlesRef.current.splice(i, 1);
          }
        }
      }
    }
    function animate() {
      update();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [valveState]);

  // Resize canvas on window resize
  useEffect(() => {
    function handleResize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const { width } = getBand();
      canvas.width = width * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = window.innerHeight + "px";
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="water-bg-root-particles">
      <canvas ref={canvasRef} className="water-bg-canvas" />
    </div>
  );
}

export default WaterBackground;
