import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Home } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { EditorialBackgroundText } from '../../components/layout/EditorialBackgroundText';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer className="min-h-[70vh] flex items-center justify-center relative">
      <EditorialBackgroundText text="404" />
      <div className="text-center space-y-4 relative z-10">
        <h1 className="text-7xl font-extrabold text-[#6B8CFF] font-mono-tech">404</h1>
        <h2 className="text-2xl font-bold text-[#F5F7FF]">Page Not Found</h2>
        <p className="text-[#9DA9C6] text-sm max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFoundPage;
