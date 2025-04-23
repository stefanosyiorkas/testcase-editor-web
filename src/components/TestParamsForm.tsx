
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TestParams {
  environment: string;
  newly_created: string;
  composite_key: string;
  wallet_approval: string;
  report_str: string;
  approval: string;
  browser: string;
  regulator: string;
  selenium_grid: string;
  output_file: string;
  phone_verification: string;
  composite_test: string;
  amount: string;
}

interface TestParamsFormProps {
  params: TestParams;
  onChange: (params: TestParams) => void;
}

const TestParamsForm = ({ params, onChange }: TestParamsFormProps) => {
  const handleInputChange = (field: keyof TestParams, value: string) => {
    onChange({
      ...params,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      {Object.entries(params).map(([field, value]) => (
        <div key={field}>
          <Label htmlFor={field} className="capitalize">
            {field.replace(/_/g, ' ')}
          </Label>
          <Input
            id={field}
            value={value}
            onChange={(e) => handleInputChange(field as keyof TestParams, e.target.value)}
            className="mt-1"
          />
        </div>
      ))}
    </div>
  );
};

export default TestParamsForm;
