import React from "react";

const SkeletonTable = () => {
  return (
    <div
      role="status"
      className="mt-6 p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
    >
      <div className="flex items-center space-x-10">
        <div className="w-1/4">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-10/12 mb-2.5" />
          <div className="w-7/12 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
        </div>
        <div className="w-1/4">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-10/12 mb-2.5" />
          <div className="w-7/12 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
        </div>
        <div className="w-1/4">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-10/12 mb-2.5" />
          <div className="w-7/12 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
        </div>
        <div className="w-1/4">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-10/12 mb-2.5" />
          <div className="w-7/12 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 space-x-10">
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
      </div>
      <div className="flex items-center justify-between pt-4 space-x-10">
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
      </div>
      <div className="flex items-center justify-between pt-4 space-x-10">
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
      </div>
      <div className="flex items-center justify-between pt-4 space-x-10">
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
      </div>
      <div className="flex items-center justify-between pt-4 space-x-10">
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SkeletonTable;
