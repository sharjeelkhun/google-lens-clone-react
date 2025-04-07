
import { ReactNode } from 'react';

interface ResultsLayoutProps {
  header: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
}

export function ResultsLayout({ header, content, footer }: ResultsLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - full width */}
      <div className="header-full-width border-b border-gray-200">
        {header}
      </div>
      
      {/* Main content - contained */}
      <div className="flex-1">
        <div className="main-content py-3">
          {content}
        </div>
      </div>
      
      {/* Footer - full width */}
      {footer && (
        <div className="footer-full-width">
          {footer}
        </div>
      )}
    </div>
  );
}

export default ResultsLayout;
