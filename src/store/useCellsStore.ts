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
   toggleSelectCell: (id: string) => set((state) => ({
      cells: state.cells.map((row) => 
         row.map((cell) => cell.id === id ?
            { ...cell, isSelected: !cell.isSelected } : 
            { ...cell, isSelected: state.gameStatus === 'in progress' ? false : cell.isSelected } // TODO: set false for isSelected if prev cell wasn't nearby
         ))
   }))
}), 
   { name: 'cells-storage' }
))