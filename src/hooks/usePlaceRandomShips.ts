import { useGameStore } from "../store/useGameStore";
import { getRandomCellIndex } from "../utils/getRandomCellIndex";
import type { IShipItem } from "../types/types";

const directions = [
   { rowDif: 1, colDif: 0 },
   { rowDif: -1, colDif: 0 },
   { rowDif: 0, colDif: 1 },
   { rowDif: 0, colDif: -1 },
]

export const usePlaceRandomShips = () => {
   const { enemyCells, placeShip, resetEnemyShips } = useGameStore();
   const emptyCellIds = new Set<string>();

   enemyCells.forEach((row) => 
      row.forEach((cell) =>
         !cell.hasShip ? emptyCellIds.add(cell.id) : cell
      )
   )

   const getCloseCellId = (cellId: string, direction: { rowDif: number, colDif: number }): string | null => {
      const [rowCol, owner] = cellId.split('-');

      const row: number = +rowCol[0];
      const col: number = +rowCol[1];

      const newRow: number = row + direction.rowDif;
      const newCol: number = col + direction.colDif;

      if (newRow < 0 || newRow > 9 || newCol < 0 || newCol > 9) return null;

      return `${newRow}${newCol}-${owner}`;
   }

   const canPlaceShip = (cellIds: string[]): boolean => {
      for (const cellId of cellIds) {
         if (!emptyCellIds.has(cellId)) return false;
      }

      const firstCell = cellIds[0];
      const [firstRowCol] = firstCell.split('-');
      const firstRow = +firstRowCol[0];
      const firstCol = +firstRowCol[1];

      const sameRow = cellIds.every((cellId) => +cellId.split('-')[0][0] === firstRow);
      const sameCol = cellIds.every((cellId) => +cellId.split('-')[0][1] === firstCol);

      if (!sameRow && !sameCol) return false;

      if (sameRow) {
         const cols = cellIds.map((cellId) => +cellId.split('-')[0][1]).sort((a, b) => a-b);

         for (let i=1; i<cols.length; i++) {
            if (cols[i] - cols[i-1] !== 1) return false;
         }
      }
      else {
         const rows = cellIds.map((cellId) => +cellId.split('-')[0][0]).sort((a, b) => a-b);

         for (let i=1; i<rows.length; i++) {
            if (rows[i] - rows[i-1] !== 1) return false;
         }
      }

      return true;
   }

   const findShipPosition = (size: number): string[] | null => {
      const emptyCellsArr = Array.from(emptyCellIds);
      const randomizedDirs = [...directions].sort(() => Math.random() - 0.5);
      
      for (let i=0; i<30; i++) {
         const randomIndex = getRandomCellIndex(emptyCellsArr);
         if (randomIndex === null) return null;
         
         const startCellId = emptyCellsArr[randomIndex];
         
         for (const dir of randomizedDirs) {
            const shipCells: string[] = [startCellId];
            let currentCellId = startCellId;
            let valid = true;
            
            for (let j=1; j<size; j++) {
               const nextCellId = getCloseCellId(currentCellId, dir);
               if (!nextCellId || !emptyCellIds.has(nextCellId)) {
                  valid = false;
                  break;
               }
               shipCells.push(nextCellId);
               currentCellId = nextCellId;
            }
            
            if (valid && canPlaceShip(shipCells)) return shipCells;
         }
      }
      return null;
   }
   const markOccupiedCells = (cellIds: string[]): void => {
      const occupied = new Set<string>();
      
      cellIds.forEach(cellId => {
         const [rowCol, owner] = cellId.split('-');
         const row = +rowCol[0];
         const col = +rowCol[1];
         
         for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
               const newRow = row + i;
               const newCol = col + j;
               if (newRow >= 0 && newRow <= 9 && newCol >= 0 && newCol <= 9) {
                  occupied.add(`${newRow}${newCol}-${owner}`);
               }
            }
         }
      });
      
      occupied.forEach(cellId => emptyCellIds.delete(cellId));
   }

   const placeAllShips = (shipsToPlace: IShipItem[]): boolean => {
      for (const ship of shipsToPlace) {
         if (ship.state !== 'ready') continue;
         
         const position = findShipPosition(ship.size);
         if (!position) return false;
         
         placeShip(position);
         markOccupiedCells(position);
      }
      return true;
   }

   const placeWithRetry = (maxAttempts = 10): boolean => {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
         resetEnemyShips();

         const currentEnemyShips = useGameStore.getState().enemyShips;
         const sortedShips = [...currentEnemyShips].sort((a, b) => b.size - a.size);

         emptyCellIds.clear();
         enemyCells.forEach(row => 
            row.forEach(cell => !cell.hasShip && emptyCellIds.add(cell.id))
         );
         
         if (placeAllShips(sortedShips)) return true;
      }
      return false;
   }

   return { placeRandomShips: placeWithRetry }
}