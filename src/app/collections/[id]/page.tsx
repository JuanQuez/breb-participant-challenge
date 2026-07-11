import { CollectionDetail } from "@/components/collections/CollectionDetail";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
      <CollectionDetail id={id} />
    </main>
  );
}
