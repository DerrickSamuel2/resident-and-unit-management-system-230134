import { ResidentProfileClient } from "@/components/ResidentProfileClient";

// PUBLIC_INTERFACE
export function generateStaticParams(): Array<{ id: string }> {
  /**
   * Required because this project uses `output: "export"` (static HTML export).
   * For now we provide a single placeholder route so `next export` can succeed.
   */
  return [{ id: "placeholder" }];
}

export default async function ResidentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResidentProfileClient id={id} />;
}
