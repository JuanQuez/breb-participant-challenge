import { TransferDetail } from "@/components/transfers/TransferDetail";

export default async function TransferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
      <TransferDetail id={id} />
    </main>
  );
}
