export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      {description && <p className="text-muted-foreground mt-2 max-w-2xl text-[15px] leading-relaxed">{description}</p>}
    </div>
  );
}
