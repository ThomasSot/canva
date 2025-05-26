import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Settings } from 'lucide-react';
import type { ProcessEntityData } from '../types';

const ProcessNode: React.FC<NodeProps<ProcessEntityData>> = ({ data, selected }) => {
  return (
    <div className={`
      bg-green-50 border-2 rounded-lg p-4 min-w-[200px] shadow-md
      ${selected ? 'border-green-500' : 'border-green-300'}
      hover:shadow-lg transition-shadow
    `}>
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-5 h-5 text-green-600" />
        <span className="font-semibold text-green-800">Process</span>
      </div>

      <div className="text-sm">
        <div className="font-medium text-gray-800 mb-1">{data.label}</div>
        {data.description && (
          <div className="text-gray-600 text-xs mb-2">{data.description}</div>
        )}

        {data.inputPorts && data.inputPorts.length > 0 && (
          <div className="text-gray-600 text-xs">
            Inputs: {data.inputPorts.join(', ')}
          </div>
        )}

        {data.outputPorts && data.outputPorts.length > 0 && (
          <div className="text-gray-600 text-xs">
            Outputs: {data.outputPorts.join(', ')}
          </div>
        )}
      </div>

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  );
};

export default ProcessNode;
