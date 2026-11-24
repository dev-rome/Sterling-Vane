type BookingProgressProps = {
  titles: string[];
  current: number;
  onSelect: (index: number) => void;
  className?: string;
};

export function BookingProgress({
  titles,
  current,
  onSelect,
  className = "",
}: BookingProgressProps) {
  return (
    <ol
      aria-label="Booking progress"
      className={`grid grid-cols-2 gap-x-2 gap-y-4 text-sm sm:grid-cols-4 ${className}`}
    >
      {titles.map((title, i) => {
        const isDone = i < current;
        const isCurrent = i === current;
        return (
          <li
            key={title}
            aria-current={isCurrent ? "step" : undefined}
            className={`border-t-2 pt-3 ${
              isDone || isCurrent ? "border-amber" : "border-line"
            } ${isCurrent ? "font-medium text-amber" : isDone ? "text-ivory" : "text-stone"}`}
          >
            {isDone ? (
              <button
                type="button"
                onClick={() => onSelect(i)}
                className="text-left transition-colors hover:text-amber"
              >
                0{i + 1} {title} <span aria-hidden="true">✓</span>
                <span className="sr-only"> (completed, go back)</span>
              </button>
            ) : (
              <>
                0{i + 1} {title}
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
