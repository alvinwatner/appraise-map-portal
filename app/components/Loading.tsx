import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s infinite linear;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;