import { Eye, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui";

/**
 * Composant de la page de profil
 * Affiche les informations de l'utilisateur
 */
export function ProfilViewItem({
  t,
  activeSheet,
  closeSheet,
  setActiveSheet,
  user,
  avatarFallback,
  user_name,
  date_incription,
  SHEET,
}) {
  return (
    <Item className="px-0">
      <ItemContent>
        <ItemTitle>{t("voirInfo.title")}</ItemTitle>
        <ItemDescription>{t("voirInfo.description")}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Sheet
          showCloseButton={false}
          open={activeSheet === SHEET.PROFIL.SHOW}
          onOpenChange={(open) => !open && closeSheet()}
        >
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="shadow-none"
              onClick={() => setActiveSheet(SHEET.PROFIL.SHOW)}
            >
              <Eye />
              {t("voirInfo.action")}
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-x-auto">
            <SheetHeader>
              <SheetTitle>{t("voirInfo.sheet.title")}</SheetTitle>
              <SheetDescription>
                {t("voirInfo.sheet.description")}
              </SheetDescription>
            </SheetHeader>
            <Separator />
            <ItemGroup className="px-4">
              <Item className="mb-4">
                <ItemHeader className="justify-center">
                  <Avatar className="size-30">
                    <AvatarImage src={user?.avatar_url} alt={user?.username} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                </ItemHeader>
                <ItemContent className="items-center">
                  <ItemTitle>{user_name}</ItemTitle>
                  <ItemDescription>{"@" + user?.username}</ItemDescription>
                </ItemContent>
              </Item>
              <ItemSeparator />
              <Item>
                <ItemMedia>
                  <User className="text-muted-foreground" size={16} />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>
                    {t("meta.joined", { date: date_incription })}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">{t("actions.close")}</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </ItemActions>
    </Item>
  );
}
