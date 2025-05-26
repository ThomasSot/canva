import React, { useState, useCallback, useMemo, createContext, useContext } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Node,
  NodeTypes,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import Sidebar from './Sidebar';
import DataView from './DataView';
import Terminal from './Terminal';
import { DatablockNode, DatablockEdge, DataSet } from '../types';
import { useBlockCanvas } from '../hooks/useBlockCanvas';
import { getUserFromToken } from '../utils/auth';

// Import custom node components
import InputCSVNode from './blocks/InputCSVNode';
import InputJSONNode from './blocks/InputJSONNode';
import InputExampleNode from './blocks/InputExampleNode';
import TransformFilterNode from './blocks/TransformFilterNode';
import TransformGroupNode from './blocks/TransformGroupNode';
import TransformSortNode from './blocks/TransformSortNode';
import TransformJavaScriptNode from './blocks/TransformJavaScriptNode';
import VisualizationTableNode from './blocks/VisualizationTableNode';

// Context for node communication
interface DatablockContextType {
  updateNodeOutput: (nodeId: string, output: DataSet) => void;
  addLog: (message: string) => void;
  getNodeInput: (nodeId: string) => DataSet | null;
}

const DatablockContext = createContext<DatablockContextType | null>(null);

export const useDatablockContext = () => {
  const context = useContext(DatablockContext);
  if (!context) {
    throw new Error('useDatablockContext must be used within DatablockEditor');
  }
  return context;
};

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

// Helper function to get process ID from JWT token
const getProcessIdFromToken = (): number => {
  try {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return 1; // fallback to process_id 1

    // Decode JWT payload (second part of the token)
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    // For now, we'll use a default process_id since the token doesn't contain it
    // In a real app, you'd get this from the URL params or user selection
    return 1; // Default process ID
  } catch (error) {
    console.warn('Error decoding JWT token:', error);
    return 1; // fallback to process_id 1
  }
};

const DatablockEditor: React.FC = () => {
  const processId = getProcessIdFromToken();

  // Use the block canvas hook for backend integration
  const {
    canvas,
    nodes: canvasNodes,
    edges: canvasEdges,
    loading,
    error,
    addNode: addNodeToCanvas,
    addEdge: addEdgeToCanvas,
    saveCanvas,
    setNodes: setCanvasNodes,
    setEdges: setCanvasEdges
  } = useBlockCanvas({ processId, canvasName: 'Datablock Canvas' });

  // Local state for UI
  const [selectedNode, setSelectedNode] = useState<DatablockNode | null>(null);
  const [nodeOutputs, setNodeOutputs] = useState<Record<string, DataSet>>({});
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Use canvas nodes and edges, fallback to empty arrays
  const nodes = canvasNodes;
  const edges = canvasEdges;

  // Handle node changes
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setCanvasNodes((nds) => applyNodeChanges(changes, nds as Node[]) as DatablockNode[]);
  }, [setCanvasNodes]);

  // Handle edge changes
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setCanvasEdges((eds) => applyEdgeChanges(changes, eds));
  }, [setCanvasEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = { ...params, type: 'default' } as DatablockEdge;
      setCanvasEdges((eds) => addEdge(edge, eds));

      // Also add to backend
      if (addEdgeToCanvas) {
        addEdgeToCanvas(edge);
      }
    },
    [setCanvasEdges, addEdgeToCanvas]
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

      setCanvasNodes((nds) => [...nds, newNode]);
      addLog(`Added new ${type} block`);

      // Also add to backend
      if (addNodeToCanvas) {
        addNodeToCanvas(newNode);
      }
    },
    [setCanvasNodes, addNodeToCanvas]
  );

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setCanvasNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, data: newData } }
          : node
      )
    );
  }, [setCanvasNodes]);

  const updateNodeOutput = useCallback((nodeId: string, output: DataSet) => {
    setNodeOutputs((prev) => ({ ...prev, [nodeId]: output }));
    setCanvasNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, output } }
          : node
      )
    );
  }, [setCanvasNodes]);

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

  const contextValue = useMemo(() => ({
    updateNodeOutput,
    addLog,
    getNodeInput
  }), [updateNodeOutput, addLog, getNodeInput]);

  return (
    <DatablockContext.Provider value={contextValue}>
      <div className="datablock-editor">
        <Sidebar />
        <div className="editor-main">
          {/* Header with save button and status */}
          <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Datablock Editor</h1>
            <div className="flex items-center space-x-4">
              {loading && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              )}
              {error && (
                <div className="text-red-600 text-sm">
                  Error: {error}
                </div>
              )}
              <button
                onClick={saveCanvas}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Canvas
              </button>
            </div>
          </div>
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
    </DatablockContext.Provider>
  );
};

export default DatablockEditor;
