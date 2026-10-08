import { notFound } from "next/navigation";
import { MockConsoleRunner } from "@/components/MockConsoleRunner";
import { getScenarioById } from "@/lib/mock-console/load";

interface ConsolePageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsolePage({ params }: ConsolePageProps) {
  const { id } = await params;
  const scenario = getScenarioById(id);

  if (!scenario) {
    notFound();
  }

  return (
    <main>
      <MockConsoleRunner scenarioId={scenario.id} />
    </main>
  );
}
