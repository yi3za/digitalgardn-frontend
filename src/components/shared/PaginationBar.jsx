import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui";

/**
 * Composant generique de pagination base sur les metadonnees du serveur
 */
export function PaginationBar({ currentPage, lastPage, onPageChange }) {
  if (!lastPage || lastPage <= 1) return null;

  // Construit la liste des pages a afficher avec ellipsis autour de la page courante
  const buildPages = () => {
    // Affiche toujours la premiere et la derniere page, et les pages autour de la page courante (delta = 1)
    const pages = [];
    const delta = 1;
    // Calcul des bornes de la plage de pages a afficher autour de la page courante
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(lastPage - 1, currentPage + delta);
    // Ajout de la premiere page
    pages.push(1);
    if (rangeStart > 2) pages.push("ellipsis-start");
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < lastPage - 1) pages.push("ellipsis-end");
    if (lastPage > 1) pages.push(lastPage);

    return pages;
  };
  // Gestion du clic sur une page
  const handleClick = (e, p) => {
    e.preventDefault();
    if (p >= 1 && p <= lastPage) onPageChange(p);
  };

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => handleClick(e, currentPage - 1)}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
        {buildPages().map((p) =>
          typeof p === "string" ? (
            <PaginationItem key={p}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === currentPage}
                onClick={(e) => handleClick(e, p)}
                className="cursor-pointer"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => handleClick(e, currentPage + 1)}
            className={
              currentPage >= lastPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
