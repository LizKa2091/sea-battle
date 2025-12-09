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
   gameStatus: 'in progress',
   playerCells: initField('player'),
   playerShips: initShips('player'),
   enemyCells: initField('enemy'),
   enemyShips: initShips('enemy'),

   setPlacementStatus: () => set(() => ({
      gameStatus: 'placement'
   })),
   placeShip: (cellIds: string[]) => set((state) => {
      const shipSize = cellIds.length;
      const shipType = shipTypeMap[shipSize];
      const { owner } = getCellData(cellIds[0]);

      if (!shipType) return state;

      const areCellsEmpty = cellIds.every((cellId) => {
         const { rowIndex, colIndex } = getCellData(cellId);

         if (owner === 'player') {
            return !state.playerCells[rowIndex][colIndex].hasShip;
         }
         else if (owner === 'enemy') {
            return !state.enemyCells[rowIndex][colIndex].hasShip;
         }
         
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

               const currCellId = `${currRow}${currCol}-${owner}`;

               if (!seenCells.has(currCellId)) {
                  seenCells.add(currCellId);

                  if (owner === 'player') {
                     if (state.playerCells[currRow][currCol].hasShip && !cellIds.includes(currCellId)) {
                        nothingNearby = false;
                        break;
                     }
                  }
                  else {
                     if (state.enemyCells[currRow][currCol].hasShip && !cellIds.includes(currCellId)) {
                        nothingNearby = false;
                        break;
                     }
                  }
               }
            }
            if (!nothingNearby) break;
         }
         if (!nothingNearby) break;
      }

      if (!nothingNearby) return state;

      let shipToPlace: IShipItem | null = null;

      let updatedShips;
      if (owner === 'player') {
         updatedShips = state.playerShips.map((ship) => {
            if (!shipToPlace && ship.state === 'ready' && ship.type === shipType) {
               shipToPlace = { ...ship, state: 'placed', takenCellIds: cellIds };

               return shipToPlace;
            }

            return ship;
         });
      }
      else if (owner === 'enemy') {
         updatedShips = state.enemyShips.map((ship) => {
            if (!shipToPlace && ship.state === 'ready' && ship.type === shipType) {
               shipToPlace = { ...ship, state: 'placed', takenCellIds: cellIds };

               return shipToPlace;
            }

            return ship;
         });
      }

      if (!shipToPlace) return state;

      let updatedCells; 
      if (owner === 'player') {
         updatedCells = state.playerCells.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
               const cellId = `${rowIndex}${cellIndex}-${owner}`;

               if (cellIds.includes(cellId)) {
                  return { ...cell, hasShip: true, shipId: shipToPlace!.id, isSelected: false };
               }

               return { ...cell, isSelected: false };
            })
         });
      }
      else if (owner === 'enemy') {
         updatedCells = state.enemyCells.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
               const cellId = `${rowIndex}${cellIndex}-${owner}`;

               if (cellIds.includes(cellId)) {
                  return { ...cell, hasShip: true, shipId: shipToPlace!.id, isSelected: false };
               }

               return { ...cell, isSelected: false };
            })
         });
      }
      
      if (owner === 'player') {
         return { ...state, playerCells: updatedCells, playerShips: updatedShips };
      }
      else if (owner === 'enemy') {
         return { ...state, enemyCells: updatedCells, enemyShips: updatedShips };
      }

      return state;
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
         const updatedCells = state.enemyCells.map((row) => 
            row.map((cell) => cell.id === cellId ? 
               { ...cell, isDamaged: true } : cell
            )
         );

         const updatedShips = state.enemyShips.map((ship) => 
            ship.takenCellIds.includes(cellId) ? 
            { ...ship, state: 'damaged' as const } : ship
         );

         return { ...state, enemyCells: updatedCells, enemyShips: updatedShips };
      }

      return state;
   }),
   toggleSelectCell: (cellId: string) => set((state) => {
      const { owner } = getCellData(cellId);

      const currCells = owner === 'player' ? state.playerCells : state.enemyCells;

      if (owner === 'player' && state.gameStatus !== 'placement') return state;
      if (owner === 'enemy' && state.gameStatus !== 'in progress') return state;

      if (owner === 'enemy' && state.gameStatus === 'in progress') {
         const updatedCells = currCells.map((row) => 
            row.map((cell) => ({ ...cell, isSelected: cell.id === cellId && !cell.isSelected }))
         )

         return { ...state, enemyCells: updatedCells };
      }

      const currSelectedCells: string[] = [];

      currCells.forEach((row) => {
         row.forEach((cell) => {
            if (cell.isSelected) currSelectedCells.push(cell.id);
         })
      })

      if (currSelectedCells.includes(cellId)) {
         const updatedCells = currCells.map((row) => 
            row.map((cell) => cell.id === cellId ?
               { ...cell, isSelected: false } : cell
            )
         )

         return owner === 'player' ? 
            { ...state, playerCells: updatedCells }
            : { ...state, enemyCells: updatedCells };
      }

      if (!currSelectedCells.length) {
         
         const updatedCells = currCells.map((row => 
            row.map((cell) => cell.id === cellId ? { ...cell, isSelected: true } : cell)
         ));

         return owner === 'player' ? 
            { ...state, playerCells: updatedCells }
            : { ...state, enemyCells: updatedCells };
      }

      if (currSelectedCells.length === 1) {
         const firstCell = currSelectedCells[0];
         const { rowIndex: firstRow, colIndex: firstCol } = getCellData(firstCell);
         const { rowIndex: newRow, colIndex: newCol } = getCellData(cellId);

         const isClose = 
            (firstRow === newRow && Math.abs(firstCol - newCol) === 1) ||
            (firstCol === newCol && Math.abs(firstRow - newRow) === 1);

         const updatedCells = currCells.map((row) =>
            row.map((cell) =>
               cell.id === cellId ?
                  { ...cell, isSelected: isClose } :
                     (isClose ? cell : { ...cell, isSelected: false })
            )
         )

         return owner === 'player' ? 
            { ...state, playerCells: updatedCells }
            : { ...state, enemyCells: updatedCells };
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
         const updatedCells = currCells.map((row) =>
            row.map((cell) =>
               cell.id === cellId ?
                  { ...cell, isSelected: true } : { ...cell, isSelected: false }
            )
         )

         return owner === 'player' ? 
            { ...state, playerCells: updatedCells }
            : { ...state, enemyCells: updatedCells };
      }

      const updatedCells = state.enemyCells.map((row) => 
         row.map((cell) =>
            cell.id === cellId ? { ...cell, isSelected: true } : cell
         )
      );

      return owner === 'player' ? 
         { ...state, playerCells: updatedCells }
         : { ...state, enemyCells: updatedCells };
   }),
   resetGame: () => set(() => ({
      playerCells: initField('player'),
      playerShips: initShips('player'),
      enemyCells: initField('enemy'),
      enemyShips: initShips('enemy'),
   }))
}), 
   { name: 'sea-battle-storage' }
))