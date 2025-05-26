import { Node, Edge } from '@xyflow/react';

export interface DatablockData extends Record<string, unknown> {
  id: string;
  type: string;
  data: any;
  output?: any;
  error?: string;
  label?: string;
}

export interface DatablockNode extends Node<DatablockData> {
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

// Backend API response types
export interface BackendUploadResponse {
  message: string;
  path: string;
  file_name: string;
  original_name: string;
}

export interface BackendProcessResponse {
  message: string;
  dataframe_id: number;
  name: string;
  columns: Array<{
    id: number;
    name: string;
    type: string;
  }>;
  rows_count: number;
}

export interface BackendDataFrame {
  id: number;
  name: string;
  file_name: string;
  company_id: number;
  created_at: string;
  updated_at: string;
  columns: Array<{
    id: number;
    df_id: number;
    name: string;
    type: string;
  }>;
  rows: Array<{
    id: number;
    df_id: number;
    index: number;
  }>;
  data: Array<{
    id: number;
    column_id: number;
    row_id: number;
    value: string;
    column_name: string;
    row_index: number;
  }>;
}

// Block Editor API Types
export interface BlockCanvas {
  id: number;
  process_id: number;
  name: string;
  description?: string;
  process_title?: string;
  board_title?: string;
  user_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlockNode {
  id: number;
  canvas_id: number;
  node_id: string;
  type: string;
  label?: string;
  position_x: number;
  position_y: number;
  width?: number;
  height?: number;
  config_data?: any;
  input_data?: any;
  output_data?: any;
  is_selected?: boolean;
  is_dragging?: boolean;
  z_index?: number;
  created_at: string;
  updated_at: string;
}

export interface BlockEdge {
  id: number;
  canvas_id: number;
  edge_id: string;
  source_node_id: string;
  target_node_id: string;
  source_handle?: string;
  target_handle?: string;
  edge_type?: string;
  is_animated?: boolean;
  style_data?: any;
  marker_end?: string;
  created_at: string;
  updated_at: string;
}

export interface CompleteCanvas {
  canvas: BlockCanvas;
  nodes: BlockNode[];
  edges: BlockEdge[];
}

// API Request/Response Types
export interface CreateCanvasRequest {
  process_id: number;
  name: string;
  description?: string;
}

export interface CreateCanvasResponse {
  message: string;
  canvas_id: number;
}

export interface CreateNodeRequest {
  canvas_id: number;
  node_id: string;
  type: string;
  label?: string;
  position_x: number;
  position_y: number;
  width?: number;
  height?: number;
  config_data?: any;
  input_data?: any;
  output_data?: any;
  z_index?: number;
}

export interface CreateNodeResponse {
  message: string;
  node_id: number;
}

export interface UpdateNodeRequest {
  label?: string;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
  config_data?: any;
  input_data?: any;
  output_data?: any;
  is_selected?: boolean;
  is_dragging?: boolean;
  z_index?: number;
}

export interface CreateEdgeRequest {
  canvas_id: number;
  edge_id: string;
  source_node_id: string;
  target_node_id: string;
  source_handle?: string;
  target_handle?: string;
  edge_type?: string;
  is_animated?: boolean;
  style_data?: any;
  marker_end?: string;
}

export interface CreateEdgeResponse {
  message: string;
  edge_id: number;
}

export interface SaveCanvasStateRequest {
  canvas_id: number;
  nodes: Array<{
    node_id: string;
    type: string;
    position_x: number;
    position_y: number;
    config_data?: any;
  }>;
  edges: Array<{
    edge_id: string;
    source_node_id: string;
    target_node_id: string;
  }>;
}
