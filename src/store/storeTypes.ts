import type { GameStatus, ICellItem, IShipItem } from "../types/types";

export interface ICellStoreState {
   gameStatus: GameStatus;
   cells: ICellItem[][],
   ships: IShipItem[],
   damageCell: (cellId: string) => void;
   toggleSelectCell: (id: string) => void;
}