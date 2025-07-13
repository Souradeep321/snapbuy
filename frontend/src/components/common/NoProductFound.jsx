import { PackageX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NoProductsFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PackageX className="w-12 h-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold text-foreground mb-2">
        No products available here yet
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        We haven’t added any product in this collection yet. Please explore other collections.
      </p>
      <Button onClick={() => navigate('/collection')} variant="outline" className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Collections
      </Button>
    </motion.div>
  );
};

export default NoProductsFound;
