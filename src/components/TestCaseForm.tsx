import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Minus } from "lucide-react";

interface TestCase {
  [key: string]: {
    [key: string]: string | boolean;
  };
}

interface TestCaseFormProps {
  testCase: TestCase;
  onChange: (testCase: TestCase) => void;
}

const TestCaseForm = ({ testCase, onChange }: TestCaseFormProps) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [editingParam, setEditingParam] = useState<string | null>(null);
  const [newParamKey, setNewParamKey] = useState("");

  const testCaseId = Object.keys(testCase)[0];
  const testCaseData = testCase[testCaseId];

  const handleInputChange = (field: string, value: string | boolean) => {
    onChange({
      [testCaseId]: {
        ...testCaseData,
        [field]: value,
      },
    });
  };

  const startEditing = () => {
    setEditingKey(testCaseId);
    setNewKey(testCaseId);
  };

  const handleRename = () => {
    if (newKey && newKey !== testCaseId) {
      onChange({
        [newKey]: testCaseData,
      });
    }
    setEditingKey(null);
  };

  const startEditingParam = (param: string) => {
    setEditingParam(param);
    setNewParamKey(param);
  };

  const handleRenameParam = (oldKey: string) => {
    if (newParamKey && newParamKey !== oldKey) {
      const updatedData = { ...testCaseData };
      const value = updatedData[oldKey];
      delete updatedData[oldKey];
      updatedData[newParamKey] = value;

      onChange({
        [testCaseId]: updatedData,
      });
    }
    setEditingParam(null);
  };

  const addParameter = () => {
    onChange({
      [testCaseId]: {
        ...testCaseData,
        [`new_param_${Object.keys(testCaseData).length}`]: "",
      },
    });
  };

  const removeParameter = (param: string) => {
    const updatedData = { ...testCaseData };
    delete updatedData[param];
    onChange({
      [testCaseId]: updatedData,
    });
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
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
              className="font-medium"
            />
          </div>
        ) : (
          <Label className="flex-1 font-medium">
            {testCaseId.replace(/_/g, " ")}
          </Label>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={startEditing}
          className="h-8 w-8 p-0 mr-10"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit test case ID</span>
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(testCaseData).map(([field, value]) => (
          <div key={field} className="space-y-2">
            <div className="flex items-center gap-2">
              {editingParam === field ? (
                <div className="flex-1">
                  <Input
                    value={newParamKey}
                    onChange={(e) => setNewParamKey(e.target.value)}
                    onBlur={() => handleRenameParam(field)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleRenameParam(field)
                    }
                    autoFocus
                    className="font-medium"
                  />
                </div>
              ) : (
                <Label className="flex-1 capitalize font-medium">
                  {field.replace(/_/g, " ")}
                </Label>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEditingParam(field)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit parameter name</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeParameter(field)}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Remove parameter</span>
              </Button>
            </div>
            {typeof value === "boolean" ? (
              <select
                className="w-full p-2 border rounded-md"
                value={value.toString()}
                onChange={(e) =>
                  handleInputChange(field, e.target.value === "true")
                }
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : (
              <Input
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addParameter} className="w-full mt-4">
        <Plus className="h-4 w-4 mr-2" />
        Add Parameter
      </Button>
    </div>
  );
};

export default TestCaseForm;
