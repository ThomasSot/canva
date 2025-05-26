import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Database } from 'lucide-react';
import type { CsvEntityData } from '../types';

const CsvNode: React.FC<NodeProps<CsvEntityData>> = ({ data, selected }) => {
  return (
    <div className={`
      bg-blue-50 border-2 rounded-lg p-4 min-w-[200px] shadow-md
      ${selected ? 'border-blue-500' : 'border-blue-300'}
      hover:shadow-lg transition-shadow
    `}>
      <div className="flex items-center gap-2 mb-2">
        <Database className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-blue-800">CSV</span>
      </div>

      <div className="text-sm">
        <div className="font-medium text-gray-800 mb-1">{data.label}</div>
        {data.fileName && (
          <div className="text-gray-600 text-xs">File: {data.fileName}</div>
        )}
        {data.columns && data.columns.length > 0 && (
          <div className="text-gray-600 text-xs mt-1">
            Columns: {data.columns.slice(0, 3).join(', ')}
            {data.columns.length > 3 && '...'}
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
};

export default CsvNode;
