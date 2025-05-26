import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from '@xyflow/react';
import Sidebar from './Sidebar';
import DataView from './DataView';
import Terminal from './Terminal';
import { DatablockNode, DatablockEdge, DataSet } from '../types';

// Import custom node components
import InputCSVNode from './blocks/InputCSVNode';
import InputJSONNode from './blocks/InputJSONNode';
import InputExampleNode from './blocks/InputExampleNode';
import TransformFilterNode from './blocks/TransformFilterNode';
import TransformGroupNode from './blocks/TransformGroupNode';
import TransformSortNode from './blocks/TransformSortNode';
import TransformJavaScriptNode from './blocks/TransformJavaScriptNode';
import VisualizationTableNode from './blocks/VisualizationTableNode';

const initialNodes: DatablockNode[] = [];
const initialEdges: DatablockEdge[] = [];

const nodeTypes: NodeTypes = {
  'input-csv': InputCSVNode,
  'input-json': InputJSONNode,
  'input-example': InputExampleNode,
  'transform-filter': TransformFilterNode,
  'transform-group': TransformGroupNode,
  'transform-sort': TransformSortNode,
  'transform-javascript': TransformJavaScriptNode,
  'visualization-table': VisualizationTableNode,
};

const DatablockEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<DatablockNode | null>(null);
  const [nodeOutputs, setNodeOutputs] = useState<Record<string, DataSet>>({});
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = { ...params, type: 'default' };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as DatablockNode);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - 280, // Adjust for sidebar width
        y: event.clientY - 120, // Adjust for header height
      };

      const newNode: DatablockNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          id: `${type}-${Date.now()}`,
          type,
          data: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
      addLog(`Added new ${type} block`);
    },
    [setNodes]
  );

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, data: newData } }
          : node
      )
    );
  }, [setNodes]);

  const updateNodeOutput = useCallback((nodeId: string, output: DataSet) => {
    setNodeOutputs((prev) => ({ ...prev, [nodeId]: output }));
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, output } }
          : node
      )
    );
  }, [setNodes]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const getNodeInput = useCallback((nodeId: string): DataSet | null => {
    const incomingEdge = edges.find((edge) => edge.target === nodeId);
    if (!incomingEdge) return null;
    
    return nodeOutputs[incomingEdge.source] || null;
  }, [edges, nodeOutputs]);

  const selectedNodeOutput = selectedNode ? nodeOutputs[selectedNode.id] : null;

  return (
    <div className="datablock-editor">
      <Sidebar />
      <div className="editor-main">
        <div 
          className="flow-container"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
        <div className="bottom-panel">
          <DataView 
            data={selectedNodeOutput} 
            selectedNode={selectedNode}
          />
          <Terminal logs={terminalLogs} />
        </div>
      </div>
    </div>
  );
};

export default DatablockEditor;
