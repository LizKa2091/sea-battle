import { useCallback } from "react";
import { useGameStore } from "../store/useGameStore";
import { getRandomCellId } from "../utils/getRandomCellId";

export const useDamageRandomCell = () => {
   const { playerCells, damageCell } = useGameStore();

   const damageRandomCell = useCallback(() => {
      const undamagedCellIds: string[] = [];

      playerCells.forEach((row) => 
         row.forEach((cell) => 
            !cell.isDamaged ? undamagedCellIds.push(cell.id) : cell
         )
      )

      if (undamagedCellIds.length) {
         const cellIdToDamage = getRandomCellId(undamagedCellIds);

         if (cellIdToDamage) damageCell(undamagedCellIds[cellIdToDamage]);
      }
   }, [playerCells, damageCell]);

   return { damageRandomCell };
}