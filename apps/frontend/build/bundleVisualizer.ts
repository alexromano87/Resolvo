import { gzipSync } from 'zlib';
import { basename } from 'path';
import type { Plugin } from 'vite';
import type { OutputChunk, OutputBundle } from 'rollup';

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

type BundleChunk = OutputChunk;

export function bundleVisualizer(): Plugin {
  return {
    name: 'custom-bundle-visualizer',
    apply: 'build',
    generateBundle(_options, bundle: OutputBundle) {
      const entries = Object.values(bundle)
        .filter((chunk): chunk is BundleChunk => chunk.type === 'chunk')
        .map((chunk) => {
          const code = chunk.code || '';
          const gzipSize = gzipSync(Buffer.from(code)).length;
          return {
            name: basename(chunk.fileName),
            size: Buffer.byteLength(code),
            gzip: gzipSize,
          };
        })
        .sort((a, b) => b.size - a.size);

      const rows = entries
        .map(
          (entry) => `<tr>
            <td class="text-left">${entry.name}</td>
            <td>${formatSize(entry.size)}</td>
            <td>${formatSize(entry.gzip)}</td>
          </tr>`,
        )
        .join('');

      const html = `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <title>Bundle report - Resolvo frontend</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #131516; color:#f4f4f5; padding:24px; }
    table { width:100%; border-collapse: collapse; margin-top:12px; }
    th, td { padding: 10px 12px; border-bottom:1px solid rgba(255,255,255,0.1); }
    th { text-align:left; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; font-size:12px; color:#a1a1aa; }
    td { font-size:14px; }
    tr:nth-child(odd) { background:rgba(255,255,255,0.02); }
  </style>
</head>
<body>
  <h1>Bundle report</h1>
  <p>Vite build ha generato ${entries.length} chunk principali.</p>
  <table>
    <thead>
      <tr><th>Chunk</th><th>Size</th><th>Gzip</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

      this.emitFile({
        type: 'asset',
        fileName: 'bundle-report.html',
        source: html,
      });
    },
  };
}
