import type { ICellItem } from "../types/types";

export interface ICellStoreState {
   cells: ICellItem[][],
   damageShip: (id: string) => void;
   toggleSelectCell: (id: string) => void;
}