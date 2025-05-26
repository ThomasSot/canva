import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Code } from 'lucide-react';
import type { FunctionEntityData } from '../types';

const FunctionNode: React.FC<NodeProps<FunctionEntityData>> = ({ data, selected }) => {
  return (
    <div className={`
      bg-purple-50 border-2 rounded-lg p-4 min-w-[200px] shadow-md
      ${selected ? 'border-purple-500' : 'border-purple-300'}
      hover:shadow-lg transition-shadow
    `}>
      <div className="flex items-center gap-2 mb-2">
        <Code className="w-5 h-5 text-purple-600" />
        <span className="font-semibold text-purple-800">Function</span>
      </div>

      <div className="text-sm">
        <div className="font-medium text-gray-800 mb-1">{data.label}</div>
        {data.functionName && (
          <div className="text-gray-600 text-xs mb-1">
            Function: {data.functionName}
          </div>
        )}

        {data.parameters && data.parameters.length > 0 && (
          <div className="text-gray-600 text-xs mb-1">
            Params: {data.parameters.slice(0, 2).join(', ')}
            {data.parameters.length > 2 && '...'}
          </div>
        )}

        {data.returnType && (
          <div className="text-gray-600 text-xs">
            Returns: {data.returnType}
          </div>
        )}
      </div>

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
    </div>
  );
};

export default FunctionNode;
