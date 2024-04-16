'use client';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-gradient-to-br from-primary-200 to-secondary-400'>
      <div className='loadingio-spinner-dual-ring-7t9j65eirym'>
        <div className='ldio-d2f969t0yu4'>
          <div></div>
          <div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
