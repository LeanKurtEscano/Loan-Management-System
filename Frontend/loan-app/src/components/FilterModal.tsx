import React, { useState } from 'react';

type FilterModalProps = {
    isOpen: boolean;
    onClose: () => void;
    paymentMethods: string[];
    settledDurations: string[];
    statuses: string[];
    onApplyFilters: (filters: {
        paymentMethod?: string;
        settledDuration?: string;
        status?: string;
    }) => void;
};

const FilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    paymentMethods,
    settledDurations,
    statuses,
    onApplyFilters,
}) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleApply = () => {
        const filters = {
            ...(selectedPaymentMethod && { paymentMethod: selectedPaymentMethod }),
            ...(selectedDuration && { settledDuration: selectedDuration }),
            ...(selectedStatus && { status: selectedStatus }),
        };
        onApplyFilters(filters);
        onClose();
    };

    const handleClearAll = () => {
        setSelectedPaymentMethod(null);
        setSelectedDuration(null);
        setSelectedStatus(null);
    };

    return (
        <div className="fixed inset-0  bg-gray-500/50  bg-opacity-40 bg-opacity-50  flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <button onClick={onClose} className=" cursor-pointer text-2xl">&times;</button>
                </div>

                <div className="p-4 space-y-6 overflow-y-auto">
                    {/* Payment Method */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium">Payment Method</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method}
                                    className={`py-2 px-4 cursor-pointer font-semibold border rounded-full text-sm ${selectedPaymentMethod === method
                                            ? 'border-blue-500 bg-blue-50 text-blue-500'
                                            : 'border-gray-300 text-black'
                                        }`}
                                    onClick={() => setSelectedPaymentMethod(
                                        selectedPaymentMethod === method ? null : method
                                    )}
                                >
                                    {method.charAt(0).toUpperCase() + method.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Settled Duration */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium">Settled Duration</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {settledDurations.map((duration) => (
                                <button
                                    key={duration}
                                    className={`py-2 px-4 cursor-pointer font-semibold border rounded-full text-sm ${selectedDuration === duration
                                            ? 'border-blue-500 bg-blue-50 text-blue-500'
                                            : 'border-gray-300 text-black'
                                        }`}
                                    onClick={() => setSelectedDuration(
                                        selectedDuration === duration ? null : duration
                                    )}
                                >
                                    {duration}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium">Status</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {statuses.map((status) => (
                                <button
                                    key={status}
                                    className={`py-2 cursor-pointer font-semibold px-4 border rounded-full text-sm ${selectedStatus === status
                                            ? 'border-blue-500 bg-blue-50 text-blue-500'
                                            : 'border-gray-300 text-black'
                                        }`}
                                    onClick={() => setSelectedStatus(
                                        selectedStatus === status ? null : status
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t flex justify-between">
                    <button
                        onClick={handleClearAll}
                        className="font-medium p-4 cursor-pointer bg-transparent text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 rounded-md "
                    >
                        Clear all
                    </button>

                    <button
                        onClick={handleApply}
                        className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white py-3 px-6 rounded-lg font-medium"
                    >
                        Show results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
