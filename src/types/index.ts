import { Node, Edge } from '@xyflow/react';

export interface DatablockData {
  id: string;
  type: string;
  data: any;
  output?: any;
  error?: string;
}

export interface DatablockNode extends Node {
  data: DatablockData;
}

export interface DatablockEdge extends Edge {}

export type BlockType = 
  | 'input-csv'
  | 'input-json' 
  | 'input-example'
  | 'transform-filter'
  | 'transform-group'
  | 'transform-sort'
  | 'transform-merge'
  | 'transform-javascript'
  | 'visualization-table'
  | 'visualization-chart'
  | 'output-export';

export interface BlockDefinition {
  type: BlockType;
  label: string;
  category: 'input' | 'transform' | 'visualization' | 'output';
  icon: string;
  description: string;
}

export interface FilterConfig {
  column: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: string | number;
}

export interface GroupConfig {
  column: string;
  aggregation?: {
    column: string;
    operation: 'sum' | 'count' | 'avg' | 'min' | 'max';
  };
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  xAxis: string;
  yAxis: string;
  title?: string;
}

export interface DataRow {
  [key: string]: any;
}

export interface DataSet {
  data: DataRow[];
  columns: string[];
  type: 'tabular' | 'json' | 'geojson';
}
