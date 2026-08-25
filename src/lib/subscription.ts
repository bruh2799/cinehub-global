import { supabase } from './supabase';
import { Subscription } from '@/types';

// Get user's active subscription
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(
      `
      *,
      subscription_plans(*)
    `
    )
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

// Get all subscription plans
export async function getSubscriptionPlans() {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('duration_months', { ascending: true });

  if (error) throw error;
  return data;
}

// Create subscription
export async function createSubscription(
  userId: string,
  planId: string,
  durationMonths: number
) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + durationMonths);

  const nextBillingDate = new Date(endDate);

  const { data, error } = await supabase.from('subscriptions').insert([
    {
      user_id: userId,
      plan_id: planId,
      status: 'active',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      next_billing_date: nextBillingDate.toISOString(),
      auto_renew: true,
    },
  ]);

  if (error) throw error;
  return data;
}

// Update subscription status
export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: 'active' | 'paused' | 'cancelled' | 'expired'
) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', subscriptionId);

  if (error) throw error;
  return data;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  return updateSubscriptionStatus(subscriptionId, 'cancelled');
}

// Pause subscription
export async function pauseSubscription(subscriptionId: string) {
  return updateSubscriptionStatus(subscriptionId, 'paused');
}

// Resume subscription
export async function resumeSubscription(subscriptionId: string) {
  return updateSubscriptionStatus(subscriptionId, 'active');
}

// Get subscription history for user
export async function getSubscriptionHistory(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(
      `
      *,
      subscription_plans(*)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Check if subscription is active
export async function isSubscriptionActive(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;

  const now = new Date();
  const endDate = new Date(subscription.end_date);

  return subscription.status === 'active' && now < endDate;
}

// Get remaining days in subscription
export async function getSubscriptionRemainingDays(userId: string) {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return 0;

  const now = new Date();
  const endDate = new Date(subscription.end_date);
  const diffMs = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}
