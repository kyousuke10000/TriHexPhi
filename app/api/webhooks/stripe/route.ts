import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { getServiceClient } from '@/lib/supabase/client';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  const supabase = getServiceClient();

  // Idempotency check
  const { data: existing } = await supabase
    .from('events')
    .select('id')
    .eq('payload->>event_id', event.id)
    .maybeSingle();

  if (existing) {
    console.log(`Event ${event.id} already processed`);
    return NextResponse.json({ received: true });
  }

  // Log event
  await supabase.from('events').insert({
    actor: 'webhook',
    kind: 'webhook',
    payload: {
      event_id: event.id,
      type: event.type,
      data: event.data.object,
    },
  });

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // Handle checkout completion
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      // Handle subscription changes
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}





