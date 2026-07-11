export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-ink/15 px-4 py-6 text-center text-sm text-ink/50">
      {message}
    </p>
  );
}
