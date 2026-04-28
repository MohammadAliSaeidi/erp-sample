import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvailableTab } from '@/lib/tabs/types';
import { Badge } from '@/components/ui/badge';

interface ShadcnTabNavigationProps<TTab extends string, TProps extends Record<string, unknown>> {
  tabs: AvailableTab<TTab, TProps>[];
  activeTab: TTab;
  onTabChange: (value: TTab) => void;
  ariaLabel?: string;
}

export function ShadcnTabNavigation<TTab extends string, TProps extends Record<string, unknown>>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel = 'Navigation tabs',
}: ShadcnTabNavigationProps<TTab, TProps>) {
  return (
    <TabsList aria-label={ariaLabel}>
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          disabled={tab.disabled}
          onClick={() => onTabChange(tab.value)}
          data-state={activeTab === tab.value ? 'active' : 'inactive'}
        >
          {tab.icon}
          {tab.label}
          {tab.badge && (
            <Badge variant="secondary" className="ml-2">
              {tab.badge}
            </Badge>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}