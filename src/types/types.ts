export interface ICellItem {
   id: string;
   hasShip: boolean;
   isDamaged: boolean;
   isSelected: boolean;
}

export interface IShipItem {
   id: string;
   size: number;
   takenCellIds: string[];
}

export type FieldCells = ICellItem[][];

export type ShipType = 'single' | 'duo' | 'trio' | 'quadro'; 
export type FieldShipsMap = Map<string, IShipItem>;