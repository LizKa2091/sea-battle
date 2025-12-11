import type { GameStatus, ICellItem, IShipItem, User } from "../types/types";

export interface IGameStoreState {
   gameStatus: GameStatus;
   currTurn: User;
   playerCells: ICellItem[][],
   playerShips: IShipItem[],
   enemyCells: ICellItem[][],
   enemyShips: IShipItem[],
   setPlacementStatus: () => void;
   setInProgressStatus: () => void;
   setFinalStatus: (winner: User) => void;
   placeShip: (cellIds: string[]) => void;
   damageCell: (cellId: string) => void;
   toggleSelectCell: (id: string) => void;
   resetEnemyShips: () => void;
   resetGame: () => void;
}