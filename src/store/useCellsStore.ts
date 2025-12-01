import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initField } from "../utils/initField";
// import type { ShipType } from "../types/types";
import type { ICellStoreState } from "./storeTypes";

export const useCellsStore = create<ICellStoreState>()(persist((set) => ({
   cells: initField(),
   // ships: 
   // placeShip: (shipType: ShipType, cellIds: string[]) => set(() => ({
   //    cells: 
   // })),
   damageShip: (id: string) => set((state) => ({
      cells: state.cells.map((row) => 
         row.map((cell) => cell.id === id ? 
            { ...cell, isDamaged: true } : cell
         )
      )
   })),
   toggleSelectCell: (id: string) => set((state) => ({
      cells: state.cells.map((row) => 
         row.map((cell) => cell.id === id ?
            { ...cell, isSelected: !cell.isSelected } : 
            { ...cell, isSelected: false }
         ))
   }))
   // resetCells: () => set(()) => ({
   //    cells: initField()
   // })
}), 
   { name: 'cells-storage' }
))