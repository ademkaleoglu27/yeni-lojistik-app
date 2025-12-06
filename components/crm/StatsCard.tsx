type Props = {
  title: string;
  value: string;
};

export default function StatsCard({ title, value }: Props) {
  return (
    <div className="bg-surface rounded-md shadow-sm p-4">
      <p className="text-text-secondary text-sm">{title}</p>
      <p className="text-text-primary text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
