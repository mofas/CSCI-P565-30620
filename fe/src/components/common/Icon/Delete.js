import React from 'react';

export default ({ className = '' }) => {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M14.016 5.016v1.969h-12v-1.969h3l0.984-1.031h3.984l1.031 1.031h3zM3 18v-9.984h9.984v9.984c0 1.078-0.891 2.016-1.969 2.016h-6c-1.078 0-2.016-0.938-2.016-2.016zM15 12h6v2.016h-6v-2.016zM15 8.016h6.984v1.969h-6.984v-1.969zM15 15.984h3.984v2.016h-3.984v-2.016z" />
    </svg>
  );
};
