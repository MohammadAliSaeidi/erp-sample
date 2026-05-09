export function defineFilterSpec<TFilter extends object, TWhere extends object>() {
  return <TSpec extends FilterSpec<TFilter, TWhere>>(spec: TSpec) => spec;
}
