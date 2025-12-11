export interface ICellItem {
   id: string;
   hasShip: boolean;
   isDamaged: boolean;
   isSelected: boolean;
   shipId?: string;
   isShipDestroyed?: boolean;
}

export interface IShipItem {
   id: string;
   state: ShipState;
   size: number;
   type: ShipType;
   takenCellIds: string[];
}

export type GameStatus = 'start' | 'placement' | 'in progress' | 'triumph' | 'defeat';

export type FieldCells = ICellItem[][];

export type ShipType = 'single' | 'duo' | 'trio' | 'quadro'; 
export type ShipState = 'ready' | 'placed' | 'damaged' | 'destroyed';

export type FieldShipsMap = Map<string, IShipItem>;

export type User = 'player' | 'enemy';