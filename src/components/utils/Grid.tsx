import { cn } from "@/lib/utils";

type Props<T> = {
  query: {
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: { message: string } | null;
    data: T[] | undefined;
  };
  header: React.ReactNode;
  row: (item: T) => React.ReactNode;
  className?: string;
};

export default function Grid<T>({ query, header, row, className }: Props<T>) {
  const { isLoading, isFetching, isError, error, data: items } = query;

  if (isLoading || isFetching) return <div>Loading...</div>;

  if (isError)
    return (
      <div>
        <h1>Error</h1>
        {error?.message}
      </div>
    );

  return (
    <div className={cn("grid", className)}>
      {header}
      {items?.map(item => row(item))}
    </div>
  );
}
