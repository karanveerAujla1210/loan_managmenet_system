import React from 'react';

export function SimpleTable({ title, columns, data }) {
  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              {columns.map(c => <th key={c.key} className="py-2 pr-4">{c.title}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row, idx) => (
              <tr key={idx} className="border-t">
                {columns.map(c => <td key={c.key} className="py-2 pr-4">{c.render ? c.render(row) : row[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default null;
