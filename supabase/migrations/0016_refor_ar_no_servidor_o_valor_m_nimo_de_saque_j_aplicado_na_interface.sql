CREATE OR REPLACE FUNCTION public.request_withdrawal(p_amount numeric, p_pix_key_type text, p_pix_key text)
RETURNS public.withdrawals
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_wallet public.wallet_accounts;
  v_withdrawal public.withdrawals;
  v_amount numeric := round(p_amount, 2);
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  IF v_amount IS NULL OR v_amount <= 0 THEN
    RAISE EXCEPTION 'Valor de saque inválido';
  END IF;

  IF v_amount < 10 THEN
    RAISE EXCEPTION 'O valor mínimo para saque é R$ 10,00';
  END IF;

  IF p_pix_key_type IS NULL OR char_length(trim(p_pix_key_type)) = 0 OR char_length(trim(p_pix_key_type)) > 30 THEN
    RAISE EXCEPTION 'Tipo de chave Pix inválido';
  END IF;

  IF p_pix_key IS NULL OR char_length(trim(p_pix_key)) = 0 OR char_length(trim(p_pix_key)) > 200 THEN
    RAISE EXCEPTION 'Chave Pix inválida';
  END IF;

  SELECT * INTO v_wallet FROM public.wallet_accounts WHERE user_id = v_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Carteira não encontrada';
  END IF;

  IF v_wallet.withdrawable < v_amount THEN
    RAISE EXCEPTION 'Saldo sacável insuficiente';
  END IF;

  INSERT INTO public.withdrawals (user_id, amount, pix_key_type, pix_key, status)
  VALUES (v_user_id, v_amount, trim(p_pix_key_type), trim(p_pix_key), 'pending')
  RETURNING * INTO v_withdrawal;

  UPDATE public.wallet_accounts
  SET total = total - v_amount, withdrawable = withdrawable - v_amount
  WHERE user_id = v_user_id;

  INSERT INTO public.wallet_ledger (
    user_id, entry_type, amount, balance_before, balance_after,
    withdrawable_before, withdrawable_after, reference_id, metadata, status
  )
  VALUES (
    v_user_id, 'withdraw', -v_amount, v_wallet.total, v_wallet.total - v_amount,
    v_wallet.withdrawable, v_wallet.withdrawable - v_amount, v_withdrawal.id,
    jsonb_build_object('withdrawal_id', v_withdrawal.id), 'success'
  );

  RETURN v_withdrawal;
END;
$function$;