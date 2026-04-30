// Composant pour afficher un badge de notification avec le nombre de notifications non lues
export function NotificationBadge({ count }) {
  if (!count || count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
