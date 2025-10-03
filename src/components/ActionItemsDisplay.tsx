import React, { useState } from 'react';
import { CheckSquare, Square, User, Calendar, Download, Copy, Check } from 'lucide-react';
import { ActionItem } from '../types';

interface ActionItemsDisplayProps {
  actionItems: ActionItem[];
  approvedItems: Set<number>;
  onToggleApproval: (id: number) => void;
}

const ActionItemsDisplay: React.FC<ActionItemsDisplayProps> = ({
  actionItems,
  approvedItems,
  onToggleApproval
}) => {
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    const approvedItemsData = actionItems.filter(item => approvedItems.has(item.id));
    const exportData = {
      exported_at: new Date().toISOString(),
      total_items: actionItems.length,
      approved_items: approvedItems.size,
      action_items: approvedItemsData
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create and download file
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `action-items-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const approvedItemsData = actionItems.filter(item => approvedItems.has(item.id));
    const exportData = {
      exported_at: new Date().toISOString(),
      total_items: actionItems.length,
      approved_items: approvedItems.size,
      action_items: approvedItemsData
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy action items:', err);
    }
  };

  const allApproved = actionItems.length > 0 && approvedItems.size === actionItems.length;
  const hasApprovedItems = approvedItems.size > 0;

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Action Items</h2>
            <p className="text-sm text-gray-500">
              {actionItems.length} items found • {approvedItems.size} approved
            </p>
          </div>
        </div>

        {hasApprovedItems && (
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-success-600" />
                  <span className="text-success-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
            <button
              onClick={handleExport}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        )}
      </div>

      {actionItems.length === 0 ? (
        <div className="text-center py-8">
          <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No action items found in this meeting</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actionItems.map((item, index) => (
            <div
              key={item.id}
              className={`
                p-4 rounded-lg border transition-all duration-200 hover:shadow-md
                ${approvedItems.has(item.id) 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                {/* Checkbox */}
                <button
                  onClick={() => onToggleApproval(item.id)}
                  className={`
                    mt-1 transition-colors duration-200
                    ${approvedItems.has(item.id) ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}
                  `}
                >
                  {approvedItems.has(item.id) ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`
                    font-medium mb-2
                    ${approvedItems.has(item.id) ? 'text-green-800' : 'text-gray-900'}
                  `}>
                    {item.task}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        <span className="font-medium">Owner:</span> {item.owner}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        <span className="font-medium">Due:</span> {item.due}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                {approvedItems.has(item.id) && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Approved
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Actions */}
      {actionItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (allApproved) {
                    // Unapprove all
                    actionItems.forEach(item => onToggleApproval(item.id));
                  } else {
                    // Approve all
                    actionItems.forEach(item => onToggleApproval(item.id));
                  }
                }}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                {allApproved ? 'Unapprove All' : 'Approve All'}
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              {approvedItems.size} of {actionItems.length} items approved
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionItemsDisplay;
