import React, { useState } from 'react';
import { 
  CogIcon, 
  DocumentCheckIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const Operations = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const operationalTasks = [
    {
      id: 'OP001',
      type: 'Document Verification',
      customer: 'Rajesh Kumar',
      loanId: 'LN001',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Priya Singh',
      dueDate: '2024-01-16',
      description: 'Verify bank statements and income documents'
    },
    {
      id: 'OP002',
      type: 'Legal Verification',
      customer: 'Amit Patel',
      loanId: 'LN003',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Rohit Sharma',
      dueDate: '2024-01-18',
      description: 'Property title verification and legal clearance'
    },
    {
      id: 'OP003',
      type: 'Field Verification',
      customer: 'Sunita Devi',
      loanId: 'LN004',
      priority: 'low',
      status: 'completed',
      assignedTo: 'Anjali Verma',
      dueDate: '2024-01-15',
      description: 'Business premises verification completed'
    }
  ];

  const workflowSteps = [
    { step: 'Application Received', status: 'completed', date: '2024-01-10' },
    { step: 'Initial Screening', status: 'completed', date: '2024-01-11' },
    { step: 'Document Collection', status: 'completed', date: '2024-01-12' },
    { step: 'Credit Analysis', status: 'in-progress', date: '2024-01-13' },
    { step: 'Field Verification', status: 'pending', date: null },
    { step: 'Final Approval', status: 'pending', date: null },
    { step: 'Disbursement', status: 'pending', date: null }
  ];

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'info'
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      'in-progress': 'info',
      completed: 'success'
    };
    return <Badge variant={variants[status]}>{status.replace('-', ' ')}</Badge>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredTasks = operationalTasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Operations</h1>
          <p className="text-base text-gray-600 mt-1">Manage operational tasks and workflows</p>
        </div>
        <Button>
          <CogIcon className="h-5 w-5 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">18</p>
              <p className="text-sm text-gray-600">Pending Tasks</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <ArrowPathIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">12</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">5</p>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">89%</p>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks List */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>Operational Tasks</Card.Title>
                <div className="flex space-x-1">
                  {['all', 'pending', 'in-progress', 'completed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        activeTab === tab
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {tab.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{task.type}</h4>
                          {getPriorityBadge(task.priority)}
                          {getStatusBadge(task.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Customer: {task.customer}</span>
                          <span>Loan: {task.loanId}</span>
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>
                      <DocumentCheckIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Workflow Status */}
        <div>
          <Card>
            <Card.Header>
              <Card.Title>Loan Workflow</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {getStatusIcon(step.status)}
                    <div className="flex-1">
                      <p className={`font-medium ${
                        step.status === 'completed' ? 'text-green-700' :
                        step.status === 'in-progress' ? 'text-blue-700' :
                        'text-gray-500'
                      }`}>
                        {step.step}
                      </p>
                      {step.date && (
                        <p className="text-sm text-gray-500">{step.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Task Detail Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title="Task Details"
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Task ID:</span>
                    <span className="font-medium">{selectedTask.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{selectedTask.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{selectedTask.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan ID:</span>
                    <span className="font-medium">{selectedTask.loanId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned To:</span>
                    <span className="font-medium">{selectedTask.assignedTo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{selectedTask.dueDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Status & Priority</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    {getPriorityBadge(selectedTask.priority)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    {getStatusBadge(selectedTask.status)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Description</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedTask.description}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h4>
              <div className="flex space-x-3">
                <Button variant="outline">Mark In Progress</Button>
                <Button>Mark Completed</Button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedTask(null)}>
                Close
              </Button>
              <Button>Update Task</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Operations;