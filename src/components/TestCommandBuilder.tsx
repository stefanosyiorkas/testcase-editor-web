import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TestCaseForm from "./TestCaseForm";
import TestParamsForm from "./TestParamsForm";

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

interface TestCommand {
  testcases: TestCase[];
  params: {
    [key: string]: string;
  };
}

const TestCommandBuilder = () => {
  const { toast } = useToast();
  const [command, setCommand] = useState<TestCommand>({
    testcases: [],
    params: {},
  });

  const handleTestCaseChange = (index: number, testCase: TestCase) => {
    setCommand((prev) => ({
      ...prev,
      testcases: prev.testcases.map((tc, i) => (i === index ? testCase : tc)),
    }));
  };

  const addTestCase = () => {
    const newTestCaseId = `new_testcase_${command.testcases.length + 1}`;
    const newTestCase = {
      [newTestCaseId]: {},
    };
    setCommand((prev) => ({
      ...prev,
      testcases: [...prev.testcases, newTestCase],
    }));
  };

  const removeTestCase = (index: number) => {
    setCommand((prev) => ({
      ...prev,
      testcases: prev.testcases.filter((_, i) => i !== index),
    }));
  };

  const handleParamsChange = (params: TestCommand["params"]) => {
    setCommand((prev) => ({
      ...prev,
      params,
    }));
  };

  const generateCommand = () => {
    return `python -u /home/tornado/selenium-tests/testcase_runner.py '${JSON.stringify(
      command,
      null,
      2 // Indentation for better readability
    )}'`;
  };

  const copyCommand = () => {
    const command = generateCommand();
    const prefix =
      "python -u /home/tornado/selenium-tests/testcase_runner.py '";
    const [before, after] = command.split(prefix);
    const cleanedAfter = after.replace(/[\s\t]+/g, ""); // Remove spaces and tabs
    const finalCommand = `${before}${prefix}${cleanedAfter}`;
    navigator.clipboard.writeText(finalCommand.trim());
    toast({
      title: "Command copied!",
      description: "The command has been copied to your clipboard.",
    });
  };

  const addParameter = () => {
    const newParamKey = `new_param_${Object.keys(command.params).length + 1}`;
    setCommand((prev) => ({
      ...prev,
      params: {
        ...prev.params,
        [newParamKey]: "",
      },
    }));
  };

  const removeParameter = (paramKey: string) => {
    const newParams = { ...command.params };
    delete newParams[paramKey];
    setCommand((prev) => ({
      ...prev,
      params: newParams,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Generated Command</h2>
          <Button
            onClick={copyCommand}
            variant="outline"
            className="flex items-center gap-2"
          >
            Copy
          </Button>
        </div>
        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
          {generateCommand()}
        </pre>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary">Test Cases</h2>
            <Button onClick={addTestCase} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add Test Case
            </Button>
          </div>
          <div className="space-y-8">
            {command.testcases.map((testCase, index) => (
              <div key={index} className="relative">
                {command.testcases.length > 0 && (
                  <div className="absolute right-0 top-0 flex gap-2 flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTestCase(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Remove test case</span>
                    </Button>
                    {/* Add other buttons here if needed */}
                  </div>
                )}
                <TestCaseForm
                  testCase={testCase}
                  onChange={(updatedTestCase) =>
                    handleTestCaseChange(index, updatedTestCase)
                  }
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary">Parameters</h2>
            <Button onClick={addParameter} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add Parameter
            </Button>
          </div>
          <TestParamsForm
            params={command.params}
            onChange={handleParamsChange}
            onRemove={removeParameter}
          />
        </Card>
      </div>
    </div>
  );
};

export default TestCommandBuilder;
