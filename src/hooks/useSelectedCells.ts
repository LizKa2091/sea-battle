import { useCellsStore } from "../store/useCellsStore"
import type { ICellItem } from "../types/types";

export const useSelectedCells = (): ICellItem[] => {
   const { cells } = useCellsStore();
   const selectedCells: ICellItem[] = [];

   for (const row of cells) {
      for (const cell of row) {
         if (cell.isSelected) selectedCells.push(cell);
      }
   }

   return selectedCells;
}