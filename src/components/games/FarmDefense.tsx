"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// =============================================================================
// TYPES
// =============================================================================

type DefenderType = "dog" | "cat" | "goose" | "rooster";
type EnemyType = "red" | "arctic" | "gray" | "chief";
type TileType = "grass" | "path" | "forest" | "coop";
type GameState = "menu" | "playing" | "paused" | "won" | "lost" | "placing";

interface GridPos {
  col: number;
  row: number;
}

interface Defender {
  id: number;
  type: DefenderType;
  col: number;
  row: number;
  attackTimer: number;
  animTimer: number;
  target: Enemy | null;
  kills: number;
}

interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  pathIndex: number;
  alive: boolean;
  slowTimer: number;
  animTimer: number;
  reward: number;
}

interface Projectile {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  damage: number;
  aoe: boolean;
  aoeRadius: number;
  color: string;
  fromDefender: DefenderType;
}

interface WaveConfig {
  enemies: { type: EnemyType; count: number; delay: number }[];
  spawnDelay: number;
}

interface ParticleEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const COLORS = {
  barnRed: "#8B2500",
  hayGold: "#DAA520",
  grassGreen: "#228B22",
  grassLight: "#2E9E2E",
  skyBlue: "#87CEEB",
  path: "#C4A882",
  pathDark: "#B89A72",
  forest: "#006400",
  forestLight: "#007700",
  coopWood: "#8B6914",
  coopRoof: "#8B2500",
  white: "#FFFFFF",
  black: "#000000",
  uiBg: "rgba(0,0,0,0.75)",
  uiBorder: "#DAA520",
  hpGreen: "#44FF44",
  hpRed: "#FF4444",
  hpYellow: "#FFFF44",
};

const DEFENDER_STATS: Record<
  DefenderType,
  {
    cost: number;
    range: number;
    damage: number;
    attackSpeed: number;
    color: string;
    bodyColor: string;
    name: string;
    emoji: string;
    description: string;
    aoe: boolean;
    aoeRadius: number;
    slow: boolean;
    boost: boolean;
    boostRange: number;
    boostAmount: number;
    projectileColor: string;
  }
> = {
  dog: {
    cost: 20,
    range: 3,
    damage: 15,
    attackSpeed: 1.0,
    color: "#8B6914",
    bodyColor: "#A0782C",
    name: "Guardian Dog",
    emoji: "D",
    description: "Medium range, reliable damage",
    aoe: false,
    aoeRadius: 0,
    slow: false,
    boost: false,
    boostRange: 0,
    boostAmount: 0,
    projectileColor: "#FFD700",
  },
  cat: {
    cost: 15,
    range: 4.5,
    damage: 8,
    attackSpeed: 0.5,
    color: "#FF8C00",
    bodyColor: "#FFA533",
    name: "Barn Cat",
    emoji: "C",
    description: "Long range, fast attacks",
    aoe: false,
    aoeRadius: 0,
    slow: false,
    boost: false,
    boostRange: 0,
    boostAmount: 0,
    projectileColor: "#FF6600",
  },
  goose: {
    cost: 30,
    range: 2,
    damage: 35,
    attackSpeed: 1.5,
    color: "#EEEEEE",
    bodyColor: "#DDDDDD",
    name: "Goose",
    emoji: "G",
    description: "Area damage, slows enemies",
    aoe: true,
    aoeRadius: 1.2,
    slow: true,
    boost: false,
    boostRange: 0,
    boostAmount: 0,
    projectileColor: "#CCCCFF",
  },
  rooster: {
    cost: 25,
    range: 3,
    damage: 10,
    attackSpeed: 0.8,
    color: "#CC0000",
    bodyColor: "#FF2222",
    name: "Rooster",
    emoji: "R",
    description: "Boosts nearby defenders +30%",
    aoe: false,
    aoeRadius: 0,
    slow: false,
    boost: true,
    boostRange: 2.5,
    boostAmount: 0.3,
    projectileColor: "#FF0000",
  },
};

const ENEMY_STATS: Record<
  EnemyType,
  {
    hp: number;
    speed: number;
    reward: number;
    color: string;
    name: string;
    size: number;
  }
> = {
  red: {
    hp: 60,
    speed: 1.5,
    reward: 5,
    color: "#CC4400",
    name: "Red Fox",
    size: 0.6,
  },
  arctic: {
    hp: 40,
    speed: 2.5,
    reward: 7,
    color: "#E8E8F0",
    name: "Arctic Fox",
    size: 0.55,
  },
  gray: {
    hp: 150,
    speed: 0.8,
    reward: 12,
    color: "#666677",
    name: "Gray Fox",
    size: 0.7,
  },
  chief: {
    hp: 500,
    speed: 0.6,
    reward: 50,
    color: "#880000",
    name: "Fox Chief",
    size: 0.9,
  },
};

function generateWaves(): WaveConfig[] {
  const waves: WaveConfig[] = [];

  for (let w = 1; w <= 15; w++) {
    const enemies: { type: EnemyType; count: number; delay: number }[] = [];
    const isBoss = w % 5 === 0;

    if (isBoss) {
      enemies.push({ type: "chief", count: 1, delay: 0 });
      enemies.push({
        type: "red",
        count: Math.floor(w / 2),
        delay: 1500,
      });
      if (w >= 10) {
        enemies.push({
          type: "gray",
          count: Math.floor(w / 5),
          delay: 2000,
        });
      }
    } else {
      enemies.push({
        type: "red",
        count: 3 + w,
        delay: 800 - Math.min(w * 30, 400),
      });

      if (w >= 3) {
        enemies.push({
          type: "arctic",
          count: Math.floor(w / 2),
          delay: 600,
        });
      }
      if (w >= 6) {
        enemies.push({
          type: "gray",
          count: Math.floor(w / 3),
          delay: 1200,
        });
      }
    }

    waves.push({
      enemies,
      spawnDelay: Math.max(600, 1200 - w * 40),
    });
  }

  return waves;
}

// =============================================================================
// PATH GENERATION
// =============================================================================

