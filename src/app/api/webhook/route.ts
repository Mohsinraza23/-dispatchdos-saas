import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLAN_BY_PRICE: Record<string, string> = {
  [process.env.STRIPE_STARTER_PRICE_ID!]: 'starter',
  [process.env.STRIPE_PRO_PRICE_ID!]: 'pro',
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    const plan = session.metadata?.plan

    if (userId && plan) {
      await supabase
        .from('profiles')
        .update({ plan, lookups_used_this_month: 0 })
        .eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const priceId = sub.items.data[0]?.price.id
    const customerId = sub.customer as string

    // Find user by stripe customer — look up via checkout sessions
    // Downgrade to free on cancellation
    const sessions = await stripe.checkout.sessions.list({ customer: customerId, limit: 1 })
    const userId = sessions.data[0]?.metadata?.user_id
    if (userId) {
      await supabase
        .from('profiles')
        .update({ plan: 'free' })
        .eq('id', userId)
    }
  }

  return NextResponse.json({ received: true })
}
