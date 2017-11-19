import React from 'react';

export default ({ className = '' }) => {
  return (
    <svg className={className} viewBox="0 0 32 32">
      <path d="M18 8l-4-4h-14v26h32v-22h-14zM22 22h-4v4h-4v-4h-4v-4h4v-4h4v4h4v4z" />
    </svg>
  );
};
