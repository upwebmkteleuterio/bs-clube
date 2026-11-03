CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  provider text DEFAULT 'pushinpay' NOT NULL,
  event_key text NOT NULL,
  resource_id text NOT NULL,
  event_type text NOT NULL,
  provider_status text NOT NULL,
  amount_cents bigint,
  payload jsonb DEFAULT '{}'::jsonb NOT NULL,
  signature_valid boolean DEFAULT false NOT NULL,
  processed_at timestamp with time zone,
  processing_error text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);