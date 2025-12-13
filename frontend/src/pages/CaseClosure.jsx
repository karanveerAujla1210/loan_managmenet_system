import { CheckCircle, Download, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CaseClosure() {
  const navigate = useNavigate();

  const closureSteps = [
    { title: 'Final Payment Received', desc: '₹2,50,000 collected', completed: true },
    { title: 'Interest Calculated', desc: 'Total interest: ₹45,230', completed: true },
    { title: 'Penalties Waived', desc: 'Late payment penalties cleared', completed: true },
    { title: 'Documents Verified', desc: 'All documents reviewed and approved', completed: true },
    { title: 'Closure Certificate Generated', desc: 'Ready for download', completed: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Indicator */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Loan Closed Successfully</h1>
          <p className="text-lg text-gray-600">Case ID: LN-2024-001 | Rajesh Kumar</p>
        </div>

        {/* Closure Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* Loan Summary */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Loan Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Original Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹2,50,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">₹2,95,230</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tenure</p>
                <p className="text-2xl font-bold text-gray-900">36 Months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Closure Date</p>
                <p className="text-2xl font-bold text-gray-900">Jan 15, 2024</p>
              </div>
            </div>
          </div>

          {/* Closure Checklist */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Closure Checklist</h2>
            <div className="space-y-4">
              {closureSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{step.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 flex items-center justify-center space-x-2 bg-[#1741FF] hover:bg-[#1230cc] text-white font-semibold py-3 rounded-lg transition">
            <Download className="w-5 h-5" />
            <span>Download Closure Certificate</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center space-x-2 border-2 border-[#1741FF] text-[#1741FF] hover:bg-blue-50 font-semibold py-3 rounded-lg transition"
          >
            <Home className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-sm text-blue-900">
            A closure certificate has been generated and sent to the customer's registered email.
          </p>
        </div>
      </div>
    </div>
  );
}
