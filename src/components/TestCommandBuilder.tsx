import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TestCaseForm from './TestCaseForm';
import TestParamsForm from './TestParamsForm';

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
  };
}

const TestCommandBuilder = () => {
  const { toast } = useToast();
  const [command, setCommand] = useState<TestCommand>({
    testcases: [{
      "0004_my_hfcopy_multiple_follower_creation": {
        predecessor_test: "0001_hotforex_first_step_registration",
        wallet_id: "50183990",
        provider: "35455365",
        balance: "10000",
        skip_test: "False",
        testcase_tag: "hfsv_multiple_follower_creation",
        status: true
      }
    }],
    params: {
      environment: "dev4",
      newly_created: "True",
      composite_key: "HFSV",
      wallet_approval: "true",
      report_str: "hfsv_multiple_follower_creation",
      approval: "true",
      browser: "chrome",
      regulator: "hfsv",
      selenium_grid: "true",
      output_file: "copy_mass_follow.yaml",
      phone_verification: "true",
      composite_test: "True",
      amount: "100"
    }
  });

  const handleTestCaseChange = (index: number, testCase: TestCase) => {
    setCommand(prev => ({
      ...prev,
      testcases: prev.testcases.map((tc, i) => i === index ? testCase : tc)
    }));
  };

  const addTestCase = () => {
    const newTestCaseId = `testcase_${command.testcases.length + 1}`;
    const newTestCase = {
      [newTestCaseId]: {
        predecessor_test: "",
        wallet_id: "",
        provider: "",
        balance: "0",
        skip_test: "False",
        testcase_tag: "",
        status: true
      }
    };
    setCommand(prev => ({
      ...prev,
      testcases: [...prev.testcases, newTestCase]
    }));
  };

  const removeTestCase = (index: number) => {
    if (command.testcases.length > 1) {
      setCommand(prev => ({
        ...prev,
        testcases: prev.testcases.filter((_, i) => i !== index)
      }));
    }
  };

  const handleParamsChange = (params: TestCommand['params']) => {
    setCommand(prev => ({
      ...prev,
      params
    }));
  };

  const generateCommand = () => {
    return `python -u /home/tornado/selenium-tests/testcase_runner.py '${JSON.stringify(command)}'`;
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(generateCommand());
    toast({
      title: "Command copied!",
      description: "The command has been copied to your clipboard.",
    });
  };

  const addParameter = () => {
    const newParamKey = `new_param_${Object.keys(command.params).length}`;
    setCommand(prev => ({
      ...prev,
      params: {
        ...prev.params,
        [newParamKey]: ""
      }
    }));
  };

  const removeParameter = (paramKey: string) => {
    const newParams = { ...command.params };
    delete newParams[paramKey];
    setCommand(prev => ({
      ...prev,
      params: newParams
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Generated Command</h2>
          <Button onClick={copyCommand} variant="outline" className="flex items-center gap-2">
            Copy
          </Button>
        </div>
        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
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
                {command.testcases.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTestCase(index)}
                    className="absolute right-0 top-0 h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Remove test case</span>
                  </Button>
                )}
                <TestCaseForm
                  testCase={testCase}
                  onChange={(updatedTestCase) => handleTestCaseChange(index, updatedTestCase)}
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