function generatePath(cols: number, rows: number): GridPos[] {
  const forestCols = cols > 8 ? 2 : 1;
  const coopCols = cols > 8 ? 2 : 1;
  const startCol = forestCols;
  const endCol = cols - coopCols - 1;

  const path: GridPos[] = [];
  let col = startCol;
  let row = Math.floor(rows / 2);

  // Offscreen spawn point
  path.push({ col: -1, row });
  // Enter through forest
  for (let fc = 0; fc < forestCols; fc++) {
    path.push({ col: fc, row });
  }

  while (col <= endCol) {
    path.push({ col, row });

    if (col < endCol) {
      const playableWidth = endCol - startCol;
      const segProgress = Math.floor(((col - startCol) / Math.max(playableWidth, 1)) * 4);
      const segment = segProgress % 4;

      if (segment === 0 && row > 2) {
        col++;
        if (col <= endCol) {
          path.push({ col, row });
          for (let i = 0; i < 2 && row > 1; i++) {
            row--;
            path.push({ col, row });
          }
        }
        col++;
      } else if (segment === 2 && row < rows - 3) {
        col++;
        if (col <= endCol) {
          path.push({ col, row });
          for (let i = 0; i < 2 && row < rows - 2; i++) {
            row++;
            path.push({ col, row });
          }
        }
        col++;
      } else {
        col++;
      }
    } else {
      col++;
    }
  }

  // Enter coop area
  for (let cc = cols - coopCols; cc < cols; cc++) {
    path.push({ col: cc, row });
  }
  // Offscreen end
  path.push({ col: cols, row });

  return path;
}

