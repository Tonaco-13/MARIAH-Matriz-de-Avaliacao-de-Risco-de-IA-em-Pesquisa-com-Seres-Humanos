import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Wrappers de navegação cientes do roteamento i18n. Disponíveis para uso
 * progressivo nos componentes (Passo 4+); com localePrefix "as-needed" e
 * pt-BR padrão, produzem as mesmas URLs sem prefixo já usadas hoje.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
