import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const logDir = '/tmp';
  const logFile = path.join(logDir, 'logs.txt');

  const { user, score, duration, submittedAt } = req.body;
  if (!user || !score || !duration || !submittedAt) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const logEntry = `User: ${user} | Score: ${score} | Duration: ${duration} | SubmittedAt: ${submittedAt}\n`;

  try {
    fs.appendFileSync(logFile, logEntry);
    return res.status(200).json({ message: 'Log saved', logFile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to write log' });
  }
}
