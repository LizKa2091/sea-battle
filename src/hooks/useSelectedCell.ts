import { useCellsStore } from "../store/useCellsStore"
import type { ICellItem } from "../types/types";

export const useSelectedCell = (): ICellItem | null => {
   const { cells } = useCellsStore();

   for (const row of cells) {
      const selectedCell = row.find((cell) => cell.isSelected);

      if (selectedCell) return selectedCell;
   }

   return null;
}