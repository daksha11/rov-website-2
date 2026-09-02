// Flight constants, kept away from three so the HUD (which is in the page
// chunk, not the dynamic scene chunk) can read them without pulling the
// renderer in. Ship.tsx and Trail.tsx import from here too.

export const FLIGHT = {
  ACCEL: 38,
  ACCEL_BOOST: 72,
  MAX_SPEED: 46,
  MAX_SPEED_BOOST: 84,
  /** rad/s */
  TURN_RATE: 2.3,
  WORLD_RADIUS: 300,
} as const;

/** How close the ship must be to a body to dock with it. */
export const dockRange = (size: number) => size * 2.3 + 3;
