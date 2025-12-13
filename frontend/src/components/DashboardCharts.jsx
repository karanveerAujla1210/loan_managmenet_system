import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function LoanPerformanceChart({ data }) {
  const series = [];
  const months = new Set();
  (data?.disbursals || []).forEach(d => months.add(d._id));
  (data?.collections || []).forEach(d => months.add(d._id));
  const sorted = Array.from(months).sort();

  const merged = sorted.map(m => ({
    month: m,
    disbursed: (data?.disbursals?.find(d=>d._id===m)?.totalDisbursed) || 0,
    collected: (data?.collections?.find(d=>d._id===m)?.totalCollected) || 0
  }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm font-semibold mb-2">Loan Performance (Monthly)</div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={merged}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="disbursed" stroke="#8884d8" />
          <Line type="monotone" dataKey="collected" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CollectionsTrendChart({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm font-semibold mb-2">Collections Trend (Last 30 days)</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#3182ce" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DpdBucketsChart({ data }) {
  const colors = ['#38bdf8','#60a5fa','#7c3aed','#a78bfa','#fb7185','#f59e0b'];
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm font-semibold mb-2">DPD Bucket Distribution</div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data || []} dataKey="count" nameKey="_id" outerRadius={80} fill="#8884d8">
            {(data || []).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LeadsChart({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm font-semibold mb-2">New Leads (Weekly)</div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#f97316" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default null;
