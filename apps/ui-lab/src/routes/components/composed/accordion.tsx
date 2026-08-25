import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { accordionSpecimen } from '@ll-ui/react/specimens';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ll-ui/react/components';

/**
 * Companion showcase for the `type="multiple"` mode. The prop-driven single-open
 * FAQ is rendered by {@link SpecimenPage}; this block lets several panels stay open
 * at once, which the single-component specimen cannot express.
 */
const MultipleExample = () => (
  <div className="flex flex-col gap-4 px-8 pb-12">
    <div>
      <h2 className="text-lg font-bold text-(--ui-foreground)">Multiple open</h2>
      <p className="mt-1 text-sm text-(--ui-text-subtle)">
        Pass <code>type=&quot;multiple&quot;</code> to let more than one section stay expanded.
      </p>
    </div>
    <Accordion type="multiple" defaultValue={['overview', 'billing']} className="w-full max-w-xl">
      <AccordionItem value="overview">
        <AccordionTrigger>Account overview</AccordionTrigger>
        <AccordionContent>Your plan, usage, and renewal date at a glance.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing &amp; invoices</AccordionTrigger>
        <AccordionContent>Download past invoices or update your payment method.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="security">
        <AccordionTrigger>Security</AccordionTrigger>
        <AccordionContent>Manage two-factor authentication and active sessions.</AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export const Route = createFileRoute('/components/composed/accordion')({
  component: () => (
    <>
      <SpecimenPage specimen={accordionSpecimen} />
      <MultipleExample />
    </>
  ),
});
