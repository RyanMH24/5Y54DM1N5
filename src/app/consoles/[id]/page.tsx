import { notFound } from "next/navigation";
import { MockConsoleRunner } from "@/components/MockConsoleRunner";
import { getScenarioById } from "@/lib/mock-console/load";
import { scenarios } from "@/content/mock-consoles";

interface ConsolePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Object.keys(scenarios).map((id) => ({ id }));
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
