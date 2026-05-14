import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ProgressChart = ({ data }) => {
  // If data hasn't loaded yet, show a placeholder so the chart doesn't crash
  if (!data || data.length === 0) {
    return <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Loading Plateau Data...</div>;
  }

  return (
    /* CRITICAL: Explicit height here prevents the (-1) error */
    <div style={{ width: '100%', height: '400px', minWidth: '0px', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff' }} 
          />
          
          {/* Theoretical Curve (Light) */}
          <Line 
            type="monotone" 
            dataKey="theoretical" 
            stroke="rgba(152, 243, 187, 0.15)" 
            strokeWidth={2} 
            dot={false} 
          />

          {/* Actual Progress (Glowing Teal) */}
          <Area 
            type="monotone" 
            dataKey="actual" 
            stroke="#00ffcc" 
            fill="rgba(0, 255, 204, 0.1)" 
            strokeWidth={4} 
            connectNulls={false} 
          />
          <Line 
            type="monotone" 
            dataKey="hope" 
            stroke="#8884d8" // A soft purple or grey
            strokeDasharray="5 5" // This makes it a dashed "expectation" line
            strokeWidth={2}
            dot={false}
            label="Expectation"/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
