export interface TabConfig<TTab extends string, TProps extends Record<string, unknown>> {
  value: TTab;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean | ((props: TProps) => boolean);
  hidden?: boolean | ((props: TProps) => boolean);
  badge?: string | ((props: TProps) => string);
  component: React.ComponentType<TProps>;
}

export interface AvailableTab<TTab extends string, TProps extends Record<string, unknown>>
  extends Omit<TabConfig<TTab, TProps>, 'disabled' | 'hidden' | 'badge'> {
  disabled: boolean;
  hidden: boolean;
  badge?: string;
}