const fs = require('fs');
const content = fs.readFileSync('C:/Users/manish yadav/.gemini/antigravity-ide/brain/299c6e0b-50e6-4313-b004-e86317644746/.system_generated/logs/transcript.jsonl', 'utf8');
const lines = content.split('\n');
for (const l of lines) {
  if (!l.trim()) continue;
  const o = JSON.parse(l);
  if (o.step_index >= 1040 && o.step_index <= 1080) {
    console.log(o.step_index, o.type, o.content ? o.content.substring(0, 150) : (o.thinking ? o.thinking.substring(0, 100) : ''));
  }
}
