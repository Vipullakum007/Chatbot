const LoadingIndicator = () => {
    return (
        <div className="flex justify-start items-end gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="h-5 w-5 text-blue-600">⋯</span>
            </div>
            <div className="max-w-[75%] rounded-2xl p-4 bg-white text-gray-800 rounded-bl-none shadow-sm">
                <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;