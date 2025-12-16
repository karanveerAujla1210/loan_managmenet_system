import { useEffect, useState } from 'react';
import { getBranches } from '../services/branches';

export const BranchSelect = ({ value, onChange, disabled = false }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBranches().then(data => {
      setBranches(data);
      setLoading(false);
    });
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading}
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    >
      <option value="">Select Branch</option>
      {branches.map(branch => (
        <option key={branch.branchId} value={branch.branchId}>
          {branch.branchName}
        </option>
      ))}
    </select>
  );
};
