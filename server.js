// 航线评估数据存储 API（Render.com 版本）
// 密码：shouyi888

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data.json');
const API_PASSWORD = 'shouyi888'; // 请替换为你的密码

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 读取数据
function readData() {
    try {
        if (fs.existsSync(DB_FILE)) {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('读取数据失败:', e);
    }
    return null;
}

// 保存数据
function writeData(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        console.error('保存数据失败:', e);
        return false;
    }
}

// 验证密码
function verifyPassword(req, res, next) {
    const password = req.query.password;
    if (password !== API_PASSWORD) {
        return res.status(401).json({ error: '密码错误' });
    }
    next();
}

// GET / - 获取所有数据
app.get('/', verifyPassword, (req, res) => {
    const data = readData();
    if (data) {
        return res.json(data);
    }
    return res.json({ message: '暂无数据' });
});

// POST / - 保存数据
app.post('/', verifyPassword, (req, res) => {
    const data = {
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    if (writeData(data)) {
        return res.json({ success: true });
    }
    return res.status(500).json({ error: '保存失败' });
});

app.listen(PORT, () => {
    console.log(`API 服务已启动，端口: ${PORT}`);
});
