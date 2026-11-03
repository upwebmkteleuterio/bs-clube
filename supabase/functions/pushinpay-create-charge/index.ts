import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(JSON.stringify({}), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  if (req.method !== 'POST') return jsonResponse({ error: 'Método não permitido.' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return jsonResponse({ error: 'Autenticação necessária.' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const pushinpayToken = Deno.env.get('PUSHINPAY_TOKEN');
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error('[pushinpay-create-charge] Configuração do Supabase ausente.');
    return jsonResponse({ error: 'Configuração do servidor incompleta.' }, 500);
  }

  try {
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) return jsonResponse({ error: 'Sessão inválida ou expirada.' }, 401);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: 'Corpo da requisição inválido.' }, 400);
    }
    const amount = body && typeof body === 'object' ? (body as { amount?: unknown }).amount : undefined;
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 5 || amount > 5000) {
      return jsonResponse({ error: 'O valor do depósito deve ser entre R$ 5,00 e R$ 5.000,00.' }, 400);
    }
    // Normaliza para 2 casas decimais para que o valor cobrado no provedor seja
    // exatamente o mesmo valor gravado no banco (evita divergência de centavos).
    const normalizedAmount = Math.round(amount * 100) / 100;
    if (!pushinpayToken) {
      console.error('[pushinpay-create-charge] PUSHINPAY_TOKEN não configurado.');
      return jsonResponse({ error: 'Token da PushinPay não configurado no servidor.' }, 500);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: paymentData, error: paymentError } = await serviceClient.rpc('create_deposit_intent', {
      p_user_id: user.id,
      p_amount: normalizedAmount,
    });
    const payment = Array.isArray(paymentData) ? paymentData[0] : paymentData;
    if (paymentError || !payment?.id) {
      console.error('[pushinpay-create-charge] Falha ao criar intenção de depósito.', paymentError?.message);
      return jsonResponse({ error: 'Não foi possível iniciar o depósito. Tente novamente.' }, 500);
    }

    const webhookUrl = `${supabaseUrl}/functions/v1/pushinpay-webhook`;
    const apiUrl = (Deno.env.get('PUSHINPAY_API_URL') ?? 'https://api.pushinpay.com.br').replace(/\/$/, '');
    let providerResponse: Response;
    let providerData: Record<string, unknown> = {};
    try {
      providerResponse = await fetch(`${apiUrl}/api/pix/cashIn`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pushinpayToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: Math.round(normalizedAmount * 100),
          webhook_url: webhookUrl,
          description: `Depósito ${payment.id}`,
        }),
      });
      const responseBody: unknown = await providerResponse.json().catch(() => ({}));
      providerData = responseBody && typeof responseBody === 'object' ? responseBody as Record<string, unknown> : {};
    } catch (error) {
      console.error('[pushinpay-create-charge] Erro de comunicação com a PushinPay.', error);
      await serviceClient.from('payments').update({ status: 'failed', provider_status: 'failed' }).eq('id', payment.id);
      return jsonResponse({ error: 'Não foi possível conectar à PushinPay. Tente novamente.' }, 502);
    }

    if (!providerResponse.ok) {
      const providerMessage = typeof providerData.error === 'string'
        ? providerData.error
        : typeof providerData.message === 'string' ? providerData.message : '';
      await serviceClient.from('payments').update({ status: 'failed', provider_status: 'failed' }).eq('id', payment.id);
      if (providerResponse.status === 401) {
        console.error('[pushinpay-create-charge] PushinPay recusou autorização da cobrança.');
        return jsonResponse({ error: 'O token ou IP do servidor não está liberado na PushinPay. Verifique a configuração da conta.' }, 502);
      }
      console.error('[pushinpay-create-charge] Provedor recusou a cobrança.', providerResponse.status, Boolean(providerMessage));
      return jsonResponse({ error: 'A PushinPay não conseguiu criar a cobrança Pix. Tente novamente.' }, 502);
    }

    const externalId = providerData.id;
    if (typeof externalId !== 'string' || !externalId) {
      console.error('[pushinpay-create-charge] Resposta da PushinPay sem identificador.');
      await serviceClient.from('payments').update({ status: 'failed', provider_status: 'failed' }).eq('id', payment.id);
      return jsonResponse({ error: 'A PushinPay retornou uma cobrança inválida.' }, 502);
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const { error: updateError } = await serviceClient.from('payments').update({
      external_id: externalId,
      provider_status: typeof providerData.status === 'string' ? providerData.status : 'created',
      qr_code: typeof providerData.qr_code === 'string' ? providerData.qr_code : null,
      qr_code_base64: typeof providerData.qr_code_base64 === 'string' ? providerData.qr_code_base64 : null,
      webhook_url: webhookUrl,
      expires_at: expiresAt,
    }).eq('id', payment.id);
    if (updateError) {
      console.error('[pushinpay-create-charge] Não foi possível salvar os dados da cobrança.', updateError.message);
      return jsonResponse({ error: 'A cobrança foi criada, mas não foi possível preparar o Pix. Contate o suporte.' }, 500);
    }

    return jsonResponse({
      paymentId: payment.id,
      qrCode: typeof providerData.qr_code === 'string' ? providerData.qr_code : null,
      qrCodeBase64: typeof providerData.qr_code_base64 === 'string' ? providerData.qr_code_base64 : null,
      expiresAt,
      amount: normalizedAmount,
    });
  } catch (error) {
    console.error('[pushinpay-create-charge] Erro inesperado ao criar cobrança.', error);
    return jsonResponse({ error: 'Não foi possível criar o depósito. Tente novamente.' }, 500);
  }
});
