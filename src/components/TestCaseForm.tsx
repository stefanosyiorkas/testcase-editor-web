
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

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
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');

  const testCaseId = Object.keys(testCase)[0];
  const testCaseData = testCase[testCaseId];

  const handleInputChange = (field: string, value: string | boolean) => {
    onChange({
      [testCaseId]: {
        ...testCaseData,
        [field]: value
      }
    });
  };

  const startEditing = () => {
    setEditingKey(testCaseId);
    setNewKey(testCaseId);
  };

  const handleRename = () => {
    if (newKey && newKey !== testCaseId) {
      onChange({
        [newKey]: testCaseData
      });
    }
    setEditingKey(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {editingKey === testCaseId ? (
          <div className="flex-1">
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              autoFocus
              className="font-medium"
            />
          </div>
        ) : (
          <Label className="flex-1 font-medium">
            {testCaseId.replace(/_/g, ' ')}
          </Label>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={startEditing}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit test case ID</span>
        </Button>
      </div>

      {Object.entries(testCaseData).map(([field, value]) => (
        <div key={field} className="space-y-2">
          <Label htmlFor={field} className="capitalize">
            {field.replace(/_/g, ' ')}
          </Label>
          {typeof value === 'boolean' ? (
            <select
              id={field}
              className="w-full p-2 border rounded-md"
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
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TestCaseForm;
