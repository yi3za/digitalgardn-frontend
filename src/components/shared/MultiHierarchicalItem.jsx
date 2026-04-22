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
  FormField,
  FormItem,
  FormMessage,
} from "../ui";
import { Fragment, useMemo, useState } from "react";

/**
 * Composant de selection multiple hierarchique permettant de choisir
 */
export function MultiHierarchicalItem({
  t,
  title = "",
  description = "",
  dataQuery = {},
  placeholder = "",
  emptyMessage = "",
  name = "",
  control = "",
  onSave = () => {},
  onReset = () => {},
  saveIsLoading = false,
  isChanged = false,
}) {
  // Destructuration des donnees et etats de la requete
  const { data, isSuccess, isLoading, isFetching } = dataQuery ?? {};
  // Etat local pour le combobox
  const [isOpen, setIsOpen] = useState(false);
  // Hook pour gerer l’ancrage du composant Combobox (positionnement UI)
  const anchor = useComboboxAnchor();
  // Transformation des donnees pour obtenir une liste plate
  const flatItems = useMemo(() => {
    return (data || []).flatMap((parent) => parent.enfants || []);
  }, [data]);

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>
          {title} {isFetching && <Spinner />}
        </ItemTitle>
        <ItemDescription>{description}</ItemDescription>
        <div className="my-3 min-h-10 flex items-center">
          {isLoading && <Skeleton className="min-h-10" />}
          {isSuccess && (
            <FormField
              control={control}
              name={name}
              render={({ field }) => (
                <FormItem className="w-full">
                  <Combobox
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    multiple
                    autoHighlight
                    items={data}
                    value={field.value}
                    onValueChange={(ids) => {
                      if (
                        ids.length <= 5 ||
                        (field.value.length > 5 &&
                          ids.length < field.value.length)
                      ) {
                        field.onChange(ids);
                        return;
                      }
                      setIsOpen(false);
                    }}
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
                  <FormMessage rules={{ attribute: title, min: 1, max: 5 }} />
                </FormItem>
              )}
            />
          )}
        </div>
        {isChanged && (
          <div className="w-full flex gap-2">
            <Button className="w-fit" onClick={onSave} disabled={saveIsLoading}>
              {saveIsLoading && <Spinner />}
              {t("common:actions.save")}
            </Button>
            <Button
              className="w-fit"
              variant="outline"
              onClick={onReset}
              disabled={saveIsLoading}
            >
              {t("common:actions.reset")}
            </Button>
          </div>
        )}
      </ItemContent>
    </Item>
  );
}
