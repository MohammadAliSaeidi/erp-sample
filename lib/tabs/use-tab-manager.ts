import { useState, useCallback, useMemo } from 'react';
import { TabConfig, AvailableTab } from './types';

function resolveConfigValue<T, TProps extends Record<string, unknown>>(
  value: T | ((props: TProps) => T) | undefined,
  props: TProps,
  defaultValue: T,
): T {
  if (value === undefined) return defaultValue;
  if (typeof value === 'function') {
    return (value as (props: TProps) => T)(props);
  }
  return value;
}

export interface TabManagerOptions<TTab extends string, TProps extends Record<string, unknown>> {
  tabs: Record<TTab, TabConfig<TTab, TProps>>;
  defaultTab: TTab;
  onTabChange?: (tab: TTab, props: TProps) => void;
}

export function useTabManager<TTab extends string, TProps extends Record<string, unknown>>(
  options: TabManagerOptions<TTab, TProps>,
  props: TProps,
) {
  const { tabs, defaultTab, onTabChange } = options;

  const [activeTab, setActiveTab] = useState<TTab>(defaultTab);

  const availableTabs = useMemo((): AvailableTab<TTab, TProps>[] => {
    return (Object.entries(tabs) as [TTab, TabConfig<TTab, TProps>][])
      .filter(([, config]) => !resolveConfigValue(config.hidden, props, false))
      .map(([value, config]) => ({
        value,
        label: config.label,
        icon: config.icon,
        disabled: resolveConfigValue(config.disabled, props, false),
        hidden: resolveConfigValue(config.hidden, props, false),
        badge: resolveConfigValue(config.badge, props, '' as string) || undefined,
        component: config.component,
      }));
  }, [tabs, props]);

  const changeTab = useCallback(
    (tab: TTab) => {
      const tabConfig = availableTabs.find(t => t.value === tab);
      if (tabConfig && !tabConfig.disabled) {
        setActiveTab(tab);
        onTabChange?.(tab, props);
      }
    },
    [availableTabs, onTabChange, props],
  );

  const ActiveComponent = useMemo(
    (): React.ComponentType<TProps> | null => tabs[activeTab]?.component ?? null,
    [activeTab, tabs],
  );

  return {
    activeTab,
    availableTabs,
    changeTab,
    ActiveComponent,
    tabConfig: tabs[activeTab], // current config
  };
}