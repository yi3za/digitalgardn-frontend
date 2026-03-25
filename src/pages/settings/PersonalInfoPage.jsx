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
  Input,
} from "@/components/ui";
import { authSelector } from "@/features/auth/auth.selectors";
import { Fragment, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// Etat initial pour la gestion de l'edition des champs
const initialState = (user) => ({
  name: { edit: false, value: user?.name ?? "" },
  username: { edit: false, value: user?.username ?? "" },
  email: { edit: false, value: user?.email ?? "" },
});

// Reducer pour la gestion de l'etat d'edition des champs
const reducer = (state, { type, payload }) => {
  switch (type) {
    case "ACTIVATE_EDIT":
      return {
        ...state,
        [payload.field]: {
          ...state[payload.field],
          edit: true,
        },
      };
    case "FIELD_CHANGE":
      return {
        ...state,
        [payload.field]: {
          ...state[payload.field],
          value: payload.value,
        },
      };
    case "RESET_FIELD":
      return {
        ...state,
        [payload.field]: {
          edit: false,
          value: payload.value,
        },
      };
    default:
      return state;
  }
};

/**
 * Page de gestion des informations personnelles de l'utilisateur
 */
export function PersonalInfoPage() {
  // Hook de traduction
  const { t } = useTranslation("settings");
  // Recuperation des informations de l'utilisateur
  const { user } = useSelector(authSelector);
  // Etat local pour la gestion de l'edition des champs
  const [state, dispatch] = useReducer(reducer, user, initialState);

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
                  {state[field]?.edit ? (
                    <>
                      <Input
                        className="my-3"
                        value={state[field]?.value}
                        onChange={(e) =>
                          dispatch({
                            type: "FIELD_CHANGE",
                            payload: { field, value: e.target.value },
                          })
                        }
                      />
                      <Button
                        className="w-fit"
                        disabled={state[field]?.value === user?.[field]}
                      >
                        {t("action.save", { field })}
                      </Button>
                    </>
                  ) : (
                    <ItemDescription>
                      {field === "username" && "@"}
                      {user?.[field] ?? ""}
                    </ItemDescription>
                  )}
                </ItemContent>
                <ItemActions className="self-start">
                  <Button
                    variant="link"
                    className="pt-0 h-fit"
                    onClick={() =>
                      dispatch(
                        state[field]?.edit
                          ? {
                              type: "RESET_FIELD",
                              payload: { field, value: user?.[field] },
                            }
                          : {
                              type: "ACTIVATE_EDIT",
                              payload: { field },
                            },
                      )
                    }
                  >
                    {t(state[field]?.edit ? "action.cancel" : "action.edit")}
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
