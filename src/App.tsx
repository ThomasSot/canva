import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge
} from 'reactflow';
import type { Connection, ReactFlowInstance, Node } from 'reactflow';
import { Database, Settings, Code } from 'lucide-react';
import type { EntityType, EntityData } from './types';
import CsvNode from './nodes/CsvNode';
import ProcessNode from './nodes/ProcessNode';
import FunctionNode from './nodes/FunctionNode';

const nodeTypes = {
  csv: CsvNode,
  process: ProcessNode,
  function: FunctionNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function App() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent, entityType: EntityType) => {
    event.dataTransfer.setData('application/reactflow', entityType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as EntityType;

      if (typeof type === 'undefined' || !type || !reactFlowInstance || !reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node<EntityData> = {
        id: getId(),
        type,
        position,
        data: {
          id: getId(),
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${id}`,
          type,
          ...(type === 'csv' && {
            fileName: 'data.csv',
            columns: ['id', 'name', 'value']
          }),
          ...(type === 'process' && {
            description: 'Data transformation process',
            inputPorts: ['input'],
            outputPorts: ['output']
          }),
          ...(type === 'function' && {
            functionName: 'processData',
            parameters: ['data', 'options'],
            returnType: 'ProcessedData'
          })
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="h-screen flex">
      <ReactFlowProvider>
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Components</h2>
          <div className="space-y-3">
            <div
              draggable
              onDragStart={(event) => onDragStart(event, 'csv')}
              className="p-3 rounded-lg border-2 bg-blue-50 border-blue-200 cursor-move hover:border-blue-400 hover:shadow-md transition-all active:scale-95"
            >
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-5 h-5 text-blue-600" />
                <div className="font-medium text-blue-800">CSV Data</div>
              </div>
              <div className="text-xs text-gray-600">Data source from CSV files</div>
            </div>
            <div
              draggable
              onDragStart={(event) => onDragStart(event, 'process')}
              className="p-3 rounded-lg border-2 bg-green-50 border-green-200 cursor-move hover:border-green-400 hover:shadow-md transition-all active:scale-95"
            >
              <div className="flex items-center gap-2 mb-1">
                <Settings className="w-5 h-5 text-green-600" />
                <div className="font-medium text-green-800">Process</div>
              </div>
              <div className="text-xs text-gray-600">Data transformation process</div>
            </div>
            <div
              draggable
              onDragStart={(event) => onDragStart(event, 'function')}
              className="p-3 rounded-lg border-2 bg-purple-50 border-purple-200 cursor-move hover:border-purple-400 hover:shadow-md transition-all active:scale-95"
            >
              <div className="flex items-center gap-2 mb-1">
                <Code className="w-5 h-5 text-purple-600" />
                <div className="font-medium text-purple-800">Function</div>
              </div>
              <div className="text-xs text-gray-600">Custom function or operation</div>
            </div>
          </div>

          <div className="mt-8 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-1">How to use:</h3>
            <p className="text-xs text-yellow-700">
              Drag components from here to the canvas to create your data flow diagram.
            </p>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-100"
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
