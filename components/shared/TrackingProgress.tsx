'use client';

import { CheckCircle2, Circle, Truck, Package, ChefHat, CreditCard } from 'lucide-react';

interface TrackingStep {
  status: string;
  label: string;
  completed: boolean;
  active: boolean;
  date?: string;
  message?: string;
}

const steps: TrackingStep[] = [
  { status: 'ORDER_PLACED', label: 'Order Placed', completed: false, active: false, message: 'Order received successfully' },
  { status: 'CONFIRMED', label: 'Confirmed', completed: false, active: false, message: 'Order confirmed by seller' },
  { status: 'PREPARING', label: 'Preparing', completed: false, active: false, message: 'Preparing your order' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', completed: false, active: false, message: 'Out for delivery' },
  { status: 'DELIVERED', label: 'Delivered', completed: false, active: false, message: 'Delivered successfully' },
];

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  ORDER_PLACED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  CONFIRMED: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  PREPARING: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  OUT_FOR_DELIVERY: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  DELIVERED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
};

interface TrackingProgressProps {
  orderStatus: string;
  statusDate?: string;
  statusMessage?: string;
}

export default function TrackingProgress({ orderStatus, statusDate, statusMessage }: TrackingProgressProps) {
  const currentStepIndex = steps.findIndex((s) => s.status === orderStatus);
  const currentColor = statusColors[orderStatus] || statusColors['ORDER_PLACED'];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Order Tracking</h2>
        <div className={`px-4 py-2 rounded-full border ${currentColor.bg} ${currentColor.text} ${currentColor.border}`}>
          <span className="font-semibold text-sm">{orderStatus.replace(/_/g, ' ')}</span>
        </div>
      </div>

      <div className="relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div key={step.status} className="relative flex items-center mb-8 last:mb-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isCompleted
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : isActive
                      ? 'bg-white border-primary-600 text-primary-600'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : isActive ? (
                    <ChefHat className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
              </div>

              <div className="ml-4 flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-semibold ${
                      isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </h3>
                  {isActive && statusDate && (
                    <span className="text-xs text-gray-500">
                      {new Date(statusDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                {(isActive || isCompleted) && statusMessage && (
                  <p className="text-sm text-gray-600 mt-1">{statusMessage}</p>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`absolute left-6 top-12 w-0.5 h-8 ${
                    isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
