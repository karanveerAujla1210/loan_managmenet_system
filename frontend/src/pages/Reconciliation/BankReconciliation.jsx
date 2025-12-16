import { useState } from 'react';
import { uploadBankStatement } from '../../services/reconciliation';

export default function BankReconciliation() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadBankStatement(formData);
      setResults(response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bank Reconciliation</h1>
      <form onSubmit={handleUpload} className="mb-6">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Uploading...' : 'Upload Statement'}
        </button>
      </form>

      {results && (
        <div>
          <h2 className="text-xl font-bold mb-2">Results</h2>
          <p>Exact Matches: {results.exactMatches?.length || 0}</p>
          <p>Semi Matches: {results.semiMatches?.length || 0}</p>
          <p>Loose Matches: {results.looseMatches?.length || 0}</p>
          <p>Unmatched: {results.unmatched?.length || 0}</p>
        </div>
      )}
    </div>
  );
}
