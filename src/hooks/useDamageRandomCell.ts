import { useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { getRandomCellIndex } from "../utils/getRandomCellIndex";

export const useDamageRandomCell = () => {
   const { playerCells, damageCell } = useGameStore();

   const damageRandomCell = useCallback(() => {
      const undamagedCellsIdsSet = new Set<string>();

      playerCells.forEach((row) => 
         row.forEach((cell) => 
            !cell.isDamaged ? undamagedCellsIdsSet.add(cell.id) : cell
         )
      )

      if (undamagedCellsIdsSet.size > 0) {
         const undamagedCellsArr = Array.from(undamagedCellsIdsSet);
         const cellIndexToDamage: number | null = getRandomCellIndex(undamagedCellsArr);

         if (cellIndexToDamage !== null) {
            damageCell(undamagedCellsArr[cellIndexToDamage]);
         }
      }
   }, [playerCells, damageCell]);

   return { damageRandomCell };
}