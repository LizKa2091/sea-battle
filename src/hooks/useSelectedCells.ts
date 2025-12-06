import { useGameStore } from "../store/useGameStore"
import type { GameStatus, ICellItem } from "../types/types";

export const useSelectedCells = (gameStatus: GameStatus): ICellItem[] => {
   const { playerCells, enemyCells } = useGameStore();
   const selectedCells: ICellItem[] = [];

   if (gameStatus === 'placement') {
      for (const row of playerCells) {
         for (const cell of row) {
            if (cell.isSelected) selectedCells.push(cell);
         }
      }
   }
   else {
      for (const row of enemyCells) {
         for (const cell of row) {
            if (cell.isSelected) selectedCells.push(cell);
         }
      }
   }
   
   return selectedCells;
}