import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { tabsSpecimen } from '@ll-ui/react/specimens';
import { TabsNav, TabsNavLink } from '@ll-ui/react/components';

/**
 * Companion showcase for the navigation surface. The prop-driven panel demo is
 * rendered by {@link SpecimenPage}; this block shows the link-based `TabsNav`,
 * which the specimen system cannot drive (it renders a single component).
 */
const NavExample = () => (
  <div className="flex flex-col gap-4 px-8 pb-12">
    <div>
      <h2 className="text-lg font-bold text-(--ui-foreground)">Navigation tabs</h2>
      <p className="mt-1 text-sm text-(--ui-text-subtle)">
        Link tabs render a nav landmark with aria-current rather than a tablist. Pass a router link
        via asChild; here they are plain anchors.
      </p>
    </div>
    <TabsNav aria-label="Profile sections">
      <TabsNavLink active href="#profile">
        Profile
      </TabsNavLink>
      <TabsNavLink href="#posts" count={12}>
        Posts
      </TabsNavLink>
      <TabsNavLink href="#saved">Saved</TabsNavLink>
    </TabsNav>
  </div>
);

export const Route = createFileRoute('/components/composed/tabs')({
  component: () => (
    <>
      <SpecimenPage specimen={tabsSpecimen} />
      <NavExample />
    </>
  ),
});
