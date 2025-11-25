import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface TransactionRequest {
  type: 'airtime' | 'bundle';
  network: string;
  phoneNumber: string;
  amount: number;
  originalAmount: number;
  discountPercentage: number;
  tier?: string;
  bundleId?: string;
  bundleSize?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify the JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const requestData: TransactionRequest = await req.json();

    // Generate transaction reference
    const reference = `${requestData.type === 'airtime' ? 'AIR' : 'BUN'}${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Simulate transaction processing (in production, this would call actual provider APIs)
    const transactionStatus = Math.random() > 0.1 ? 'completed' : 'pending';

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: requestData.type,
        network: requestData.network,
        phone_number: requestData.phoneNumber,
        amount: requestData.amount,
        original_amount: requestData.originalAmount,
        discount_percentage: requestData.discountPercentage,
        tier: requestData.tier,
        bundle_id: requestData.bundleId,
        bundle_size: requestData.bundleSize,
        status: transactionStatus,
        reference: reference,
      })
      .select()
      .single();

    if (txError) {
      throw new Error(`Failed to create transaction: ${txError.message}`);
    }

    // Update user's total savings
    const savings = requestData.originalAmount - requestData.amount;
    if (transactionStatus === 'completed' && savings > 0) {
      await supabase
        .from('users')
        .update({
          total_savings: supabase.rpc('increment_savings', { user_id: user.id, amount: savings })
        })
        .eq('id', user.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          id: transaction.id,
          reference: transaction.reference,
          status: transaction.status,
          amount: transaction.amount,
          type: transaction.type,
          network: transaction.network,
          phoneNumber: transaction.phone_number,
          timestamp: transaction.created_at,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});