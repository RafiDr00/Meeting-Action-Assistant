import React, { useState } from 'react';
import { CheckSquare, Square, User, Calendar, Download, Copy, Check } from 'lucide-react';
import { ActionItem } from '../types';
import '../index.css'; // Ensure global styles are loaded

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
    <div className="card animate-fade-in bg-gradient-to-br from-[#1A1A2E] via-[#0F3460] to-[#E94560] p-8 rounded-3xl shadow-2xl font-['Sora','Space Grotesk',sans-serif]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#FFD700] to-[#E94560] rounded-2xl flex items-center justify-center shadow-lg">
            <CheckSquare className="w-7 h-7 text-[#1A1A2E] animate-bounce" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-[#FFD700] tracking-tight drop-shadow-lg">Action Items</h2>
            <p className="text-base text-[#FFFFFF] opacity-80 font-mono">
              {actionItems.length} items found • <span className="text-[#FFD700]">{approvedItems.size} approved</span>
            </p>
          </div>
        </div>

        {hasApprovedItems && (
          <div className="flex space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2 text-base font-semibold text-[#1A1A2E] bg-[#FFD700] hover:bg-[#E94560] hover:text-white rounded-xl shadow transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 animate-pulse text-[#0F3460]" />
                  <span className="text-[#0F3460]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 text-base font-semibold text-white bg-[#E94560] hover:bg-[#FFD700] hover:text-[#1A1A2E] rounded-xl shadow transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        )}
      </div>

      {actionItems.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-[#FFD700] mx-auto mb-6 animate-spin" />
          <p className="text-[#FFFFFF] opacity-70 text-lg font-semibold">No action items found in this meeting</p>
        </div>
      ) : (
        <div className="space-y-6">
          {actionItems.map((item) => (
            <div
              key={item.id}
              className={`
                p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-xl relative overflow-hidden
                ${approvedItems.has(item.id) 
                  ? 'bg-gradient-to-r from-[#FFD700]/30 to-[#E94560]/10 border-[#FFD700]' 
                  : 'bg-[#1A1A2E]/80 border-[#0F3460] hover:border-[#E94560]'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <button
                  onClick={() => onToggleApproval(item.id)}
                  className={`
                    mt-1 transition-colors duration-200 scale-110
                    ${approvedItems.has(item.id) ? 'text-[#FFD700] animate-pulse' : 'text-[#E94560] hover:text-[#FFD700]'}
                  `}
                >
                  {approvedItems.has(item.id) ? (
                    <CheckSquare className="w-6 h-6" />
                  ) : (
                    <Square className="w-6 h-6" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`
                    font-bold mb-2 text-xl tracking-tight
                    ${approvedItems.has(item.id) ? 'text-[#FFD700] drop-shadow' : 'text-white'}
                  `}>
                    {item.task}
                  </p>
                  <div className="flex flex-wrap gap-6 text-base">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-[#E94560]" />
                      <span className="text-[#FFD700]">
                        <span className="font-semibold">Owner:</span> {item.owner}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-[#0F3460]" />
                      <span className="text-white">
                        <span className="font-semibold">Due:</span> {item.due}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                {approvedItems.has(item.id) && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-[#FFD700] text-[#1A1A2E] animate-pulse shadow">
                      Approved
                    </span>
                  </div>
                )}
              </div>
              {/* Decorative SVG or shape */}
              <svg className="absolute right-0 bottom-0 w-24 h-24 opacity-20 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="#E94560" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Footer Actions */}
      {actionItems.length > 0 && (
        <div className="mt-8 pt-6 border-t-2 border-[#0F3460]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
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
                className="text-base font-bold text-[#FFD700] hover:text-[#E94560] transition-colors duration-200 underline underline-offset-4"
              >
                {allApproved ? 'Unapprove All' : 'Approve All'}
              </button>
            </div>
            <div className="text-base text-white font-mono">
              {approvedItems.size} of {actionItems.length} items approved
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionItemsDisplay;
