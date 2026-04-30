import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`}></div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
    <Skeleton className="w-full h-48" />
    <div className="space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="flex justify-between items-center pt-4">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 py-8">
    <Skeleton className="h-[400px] rounded-3xl" />
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-1/3" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  </div>
);

export const RouteSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
    <div className="flex justify-between items-center">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-6 w-96 rounded-lg" />
      </div>
      <Skeleton className="h-14 w-48 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
    <div className="h-96 w-full rounded-[48px] bg-slate-100 animate-pulse"></div>
  </div>
);

export default Skeleton;
