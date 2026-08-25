import Stripe from 'stripe';
import { supabase } from './supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Get pricing for a country
export async function getCountryPricing(countryCode: string) {
  const { data, error } = await supabase
    .from('country_pricing')
    .select('*')
    .eq('country_code', countryCode)
    .eq('active', true)
    .single();

  if (error) throw error;
  return data;
}

// Create payment intent for Stripe
export async function createPaymentIntent(
  userId: string,
  amount: number,
  currency: string,
  description: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency.toLowerCase(),
    description,
    metadata: {
      userId,
    },
  });

  return paymentIntent;
}

// Confirm payment
export async function confirmPayment(
  paymentIntentId: string,
  paymentMethodId: string
) {
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethodId,
  });

  return paymentIntent;
}

// Save payment to database
export async function savePayment(
  userId: string,
  subscriptionId: string,
  transactionId: string,
  amount: number,
  currency: string,
  status: 'completed' | 'failed' | 'pending'
) {
  const { data, error } = await supabase.from('payments').insert([
    {
      user_id: userId,
      subscription_id: subscriptionId,
      gateway: 'stripe',
      amount,
      currency,
      status,
      transaction_id: transactionId,
      payment_date: new Date().toISOString(),
    },
  ]);

  if (error) throw error;
  return data;
}

// Get payment methods for user
export async function getUserPaymentMethods(userId: string) {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// Delete payment method
export async function deletePaymentMethod(paymentMethodId: string) {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', paymentMethodId);

  if (error) throw error;
}
