import React from 'react';
import { Database, Settings, Code } from 'lucide-react';
import { EntityType } from '../types';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, entityType: EntityType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  const entities = [
    {
      type: 'csv' as EntityType,
      label: 'CSV Data',
      icon: Database,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverBorderColor: 'hover:border-blue-400',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
      description: 'Data source from CSV files'
    },
    {
      type: 'process' as EntityType,
      label: 'Process',
      icon: Settings,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverBorderColor: 'hover:border-green-400',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
      description: 'Data transformation process'
    },
    {
      type: 'function' as EntityType,
      label: 'Function',
      icon: Code,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverBorderColor: 'hover:border-purple-400',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-800',
      description: 'Custom function or operation'
    }
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Components</h2>

      <div className="space-y-3">
        {entities.map((entity) => {
          const Icon = entity.icon;
          return (
            <div
              key={entity.type}
              draggable
              onDragStart={(event) => onDragStart(event, entity.type)}
              className={`
                p-3 rounded-lg border-2 cursor-move transition-all
                ${entity.bgColor} ${entity.borderColor}
                ${entity.hoverBorderColor} hover:shadow-md
                active:scale-95
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-5 h-5 ${entity.iconColor}`} />
                <span className={`font-medium ${entity.textColor}`}>
                  {entity.label}
                </span>
              </div>
              <p className="text-xs text-gray-600">{entity.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800 mb-1">How to use:</h3>
        <p className="text-xs text-yellow-700">
          Drag components from here to the canvas to create your data flow diagram.
          Connect them by dragging from output handles to input handles.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
