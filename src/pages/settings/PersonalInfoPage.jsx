import {
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  CardContent,
  ItemGroup,
  Item,
  ItemTitle,
  ItemDescription,
  ItemContent,
  ItemActions,
  ItemSeparator,
} from "@/components/ui";
import { authSelector } from "@/features/auth/auth.selectors";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

/**
 * Page de gestion des informations personnelles de l'utilisateur
 */
export function PersonalInfoPage() {
  // Hook de traduction
  const { t } = useTranslation("settings");
  // Recuperation des informations de l'utilisateur
  const { user } = useSelector(authSelector);

  return (
    <>
      <CardHeader>
        <CardTitle>{t("items.personal_info.title")}</CardTitle>
        <CardDescription>
          {t("items.personal_info.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {["name", "username", "email"].map((field, index, array) => (
            <Fragment key={field}>
              <Item>
                <ItemContent>
                  <ItemTitle>
                    {t(`items.personal_info.fields.labels.${field}`)}
                  </ItemTitle>
                  <ItemDescription>{user?.[field]}</ItemDescription>
                </ItemContent>
                <ItemActions className="self-start">
                  <Button variant="link" className="pt-0 h-fit">
                    {t("action.edit")}
                  </Button>
                </ItemActions>
              </Item>
              {index !== array.length - 1 && <ItemSeparator />}
            </Fragment>
          ))}
        </ItemGroup>
      </CardContent>
    </>
  );
}
