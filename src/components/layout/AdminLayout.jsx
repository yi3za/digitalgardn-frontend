import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Users,
  Layers,
  ShoppingCart,
  LogOut,
  ChevronsUpDown,
  BadgeCheck,
  Bell,
  Wallet,
  Star,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui";
import { authSelector } from "@/features/auth/auth.selectors";
import { logoutThunk } from "@/features/auth/auth.thunks";
import { toast } from "sonner";
import { getFallbackName } from "@/lib/utils";
import { APP_NAME } from "@/lib/config";
import { NavigationContext, ADMIN_PATHS } from "@/contexts/NavigationContext";
import { LanguageToggle } from "../shared/LanguageToggle";
import { ThemeToggle } from "../shared/ThemeToggle";
import { BackButton } from "../shared/BackButton";
import { ScrollToTop } from "../feedback/scroll-to-top";
import logo from "@/assets/logo.png";
import { useQueryClient } from "@tanstack/react-query";
import { resetCommandes } from "@/features/notifications/notificationsSlice";

// Navigation principale de l'espace admin
const ADMIN_NAV_ITEMS = [
  {
    key: "dashboard",
    to: "/admin",
    icon: LayoutDashboard,
    labelKey: "admin:nav.dashboard",
    exact: true,
  },
  {
    key: "users",
    to: "/admin/users",
    icon: Users,
    labelKey: "admin:nav.users",
  },
  {
    key: "catalog",
    icon: Layers,
    labelKey: "admin:nav.catalog",
    children: [
      {
        key: "services",
        to: "/admin/services",
        labelKey: "admin:nav.services",
      },
      {
        key: "categories",
        to: "/admin/categories",
        labelKey: "admin:nav.categories",
      },
      {
        key: "competences",
        to: "/admin/competences",
        labelKey: "admin:nav.competences",
      },
      {
        key: "langues",
        to: "/admin/langues",
        labelKey: "admin:nav.langues",
      },
    ],
  },
  {
    key: "commandes",
    to: "/admin/commandes",
    icon: ShoppingCart,
    labelKey: "admin:nav.commandes",
  },
  {
    key: "finance",
    icon: Wallet,
    labelKey: "admin:nav.finance",
    children: [
      {
        key: "portefeuilles",
        to: "/admin/portefeuilles",
        labelKey: "admin:nav.portefeuilles",
      },
      {
        key: "transactions",
        to: "/admin/transactions",
        labelKey: "admin:nav.transactions",
      },
    ],
  },
  {
    key: "avis",
    to: "/admin/avis",
    icon: Star,
    labelKey: "admin:nav.avis",
  },
];

/**
 * Layout principal de l'espace d'administration avec sidebar complete
 */
export function AdminLayout() {
  // Recupere queryClient
  const queryClient = useQueryClient();
  // Traduction
  const { t } = useTranslation(["admin", "codes"]);
  // Recuperation de l'utilisateur connecte
  const { user } = useSelector(authSelector);
  // Dispatcher pour les actions redux
  const dispatch = useDispatch();
  // Recuperation de la location actuelle
  const location = useLocation();
  // Generation du nom fallback pour l'avatar
  const avatarFallback = getFallbackName(user?.name);
  // Generation du nom fallback pour l'avatar de l'application
  const AppFallback = getFallbackName(APP_NAME);
  // Separation du nom de l'application en deux parties pour styliser la seconde partie
  const [prefix, suffix] = [APP_NAME.slice(0, 7), APP_NAME.slice(7)];
  // Determiner si la page courante fait partie de l'espace admin pour afficher le bouton de retour dans le header
  const showBackButton = location.pathname !== "/admin";
  // Dispatch du thunk de logout et gestion des notifications
  const logout = async () => {
    try {
      // Appeler le thunk de logout pour deconnecter l'utilisateur
      const { code } = await dispatch(logoutThunk()).unwrap();
      // Netoyage le cache des donnees
      queryClient.clear();
      // Initial le count de les commandes a 0
      dispatch(resetCommandes());
      // Notifier la deconnexion reussie
      toast.success(t(`codes:${code}`));
    } catch ({ code }) {
      // Notifier l'erreur de deconnexion
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <NavigationContext.Provider value={ADMIN_PATHS}>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link to="/admin">
                    <Avatar>
                      <AvatarImage src={logo} alt={APP_NAME} title={APP_NAME} />
                      <AvatarFallback className="rounded-lg">
                        {AppFallback}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {prefix}
                        <span className="text-primary">{suffix}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t("admin:title")}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t("admin:nav.label")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ADMIN_NAV_ITEMS.map(
                    ({ key, to, icon: Icon, labelKey, exact, children }) => {
                      if (children) {
                        const isAnyChildActive = children.some(
                          ({ to: childTo }) =>
                            location.pathname.startsWith(childTo),
                        );
                        return (
                          <Collapsible
                            key={key}
                            defaultOpen={isAnyChildActive}
                            className="group/collapsible"
                          >
                            <SidebarMenuItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                  tooltip={t(labelKey)}
                                  isActive={isAnyChildActive}
                                >
                                  <Icon />
                                  <span>{t(labelKey)}</span>
                                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {children.map(
                                    ({
                                      key: childKey,
                                      to: childTo,
                                      labelKey: childLabelKey,
                                    }) => (
                                      <SidebarMenuSubItem key={childKey}>
                                        <SidebarMenuSubButton
                                          asChild
                                          isActive={location.pathname.startsWith(
                                            childTo,
                                          )}
                                        >
                                          <Link to={childTo}>
                                            <span>{t(childLabelKey)}</span>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    ),
                                  )}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuItem>
                          </Collapsible>
                        );
                      }
                      return (
                        <SidebarMenuItem key={key}>
                          <SidebarMenuButton
                            asChild
                            tooltip={t(labelKey)}
                            isActive={
                              exact
                                ? location.pathname === to
                                : location.pathname.startsWith(to)
                            }
                          >
                            <Link to={to}>
                              <Icon />
                              <span>{t(labelKey)}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    },
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <SidebarMenuButton size="lg">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage
                          src={user?.avatar_url}
                          alt={user?.username}
                          title={user?.username}
                        />
                        <AvatarFallback className="rounded-lg">
                          {avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user?.email}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={4}>
                    <DropdownMenuLabel>
                      <div className="flex items-center gap-2 p-1">
                        <Avatar className="size-8 rounded-lg">
                          <AvatarImage
                            src={user?.avatar_url}
                            alt={user?.username}
                            title={user?.username}
                          />
                          <AvatarFallback className="rounded-lg">
                            {avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user?.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/profil">
                          <BadgeCheck />
                          {t("admin:nav.account")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/settings">
                          <Bell />
                          {t("admin:nav.settings")}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} variant="destructive">
                      <LogOut className="text-destructive" />
                      {t("admin:nav.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <ScrollToTop />
          <header className="flex items-center gap-2 border-b px-4 py-3">
            <SidebarTrigger />
            <SidebarSeparator orientation="vertical" />
            {showBackButton && <BackButton />}
            <span className="text-sm font-medium text-muted-foreground">
              {t("admin:title")}
            </span>
            <div className="w-full flex justify-end items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </header>
          <main className="flex flex-col flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </NavigationContext.Provider>
  );
}
