import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AgentPerformanceChart = ({ data }) => {
  const chartData = data.slice(0, 10).map(agent => ({
    name: agent.agentName,
    recoveryRate: (agent.recoveryRate * 100).toFixed(1),
    totalAssigned: agent.totalAssigned,
    collectedAmount: agent.collectedAmount
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-green-600">Recovery Rate: {data.recoveryRate}%</p>
          <p className="text-sm text-blue-600">Assigned: {data.totalAssigned}</p>
          <p className="text-sm text-purple-600">
            Collected: ₹{new Intl.NumberFormat('en-IN').format(data.collectedAmount)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Top 10 Agent Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="recoveryRate" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgentPerformanceChart;