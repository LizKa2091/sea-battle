import { useShipsTrack } from "./useShipsTrack"
import type { GameStatus } from "../types/types";

export const useGameResult = (gameSatus: GameStatus) => {
   const currPlayerTrack = useShipsTrack(gameSatus, 'player');
   const currEnemyTrack = useShipsTrack(gameSatus, 'enemy');

   const getGameResult = (() => {
      const arePlayerShipsDestroyed: boolean = 
         currPlayerTrack?.single === 0 &&
         currPlayerTrack?.duo === 0 &&
         currPlayerTrack?.trio === 0 &&
         currPlayerTrack?.quadro === 0;

      const areEnemyShipsDestroyed: boolean =
         currEnemyTrack?.single === 0 &&
         currEnemyTrack?.duo === 0 &&
         currEnemyTrack?.trio === 0 &&
         currEnemyTrack?.quadro === 0;

      if (arePlayerShipsDestroyed) return 'player';
      if (areEnemyShipsDestroyed) return 'enemy';
      return null;
   })

   return { getGameResult };
}