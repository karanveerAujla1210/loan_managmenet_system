import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CashflowChart = ({ data }) => {
  const chartData = data.map(item => ({
    week: `W${item._id.week}`,
    expected: item.expectedAmount,
    count: item.loanCount
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-blue-600">
            Expected: ₹{new Intl.NumberFormat('en-IN').format(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">
            Loans: {payload[0].payload.count}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">12-Week Cashflow Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="expected" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashflowChart;