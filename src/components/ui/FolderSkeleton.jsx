import React from 'react'

const FolderSkeleton = () => {
  return (
    <div>
      <div className="min-h-screen bg-[var(--bg-main)] p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] animate-pulse" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--bg-gradient)] animate-pulse" />
                <div className="h-9 w-64 bg-[var(--bg-secondary)] rounded-lg animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-28 bg-[var(--bg-secondary)] rounded-lg animate-pulse" />
              <div className="h-10 w-32 bg-[var(--accent-primary)]/20 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Controls Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-6 w-24 bg-[var(--bg-secondary)] rounded animate-pulse" />

          <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-light)]/60">
            <div className="w-9 h-9 bg-white/60 rounded-md animate-pulse mx-0.5" />
            <div className="w-9 h-9 bg-[var(--bg-secondary)]/60 rounded-md animate-pulse mx-0.5" />
          </div>
        </div>

        {/* Files Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="
                  border border-[var(--border-light)]/70 
                  rounded-xl 
                  overflow-hidden 
                  bg-[var(--bg-secondary)]/60 
                  animate-pulse
                "
              >
                <div className="aspect-square w-full bg-gradient-to-br from-[var(--bg-gradient)]/40 to-transparent" />
                <div className="p-4 space-y-2">
                  <div className="h-5 w-4/5 bg-[var(--bg-secondary)] rounded" />
                  <div className="h-4 w-3/5 bg-[var(--bg-secondary)]/80 rounded" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default FolderSkeleton