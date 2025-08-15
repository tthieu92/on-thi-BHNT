import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { user, score, duration, submittedAt } = req.body;
  if (!user || !score || !duration || !submittedAt) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const owner = 'hieuicttn';
  const repo = 'on-thi-BHNT';
  const path = 'logs.txt';
  const token = process.env.GITHUB_TOKEN;

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const newLog = `User: ${user} | Score: ${score} | Duration: ${duration} | SubmittedAt: ${submittedAt}\n`;

  try {
    // Lấy file hiện tại từ GitHub
    let content = '';
    let sha = null;
    const resp = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}` }
    });

    if (resp.ok) {
      const data = await resp.json();
      content = Buffer.from(data.content, 'base64').toString('utf-8');
      sha = data.sha;
    }

    // Thêm log mới
    const updatedContent = content + newLog;

    // Gửi commit lên GitHub
    const putResp = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Add quiz log',
        content: Buffer.from(updatedContent).toString('base64'),
        sha
      })
    });

    if (!putResp.ok) {
      throw new Error(`GitHub API error: ${putResp.statusText}`);
    }

    return res.status(200).json({ message: 'Log saved to GitHub' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to save log', error: err.message });
  }
}
