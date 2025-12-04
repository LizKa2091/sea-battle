import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initField } from "../utils/initField";
import { initShips } from "../utils/initShips";
import { shipTypeMap } from "../constants/constants";
import type { ICellStoreState } from "./storeTypes";
import type { IShipItem } from "../types/types";

export const useCellsStore = create<ICellStoreState>()(persist((set) => ({
   gameStatus: 'placement',
   cells: initField(),
   ships: initShips(),
   placeShip: (cellIds: string[]) => set((state) => {
      const shipSize = cellIds.length;
      const shipType = shipTypeMap[shipSize];

      if (!shipType) return state;

      const areCellsEmpty = cellIds.every((cellId) => {
         const rowIndex = Math.floor(+cellId / 10);
         const colIndex = +cellId % 10;

         return !state.cells[rowIndex][colIndex].hasShip;
      });

      if (!areCellsEmpty) return state;

      const seenCells = new Set();
      let nothingNearby: boolean = true;

      for (const cellId of cellIds) {
         const rowIndex = Math.floor(+cellId / 10);
         const colIndex = +cellId % 10;

         for (let i=-1; i<2; i++) {
            for (let j=-1; j<2; j++) {
               const currRow = rowIndex+i;
               const currCol = colIndex+j;

               if (currRow < 0 || currRow > 9 || currCol < 0 || currCol > 9) {
                  continue;
               }

               const currCellId = `${currRow}${currCol}`;

               if (!seenCells.has(currCellId)) {
                  seenCells.add(currCellId);

                  if (state.cells[currRow][currCol].hasShip && !cellIds.includes(currCellId)) {
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

      const updatedShips = state.ships.map((ship) => {
         if (!shipToPlace && ship.state === 'ready' && ship.type === shipType) {
            shipToPlace = { ...ship, state: 'placed', takenCellIds: cellIds };

            return shipToPlace;
         }

         return ship;
      });

      if (!shipToPlace) return state;

      const updatedCells = state.cells.map((row, rowIndex) => {
         return row.map((cell, cellIndex) => {
            const cellId = `${rowIndex}${cellIndex}`;

            if (cellIds.includes(cellId)) {
               return { ...cell, hasShip: true, shipId: shipToPlace!.id, isSelected: false };
            }

            return { ...cell, isSelected: false };
         })
      });

      return { ...state, cells: updatedCells, ships: updatedShips };
   }),
   damageCell: (cellId: string) => set((state) => ({
      cells: state.cells.map((row) => 
         row.map((cell) => cell.id === cellId ? 
            { ...cell, isDamaged: true } : cell
         )
      ),
      ships: state.ships.map((ship) => 
         ship.takenCellIds.includes(cellId) ? 
         { ...ship, state: 'damaged' } : ship
      )
   })),
   toggleSelectCell: (id: string) => set((state) => {
      const currSelectedCells: string[] = [];

      state.cells.forEach((row) => {
         row.forEach((cell) => {
            if (cell.isSelected) currSelectedCells.push(cell.id);
         })
      })

      if (currSelectedCells.includes(id)) {
         return { cells: state.cells.map((row) => 
            row.map((cell) => cell.id === id ?
               { ...cell, isSelected: true } : cell
            )
         )}
      }

      if (!currSelectedCells.length) {
         return { 
            cells: state.cells.map((row => 
               row.map((cell) => cell.id === id ? { ...cell, isSelected: true } : cell)
            ))
         }
      }

      if (currSelectedCells.length === 1) {
         const firstCell = currSelectedCells[0];
         const firstRow = Math.floor(+firstCell / 10);
         const firstCol = +firstCell % 10;

         const newRow = Math.floor(+id / 10);
         const newCol = +id % 10;

         const isClose = 
            (firstRow === newRow && Math.abs(firstCol - newCol) === 1) ||
            (firstCol === newCol && Math.abs(firstRow - newRow) === 1);

         return {
            cells: state.cells.map((row) =>
               row.map((cell) =>
                  cell.id === id ?
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

      const newRow = Math.floor(+id / 10);
      const newCol = +id % 10;

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
            cells: state.cells.map((row) =>
               row.map((cell) =>
                  cell.id === id ?
                     { ...cell, isSelected: true } : { ...cell, isSelected: false }
               )
            )
         }
      }

      return {
         cells: state.cells.map((row) => 
            row.map((cell) =>
               cell.id === id ? { ...cell, isSelected: true } : cell
            )
         )
      }
   })
}), 
   { name: 'cells-storage' }
))