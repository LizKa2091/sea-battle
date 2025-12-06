import { useGameStore } from "../store/useGameStore";
import type { ShipType } from "../types/types";

export const useShipsTrack = (): Record<ShipType, number> => {
   const { ships } = useGameStore();

   return {
      single: ships.filter((ship) => ship.type === 'single' && ship.state === 'ready').length,
      duo: ships.filter((ship) => ship.type === 'duo' && ship.state === 'ready').length,
      trio: ships.filter((ship) => ship.type === 'trio' && ship.state === 'ready').length,
      quadro: ships.filter((ship) => ship.type === 'quadro' && ship.state === 'ready').length
   }
}