// 航线评估数据存储 API（Vercel Edge Functions 版本）
// 密码：shouyi888

export const runtime = 'edge';

const API_PASSWORD = 'shouyi888';
const DB_KEY = 'flight_eval_data';

// 使用 Vercel KV 存储数据（免费）
// 如果没有 KV，可以用简单的内存存储（免费版容器重启后会丢失）

let inMemoryDB = null;

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 验证密码
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password');

  if (password !== API_PASSWORD) {
    return new Response(JSON.stringify({ error: '密码错误' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // GET - 获取数据
  if (req.method === 'GET') {
    try {
      if (inMemoryDB) {
        return new Response(JSON.stringify(inMemoryDB), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ message: '暂无数据' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  // POST - 保存数据
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      inMemoryDB = {
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

  return new Response('Not Found', { status: 404 });
}
