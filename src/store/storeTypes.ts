import type { GameStatus, ICellItem, IShipItem } from "../types/types";

export interface IGameStoreState {
   gameStatus: GameStatus;
   playerCells: ICellItem[][],
   playerShips: IShipItem[],
   enemyCells: ICellItem[][],
   enemyShips: IShipItem[],
   setPlacementStatus: () => void;
   placeShip: (cellIds: string[]) => void;
   damageCell: (cellId: string) => void;
   toggleSelectCell: (id: string) => void;
   resetGame: () => void;
}