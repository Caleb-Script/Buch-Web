import React from 'react';

type Props = {
    message?: string;
};

export const LoadingComponent = ({message}) => {
  const loadingText = message ?? "Wird geladen";

  return (
    <div className="d-flex justify-content-center">
      <div role="status" className="spinner-border">
        <span className="sr-only">{loadingText}</span>
      </div>
    </div>
  );
};
