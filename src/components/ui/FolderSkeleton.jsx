import React from "react";

const SkeletonBox = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-xl bg-[var(--bg-secondary)] ${className}`}
  />
);

const FolderSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* HEADER SKELETON */}
      <div className="sticky top-0 z-10 bg-[var(--bg-main)]/90 backdrop-blur-md py-3">
        <div className="mx-0 md:mx-15 px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SkeletonBox className="w-8 h-8 rounded-lg" />
              <SkeletonBox className="w-40 h-6" />
            </div>

            <SkeletonBox className="w-48 h-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-0 md:mx-15 px-4 sm:px-6 py-8">
        {/* MEMBERS SECTION */}
        <div className="bg-[var(--bg-secondary)]   rounded-2xl p-4 sm:p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <SkeletonBox className="w-36 h-5 mb-2" />
              <SkeletonBox className="w-24 h-4" />
            </div>

            <div className="flex gap-3">
              <SkeletonBox className="w-32 h-10" />
              <SkeletonBox className="w-36 h-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[var(--bg-main)]  "
              >
                <SkeletonBox className="w-32 h-4 mb-2" />
                <SkeletonBox className="w-48 h-3 mb-2" />
                <SkeletonBox className="w-20 h-3" />
              </div>
            ))}
          </div>
        </div>

        {/* FILE GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[var(--bg-secondary)]  "
            >
              <SkeletonBox className="w-full h-24 mb-3" />
              <SkeletonBox className="w-3/4 h-4 mb-2" />
              <SkeletonBox className="w-1/2 h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FolderSkeleton;
