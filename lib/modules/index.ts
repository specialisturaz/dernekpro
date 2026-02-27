export { MODULE_REGISTRY, MENU_GROUP_ORDER, CATEGORY_LABELS } from "./registry";
export type { ModuleDefinition, ModuleMenuItem, ModuleNavItem, ModuleCategory } from "./registry";
export {
  getActiveModuleCodes,
  getActiveModules,
  isModuleActive,
  checkDependencies,
  getModulesByCategory,
  getAdminNavGroups,
} from "./utils";
