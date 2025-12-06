import type { GameStatus, ICellItem, IShipItem } from "../types/types";

export interface IGameStoreState {
   gameStatus: GameStatus;
   cells: ICellItem[][],
   ships: IShipItem[],
   setPlacementStatus: () => void;
   placeShip: (cellIds: string[]) => void;
   damageCell: (cellId: string) => void;
   toggleSelectCell: (id: string) => void;
}