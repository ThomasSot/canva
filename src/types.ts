import type { Node, Edge } from 'reactflow';

export type EntityType = 'csv' | 'process' | 'function';

export interface BaseEntityData {
  id: string;
  label: string;
  type: EntityType;
}

export interface CsvEntityData extends BaseEntityData {
  type: 'csv';
  fileName?: string;
  columns?: string[];
}

export interface ProcessEntityData extends BaseEntityData {
  type: 'process';
  description?: string;
  inputPorts?: string[];
  outputPorts?: string[];
}

export interface FunctionEntityData extends BaseEntityData {
  type: 'function';
  functionName?: string;
  parameters?: string[];
  returnType?: string;
}

export type EntityData = CsvEntityData | ProcessEntityData | FunctionEntityData;

export type EntityNode = Node<EntityData>;
export type EntityEdge = Edge;

export interface DragItem {
  type: EntityType;
  label: string;
}
