import { useState } from 'react'
import { loanService } from '../services/api'
import toast from 'react-hot-toast'

const ImportData = () => {
  const [jsonData, setJsonData] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleImport = async (e) => {
    e.preventDefault()
    
    if (!jsonData.trim()) {
      toast.error('Please enter JSON data')
      return
    }

    try {
      setLoading(true)
      const data = JSON.parse(jsonData)
      
      const response = await loanService.importData({ data })
      setResults(response.data.data)
      toast.success(`Successfully imported ${response.data.data.length} loans`)
      setJsonData('')
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON format')
      } else {
        toast.error('Import failed: ' + (error.response?.data?.message || error.message))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Import Loan Data</h1>
        <p className="mt-1 text-sm text-gray-600">
          Import loan disbursement and payment data from JSON format
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">JSON Data Import</h3>
          </div>
          
          <form onSubmit={handleImport} className="p-6">
            <div className="mb-4">
              <textarea
                className="w-full h-96 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder="Paste your JSON data here..."
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Import Data'}
            </button>
          </form>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Import Results</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                    <div>
                      <p className="font-medium text-green-900">{result.loanId}</p>
                      <p className="text-sm text-green-700">
                        {result.paymentsCount} payments • ₹{result.totalPaid?.toLocaleString()} paid
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                      {result.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImportData