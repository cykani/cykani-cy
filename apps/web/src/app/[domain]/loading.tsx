export default function DomainLoading() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <p className="text-muted-foreground text-sm">Resolving workspace...</p>
      </div>
    </div>
  );
}
