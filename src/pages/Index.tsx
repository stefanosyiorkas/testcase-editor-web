
import TestCommandBuilder from "@/components/TestCommandBuilder";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          Test Command Builder
        </h1>
        <TestCommandBuilder />
      </div>
    </div>
  );
};

export default Index;
