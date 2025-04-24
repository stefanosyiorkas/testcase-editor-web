
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";

interface TestParams {
  [key: string]: string;
}

interface TestParamsFormProps {
  params: TestParams;
  onChange: (params: TestParams) => void;
  onRemove: (paramKey: string) => void;
}

const TestParamsForm = ({ params, onChange, onRemove }: TestParamsFormProps) => {
  const handleInputChange = (field: string, value: string) => {
    onChange({
      ...params,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      {Object.entries(params).map(([field, value]) => (
        <div key={field} className="flex items-start gap-2">
          <div className="flex-1">
            <Label htmlFor={field} className="capitalize">
              {field.replace(/_/g, ' ')}
            </Label>
            <Input
              id={field}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-6"
            onClick={() => onRemove(field)}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TestParamsForm;