function buildGrid(
  cols: number,
  rows: number,
  path: GridPos[]
): TileType[][] {
  const grid: TileType[][] = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = "grass";
    }
  }

  for (const p of path) {
    if (p.col >= 0 && p.col < cols && p.row >= 0 && p.row < rows) {
      grid[p.row][p.col] = "path";
    }
  }

  const forestCols = cols > 8 ? 2 : 1;
  const coopCols = cols > 8 ? 2 : 1;

  for (let r = 0; r < rows; r++) {
    for (let fc = 0; fc < forestCols; fc++) {
      if (grid[r][fc] !== "path") grid[r][fc] = "forest";
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let cc = 0; cc < coopCols; cc++) {
      if (grid[r][cols - 1 - cc] !== "path") grid[r][cols - 1 - cc] = "coop";
    }
  }

  return grid;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FarmDefense() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<null | {
    state: GameState;
    grid: TileType[][];
    cols: number;
    rows: number;
    cellSize: number;
    path: GridPos[];
    defenders: Defender[];
    enemies: Enemy[];
    projectiles: Projectile[];
    particles: ParticleEffect[];
    eggs: number;
    coopHp: number;
    maxCoopHp: number;
    wave: number;
    maxWaves: number;
    waves: WaveConfig[];
    waveActive: boolean;
    waveEnemyQueue: { type: EnemyType; delay: number }[];
    waveSpawnTimer: number;
    selectedDefender: DefenderType | null;
    score: number;
    totalKills: number;
    nextId: number;
    lastTime: number;
    canvasWidth: number;
    canvasHeight: number;
    offsetX: number;
    offsetY: number;
    waveCooldown: number;
    highScore: number;
    waveStartCountdown: number;
    shakeTimer: number;
    shakeIntensity: number;
    hoveredCell: GridPos | null;
    speedMultiplier: number;
    autoWave: boolean;
  }>(null);
  const animFrameRef = useRef<number>(0);
  const [uiState, setUiState] = useState<{
    gameState: GameState;
    eggs: number;
    wave: number;
    coopHp: number;
    maxCoopHp: number;
    selectedDefender: DefenderType | null;
    score: number;
    highScore: number;
    waveActive: boolean;
    waveCooldown: number;
    speedMultiplier: number;
  }>({
    gameState: "menu",
    eggs: 60,
    wave: 0,
    coopHp: 10,
    maxCoopHp: 10,
    selectedDefender: null,
    score: 0,
    highScore: 0,
    waveActive: false,
    waveCooldown: 0,
    speedMultiplier: 1,
  });

  const syncUI = useCallback(() => {
    const gs = gameStateRef.current;
    if (!gs) return;
    setUiState({
      gameState: gs.state,
      eggs: gs.eggs,
      wave: gs.wave,
      coopHp: gs.coopHp,
      maxCoopHp: gs.maxCoopHp,
      selectedDefender: gs.selectedDefender,
      score: gs.score,
      highScore: gs.highScore,
      waveActive: gs.waveActive,
      waveCooldown: gs.waveCooldown,
      speedMultiplier: gs.speedMultiplier,
    });
  }, []);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const isMobile = screenW < 700;

    const cols = isMobile ? 10 : 14;
    const rows = isMobile ? 14 : 10;

    const uiTopHeight = 44;
    const uiBottomHeight = isMobile ? 120 : 90;
    const canvasAreaW = screenW;
    const canvasAreaH = screenH - uiTopHeight - uiBottomHeight;

    const cellSize = Math.floor(
      Math.min(canvasAreaW / cols, canvasAreaH / rows)
    );
    const gridW = cellSize * cols;
    const gridH = cellSize * rows;

    const canvasWidth = canvasAreaW;
    const canvasHeight = canvasAreaH;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    const offsetX = Math.floor((canvasWidth - gridW) / 2);
    const offsetY = Math.floor((canvasHeight - gridH) / 2);

    const path = generatePath(cols, rows);
    const grid = buildGrid(cols, rows, path);

    let highScore = 0;
    try {
      const stored = localStorage.getItem("farmDefenseHighScore");
      if (stored) highScore = parseInt(stored, 10) || 0;
    } catch {
      // localStorage unavailable
    }

    gameStateRef.current = {
      state: "playing",
      grid,
      cols,
      rows,
      cellSize,
      path,
      defenders: [],
      enemies: [],
      projectiles: [],
      particles: [],
      eggs: 60,
      coopHp: 10,
      maxCoopHp: 10,
      wave: 0,
      maxWaves: 15,
      waves: generateWaves(),
      waveActive: false,
      waveEnemyQueue: [],
      waveSpawnTimer: 0,
      selectedDefender: null,
      score: 0,
      totalKills: 0,
      nextId: 1,
      lastTime: performance.now(),
      canvasWidth,
      canvasHeight,
      offsetX,
      offsetY,
      waveCooldown: 0,
      highScore,
      waveStartCountdown: 3,
      shakeTimer: 0,
      shakeIntensity: 0,
      hoveredCell: null,
      speedMultiplier: 1,
      autoWave: false,
    };

    syncUI();
  }, [syncUI]);

  // =========================================================================
  // DRAWING
  // =========================================================================

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    const gs = gameStateRef.current;
    if (!canvas || !gs) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const {
      grid,
      cols,
      rows,
      cellSize,
      offsetX,
      offsetY,
      canvasWidth,
      canvasHeight,
      defenders,
      enemies,
      projectiles,
      particles,
      path,
      shakeTimer,
      shakeIntensity,
      hoveredCell,
      selectedDefender,
    } = gs;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Sky background
    ctx.fillStyle = COLORS.skyBlue;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Apply screen shake
    let shakeX = 0;
    let shakeY = 0;
    if (shakeTimer > 0) {
      shakeX = (Math.random() - 0.5) * shakeIntensity;
      shakeY = (Math.random() - 0.5) * shakeIntensity;
    }

    ctx.save();
    ctx.translate(offsetX + shakeX, offsetY + shakeY);

    // Draw grid tiles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellSize;
        const y = r * cellSize;
        const tile = grid[r][c];

        switch (tile) {
          case "grass": {
            ctx.fillStyle =
              (r + c) % 2 === 0 ? COLORS.grassGreen : COLORS.grassLight;
            ctx.fillRect(x, y, cellSize, cellSize);
            // Small grass tufts
            const seed = (r * 17 + c * 31) % 7;
            if (seed < 3) {
              ctx.fillStyle = "#1A7A1A";
              const gx = x + cellSize * (0.2 + (seed * 0.25));
              const gy = y + cellSize * 0.7;
              ctx.beginPath();
              ctx.moveTo(gx, gy);
              ctx.lineTo(gx - 2, gy - cellSize * 0.15);
              ctx.lineTo(gx + 2, gy - cellSize * 0.12);
              ctx.fill();
            }
            break;
          }
          case "path": {
            ctx.fillStyle =
              (r + c) % 2 === 0 ? COLORS.path : COLORS.pathDark;
            ctx.fillRect(x, y, cellSize, cellSize);
            // Path texture dots
            ctx.fillStyle = "#B89060";
            for (let i = 0; i < 3; i++) {
              const px =
                x + ((r * 13 + c * 7 + i * 23) % cellSize);
              const py =
                y + ((r * 11 + c * 19 + i * 17) % cellSize);
              ctx.beginPath();
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
            break;
          }
          case "forest": {
            ctx.fillStyle = COLORS.forest;
            ctx.fillRect(x, y, cellSize, cellSize);
            // Tree
            ctx.fillStyle = COLORS.forestLight;
            const tx = x + cellSize / 2;
            const ty = y + cellSize * 0.8;
            ctx.beginPath();
            ctx.moveTo(tx, ty - cellSize * 0.7);
            ctx.lineTo(tx - cellSize * 0.35, ty);
            ctx.lineTo(tx + cellSize * 0.35, ty);
            ctx.fill();
            // Trunk
            ctx.fillStyle = "#4A3000";
            ctx.fillRect(
              tx - cellSize * 0.06,
              ty - cellSize * 0.08,
              cellSize * 0.12,
              cellSize * 0.15
            );
            break;
          }
          case "coop": {
            ctx.fillStyle = COLORS.grassGreen;
            ctx.fillRect(x, y, cellSize, cellSize);
            // Coop building
            if (c === cols - 1 || (cols > 8 && c === cols - 2)) {
              if (r >= Math.floor(rows / 2) - 1 && r <= Math.floor(rows / 2) + 1) {
                // Main coop structure
                ctx.fillStyle = COLORS.coopWood;
                ctx.fillRect(
                  x + cellSize * 0.1,
                  y + cellSize * 0.2,
                  cellSize * 0.8,
                  cellSize * 0.7
                );
                // Roof
                ctx.fillStyle = COLORS.coopRoof;
                ctx.beginPath();
                ctx.moveTo(x + cellSize * 0.5, y + cellSize * 0.05);
                ctx.lineTo(x + cellSize * 0.0, y + cellSize * 0.3);
                ctx.lineTo(x + cellSize * 1.0, y + cellSize * 0.3);
                ctx.fill();
                // Door
                ctx.fillStyle = "#3A2800";
                ctx.fillRect(
                  x + cellSize * 0.35,
                  y + cellSize * 0.5,
                  cellSize * 0.3,
                  cellSize * 0.4
                );
              }
            }
            break;
          }
        }
      }
    }

    // Draw path arrows (subtle direction indicators)
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#FFD700";
    for (let i = 2; i < path.length - 1; i += 3) {
      const p = path[i];
      const next = path[i + 1];
      if (!next) break;
      if (
        p.col < 0 ||
        p.col >= cols ||
        p.row < 0 ||
        p.row >= rows
      )
        continue;
      const cx = p.col * cellSize + cellSize / 2;
      const cy = p.row * cellSize + cellSize / 2;
      const dx = next.col - p.col;
      const dy = next.row - p.row;
      const angle = Math.atan2(dy, dx);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(cellSize * 0.2, 0);
      ctx.lineTo(-cellSize * 0.1, -cellSize * 0.1);
      ctx.lineTo(-cellSize * 0.1, cellSize * 0.1);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // Draw range preview for selected defender when hovering
    if (hoveredCell && selectedDefender) {
      const { col, row } = hoveredCell;
      if (
        col >= 0 &&
        col < cols &&
        row >= 0 &&
        row < rows &&
        grid[row][col] === "grass" &&
        !defenders.find((d) => d.col === col && d.row === row)
      ) {
        const stats = DEFENDER_STATS[selectedDefender];
        const cx = col * cellSize + cellSize / 2;
        const cy = row * cellSize + cellSize / 2;

        // Range circle
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(cx, cy, stats.range * cellSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Placement preview
        ctx.globalAlpha = 0.6;
        drawDefender(ctx, { id: 0, type: selectedDefender, col, row, attackTimer: 0, animTimer: 0, target: null, kills: 0 }, cellSize);
        ctx.globalAlpha = 1;
      }
    }

    // Draw defenders
    for (const def of defenders) {
      drawDefender(ctx, def, cellSize);

      // Draw boost range for roosters
      if (def.type === "rooster") {
        const stats = DEFENDER_STATS.rooster;
        const cx = def.col * cellSize + cellSize / 2;
        const cy = def.row * cellSize + cellSize / 2;
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(cx, cy, stats.boostRange * cellSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Draw enemies
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      drawEnemy(ctx, enemy, cellSize);
    }

    // Draw projectiles
    for (const proj of projectiles) {
      ctx.fillStyle = proj.color;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, proj.aoe ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();

      // Trail
      ctx.globalAlpha = 0.3;
      const dx = proj.targetX - proj.x;
      const dy = proj.targetY - proj.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        const nx = dx / dist;
        const ny = dy / dist;
        ctx.beginPath();
        ctx.moveTo(proj.x, proj.y);
        ctx.lineTo(proj.x - nx * 8, proj.y - ny * 8);
        ctx.strokeStyle = proj.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Draw particles
    for (const p of particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Grid border
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, cols * cellSize, rows * cellSize);

    ctx.restore();
  }, []);

  function drawDefender(
    ctx: CanvasRenderingContext2D,
    def: Defender,
    cellSize: number
  ) {
    const stats = DEFENDER_STATS[def.type];
    const cx = def.col * cellSize + cellSize / 2;
    const cy = def.row * cellSize + cellSize / 2;
    const s = cellSize * 0.35;
    const bounce = Math.sin(def.animTimer * 3) * 1.5;

    ctx.save();
    ctx.translate(cx, cy + bounce);

    switch (def.type) {
      case "dog": {
        // Body
        ctx.fillStyle = stats.bodyColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.9, s * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        // Head
        ctx.fillStyle = stats.color;
        ctx.beginPath();
        ctx.arc(s * 0.5, -s * 0.3, s * 0.45, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.fillStyle = "#5A3A00";
        ctx.beginPath();
        ctx.ellipse(s * 0.3, -s * 0.7, s * 0.15, s * 0.25, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(s * 0.7, -s * 0.7, s * 0.15, s * 0.25, 0.3, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(s * 0.35, -s * 0.35, s * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s * 0.65, -s * 0.35, s * 0.08, 0, Math.PI * 2);
        ctx.fill();
        // Nose
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.arc(s * 0.7, -s * 0.2, s * 0.06, 0, Math.PI * 2);
        ctx.fill();
        // Tail
        ctx.strokeStyle = stats.bodyColor;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-s * 0.7, -s * 0.1);
        ctx.quadraticCurveTo(-s * 1.1, -s * 0.6, -s * 0.8, -s * 0.8 + Math.sin(def.animTimer * 5) * 3);
        ctx.stroke();
        break;
      }
      case "cat": {
        // Body
        ctx.fillStyle = stats.bodyColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.7, s * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Head
        ctx.fillStyle = stats.color;
        ctx.beginPath();
        ctx.arc(s * 0.3, -s * 0.35, s * 0.4, 0, Math.PI * 2);
        ctx.fill();
        // Pointed ears
        ctx.beginPath();
        ctx.moveTo(s * 0.05, -s * 0.65);
        ctx.lineTo(s * 0.0, -s * 1.0);
        ctx.lineTo(s * 0.25, -s * 0.7);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(s * 0.35, -s * 0.65);
        ctx.lineTo(s * 0.55, -s * 1.0);
        ctx.lineTo(s * 0.55, -s * 0.65);
        ctx.fill();
        // Eyes
        ctx.fillStyle = "#22FF22";
        ctx.beginPath();
        ctx.ellipse(s * 0.15, -s * 0.35, s * 0.08, s * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(s * 0.45, -s * 0.35, s * 0.08, s * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
        // Pupil slits
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(s * 0.15, -s * 0.35, s * 0.03, s * 0.09, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(s * 0.45, -s * 0.35, s * 0.03, s * 0.09, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tail
        ctx.strokeStyle = stats.color;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-s * 0.5, s * 0.1);
        ctx.quadraticCurveTo(-s * 1.0, -s * 0.2, -s * 0.7, -s * 0.7);
        ctx.stroke();
        break;
      }
      case "goose": {
        // Body
        ctx.fillStyle = stats.bodyColor;
        ctx.beginPath();
        ctx.ellipse(0, s * 0.1, s * 0.6, s * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Neck
        ctx.fillStyle = stats.color;
        ctx.beginPath();
        ctx.moveTo(s * 0.2, -s * 0.1);
        ctx.quadraticCurveTo(s * 0.3, -s * 0.8, s * 0.5, -s * 0.7);
        ctx.quadraticCurveTo(s * 0.5, -s * 0.8, s * 0.15, -s * 0.1);
        ctx.fill();
        // Head
        ctx.beginPath();
        ctx.arc(s * 0.45, -s * 0.75, s * 0.2, 0, Math.PI * 2);
        ctx.fill();
        // Beak
        ctx.fillStyle = "#FF8C00";
        ctx.beginPath();
        ctx.moveTo(s * 0.65, -s * 0.75);
        ctx.lineTo(s * 0.95, -s * 0.7);
        ctx.lineTo(s * 0.65, -s * 0.65);
        ctx.fill();
        // Eye (angry)
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(s * 0.5, -s * 0.8, s * 0.06, 0, Math.PI * 2);
        ctx.fill();
        // Angry eyebrow
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s * 0.35, -s * 0.95);
        ctx.lineTo(s * 0.6, -s * 0.88);
        ctx.stroke();
        // Wings
        ctx.fillStyle = "#CCCCCC";
        ctx.beginPath();
        ctx.ellipse(-s * 0.15, s * 0.0, s * 0.4, s * 0.25, -0.2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "rooster": {
        // Body
        ctx.fillStyle = stats.bodyColor;
        ctx.beginPath();
        ctx.ellipse(0, s * 0.1, s * 0.55, s * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        // Neck
        ctx.fillStyle = stats.color;
        ctx.beginPath();
        ctx.moveTo(s * 0.2, -s * 0.1);
        ctx.quadraticCurveTo(s * 0.25, -s * 0.6, s * 0.35, -s * 0.55);
        ctx.quadraticCurveTo(s * 0.2, -s * 0.6, s * 0.1, -s * 0.1);
        ctx.fill();
        // Head
        ctx.beginPath();
        ctx.arc(s * 0.3, -s * 0.6, s * 0.2, 0, Math.PI * 2);
        ctx.fill();
        // Comb
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(s * 0.3, -s * 0.85, s * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s * 0.2, -s * 0.8, s * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s * 0.4, -s * 0.8, s * 0.08, 0, Math.PI * 2);
        ctx.fill();
        // Beak
        ctx.fillStyle = "#FF8C00";
        ctx.beginPath();
        ctx.moveTo(s * 0.5, -s * 0.6);
        ctx.lineTo(s * 0.75, -s * 0.55);
        ctx.lineTo(s * 0.5, -s * 0.5);
        ctx.fill();
        // Eye
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(s * 0.38, -s * 0.63, s * 0.05, 0, Math.PI * 2);
        ctx.fill();
        // Tail feathers
        const tailColors = ["#FF0000", "#00AA00", "#0044CC", "#FF8800"];
        for (let i = 0; i < 4; i++) {
          ctx.strokeStyle = tailColors[i];
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(-s * 0.4, s * 0.0);
          ctx.quadraticCurveTo(
            -s * 0.9,
            s * (0.1 - i * 0.15),
            -s * (0.7 + i * 0.1),
            -s * (0.1 + i * 0.2)
          );
          ctx.stroke();
        }
        // Boost glow
        const pulseAlpha = 0.15 + Math.sin(def.animTimer * 4) * 0.1;
        ctx.globalAlpha = pulseAlpha;
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(0, 0, s * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        break;
      }
    }

    ctx.restore();
  }

  function drawEnemy(
    ctx: CanvasRenderingContext2D,
    enemy: Enemy,
    cellSize: number
  ) {
    const stats = ENEMY_STATS[enemy.type];
    const s = cellSize * stats.size * 0.4;
    const wobble = Math.sin(enemy.animTimer * 6) * 2;

    ctx.save();
    ctx.translate(enemy.x, enemy.y + wobble);

    // Slow effect
    if (enemy.slowTimer > 0) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#88BBFF";
      ctx.beginPath();
      ctx.arc(0, 0, s * 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.ellipse(0, s * 0.8, s * 0.7, s * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = stats.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.7, s * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(s * 0.5, -s * 0.2, s * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.moveTo(s * 0.3, -s * 0.45);
    ctx.lineTo(s * 0.25, -s * 0.8);
    ctx.lineTo(s * 0.5, -s * 0.5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s * 0.5, -s * 0.45);
    ctx.lineTo(s * 0.7, -s * 0.8);
    ctx.lineTo(s * 0.7, -s * 0.45);
    ctx.fill();

    // Snout
    ctx.fillStyle = enemy.type === "arctic" ? "#DDDDDD" : "#CC6633";
    ctx.beginPath();
    ctx.ellipse(s * 0.75, -s * 0.1, s * 0.2, s * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(s * 0.9, -s * 0.12, s * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = enemy.type === "chief" ? "#FF0000" : "#FFCC00";
    ctx.beginPath();
    ctx.arc(s * 0.45, -s * 0.3, s * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(s * 0.47, -s * 0.3, s * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Bushy tail
    ctx.fillStyle = stats.color;
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, s * 0.1);
    ctx.quadraticCurveTo(-s * 1.0, -s * 0.4, -s * 0.7, -s * 0.5);
    ctx.quadraticCurveTo(-s * 0.5, -s * 0.2, -s * 0.5, s * 0.1);
    ctx.fill();
    // White tail tip
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(-s * 0.72, -s * 0.45, s * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Chief crown
    if (enemy.type === "chief") {
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.moveTo(s * 0.2, -s * 0.85);
      ctx.lineTo(s * 0.3, -s * 1.15);
      ctx.lineTo(s * 0.4, -s * 0.9);
      ctx.lineTo(s * 0.5, -s * 1.2);
      ctx.lineTo(s * 0.6, -s * 0.9);
      ctx.lineTo(s * 0.7, -s * 1.1);
      ctx.lineTo(s * 0.75, -s * 0.85);
      ctx.fill();
    }

    ctx.restore();

    // HP bar
    const hpRatio = enemy.hp / enemy.maxHp;
    const barW = cellSize * 0.7;
    const barH = 4;
    const barX = enemy.x - barW / 2;
    const barY = enemy.y - s - 10;

    ctx.fillStyle = "#333";
    ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
    ctx.fillStyle =
      hpRatio > 0.6
        ? COLORS.hpGreen
        : hpRatio > 0.3
          ? COLORS.hpYellow
          : COLORS.hpRed;
    ctx.fillRect(barX, barY, barW * hpRatio, barH);
  }

  // =========================================================================
  // GAME LOGIC
  // =========================================================================

  const update = useCallback(
    (dt: number) => {
      const gs = gameStateRef.current;
      if (!gs || gs.state !== "playing") return;

      const effectiveDt = dt * gs.speedMultiplier;

      gs.shakeTimer = Math.max(0, gs.shakeTimer - dt);

      // Wave management
      if (!gs.waveActive && gs.wave < gs.maxWaves) {
        gs.waveCooldown -= dt;
        if (gs.waveCooldown <= 0 && gs.autoWave) {
          startWave(gs);
        }
      }

      // Spawn enemies from queue
      if (gs.waveActive && gs.waveEnemyQueue.length > 0) {
        gs.waveSpawnTimer -= effectiveDt * 1000;
        if (gs.waveSpawnTimer <= 0) {
          const next = gs.waveEnemyQueue.shift()!;
          spawnEnemy(gs, next.type);
          if (gs.waveEnemyQueue.length > 0) {
            gs.waveSpawnTimer = gs.waveEnemyQueue[0].delay;
          }
        }
      }

      // Check wave complete
      if (
        gs.waveActive &&
        gs.waveEnemyQueue.length === 0 &&
        gs.enemies.filter((e) => e.alive).length === 0
      ) {
        gs.waveActive = false;
        gs.waveCooldown = 5;

        if (gs.wave >= gs.maxWaves) {
          gs.state = "won";
          gs.score += gs.coopHp * 50;
          saveHighScore(gs);
          syncUI();
          return;
        }
      }

      // Update enemies
      for (const enemy of gs.enemies) {
        if (!enemy.alive) continue;

        enemy.animTimer += effectiveDt;

        if (enemy.slowTimer > 0) {
          enemy.slowTimer -= effectiveDt;
        }

        const speedMult = enemy.slowTimer > 0 ? 0.4 : 1;
        const moveAmount = enemy.speed * speedMult * effectiveDt * gs.cellSize;

        // Move along path
        if (enemy.pathIndex < gs.path.length - 1) {
          const target = gs.path[enemy.pathIndex + 1];
          const tx = target.col * gs.cellSize + gs.cellSize / 2;
          const ty = target.row * gs.cellSize + gs.cellSize / 2;
          const dx = tx - enemy.x;
          const dy = ty - enemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < moveAmount) {
            enemy.x = tx;
            enemy.y = ty;
            enemy.pathIndex++;
          } else {
            enemy.x += (dx / dist) * moveAmount;
            enemy.y += (dy / dist) * moveAmount;
          }
        }

        // Reached the coop
        if (enemy.pathIndex >= gs.path.length - 1) {
          enemy.alive = false;
          gs.coopHp -= enemy.type === "chief" ? 3 : 1;
          gs.shakeTimer = 0.3;
          gs.shakeIntensity = enemy.type === "chief" ? 12 : 6;

          // Damage particles
          for (let i = 0; i < 8; i++) {
            gs.particles.push({
              x: enemy.x,
              y: enemy.y,
              vx: (Math.random() - 0.5) * 100,
              vy: (Math.random() - 0.5) * 100,
              life: 0.5,
              maxLife: 0.5,
              color: "#FF0000",
              size: 4,
            });
          }

          if (gs.coopHp <= 0) {
            gs.coopHp = 0;
            gs.state = "lost";
            saveHighScore(gs);
            syncUI();
            return;
          }
        }
      }

      // Check for boost from roosters
      const boostMap = new Map<number, number>();
      for (const def of gs.defenders) {
        if (def.type !== "rooster") continue;
        const stats = DEFENDER_STATS.rooster;
        for (const other of gs.defenders) {
          if (other.id === def.id) continue;
          const dist = Math.sqrt(
            (def.col - other.col) ** 2 + (def.row - other.row) ** 2
          );
          if (dist <= stats.boostRange) {
            const current = boostMap.get(other.id) || 0;
            boostMap.set(
              other.id,
              Math.max(current, stats.boostAmount)
            );
          }
        }
      }

      // Update defenders
      for (const def of gs.defenders) {
        def.animTimer += effectiveDt;
        def.attackTimer -= effectiveDt;

        if (def.attackTimer > 0) continue;

        const stats = DEFENDER_STATS[def.type];
        const range = stats.range * gs.cellSize;
        const boost = boostMap.get(def.id) || 0;
        const effectiveAttackSpeed = stats.attackSpeed * (1 - boost);

        const cx = def.col * gs.cellSize + gs.cellSize / 2;
        const cy = def.row * gs.cellSize + gs.cellSize / 2;

        let closestEnemy: Enemy | null = null;
        let closestDist = Infinity;

        for (const enemy of gs.enemies) {
          if (!enemy.alive) continue;
          const dx = enemy.x - cx;
          const dy = enemy.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= range && dist < closestDist) {
            closestDist = dist;
            closestEnemy = enemy;
          }
        }

        if (closestEnemy) {
          def.target = closestEnemy;
          def.attackTimer = effectiveAttackSpeed;

          const effectiveDamage = stats.damage * (1 + boost);

          gs.projectiles.push({
            x: cx,
            y: cy,
            targetX: closestEnemy.x,
            targetY: closestEnemy.y,
            speed: 300 * gs.cellSize / 40,
            damage: effectiveDamage,
            aoe: stats.aoe,
            aoeRadius: stats.aoeRadius * gs.cellSize,
            color: stats.projectileColor,
            fromDefender: def.type,
          });
        }
      }

      // Update projectiles
      for (let i = gs.projectiles.length - 1; i >= 0; i--) {
        const proj = gs.projectiles[i];
        const dx = proj.targetX - proj.x;
        const dy = proj.targetY - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 8) {
          if (proj.aoe) {
            for (const enemy of gs.enemies) {
              if (!enemy.alive) continue;
              const edx = enemy.x - proj.targetX;
              const edy = enemy.y - proj.targetY;
              const eDist = Math.sqrt(edx * edx + edy * edy);
              if (eDist <= proj.aoeRadius) {
                enemy.hp -= proj.damage * (1 - eDist / (proj.aoeRadius * 1.5));
                if (
                  proj.fromDefender === "goose" &&
                  DEFENDER_STATS.goose.slow
                ) {
                  enemy.slowTimer = 2;
                }
              }
            }
            // AOE explosion particles
            for (let p = 0; p < 12; p++) {
              const angle = (p / 12) * Math.PI * 2;
              gs.particles.push({
                x: proj.targetX,
                y: proj.targetY,
                vx: Math.cos(angle) * 60,
                vy: Math.sin(angle) * 60,
                life: 0.4,
                maxLife: 0.4,
                color: "#AACCFF",
                size: 3,
              });
            }
          } else {
            // Single target hit - find the nearest alive enemy to the target position
            let hitEnemy: Enemy | null = null;
            let hitDist = 20;
            for (const enemy of gs.enemies) {
              if (!enemy.alive) continue;
              const edx = enemy.x - proj.targetX;
              const edy = enemy.y - proj.targetY;
              const eDist = Math.sqrt(edx * edx + edy * edy);
              if (eDist < hitDist) {
                hitDist = eDist;
                hitEnemy = enemy;
              }
            }
            if (hitEnemy) {
              hitEnemy.hp -= proj.damage;
            }
            // Hit particle
            gs.particles.push({
              x: proj.targetX,
              y: proj.targetY,
              vx: (Math.random() - 0.5) * 40,
              vy: (Math.random() - 0.5) * 40,
              life: 0.25,
              maxLife: 0.25,
              color: proj.color,
              size: 4,
            });
          }
          gs.projectiles.splice(i, 1);
        } else {
          const move = (proj.speed * effectiveDt);
          proj.x += (dx / dist) * move;
          proj.y += (dy / dist) * move;
        }
      }

      // Check enemy deaths
      for (const enemy of gs.enemies) {
        if (enemy.alive && enemy.hp <= 0) {
          enemy.alive = false;
          gs.eggs += enemy.reward;
          gs.score += enemy.reward * 10;
          gs.totalKills++;

          // Death particles
          for (let i = 0; i < 10; i++) {
            gs.particles.push({
              x: enemy.x,
              y: enemy.y,
              vx: (Math.random() - 0.5) * 120,
              vy: (Math.random() - 0.5) * 120,
              life: 0.6,
              maxLife: 0.6,
              color: ENEMY_STATS[enemy.type].color,
              size: 3 + Math.random() * 3,
            });
          }

          // Egg reward floating text particle
          gs.particles.push({
            x: enemy.x,
            y: enemy.y - 10,
            vx: 0,
            vy: -40,
            life: 1.0,
            maxLife: 1.0,
            color: "#FFD700",
            size: 8,
          });

          // Chief spawns baby foxes
          if (enemy.type === "chief") {
            for (let i = 0; i < 3; i++) {
              setTimeout(() => {
                if (gameStateRef.current?.state === "playing") {
                  const baby = createEnemy(gameStateRef.current, "red");
                  if (baby) {
                    baby.x = enemy.x + (Math.random() - 0.5) * 20;
                    baby.y = enemy.y + (Math.random() - 0.5) * 20;
                    baby.pathIndex = Math.max(0, enemy.pathIndex - 1);
                    baby.hp = ENEMY_STATS.red.hp * 0.6;
                    baby.maxHp = baby.hp;
                  }
                }
              }, i * 300);
            }
          }
        }
      }

      // Clean up dead enemies
      gs.enemies = gs.enemies.filter(
        (e) => e.alive || e.hp > 0
      );

      // Update particles
      for (let i = gs.particles.length - 1; i >= 0; i--) {
        const p = gs.particles[i];
        p.x += p.vx * effectiveDt;
        p.y += p.vy * effectiveDt;
        p.life -= effectiveDt;
        if (p.life <= 0) {
          gs.particles.splice(i, 1);
        }
      }

      // Sync UI periodically (not every frame to avoid React overhead)
      syncUI();
    },
    [syncUI]
  );

  function startWave(gs: NonNullable<typeof gameStateRef.current>) {
    if (gs.waveActive || gs.wave >= gs.maxWaves) return;

    gs.wave++;
    gs.waveActive = true;

    const waveConfig = gs.waves[gs.wave - 1];
    gs.waveEnemyQueue = [];

    for (const group of waveConfig.enemies) {
      for (let i = 0; i < group.count; i++) {
        gs.waveEnemyQueue.push({
          type: group.type,
          delay: i === 0 && gs.waveEnemyQueue.length === 0 ? 0 : group.delay,
        });
      }
    }

    gs.waveSpawnTimer = 0;
  }

  function spawnEnemy(
    gs: NonNullable<typeof gameStateRef.current>,
    type: EnemyType
  ) {
    const enemy = createEnemy(gs, type);
    if (enemy) return enemy;
    return null;
  }

  function createEnemy(
    gs: NonNullable<typeof gameStateRef.current>,
    type: EnemyType
  ): Enemy | null {
    const stats = ENEMY_STATS[type];
    const startPos = gs.path[0];
    if (!startPos) return null;

    const waveScale = 1 + (gs.wave - 1) * 0.12;

    const enemy: Enemy = {
      id: gs.nextId++,
      type,
      x: startPos.col * gs.cellSize + gs.cellSize / 2,
      y: startPos.row * gs.cellSize + gs.cellSize / 2,
      hp: Math.round(stats.hp * waveScale),
      maxHp: Math.round(stats.hp * waveScale),
      speed: stats.speed,
      pathIndex: 0,
      alive: true,
      slowTimer: 0,
      animTimer: Math.random() * Math.PI * 2,
      reward: stats.reward,
    };

    gs.enemies.push(enemy);
    return enemy;
  }

  function saveHighScore(gs: NonNullable<typeof gameStateRef.current>) {
    if (gs.score > gs.highScore) {
      gs.highScore = gs.score;
      try {
        localStorage.setItem(
          "farmDefenseHighScore",
          gs.highScore.toString()
        );
      } catch {
        // localStorage unavailable
      }
    }
  }

  // =========================================================================
  // INPUT HANDLING
  // =========================================================================

  const handleCanvasClick = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const gs = gameStateRef.current;
      if (!canvas || !gs || gs.state !== "playing") return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - gs.offsetX;
      const y = clientY - rect.top - gs.offsetY;

      const col = Math.floor(x / gs.cellSize);
      const row = Math.floor(y / gs.cellSize);

      if (col < 0 || col >= gs.cols || row < 0 || row >= gs.rows) return;

      if (gs.selectedDefender) {
        const tile = gs.grid[row][col];
        if (tile !== "grass") return;

        if (gs.defenders.find((d) => d.col === col && d.row === row))
          return;

        const stats = DEFENDER_STATS[gs.selectedDefender];
        if (gs.eggs < stats.cost) return;

        gs.eggs -= stats.cost;
        gs.defenders.push({
          id: gs.nextId++,
          type: gs.selectedDefender,
          col,
          row,
          attackTimer: 0,
          animTimer: Math.random() * Math.PI * 2,
          target: null,
          kills: 0,
        });

        // Placement particles
        for (let i = 0; i < 6; i++) {
          gs.particles.push({
            x: col * gs.cellSize + gs.cellSize / 2,
            y: row * gs.cellSize + gs.cellSize / 2,
            vx: (Math.random() - 0.5) * 80,
            vy: (Math.random() - 0.5) * 80,
            life: 0.4,
            maxLife: 0.4,
            color: "#FFD700",
            size: 3,
          });
        }

        syncUI();
      }
    },
    [syncUI]
  );

  const handleCanvasMove = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const gs = gameStateRef.current;
      if (!canvas || !gs) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - gs.offsetX;
      const y = clientY - rect.top - gs.offsetY;

      const col = Math.floor(x / gs.cellSize);
      const row = Math.floor(y / gs.cellSize);

      if (col >= 0 && col < gs.cols && row >= 0 && row < gs.rows) {
        gs.hoveredCell = { col, row };
      } else {
        gs.hoveredCell = null;
      }
    },
    []
  );

  // =========================================================================
  // GAME LOOP
  // =========================================================================

  const gameLoop = useCallback(
    (time: number) => {
      const gs = gameStateRef.current;
      if (!gs) {
        animFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const dt = Math.min((time - gs.lastTime) / 1000, 0.05);
      gs.lastTime = time;

      if (gs.state === "playing") {
        update(dt);
      }
      drawGame();

      animFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [update, drawGame]
  );

  // =========================================================================
  // EFFECTS
  // =========================================================================

  useEffect(() => {
    const handleResize = () => {
      // We don't reinit the game on resize, just note it
      // A full reinit would lose game state
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameLoop]);

  // =========================================================================
  // UI HANDLERS
  // =========================================================================

  const handleStartGame = useCallback(() => {
    initGame();
  }, [initGame]);

  const handleSelectDefender = useCallback(
    (type: DefenderType) => {
      const gs = gameStateRef.current;
      if (!gs) return;
      gs.selectedDefender = gs.selectedDefender === type ? null : type;
      syncUI();
    },
    [syncUI]
  );

  const handleStartWave = useCallback(() => {
    const gs = gameStateRef.current;
    if (!gs || gs.waveActive || gs.wave >= gs.maxWaves) return;
    startWave(gs);
    syncUI();
  }, [syncUI]);

  const handleToggleSpeed = useCallback(() => {
    const gs = gameStateRef.current;
    if (!gs) return;
    gs.speedMultiplier = gs.speedMultiplier === 1 ? 2 : 1;
    syncUI();
  }, [syncUI]);

  const handleRestart = useCallback(() => {
    initGame();
  }, [initGame]);

  // =========================================================================
  // RENDER
  // =========================================================================

  const defenderTypes: DefenderType[] = ["dog", "cat", "goose", "rooster"];
  const isPlaying = uiState.gameState === "playing";
  const isMenu = uiState.gameState === "menu";
  const isEnd = uiState.gameState === "won" || uiState.gameState === "lost";

  return (
    <div className="fixed inset-0 flex flex-col bg-[#87CEEB] select-none overflow-hidden">
      {/* Top bar - visible during gameplay */}
      {isPlaying && (
        <div
          className="flex h-11 shrink-0 items-center justify-between px-3 text-white text-sm font-bold"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-yellow-300">
              🥚 {uiState.eggs}
            </span>
            <span>
              Wave {uiState.wave}/{15}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Coop:{" "}
              <span
                className={
                  uiState.coopHp <= 3
                    ? "text-red-400"
                    : uiState.coopHp <= 6
                      ? "text-yellow-300"
                      : "text-green-300"
                }
              >
                {"❤️".repeat(Math.max(0, uiState.coopHp))}
              </span>
            </span>
            <span className="text-yellow-200">
              {uiState.score}pts
            </span>
          </div>
        </div>
      )}

      {/* Canvas area - always present for ref access */}
      <div className="relative flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onClick={(e) => {
            if (isPlaying) handleCanvasClick(e.clientX, e.clientY);
          }}
          onMouseMove={(e) => {
            if (isPlaying) handleCanvasMove(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            if (!isPlaying) return;
            e.preventDefault();
            const touch = e.touches[0];
            handleCanvasClick(touch.clientX, touch.clientY);
          }}
          onTouchMove={(e) => {
            if (!isPlaying) return;
            const touch = e.touches[0];
            handleCanvasMove(touch.clientX, touch.clientY);
          }}
        />

        {/* Menu overlay */}
        {isMenu && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#87CEEB] to-[#228B22] z-10">
            <div className="flex flex-col items-center gap-6 px-6 text-center">
              <div
                className="text-5xl sm:text-6xl font-bold text-white drop-shadow-lg"
                style={{
                  textShadow:
                    "3px 3px 0 #8B2500, -1px -1px 0 #8B2500, 1px -1px 0 #8B2500, -1px 1px 0 #8B2500",
                }}
              >
                FARM DEFENSE
              </div>
              <div className="text-lg sm:text-xl text-white font-semibold drop-shadow-md">
                Protect the chicken coop from the foxes!
              </div>
              <div className="mt-2 flex flex-col gap-3 text-left text-white/90 text-sm max-w-xs">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐕</span>
                  <span>Place defenders to stop the foxes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥚</span>
                  <span>Earn eggs by defeating enemies</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏠</span>
                  <span>Survive 15 waves to win!</span>
                </div>
              </div>
              {uiState.highScore > 0 && (
                <div className="text-lg text-yellow-200 font-semibold">
                  High Score: {uiState.highScore}
                </div>
              )}
              <button
                onClick={handleStartGame}
                className="mt-4 rounded-xl bg-[#8B2500] px-10 py-4 text-xl sm:text-2xl font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-[#A03000]"
              >
                START GAME
              </button>
            </div>
          </div>
        )}

        {/* End screen overlay */}
        {isEnd && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
            <div className="flex flex-col items-center gap-6 px-6 text-center">
              <div
                className="text-5xl font-bold text-white drop-shadow-lg"
                style={{ textShadow: "3px 3px 0 #8B2500" }}
              >
                {uiState.gameState === "won" ? "VICTORY!" : "DEFEAT"}
              </div>
              <div className="text-xl text-white font-semibold">
                {uiState.gameState === "won"
                  ? "The chicken coop is safe!"
                  : "The foxes got through..."}
              </div>
              <div className="flex flex-col gap-2 text-white text-lg">
                <div>
                  Score:{" "}
                  <span className="font-bold text-yellow-200">
                    {uiState.score}
                  </span>
                </div>
                <div>
                  Waves Survived:{" "}
                  <span className="font-bold">
                    {uiState.wave}/15
                  </span>
                </div>
                <div>
                  High Score:{" "}
                  <span className="font-bold text-yellow-200">
                    {uiState.highScore}
                  </span>
                </div>
              </div>
              <button
                onClick={handleRestart}
                className="mt-4 rounded-xl bg-[#8B2500] px-10 py-4 text-2xl font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-[#A03000]"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom UI - visible during gameplay */}
      {isPlaying && (
        <div
          className="shrink-0 flex flex-col gap-2 px-2 py-2"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          {/* Defender selection */}
          <div className="flex items-center justify-center gap-2">
            {defenderTypes.map((type) => {
              const stats = DEFENDER_STATS[type];
              const selected = uiState.selectedDefender === type;
              const canAfford = uiState.eggs >= stats.cost;

              return (
                <button
                  key={type}
                  onClick={() => handleSelectDefender(type)}
                  className={`
                    flex flex-col items-center justify-center rounded-lg px-2 py-1.5 text-xs font-bold transition-all min-w-[70px]
                    ${
                      selected
                        ? "bg-yellow-600 ring-2 ring-yellow-300 scale-105"
                        : canAfford
                          ? "bg-gray-700 hover:bg-gray-600 active:scale-95"
                          : "bg-gray-800 opacity-50"
                    }
                    text-white
                  `}
                  disabled={!canAfford && !selected}
                >
                  <span className="text-base leading-none">
                    {type === "dog"
                      ? "🐕"
                      : type === "cat"
                        ? "🐈"
                        : type === "goose"
                          ? "🪿"
                          : "🐓"}
                  </span>
                  <span className="mt-0.5 leading-none">
                    {stats.name.split(" ").pop()}
                  </span>
                  <span className="mt-0.5 text-yellow-300 leading-none">
                    🥚{stats.cost}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-2">
            {!uiState.waveActive && uiState.wave < 15 && (
              <button
                onClick={handleStartWave}
                className="rounded-lg bg-red-700 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-red-600 active:scale-95"
              >
                {uiState.wave === 0
                  ? "START WAVE 1"
                  : `SEND WAVE ${uiState.wave + 1}`}
              </button>
            )}
            {uiState.waveActive && (
              <div className="text-sm font-bold text-yellow-300 animate-pulse">
                WAVE {uiState.wave} IN PROGRESS...
              </div>
            )}
            <button
              onClick={handleToggleSpeed}
              className={`rounded-lg px-4 py-2 text-sm font-bold text-white transition-all active:scale-95 ${
                uiState.speedMultiplier === 2
                  ? "bg-yellow-600"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              {uiState.speedMultiplier === 1 ? "▶ 1x" : "▶▶ 2x"}
            </button>
            {uiState.selectedDefender && (
              <div className="text-xs text-gray-300 max-w-[160px] text-center leading-tight">
                {DEFENDER_STATS[uiState.selectedDefender].description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
