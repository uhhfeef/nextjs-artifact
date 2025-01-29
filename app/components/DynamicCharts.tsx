// components/DynamicChart.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function DynamicCharts({ transpiledCode }: { transpiledCode: string }) {
    const [Component, setComponent] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        const loadComponent = async () => {
            const wrappedCode = `
            ${transpiledCode
              .replace(/import .*? from '.*?';/g, '')
              .replace('export default SimpleBarChart;', 'const __EXPORTED_COMP__ = SimpleBarChart;')}
            
            const ChartComponent = ({ React, Recharts }) => {
              try {
                return React.createElement(__EXPORTED_COMP__);
              } catch (e) {
                return () => React.createElement('div', null, 'Error rendering chart');
              }
            };
            
            export default ChartComponent;
            `;
            console.log("wrappedCode", wrappedCode);

            try {
                const blob = new Blob([wrappedCode], { type: 'text/javascript' });
                const url = URL.createObjectURL(blob);
                
                // Add Recharts components to the execution context
                const { default: ChartComponent } = await import(/* webpackIgnore: true */ url);
                const Component = ChartComponent({ 
                  React, 
                  Recharts: {
                    BarChart,
                    Bar,
                    XAxis,
                    YAxis,
                    CartesianGrid,
                    Tooltip,
                    Legend
                  }
                });
                
                setComponent(() => Component);
              } catch (error) {
                console.error('Component error:', error);
              }        };

        loadComponent();
    }, [transpiledCode]);

    return (
        <React.Suspense fallback={<div>Loading chart...</div>}>
            {Component && <Component />}
        </React.Suspense>
    );
}