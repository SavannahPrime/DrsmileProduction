
import { cn } from '@/lib/utils';

interface FormStepsProps {
  step: number;
}

const FormSteps = ({ step }: FormStepsProps) => {
  return (
    <div className="mb-10 flex justify-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          step === 1 ? 'bg-dental-blue text-white' : 'bg-dental-light-blue text-dental-blue'
        )}>
          1
        </div>
        <div className="w-16 h-1 bg-dental-light-blue"></div>
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          step === 2 ? 'bg-dental-blue text-white' : 'bg-dental-light-blue text-dental-blue'
        )}>
          2
        </div>
      </div>
    </div>
  );
};

export default FormSteps;
