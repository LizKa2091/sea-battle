import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initField } from "../utils/initField";
import { initShips } from "../utils/initShips";
import { shipTypeMap } from "../constants/constants";
import type { IGameStoreState } from "./storeTypes";
import type { IShipItem } from "../types/types";

const getCellData = (cellId: string) => {
   const cellSplitted = cellId.split('-');

   const xy = cellSplitted[0];
   const owner = cellSplitted[1];

   const rowIndex = Math.floor(+xy / 10);
   const colIndex = +xy % 10;

   return { rowIndex, colIndex, owner };
}

export const useGameStore = create<IGameStoreState>()(persist((set) => ({
   gameStatus: 'start',
   playerCells: initField('player'),
   playerShips: initShips('player'),
   enemyCells: initField('enemy'),
   enemyShips: initShips('enemy'),

   setPlacementStatus: () => set(() => ({
      gameStatus: 'placement'
   })),
   // placeEnemiesShips: () => set((state) => {
      
   // }),
   placeShip: (cellIds: string[]) => set((state) => {
      const shipSize = cellIds.length;
      const shipType = shipTypeMap[shipSize];
      const { owner } = getCellData(cellIds[0]);

      if (!shipType || owner !== 'player') return state;

      const areCellsEmpty = cellIds.every((cellId) => {
         const { rowIndex, colIndex } = getCellData(cellId);

         return !state.playerCells[rowIndex][colIndex].hasShip;
      });

      if (!areCellsEmpty) return state;

      const seenCells = new Set();
      let nothingNearby: boolean = true;

      for (const cellId of cellIds) {
         const { rowIndex, colIndex } = getCellData(cellId);

         for (let i=-1; i<2; i++) {
            for (let j=-1; j<2; j++) {
               const currRow = rowIndex+i;
               const currCol = colIndex+j;

               if (currRow < 0 || currRow > 9 || currCol < 0 || currCol > 9) {
                  continue;
               }

               const currCellId = `${currRow}${currCol}-player`;

               if (!seenCells.has(currCellId)) {
                  seenCells.add(currCellId);

                  if (state.playerCells[currRow][currCol].hasShip && !cellIds.includes(currCellId)) {
                     nothingNearby = false;
                     break;
                  }
               }
            }
            if (!nothingNearby) break;
         }
         if (!nothingNearby) break;
      }

      if (!nothingNearby) return state;

      let shipToPlace: IShipItem | null = null;

      const updatedShips = state.playerShips.map((ship) => {
         if (!shipToPlace && ship.state === 'ready' && ship.type === shipType) {
            shipToPlace = { ...ship, state: 'placed', takenCellIds: cellIds };

            return shipToPlace;
         }

         return ship;
      });

      if (!shipToPlace) return state;

      const updatedCells = state.playerCells.map((row, rowIndex) => {
         return row.map((cell, cellIndex) => {
            const cellId = `${rowIndex}${cellIndex}-player`;

            if (cellIds.includes(cellId)) {
               return { ...cell, hasShip: true, shipId: shipToPlace!.id, isSelected: false };
            }

            return { ...cell, isSelected: false };
         })
      });

      return { ...state, cells: updatedCells, ships: updatedShips };
   }),
   damageCell: (cellId: string) => set((state) => {
      const { owner } = getCellData(cellId);

      if (owner === 'player') {
         const updatedCells = state.playerCells.map((row) => 
            row.map((cell) => cell.id === cellId ? 
               { ...cell, isDamaged: true } : cell
            )
         );

         const updatedShips = state.playerShips.map((ship) => 
            ship.takenCellIds.includes(cellId) ? 
            { ...ship, state: 'damaged' as const } : ship
         );

         return { ...state, playerCells: updatedCells, playerShips: updatedShips };
      }

      else if (owner === 'enemy') {
         return state;
      }

      return state;
   }),
   toggleSelectCell: (cellId: string) => set((state) => {
      const { owner } = getCellData(cellId);

      if (owner !== 'enemy' && state.gameStatus === 'in progress') return state;

      const currSelectedCells: string[] = [];

      state.enemyCells.forEach((row) => {
         row.forEach((cell) => {
            if (cell.isSelected) currSelectedCells.push(cell.id);
         })
      })

      if (currSelectedCells.includes(cellId)) {
         return { 
            enemyCells: state.enemyCells.map((row) => 
               row.map((cell) => cell.id === cellId ?
                  { ...cell, isSelected: false } : cell
               )
         )}
      }

      if (!currSelectedCells.length) {
         return { 
            enemyCells: state.enemyCells.map((row => 
               row.map((cell) => cell.id === cellId ? { ...cell, isSelected: true } : cell)
            ))
         }
      }

      if (currSelectedCells.length === 1) {
         const firstCell = currSelectedCells[0];
         const { rowIndex: firstRow, colIndex: firstCol } = getCellData(firstCell);
         const { rowIndex: newRow, colIndex: newCol } = getCellData(cellId);

         const isClose = 
            (firstRow === newRow && Math.abs(firstCol - newCol) === 1) ||
            (firstCol === newCol && Math.abs(firstRow - newRow) === 1);

         return {
            enemyCells: state.enemyCells.map((row) =>
               row.map((cell) =>
                  cell.id === cellId ?
                     { ...cell, isSelected: isClose } :
                        (isClose ? cell : { ...cell, isSelected: false })
               )
            )
         }
      }

      const rows = currSelectedCells.map((cell) => Math.floor(+cell / 10));
      const cols = currSelectedCells.map((cell) => +cell % 10);

      const allSameRow = rows.every((row) => row === rows[0]);
      const allSameCol = cols.every((col) => col === cols[0]);

      const { rowIndex: newRow, colIndex: newCol } = getCellData(cellId);

      let isNearby = false;

      if (allSameRow) {
         const minCol = Math.min(...cols);
         const maxCol = Math.max(...cols);

         isNearby = newRow === rows[0] && (newCol === minCol - 1 || newCol === maxCol + 1);
      }
      else if (allSameCol) {
         const minRow = Math.min(...rows);
         const maxRow = Math.max(...rows);
         
         isNearby = newCol === cols[0] && (newRow === minRow - 1 || newRow === maxRow + 1);
      }

      if (!isNearby) {
         return {
            enemyCells: state.enemyCells.map((row) =>
               row.map((cell) =>
                  cell.id === cellId ?
                     { ...cell, isSelected: true } : { ...cell, isSelected: false }
               )
            )
         }
      }

      return {
         enemyCells: state.enemyCells.map((row) => 
            row.map((cell) =>
               cell.id === cellId ? { ...cell, isSelected: true } : cell
            )
         )
      }
   })
}), 
   { name: 'sea-battle-storage' }
))