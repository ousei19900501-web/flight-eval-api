// 航线评估数据存储 API
// 密码：shouyi888

const API_PASSWORD = 'shouyi888';

export default async function handler(req, res) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  const url = new URL(req.url);
  const password = url.searchParams.get('password');

  if (password !== API_PASSWORD) {
    return new Response(JSON.stringify({ error: '密码错误' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // 内存存储
  if (!global.flightData) {
    global.flightData = null;
  }

  if (req.method === 'GET') {
    if (global.flightData) {
      return new Response(JSON.stringify(global.flightData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ message: '暂无数据' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      global.flightData = {
        ...body,
        updatedAt: new Date().toISOString()
      };
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
