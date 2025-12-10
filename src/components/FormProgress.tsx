import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export const FormProgress = ({ currentStep, totalSteps, stepLabels }: FormProgressProps) => {
  return (
    <div className="w-full mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-300",
                    isCompleted && "bg-success text-success-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : stepNumber}
                </div>
                {stepLabels && stepLabels[index] && (
                  <span className={cn(
                    "text-[10px] sm:text-xs mt-1 sm:mt-2 text-center max-w-[60px] sm:max-w-none leading-tight",
                    isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {stepLabels[index]}
                  </span>
                )}
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-1 sm:mx-2 transition-all duration-300",
                    stepNumber < currentStep ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
