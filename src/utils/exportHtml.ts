/**
 * Utility to generate a beautifully styled standalone HTML document for the letter.
 * It embeds fonts, elegant parchment styling, and proper print stylesheets.
 */
export function generateLetterHtml(options: {
  title: string;
  letterContent: string;
  optionName: string;
  dateStr: string;
  wordCount: number;
}): string {
  const { title, letterContent, optionName, dateStr, wordCount } = options;

  // Format paragraphs safely
  const paragraphs = letterContent
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin-bottom: 1.5em; line-height: 1.9;">${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} - Letter to Dad</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #FAF8F5;
      color: #1C1917;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }
    .page-container {
      width: 100%;
      max-width: 720px;
      margin: 0 auto;
    }
    .letterhead {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 20px;
      box-shadow: 0 10px 30px -6px rgba(28, 25, 23, 0.08);
      overflow: hidden;
    }
    .top-bar {
      padding: 20px 36px;
      background: #FDFCFA;
      border-bottom: 1px solid #F0EEE9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .emblem {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #1C1917;
      color: #FDE68A;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .brand-text h1 {
      font-family: 'Newsreader', Georgia, serif;
      font-size: 17px;
      font-weight: 600;
      color: #1C1917;
    }
    .brand-text p {
      font-size: 11px;
      color: #78716C;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .meta-badge {
      font-size: 12px;
      color: #57534E;
      background: #F5F5F4;
      padding: 6px 14px;
      border-radius: 9999px;
      font-weight: 500;
    }
    .sheet-body {
      padding: 48px 48px 60px 48px;
      background: #FCFAF7;
      position: relative;
    }
    .date-recipient {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #A8A29E;
      border-bottom: 1px solid #E7E5E4;
      padding-bottom: 14px;
      margin-bottom: 32px;
    }
    .content {
      font-family: 'Newsreader', Georgia, serif;
      font-size: 17px;
      line-height: 1.88;
      color: #292524;
    }
    .footer-note {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #E7E5E4;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #78716C;
    }
    .action-bar {
      margin-top: 24px;
      display: flex;
      justify-content: center;
      gap: 12px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid #D6D3D1;
      background: #FFFFFF;
      color: #1C1917;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn:hover {
      background: #F5F5F4;
      border-color: #A8A29E;
    }
    .btn-primary {
      background: #1C1917;
      color: #FFFFFF;
      border-color: #1C1917;
    }
    .btn-primary:hover {
      background: #292524;
      color: #FFFFFF;
    }
    @media print {
      body {
        background: #FFFFFF;
        padding: 0;
      }
      .letterhead {
        border: none;
        box-shadow: none;
      }
      .action-bar {
        display: none;
      }
      .sheet-body {
        padding: 20px 0;
        background: #FFFFFF;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="letterhead">
      <div class="top-bar">
        <div class="brand">
          <div class="emblem">🪶</div>
          <div class="brand-text">
            <h1>Letter to Dad</h1>
            <p>${escapeHtml(optionName)}</p>
          </div>
        </div>
        <div class="meta-badge">${dateStr}</div>
      </div>
      <div class="sheet-body">
        <div class="date-recipient">
          <span>Addressed to: Dad</span>
          <span>${wordCount} words</span>
        </div>
        <div class="content">
          ${paragraphs}
        </div>
        <div class="footer-note">
          <span>Prepared with Letter Ghostwriter</span>
          <span>Prepared before upcoming phone call</span>
        </div>
      </div>
    </div>

    <div class="action-bar">
      <button class="btn btn-primary" onclick="window.print()">Print or Save as PDF</button>
      <button class="btn" onclick="navigator.clipboard.writeText(document.querySelector('.content').innerText).then(() => alert('Copied to clipboard!'))">Copy Text</button>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
