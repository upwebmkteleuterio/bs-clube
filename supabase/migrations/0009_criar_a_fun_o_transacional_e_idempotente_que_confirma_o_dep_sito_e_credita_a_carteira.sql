CREATE OR REPLACE FUNCTION public.settle_deposit(
  p_provider text,
  p_external_id text,
  p_amount_cents bigint,
  p_status text,
  p_paid_at timestamp with time zone DEFAULT NULL,
  p_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_payment public.payments;
  v_wallet public.wallet_accounts;
  v_expected_cents bigint;
  v_amount numeric(14,2);
BEGIN
  IF p_provider IS NULL OR p_external_id IS NULL OR p_status IS NULL THEN
    RAISE EXCEPTION 'Dados de liquidação incompletos';
  END IF;

  IF p_status NOT IN ('paid', 'canceled') THEN
    RAISE EXCEPTION 'Status de liquidação inválido';
  END IF;

  SELECT * INTO v_payment
  FROM public.payments
  WHERE provider = p_provider AND external_id = p_external_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'unknown_charge', 'external_id', p_external_id);
  END IF;

  IF v_payment.kind <> 'deposit' THEN
    RETURN jsonb_build_object('status', 'ignored', 'reason', 'not_a_deposit', 'payment_id', v_payment.id);
  END IF;

  IF p_status = 'canceled' THEN
    IF v_payment.status = 'pending' THEN
      UPDATE public.payments
      SET status = 'canceled', provider_status = 'canceled'
      WHERE id = v_payment.id;
    END IF;
    RETURN jsonb_build_object('status', 'canceled', 'payment_id', v_payment.id);
  END IF;

  IF v_payment.status = 'confirmed' THEN
    RETURN jsonb_build_object('status', 'already_confirmed', 'payment_id', v_payment.id);
  END IF;

  IF v_payment.status <> 'pending' THEN
    RETURN jsonb_build_object('status', 'ignored', 'reason', 'not_pending', 'payment_id', v_payment.id);
  END IF;

  v_expected_cents := round(v_payment.amount * 100)::bigint;

  IF p_amount_cents IS DISTINCT FROM v_expected_cents THEN
    UPDATE public.payments SET provider_status = 'paid' WHERE id = v_payment.id;
    RETURN jsonb_build_object(
      'status', 'amount_mismatch',
      'payment_id', v_payment.id,
      'expected_cents', v_expected_cents,
      'received_cents', p_amount_cents
    );
  END IF;

  v_amount := v_payment.amount;

  SELECT * INTO v_wallet
  FROM public.wallet_accounts
  WHERE user_id = v_payment.user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.wallet_accounts (user_id) VALUES (v_payment.user_id)
    RETURNING * INTO v_wallet;
  END IF;

  UPDATE public.wallet_accounts
  SET total = total + v_amount, withdrawable = withdrawable + v_amount
  WHERE user_id = v_payment.user_id;

  INSERT INTO public.wallet_ledger (
    user_id, entry_type, amount, balance_before, balance_after,
    withdrawable_before, withdrawable_after, reference_id, idempotency_key, metadata, status
  )
  VALUES (
    v_payment.user_id, 'deposit', v_amount, v_wallet.total, v_wallet.total + v_amount,
    v_wallet.withdrawable, v_wallet.withdrawable + v_amount, v_payment.id,
    concat('deposit:', v_payment.id::text),
    jsonb_build_object('provider', p_provider, 'external_id', p_external_id, 'title', 'Depósito Pix'),
    'success'
  )
  ON CONFLICT (idempotency_key) DO NOTHING;

  UPDATE public.payments
  SET status = 'confirmed',
      provider_status = 'paid',
      paid_at = COALESCE(p_paid_at, now()),
      metadata = COALESCE(metadata, '{}'::jsonb) || COALESCE(p_payload, '{}'::jsonb)
  WHERE id = v_payment.id;

  RETURN jsonb_build_object(
    'status', 'credited',
    'payment_id', v_payment.id,
    'user_id', v_payment.user_id,
    'amount', v_amount
  );
END;
$function$;