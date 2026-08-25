import type { FileRoutesByTo } from './routeTree.gen';

export type NavItem = {
  label: string;
  // Typed against the generated route tree so a renamed or deleted route makes
  // every stale nav entry a compile error instead of a dead link.
  path: keyof FileRoutesByTo;
  children?: NavItem[];
};

export const nav: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Brand Guidelines', path: '/brand-guidelines' },
  { label: 'Playground', path: '/playground' },
  {
    label: 'Components',
    path: '/components',
    children: [
      {
        label: 'Primitives',
        path: '/components/primitives',
        children: [
          { label: 'Input', path: '/components/primitives/input' },
          { label: 'Button', path: '/components/primitives/button' },
          { label: 'Checkbox', path: '/components/primitives/checkbox' },
          { label: 'Switch', path: '/components/primitives/switch' },
          { label: 'Radio', path: '/components/primitives/radio' },
          { label: 'Select', path: '/components/primitives/select' },
          { label: 'Slider', path: '/components/primitives/slider' },
          { label: 'Textarea', path: '/components/primitives/textarea' },
          { label: 'Badge', path: '/components/primitives/badge' },
          { label: 'CountBadge', path: '/components/primitives/count-badge' },
          { label: 'StatusDot', path: '/components/primitives/status-dot' },
          { label: 'ProgressBar', path: '/components/primitives/progress-bar' },
          { label: 'Bars', path: '/components/primitives/bars' },
          { label: 'VerifiedBadge', path: '/components/primitives/verified-badge' },
          { label: 'Heading', path: '/components/primitives/heading' },
          { label: 'Display', path: '/components/primitives/display' },
          { label: 'Text', path: '/components/primitives/text' },
          { label: 'Divider', path: '/components/primitives/divider' },
          { label: 'Box', path: '/components/primitives/box' },
          { label: 'Stack', path: '/components/primitives/stack' },
          { label: 'Row', path: '/components/primitives/row' },
          { label: 'Grid', path: '/components/primitives/grid' },
          { label: 'List', path: '/components/primitives/list' },
          { label: 'Table', path: '/components/primitives/table' },
        ],
      },
      {
        label: 'Composed',
        path: '/components/composed',
        children: [
          { label: 'Accordion', path: '/components/composed/accordion' },
          { label: 'ActionModal', path: '/components/composed/action-modal' },
          { label: 'Banner', path: '/components/composed/banner' },
          { label: 'Callout', path: '/components/composed/callout' },
          { label: 'Dialog', path: '/components/composed/dialog' },
          { label: 'Drawer', path: '/components/composed/drawer' },
          { label: 'DropDown', path: '/components/composed/dropdown' },
          { label: 'FileUpload', path: '/components/composed/file-upload' },
          { label: 'HoverCard', path: '/components/composed/hover-card' },
          { label: 'MessageBubble', path: '/components/composed/message-bubble' },
          { label: 'MetricInput', path: '/components/composed/metric-input' },
          { label: 'PasswordStrengthMeter', path: '/components/composed/password-strength-meter' },
          { label: 'Popover', path: '/components/composed/popover' },
          { label: 'ScrollArea', path: '/components/composed/scroll-area' },
          { label: 'Tabs', path: '/components/composed/tabs' },
          { label: 'Toast', path: '/components/composed/toast' },
          { label: 'Tooltip', path: '/components/composed/tooltip' },
        ],
      },
      {
        label: 'Integrations',
        path: '/components/integrations',
        children: [{ label: 'DataTable', path: '/components/integrations/data-table' }],
      },
      { label: 'Icons', path: '/components/icons' },
    ],
  },
  { label: 'Forms', path: '/forms' },
  { label: 'Providers', path: '/providers' },
  { label: 'Hooks', path: '/hooks' },
  { label: 'Libs', path: '/libs' },
];
