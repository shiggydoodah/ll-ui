import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import {
  BannerStack,
  DEFAULT_DISMISSED_BANNERS_KEY,
  NotificationProvider,
  notify,
  useNotifications,
} from '@ll-ui/react';
import type { GlobalBannerData } from '@ll-ui/react';
import { Button } from '@ll-ui/react/primitives';

const demoBanners: GlobalBannerData[] = [
  {
    id: 'demo-maintenance',
    tone: 'amber',
    title: 'Scheduled maintenance',
    message: 'The site will be unavailable on 12/06 at 22:00 UTC.',
  },
  {
    id: 'demo-outage',
    tone: 'red',
    variant: 'solid',
    title: 'Server issues',
    message: 'We are currently investigating elevated error rates.',
  },
  {
    id: 'demo-info',
    tone: 'blue',
    title: 'New feature',
    message: 'Profiles now support custom avatars.',
  },
  {
    id: 'demo-promo',
    tone: 'purple',
    title: '14-day free trial',
    message: 'Only this weekend — upgrade and try every premium feature.',
    action: (
      <Button size="small" tone="purple" variant="solid">
        Start trial
      </Button>
    ),
  },
  {
    id: 'demo-locked',
    tone: 'neutral',
    title: 'Read-only notice',
    message: 'This banner is not dismissible and always shows.',
    dismissible: false,
  },
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="font-display text-lg font-bold">{title}</h2>
    {children}
  </section>
);

// BannerStack is presentational, so read the active banners + dismiss callback
// from the provider context and pass them in.
const DemoBanners = () => {
  const { banners, dismissBanner } = useNotifications();
  return <BannerStack banners={banners} onDismiss={dismissBanner} />;
};

const ProvidersDemo = () => {
  // Re-mounting the provider re-reads the storage adapter, so clearing the
  // persisted dismissals and bumping this key brings every banner back.
  const [resetKey, setResetKey] = useState(0);

  const resetDismissed = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DEFAULT_DISMISSED_BANNERS_KEY);
    }
    setResetKey((key) => key + 1);
  };

  return (
    <NotificationProvider key={resetKey} banners={demoBanners}>
      <div className="flex flex-col gap-8 p-8">
        <header className="flex flex-col gap-2">
          {/* Titled "Providers" to match the nav entry and the /providers path. */}
          <h1 className="text-2xl font-bold">Providers</h1>
          <p className="text-sm text-(--ui-text-subtle)">
            Global banners (admin-set, dismissed-by-id and persisted) and Sonner-based toasts, all
            driven by a single <code>NotificationProvider</code>.
          </p>
        </header>

        <Section title="Global banners">
          <p className="text-sm text-(--ui-text-subtle)">
            Dismissals persist in <code>localStorage</code> — refresh the page and they stay hidden.
            Use reset to bring them back.
          </p>
          <DemoBanners />
          <div>
            <Button size="small" tone="neutral" variant="outline" onClick={resetDismissed}>
              Reset dismissed banners
            </Button>
          </div>
        </Section>

        <Section title="Toasts">
          <p className="text-sm text-(--ui-text-subtle)">
            Fire toasts imperatively via <code>notify</code>. Auto-dismiss takes seconds; pass{' '}
            <code>Infinity</code> for manual-only.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="small" tone="green" onClick={() => notify.success('Profile updated')}>
              Success
            </Button>
            <Button
              size="small"
              tone="red"
              onClick={() => notify.error('Update failed', { description: 'Please try again.' })}
            >
              Error (failed update)
            </Button>
            <Button
              size="small"
              tone="blue"
              onClick={() =>
                notify.info('New message from Alex', { description: 'Hey, are you around?' })
              }
            >
              Info (new DM)
            </Button>
            <Button
              size="small"
              tone="amber"
              onClick={() =>
                notify.warning('Heads up', { description: 'Your session expires soon.' })
              }
            >
              Warning
            </Button>
            <Button
              size="small"
              tone="neutral"
              variant="outline"
              onClick={() => notify.message('Disappears in 3 seconds', { duration: 3 })}
            >
              Auto-dismiss (3s)
            </Button>
            <Button
              size="small"
              tone="neutral"
              variant="outline"
              onClick={() =>
                notify.info('Manual dismiss only', {
                  description: 'Stays until you close it.',
                  duration: Infinity,
                })
              }
            >
              Manual-only (∞)
            </Button>
          </div>
        </Section>
      </div>
    </NotificationProvider>
  );
};

export const Route = createFileRoute('/providers')({
  component: ProvidersDemo,
});
