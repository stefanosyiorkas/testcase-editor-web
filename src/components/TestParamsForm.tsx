
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Edit } from "lucide-react";

interface TestParams {
  [key: string]: string;
}

interface TestParamsFormProps {
  params: TestParams;
  onChange: (params: TestParams) => void;
  onRemove: (paramKey: string) => void;
}

const TestParamsForm = ({ params, onChange, onRemove }: TestParamsFormProps) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');

  const handleInputChange = (field: string, value: string) => {
    onChange({
      ...params,
      [field]: value
    });
  };

  const startEditing = (key: string) => {
    setEditingKey(key);
    setNewKey(key);
  };

  const handleRename = (oldKey: string) => {
    if (newKey && newKey !== oldKey) {
      const updatedParams = { ...params };
      const value = updatedParams[oldKey];
      delete updatedParams[oldKey];
      updatedParams[newKey] = value;
      onChange(updatedParams);
    }
    setEditingKey(null);
  };

  return (
    <div className="space-y-4">
      {Object.entries(params).map(([field, value]) => (
        <div key={field} className="space-y-2">
          <div className="flex items-center gap-2">
            {editingKey === field ? (
              <div className="flex-1">
                <Input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  onBlur={() => handleRename(field)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename(field)}
                  autoFocus
                  className="font-medium"
                />
              </div>
            ) : (
              <Label className="flex-1 capitalize font-medium">
                {field.replace(/_/g, ' ')}
              </Label>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEditing(field)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit parameter name</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(field)}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Remove parameter</span>
            </Button>
          </div>
          <Input
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default TestParamsForm;
