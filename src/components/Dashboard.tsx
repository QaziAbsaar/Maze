// src/components/Dashboard.tsx
'use client';
import React, { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ComposedChart
} from 'recharts';

interface Metrics {
  algorithmUsed: string;
  executionTimeMs: number;
  nodesExplored: number;
  pathLength: number;
}

export const Dashboard: React.FC<{ metrics: Metrics; history: Metrics[] }> = ({ metrics, history }) => {
  // Prepare data for performance comparison graphs
  const chartData = useMemo(() => {
    if (history.length === 0) return [];
    
    // Group by algorithm to show latest run for each
    const algorithmMap = new Map<string, Metrics>();
    history.forEach(record => {
      if (!algorithmMap.has(record.algorithmUsed)) {
        algorithmMap.set(record.algorithmUsed, record);
      }
    });
    
    return Array.from(algorithmMap.values()).map(m => ({
      name: m.algorithmUsed.split(' ')[0], // Short name (A*, Dijkstra, etc.)
      time: m.executionTimeMs,
      nodes: m.nodesExplored,
      path: m.pathLength,
      fullName: m.algorithmUsed
    })).sort((a, b) => a.time - b.time);
  }, [history]);

  // Time series data for execution time trend
  const timeSeriesData = useMemo(() => {
    return history.slice(0, 10).reverse().map((record, i) => ({
      index: i + 1,
      algo: record.algorithmUsed.split(' ')[0],
      time: record.executionTimeMs,
      nodes: record.nodesExplored
    }));
  }, [history]);

  return (
    <div className="p-4 bg-slate-900 text-slate-100 rounded-xl shadow-lg border border-slate-800 w-full">
      {/* Current Metrics */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-cyan-400">Current Algorithm Metrics</h2>
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div className="bg-slate-800 p-3 rounded border border-slate-700">
            <p className="text-slate-400 text-xs">Algorithm</p>
            <p className="text-lg font-semibold text-green-400">{metrics.algorithmUsed || 'None'}</p>
          </div>
          <div className="bg-slate-800 p-3 rounded border border-slate-700">
            <p className="text-slate-400 text-xs">Execution Time</p>
            <p className="text-lg font-semibold text-blue-400">{metrics.executionTimeMs} ms</p>
          </div>
          <div className="bg-slate-800 p-3 rounded border border-slate-700">
            <p className="text-slate-400 text-xs">Nodes Explored</p>
            <p className="text-lg font-semibold text-yellow-400">{metrics.nodesExplored}</p>
          </div>
          <div className="bg-slate-800 p-3 rounded border border-slate-700">
            <p className="text-slate-400 text-xs">Path Length</p>
            <p className="text-lg font-semibold text-purple-400">{metrics.pathLength}</p>
          </div>
        </div>
      </div>

      {/* Comparison Charts */}
      {chartData.length > 1 && (
        <div className="space-y-6">
          {/* Execution Time Comparison */}
          <div className="bg-slate-800 p-4 rounded border border-slate-700">
            <h3 className="text-sm font-semibold mb-3 text-cyan-300">Execution Time Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(value: any) => `${value} ms`}
                />
                <Bar dataKey="time" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Nodes Explored Comparison */}
          <div className="bg-slate-800 p-4 rounded border border-slate-700">
            <h3 className="text-sm font-semibold mb-3 text-cyan-300">Nodes Explored Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(value: any) => value.toString()}
                />
                <Bar dataKey="nodes" fill="#fbbf24" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Efficiency Scatter (Nodes vs Time) */}
          <div className="bg-slate-800 p-4 rounded border border-slate-700">
            <h3 className="text-sm font-semibold mb-3 text-cyan-300">Efficiency Chart (Nodes vs Time)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" name="Time (ms)" stroke="#9ca3af" />
                <YAxis dataKey="nodes" name="Nodes Explored" stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value: any, name: any) => {
                    if (name === 'time') return [`${value} ms`, 'Time'];
                    if (name === 'nodes') return [value.toString(), 'Nodes'];
                    return value.toString();
                  }}
                  labelFormatter={(value: any) => chartData.find(d => d.time.toString() === value)?.fullName || value}
                />
                <Scatter name="Algorithms" data={chartData} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Time Series for Last Runs */}
      {timeSeriesData.length > 1 && (
        <div className="bg-slate-800 p-4 rounded border border-slate-700 mt-6">
          <h3 className="text-sm font-semibold mb-3 text-cyan-300">Performance Trends (Last 10 Runs)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" stroke="#9ca3af" label={{ value: 'Run Order', position: 'insideBottomRight', offset: -5 }} />
              <YAxis yAxisId="left" stroke="#9ca3af" label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" label={{ value: 'Nodes', angle: 90, position: 'insideRight' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="time" stroke="#3b82f6" dot={{ r: 4 }} name="Execution Time (ms)" />
              <Line yAxisId="right" type="monotone" dataKey="nodes" stroke="#fbbf24" dot={{ r: 4 }} name="Nodes Explored" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History Table */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2 border-b border-slate-700 pb-2 text-cyan-300">Run History</h3>
        <div className="overflow-y-auto max-h-48">
          <table className="w-full text-xs text-slate-300">
            <thead className="sticky top-0 bg-slate-800">
              <tr className="border-b border-slate-700">
                <th className="text-left p-2">Algorithm</th>
                <th className="text-right p-2">Time (ms)</th>
                <th className="text-right p-2">Nodes</th>
                <th className="text-right p-2">Path</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record, i) => (
                <tr key={i} className="border-b border-slate-700 hover:bg-slate-750">
                  <td className="p-2 text-slate-400">{record.algorithmUsed}</td>
                  <td className="text-right p-2 text-blue-400">{record.executionTimeMs}</td>
                  <td className="text-right p-2 text-yellow-400">{record.nodesExplored}</td>
                  <td className="text-right p-2 text-purple-400">{record.pathLength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
