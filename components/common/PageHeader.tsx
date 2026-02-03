"use client";

import React from "react";

interface PageHeaderProps {
  title: string | React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2 sm:gap-3">{children}</div>}
    </div>
  );
}
