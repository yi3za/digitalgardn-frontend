import { useState } from "react";
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Composant de recherche reutilisable
 */
export function SearchBar({ className }) {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  // Etat interne de recherche
  const [internalValue, setInternalValue] = useState("");
  const currentValue = internalValue;

  // Met a jour la valeur locale
  const handleChange = (nextValue) => {
    setInternalValue(nextValue);
  };

  // Lance la recherche avec la valeur nettoyee
  const handleSearch = () => {
    const query = (currentValue ?? "").trim();
    const encoded = encodeURIComponent(query);
    navigate(query ? `/services?search=${encoded}` : "/services");
  };

  return (
    <InputGroup className={cn("min-w-100 px-2 py-6 shadow-none", className)}>
      <InputGroupAddon>
        <Search className="size-4 text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        value={currentValue}
        placeholder={t("filters.search")}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button onClick={handleSearch}> {t("actions.search")}</Button>
    </InputGroup>
  );
}
