import { notFound } from "next/navigation";
import { LabRunner } from "@/components/LabRunner";
import { getLabById } from "@/lib/terminal-lab/load";
import { labs } from "@/content/labs";

interface LabPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Object.keys(labs).map((id) => ({ id }));
}

export default async function LabPage({ params }: LabPageProps) {
  const { id } = await params;
  const lab = getLabById(id);

  if (!lab) {
    notFound();
  }

  return (
    <main>
      <LabRunner labId={lab.id} />
    </main>
  );
}
