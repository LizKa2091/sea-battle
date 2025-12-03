import type { ICellItem, IShipItem } from "../types/types";

export interface ICellStoreState {
   cells: ICellItem[][],
   ships: IShipItem[],
   damageCell: (cellId: string) => void;
   toggleSelectCell: (id: string) => void;
}