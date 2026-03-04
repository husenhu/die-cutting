/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Settings2, 
  FileDown, 
  Maximize2, 
  Grid3X3, 
  Layers, 
  Printer, 
  Info,
  ChevronRight,
  RefreshCcw,
  Scissors
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutSettings, CalculatedLayout } from './types';

const INITIAL_SETTINGS: LayoutSettings = {
  labelWidth: 50,
  labelHeight: 30,
  gapHorizontal: 2,
  gapVertical: 2,
  sheetWidth: 210, // A4
  sheetHeight: 297, // A4
  marginTop: 10,
  marginRight: 10,
  marginBottom: 10,
  marginLeft: 10,
  totalQuantity: 100,
  showCutLines: true,
  showPerforation: true,
};

export default function App() {
  const [settings, setSettings] = useState<LayoutSettings>(INITIAL_SETTINGS);
  const [activeTab, setActiveTab] = useState<'dimensions' | 'sheet' | 'production'>('dimensions');

  const layout = useMemo((): CalculatedLayout => {
    const availableWidth = settings.sheetWidth - settings.marginLeft - settings.marginRight;
    const availableHeight = settings.sheetHeight - settings.marginTop - settings.marginBottom;

    // Calculate how many labels fit horizontally
    // (n * labelWidth) + ((n-1) * gapHorizontal) <= availableWidth
    // n * labelWidth + n * gapHorizontal - gapHorizontal <= availableWidth
    // n * (labelWidth + gapHorizontal) <= availableWidth + gapHorizontal
    const labelsPerRow = Math.floor((availableWidth + settings.gapHorizontal) / (settings.labelWidth + settings.gapHorizontal));
    
    // Calculate how many labels fit vertically
    const labelsPerColumn = Math.floor((availableHeight + settings.gapVertical) / (settings.labelHeight + settings.gapVertical));

    const labelsPerPage = Math.max(0, labelsPerRow * labelsPerColumn);
    const totalPages = labelsPerPage > 0 ? Math.ceil(settings.totalQuantity / labelsPerPage) : 0;

    const actualWidthUsed = labelsPerRow > 0 ? (labelsPerRow * settings.labelWidth) + ((labelsPerRow - 1) * settings.gapHorizontal) : 0;
    const actualHeightUsed = labelsPerColumn > 0 ? (labelsPerColumn * settings.labelHeight) + ((labelsPerColumn - 1) * settings.gapVertical) : 0;

    return {
      labelsPerRow,
      labelsPerColumn,
      labelsPerPage,
      totalPages,
      actualWidthUsed,
      actualHeightUsed
    };
  }, [settings]);

  const handleInputChange = (key: keyof LayoutSettings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (layout.labelsPerPage === 0) return;
    
    setIsGenerating(true);
    
    // Use setTimeout to allow UI to update before heavy PDF generation
    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: settings.sheetWidth > settings.sheetHeight ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [settings.sheetWidth, settings.sheetHeight]
        });

        let labelsRemaining = settings.totalQuantity;

        for (let p = 0; p < layout.totalPages; p++) {
          if (p > 0) doc.addPage([settings.sheetWidth, settings.sheetHeight]);

          for (let row = 0; row < layout.labelsPerColumn; row++) {
            for (let col = 0; col < layout.labelsPerRow; col++) {
              if (labelsRemaining <= 0) break;

              const x = settings.marginLeft + col * (settings.labelWidth + settings.gapHorizontal);
              const y = settings.marginTop + row * (settings.labelHeight + settings.gapVertical);

              // Draw label outline
              doc.setDrawColor(200, 200, 200);
              doc.setLineWidth(0.1);
              doc.rect(x, y, settings.labelWidth, settings.labelHeight);

              // Draw cut marks if enabled
              if (settings.showCutLines) {
                doc.setDrawColor(0, 0, 0);
                doc.setLineWidth(0.05);
                const markSize = 2;
                // Top Left
                doc.line(x - 1, y, x - 1 - markSize, y);
                doc.line(x, y - 1, x, y - 1 - markSize);
                // Top Right
                doc.line(x + settings.labelWidth + 1, y, x + settings.labelWidth + 1 + markSize, y);
                doc.line(x + settings.labelWidth, y - 1, x + settings.labelWidth, y - 1 - markSize);
                // Bottom Left
                doc.line(x - 1, y + settings.labelHeight, x - 1 - markSize, y + settings.labelHeight);
                doc.line(x, y + settings.labelHeight + 1, x, y + settings.labelHeight + 1 + markSize);
                // Bottom Right
                doc.line(x + settings.labelWidth + 1, y + settings.labelHeight, x + settings.labelWidth + 1 + markSize, y + settings.labelHeight);
                doc.line(x + settings.labelWidth, y + settings.labelHeight + 1, x + settings.labelWidth, y + settings.labelHeight + 1 + markSize);
              }

              labelsRemaining--;
            }
            if (labelsRemaining <= 0) break;
          }

          if (settings.showPerforation && p < layout.totalPages - 1) {
            doc.setDrawColor(150, 150, 150);
            doc.setLineDashPattern([1, 1], 0);
            doc.line(0, settings.sheetHeight - 2, settings.sheetWidth, settings.sheetHeight - 2);
            doc.setLineDashPattern([], 0);
          }
        }

        doc.save(`die-cutting-layout-${settings.labelWidth}x${settings.labelHeight}mm.pdf`);
      } catch (error) {
        console.error('PDF Generation failed:', error);
        alert('Failed to generate PDF. Please check your settings.');
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-xl z-10">
        <div className="p-6 border-bottom border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Scissors className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Die-Cutting</h1>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Industrial Layout Automation</p>
        </div>

        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('dimensions')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'dimensions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Label
          </button>
          <button 
            onClick={() => setActiveTab('sheet')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'sheet' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Sheet
          </button>
          <button 
            onClick={() => setActiveTab('production')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'production' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Mass
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dimensions' && (
              <motion.div 
                key="dimensions"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Label Dimensions (mm)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Width</span>
                      <input 
                        type="number" 
                        value={settings.labelWidth}
                        onChange={(e) => handleInputChange('labelWidth', Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Height</span>
                      <input 
                        type="number" 
                        value={settings.labelHeight}
                        onChange={(e) => handleInputChange('labelHeight', Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Gap Management (mm)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Horizontal</span>
                      <input 
                        type="number" 
                        value={settings.gapHorizontal}
                        onChange={(e) => handleInputChange('gapHorizontal', Math.max(0, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Vertical</span>
                      <input 
                        type="number" 
                        value={settings.gapVertical}
                        onChange={(e) => handleInputChange('gapVertical', Math.max(0, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'sheet' && (
              <motion.div 
                key="sheet"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Sheet Size (mm)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Width</span>
                      <input 
                        type="number" 
                        value={settings.sheetWidth}
                        onChange={(e) => handleInputChange('sheetWidth', Math.max(10, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Height</span>
                      <input 
                        type="number" 
                        value={settings.sheetHeight}
                        onChange={(e) => handleInputChange('sheetHeight', Math.max(10, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Margins (mm)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Top</span>
                      <input 
                        type="number" 
                        value={settings.marginTop}
                        onChange={(e) => handleInputChange('marginTop', Math.max(0, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Bottom</span>
                      <input 
                        type="number" 
                        value={settings.marginBottom}
                        onChange={(e) => handleInputChange('marginBottom', Math.max(0, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Left</span>
                      <input 
                        type="number" 
                        value={settings.marginLeft}
                        onChange={(e) => handleInputChange('marginLeft', Math.max(0, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Right</span>
                      <input 
                        type="number" 
                        value={settings.marginRight}
                        onChange={(e) => handleInputChange('marginRight', Math.max(0, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'production' && (
              <motion.div 
                key="production"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Order Quantity</label>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400">Total Labels</span>
                    <input 
                      type="number" 
                      value={settings.totalQuantity}
                      onChange={(e) => handleInputChange('totalQuantity', Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Options</label>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Show Cut Lines</span>
                    <button 
                      onClick={() => handleInputChange('showCutLines', !settings.showCutLines)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${settings.showCutLines ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.showCutLines ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Show Perforation</span>
                    <button 
                      onClick={() => handleInputChange('showPerforation', !settings.showPerforation)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${settings.showPerforation ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.showPerforation ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <button 
            onClick={generatePDF}
            disabled={layout.labelsPerPage === 0 || isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
          >
            {isGenerating ? (
              <>
                <RefreshCcw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                Generate Vector PDF
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-gray-400 mt-3 uppercase tracking-tighter">Ready for Industrial Printing</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{layout.labelsPerRow} x {layout.labelsPerColumn} Grid</span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{layout.labelsPerPage} Labels / Page</span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{layout.totalPages} Total Pages</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSettings(INITIAL_SETTINGS)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Reset Settings"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Live Preview
            </div>
          </div>
        </header>

        {/* Preview Area */}
        <div className="flex-1 p-12 overflow-auto flex justify-center items-start bg-[#F3F4F6]">
          <div className="relative shadow-2xl bg-white" style={{ 
            width: `${settings.sheetWidth * 3}px`, 
            height: `${settings.sheetHeight * 3}px`,
            minWidth: `${settings.sheetWidth * 3}px`,
            minHeight: `${settings.sheetHeight * 3}px`
          }}>
            {/* SVG Overlay for Precision Preview */}
            <svg 
              width="100%" 
              height="100%" 
              viewBox={`0 0 ${settings.sheetWidth} ${settings.sheetHeight}`}
              className="absolute inset-0"
            >
              {/* Margins */}
              <rect 
                x={settings.marginLeft} 
                y={settings.marginTop} 
                width={settings.sheetWidth - settings.marginLeft - settings.marginRight} 
                height={settings.sheetHeight - settings.marginTop - settings.marginBottom}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />

              {/* Labels Grid */}
              {Array.from({ length: layout.labelsPerColumn }).map((_, row) => (
                Array.from({ length: layout.labelsPerRow }).map((_, col) => {
                  const x = settings.marginLeft + col * (settings.labelWidth + settings.gapHorizontal);
                  const y = settings.marginTop + row * (settings.labelHeight + settings.gapVertical);
                  
                  return (
                    <g key={`label-${row}-${col}`}>
                      <rect 
                        x={x} 
                        y={y} 
                        width={settings.labelWidth} 
                        height={settings.labelHeight}
                        fill="#EFF6FF"
                        stroke="#3B82F6"
                        strokeWidth="0.2"
                      />
                      {settings.showCutLines && (
                        <g stroke="#EF4444" strokeWidth="0.1">
                          {/* Corner Indicators */}
                          <line x1={x-1} y1={y} x2={x-3} y2={y} />
                          <line x1={x} y1={y-1} x2={x} y2={y-3} />
                          
                          <line x1={x+settings.labelWidth+1} y1={y} x2={x+settings.labelWidth+3} y2={y} />
                          <line x1={x+settings.labelWidth} y1={y-1} x2={x+settings.labelWidth} y2={y-3} />
                          
                          <line x1={x-1} y1={y+settings.labelHeight} x2={x-3} y2={y+settings.labelHeight} />
                          <line x1={x} y1={y+settings.labelHeight+1} x2={x} y2={y+settings.labelHeight+3} />
                          
                          <line x1={x+settings.labelWidth+1} y1={y+settings.labelHeight} x2={x+settings.labelWidth+3} y2={y+settings.labelHeight} />
                          <line x1={x+settings.labelWidth} y1={y+settings.labelHeight+1} x2={x+settings.labelWidth} y2={y+settings.labelHeight+3} />
                        </g>
                      )}
                    </g>
                  );
                })
              ))}

              {/* Perforation Line */}
              {settings.showPerforation && (
                <line 
                  x1="0" 
                  y1={settings.sheetHeight - 2} 
                  x2={settings.sheetWidth} 
                  y2={settings.sheetHeight - 2} 
                  stroke="#9CA3AF" 
                  strokeWidth="0.5" 
                  strokeDasharray="1,1" 
                />
              )}
            </svg>

            {/* Scale Indicator */}
            <div className="absolute -bottom-8 left-0 flex items-center gap-2 text-[10px] font-mono text-gray-400">
              <Maximize2 className="w-3 h-3" />
              <span>{settings.sheetWidth}mm x {settings.sheetHeight}mm (1:3 Preview Scale)</span>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <footer className="h-12 bg-white border-t border-gray-200 flex items-center px-8 justify-between">
          <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-100 border border-blue-500 rounded-sm" />
              <span>Label Area: {layout.actualWidthUsed.toFixed(1)} x {layout.actualHeightUsed.toFixed(1)} mm</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 border border-gray-300 border-dashed rounded-sm" />
              <span>Safety Margin: {settings.marginLeft}mm</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            <Info className="w-3 h-3" />
            <span>Optimization: {((layout.actualWidthUsed * layout.actualHeightUsed) / (settings.sheetWidth * settings.sheetHeight) * 100).toFixed(1)}% Surface Usage</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
