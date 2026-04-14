import { useSelector } from "react-redux";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  ComboboxGroup,
  ComboboxLabel,
  useComboboxAnchor,
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  Spinner,
  Button,
  Skeleton,
} from "../ui";
import { Fragment, useMemo, useState } from "react";
import { authSelector } from "@/features/auth/auth.selectors";
import { arraysEqual } from "@/lib/utils";

/**
 * Composant de selection multiple hierarchique permettant de choisir
 */
export function MultiHierarchicalItem({
  t,
  title = "",
  description = "",
  dataQuery = [],
  placeholder = "",
  emptyMessage = "",
}) {
  // Utilisateur connecte
  const { user } = useSelector(authSelector);
  // Destructuration des donnees et etats de la requete
  const { data, isSuccess, isLoading, isFetching, isError, error } = dataQuery;
  // Code d'error
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Etat local pour stocker les IDs selectionnes
  const [selectedIds, setSelectedIds] = useState(user?.competences || []);
  // Indique si les competences ont change
  const competencesChanged = !arraysEqual(user?.competences || [], selectedIds);
  // Etat local pour le combobox
  const [isOpen, setIsOpen] = useState(false);
  // Hook pour gerer l’ancrage du composant Combobox (positionnement UI)
  const anchor = useComboboxAnchor();
  // Transformation des donnees pour obtenir une liste plate
  const flatItems = useMemo(() => {
    return (data || []).flatMap((parent) => parent.enfants || []);
  }, [data]);
  // Fonction appelee lors d’un changement (selection d’un item)
  const onChange = (ids) => {
    if (ids.length <= 5) {
      setSelectedIds(ids);
      return;
    }
    setIsOpen(false);
  };

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>
          {title} {isFetching && <Spinner />}
        </ItemTitle>
        <ItemDescription>{description}</ItemDescription>
        <div className="my-3 min-h-10 flex items-center">
          {isLoading && <Skeleton className="h-full" />}
          {isError && (
            <CustomAlert
              header={code}
              body={t(`codes:${code}`)}
              onRefetch={refetch}
              refreshText={t("common.refresh")}
              icon={AlertCircle}
              variant="destructive"
            />
          )}
          {isSuccess && (
            <Combobox
              open={isOpen}
              onOpenChange={setIsOpen}
              multiple
              autoHighlight
              items={data}
              value={selectedIds}
              onValueChange={onChange}
              filter={(item, search) => {
                const s = search.toLowerCase();
                const parentMatch = item.nom?.toLowerCase().includes(s);
                const childrenMatch = item.enfants?.some((child) =>
                  child.nom?.toLowerCase().includes(s),
                );
                return parentMatch || childrenMatch;
              }}
            >
              <ComboboxChips ref={anchor} className="w-full">
                <ComboboxValue>
                  {(selectedIds) => (
                    <Fragment>
                      {selectedIds.map((id) => {
                        const item = flatItems.find((i) => i.id === id);
                        return (
                          <ComboboxChip key={id} value={id}>
                            {item?.nom ? item.nom : <Spinner />}
                          </ComboboxChip>
                        );
                      })}
                      <ComboboxChipsInput placeholder={placeholder} />
                    </Fragment>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
                <ComboboxList>
                  {(parent) => (
                    <ComboboxGroup key={parent.id} label={parent.nom}>
                      <ComboboxLabel>{parent.nom}</ComboboxLabel>
                      {parent.enfants.map((enfant) => (
                        <ComboboxItem
                          key={enfant.id}
                          value={enfant.id}
                          className="cursor-pointer"
                        >
                          {enfant.nom}
                        </ComboboxItem>
                      ))}
                    </ComboboxGroup>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        </div>
        {competencesChanged && (
          <Button
            className="w-fit"
            // onClick={}
          >
            {t("taxonomy:actions.save")}
          </Button>
        )}
      </ItemContent>
    </Item>
  );
}
