import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { Dimensions } from '../types';

interface CutDiagramProps {
  dimensions: Dimensions;
  stripWidth?: number; // in meters, default 0.2
}

const CutDiagram: React.FC<CutDiagramProps> = ({ dimensions, stripWidth = 0.2 }) => {
  const { width, length } = dimensions;

  // SVG Viewport dimensions
  const svgWidth = 600;
  const svgHeight = 400;
  const padding = 40;

  const diagramData = useMemo(() => {
    // Decide orientation: usually strips run parallel to the shortest side to save structure,
    // OR parallel to longest side for aesthetics (fewer joints). 
    // Let's assume strips run parallel to the LONGEST side (Length), stacking along the Width.
    // Or specifically: Strips are cut to length L. We need W / stripWidth strips.
    
    // To make it visual, let's map real meters to SVG pixels
    // We need to fit the room ratio into the svg container ratio
    const widthScale = d3.scaleLinear()
      .domain([0, width])
      .range([0, svgWidth - padding * 2]);

    const lengthScale = d3.scaleLinear()
      .domain([0, length])
      .range([0, svgHeight - padding * 2]);

    // Determine scaling factor to maintain aspect ratio
    // We want the bounding box to fit within [svgWidth, svgHeight]
    const scaleFactor = Math.min(
      (svgWidth - padding * 2) / width,
      (svgHeight - padding * 2) / length
    );

    const pixelWidth = width * scaleFactor;
    const pixelLength = length * scaleFactor;

    const startX = (svgWidth - pixelWidth) / 2;
    const startY = (svgHeight - pixelLength) / 2;

    // Generate strips
    const numStrips = Math.ceil(width / stripWidth);
    const strips = [];

    for (let i = 0; i < numStrips; i++) {
      strips.push({
        x: startX + (i * stripWidth * scaleFactor),
        y: startY,
        w: stripWidth * scaleFactor,
        h: pixelLength,
        id: i
      });
    }

    return { strips, pixelWidth, pixelLength, startX, startY, scaleFactor };
  }, [width, length, stripWidth]);

  return (
    <div className="w-full flex flex-col items-center bg-slate-900 rounded-lg p-4 shadow-inner">
      <h3 className="text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        Diagrama de Paginação (Esquemático)
      </h3>
      <svg 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
        className="w-full h-auto max-h-[300px] border border-slate-700 rounded bg-slate-800"
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </pattern>
        </defs>
        
        {/* Background Grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Room Boundary */}
        <rect
          x={diagramData.startX}
          y={diagramData.startY}
          width={diagramData.pixelWidth}
          height={diagramData.pixelLength}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Strips */}
        {diagramData.strips.map((strip) => (
          <rect
            key={strip.id}
            x={strip.x}
            y={strip.y}
            width={strip.w}
            height={strip.h}
            fill={strip.id % 2 === 0 ? '#3b82f6' : '#2563eb'}
            stroke="#1e3a8a"
            strokeWidth="0.5"
            className="opacity-80 hover:opacity-100 transition-opacity cursor-crosshair"
          >
            <title>Régua #{strip.id + 1}</title>
          </rect>
        ))}

        {/* Dimensions Labels */}
        <text 
          x={svgWidth / 2} 
          y={diagramData.startY - 10} 
          textAnchor="middle" 
          fill="#cbd5e1" 
          fontSize="12"
          className="font-mono"
        >
          Largura: {width}m
        </text>
        <text 
          x={diagramData.startX - 10} 
          y={svgHeight / 2} 
          textAnchor="middle" 
          fill="#cbd5e1" 
          fontSize="12"
          className="font-mono"
          transform={`rotate(-90, ${diagramData.startX - 10}, ${svgHeight / 2})`}
        >
          Comprimento: {length}m
        </text>

      </svg>
      <p className="text-xs text-slate-500 mt-2 text-center">
        *Visualização ilustrativa. O sentido real de instalação depende da estrutura secundária.
      </p>
    </div>
  );
};

export default CutDiagram;