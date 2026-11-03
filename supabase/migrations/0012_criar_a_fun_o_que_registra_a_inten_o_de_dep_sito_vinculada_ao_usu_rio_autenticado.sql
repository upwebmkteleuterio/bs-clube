CREATE OR REPLACE FUNCTION public.create_deposit_intent(p_user_id uuid, p_amount numeric)
RETURNS public.payments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_payment public.payments;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário inválido';
  END IF;

  IF p_amount IS NULL OR p_amount < 5 OR p_amount > 5000 THEN
    RAISE EXCEPTION 'O depósito deve ser entre R$ 5,00 e R$ 5.000,00';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  INSERT INTO public.payments (user_id, provider, kind, amount, status)
  VALUES (p_user_id, 'pushinpay', 'deposit', round(p_amount, 2), 'pending')
  RETURNING * INTO v_payment;

  RETURN v_payment;
END;
$function$;