import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Users,
  Layers,
  ShoppingCart,
  LogOut,
  ShieldCheck,
  ChevronsUpDown,
  Home,
  BadgeCheck,
  Bell,
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
} from "@/components/ui";
import { authSelector } from "@/features/auth/auth.selectors";
import { logoutThunk } from "@/features/auth/auth.thunks";
import { toast } from "sonner";
import { getFallbackName } from "@/lib/utils";
import { APP_NAME } from "@/lib/config";

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
    key: "services",
    to: "/admin/services",
    icon: Layers,
    labelKey: "admin:nav.services",
  },
  {
    key: "commandes",
    to: "/admin/commandes",
    icon: ShoppingCart,
    labelKey: "admin:nav.commandes",
  },
];

/**
 * Layout principal de l'espace d'administration avec sidebar complete
 */
export function AdminLayout() {
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
  // Dispatch du thunk de logout et gestion des notifications
  const logout = async () => {
    try {
      // Appeler le thunk de logout pour deconnecter l'utilisateur
      const { code } = await dispatch(logoutThunk()).unwrap();
      // Notifier la deconnexion reussie
      toast.success(t(`codes:${code}`));
    } catch ({ code }) {
      // Notifier l'erreur de deconnexion
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/admin">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{APP_NAME}</span>
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
                  ({ key, to, icon: Icon, labelKey, exact }) => (
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
                  ),
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
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive"
                  >
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
        <header className="flex items-center gap-2 border-b px-4 py-3">
          <SidebarTrigger />
          <SidebarSeparator orientation="vertical" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("admin:title")}
          </span>
        </header>
        <main className="flex flex-col flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
