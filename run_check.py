import subprocess, os, tempfile

with open('index.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

test_hook = """
<div id="testOutput">WAITING...</div>
<script>
window.addEventListener('load', async () => {
  try {
    const student = { fullName: 'Шевченко Дарина', certId: 'HQ-2026-9999' };
    const grade = { grade: 12, level: 'Високий рівень', pointsEarned: 100, percentage: 100, color: '#10b981' };

    window.certificateManager.renderCertificateData(student, grade);

    let capturedPdf = null;
    const origSave = window.jsPDF.prototype.save;
    window.jsPDF.prototype.save = function(name) {
      capturedPdf = {
        filename: name,
        pages: this.internal.getNumberOfPages(),
        w: this.internal.pageSize.getWidth(),
        h: this.internal.pageSize.getHeight()
      };
    };

    await window.certificateManager.downloadCertificatePDF(student, grade);

    document.getElementById('testOutput').textContent = JSON.stringify({
      success: true,
      capturedPdf: capturedPdf
    });
  } catch (e) {
    document.getElementById('testOutput').textContent = 'ERROR: ' + e.message + ' ' + e.stack;
  }
});
</script>
</body>
"""

test_html = orig_html.replace('</body>', test_hook)
with open('test_live_index.html', 'w', encoding='utf-8') as f:
    f.write(test_html)

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
url = 'file:///' + os.path.abspath('test_live_index.html').replace('\\', '/')
user_data = tempfile.mkdtemp()
res = subprocess.run([
    chrome, '--headless=new', '--disable-gpu', f'--user-data-dir={user_data}', '--virtual-time-budget=8000', '--dump-dom', url
], capture_output=True, text=True, encoding='utf-8')

if os.path.exists('test_live_index.html'):
    os.remove('test_live_index.html')

start = res.stdout.find('<div id="testOutput">')
end = res.stdout.find('</div>', start)
print(res.stdout[start:end+6])
