// 航线评估数据存储 API
// 密码：shouyi888

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const password = req.query.password;
  if (password !== 'shouyi888') {
    res.status(401).json({ error: '密码错误' });
    return;
  }

  // 简单的内存存储
  if (!global.flightEvalDB) {
    global.flightEvalDB = null;
  }

  if (req.method === 'GET') {
    if (global.flightEvalDB) {
      res.json(global.flightEvalDB);
    } else {
      res.json({ message: '暂无数据' });
    }
    return;
  }

  if (req.method === 'POST') {
    global.flightEvalDB = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json({ success: true });
    return;
  }

  res.status(404).json({ error: 'Not Found' });
}
