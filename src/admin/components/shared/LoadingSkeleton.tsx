import './LoadingSkeleton.css';

interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function LoadingSkeleton({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = ''
}: LoadingSkeletonProps) {
  return (
    <div 
      className={`loading-skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
}

export function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  return (
    <div className="skeleton-card">
      <LoadingSkeleton height="24px" width="60%" />
      <div className="skeleton-lines">
        {[...Array(lines)].map((_, i) => (
          <LoadingSkeleton 
            key={i} 
            height="16px" 
            width={i === lines - 1 ? '80%' : '100%'} 
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table-header">
        {[...Array(columns)].map((_, i) => (
          <LoadingSkeleton key={i} height="16px" width="80px" />
        ))}
      </div>
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {[...Array(columns)].map((_, colIndex) => (
            <LoadingSkeleton 
              key={colIndex} 
              height="16px" 
              width={colIndex === 0 ? '120px' : '80px'} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
