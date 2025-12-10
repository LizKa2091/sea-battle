import { useGameStore } from "../store/useGameStore";
import type { GameStatus, ShipType } from "../types/types";

export const useShipsTrack = (gameStatus: GameStatus): Record<ShipType, number> => {
   const { playerShips, enemyShips } = useGameStore();

   if (gameStatus === 'placement') {
      return {
         single: playerShips.filter((ship) => ship.type === 'single' && ship.state === 'ready').length,
         duo: playerShips.filter((ship) => ship.type === 'duo' && ship.state === 'ready').length,
         trio: playerShips.filter((ship) => ship.type === 'trio' && ship.state === 'ready').length,
         quadro: playerShips.filter((ship) => ship.type === 'quadro' && ship.state === 'ready').length
      }
   }

   else {
      return {
         single: enemyShips.filter((ship) => ship.type === 'single' && ship.state !== 'destroyed').length,
         duo: enemyShips.filter((ship) => ship.type === 'duo' && ship.state !== 'destroyed').length,
         trio: enemyShips.filter((ship) => ship.type === 'trio' && ship.state !== 'destroyed').length,
         quadro: enemyShips.filter((ship) => ship.type === 'quadro' && ship.state !== 'destroyed').length
      }
   }
}