// 航线评估数据存储 API（Vercel Serverless 版本）
// 密码：shouyi888

let inMemoryDB = null;

module.exports = (req, res) => {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 验证密码
  const password = req.query.password;
  if (password !== 'shouyi888') {
    return res.status(401).json({ error: '密码错误' });
  }

  // GET - 获取数据
  if (req.method === 'GET') {
    if (inMemoryDB) {
      return res.json(inMemoryDB);
    }
    return res.json({ message: '暂无数据' });
  }

  // POST - 保存数据
  if (req.method === 'POST') {
    inMemoryDB = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    return res.json({ success: true });
  }

  return res.status(404).json({ error: 'Not Found' });
};
