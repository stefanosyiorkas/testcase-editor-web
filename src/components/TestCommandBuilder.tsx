
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
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

  const handleTestCaseChange = (testCase: TestCase) => {
    setCommand(prev => ({
      ...prev,
      testcases: [testCase]
    }));
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">Test Cases</h2>
          <TestCaseForm testCase={command.testcases[0]} onChange={handleTestCaseChange} />
        </Card>
        
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">Parameters</h2>
          <TestParamsForm params={command.params} onChange={handleParamsChange} />
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Generated Command</h2>
          <Button onClick={copyCommand} variant="outline" className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
          {generateCommand()}
        </pre>
      </Card>
    </div>
  );
};

export default TestCommandBuilder;
