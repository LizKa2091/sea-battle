import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initField } from "../utils/initField";
import { initShips } from "../utils/initShips";
import type { ICellStoreState } from "./storeTypes";

export const useCellsStore = create<ICellStoreState>()(persist((set) => ({
   gameStatus: 'placement',
   cells: initField(),
   ships: initShips(),
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