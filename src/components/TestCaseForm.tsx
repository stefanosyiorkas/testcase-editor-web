
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TestCase {
  [key: string]: {
    predecessor_test: string;
    wallet_id: string;
    provider: string;
    balance: string;
    skip_test: string;
    testcase_tag: string;
    status: boolean;
  };
}

interface TestCaseFormProps {
  testCase: TestCase;
  onChange: (testCase: TestCase) => void;
}

const TestCaseForm = ({ testCase, onChange }: TestCaseFormProps) => {
  const testCaseKey = Object.keys(testCase)[0];
  const testCaseData = testCase[testCaseKey];

  const handleInputChange = (field: string, value: string | boolean) => {
    onChange({
      [testCaseKey]: {
        ...testCaseData,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      {Object.entries(testCaseData).map(([field, value]) => (
        <div key={field}>
          <Label htmlFor={field} className="capitalize">
            {field.replace(/_/g, ' ')}
          </Label>
          {typeof value === 'boolean' ? (
            <select
              className="w-full p-2 border rounded-md mt-1"
              value={value.toString()}
              onChange={(e) => handleInputChange(field, e.target.value === 'true')}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          ) : (
            <Input
              id={field}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="mt-1"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TestCaseForm;
