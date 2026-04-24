import Image from 'next/image';

export function PersonAvatar({
  name,
  title,
  avatarUrl,
  size = 'md',
}: {
  name: string;
  title: string;
  avatarUrl: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeMap = { sm: 32, md: 48, lg: 64 };
  const px = sizeMap[size];

  return (
    <div className="flex items-center gap-[var(--space-md)]">
      <Image
        src={avatarUrl}
        alt={name}
        width={px}
        height={px}
        className="rounded-full bg-border-default flex-shrink-0 object-cover"
      />
      <div className="min-w-0">
        <p className={`font-semibold text-text-primary truncate ${size === 'sm' ? 'text-[length:var(--text-body)]' : 'text-[length:var(--text-h3)]'}`}>
          {name}
        </p>
        <p className={`text-text-secondary truncate ${size === 'sm' ? 'text-[length:var(--text-caption)]' : 'text-[length:var(--text-body)]'}`}>
          {title}
        </p>
      </div>
    </div>
  );
}
