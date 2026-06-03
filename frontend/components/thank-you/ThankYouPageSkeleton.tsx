export function ThankYouPageSkeleton() {
  return (
    <div className="py-10 md:py-14 page-x animate-pulse" aria-hidden>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-brand-beige" />
          <div className="h-7 w-56 bg-brand-beige rounded-lg" />
          <div className="h-4 w-64 bg-brand-beige/80 rounded" />
          <div className="h-14 w-32 bg-brand-beige rounded-2xl" />
        </div>
        <div className="card h-48 bg-brand-beige/60 rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-24 bg-brand-beige/50 rounded-2xl" />
          ))}
        </div>
        <div className="card h-40 bg-brand-beige/50 rounded-2xl" />
        <div className="card h-64 bg-brand-beige/50 rounded-2xl" />
      </div>
    </div>
  );
}
