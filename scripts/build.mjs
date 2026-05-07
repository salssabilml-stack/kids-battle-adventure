import { cpSync, mkdirSync, rmSync } from 'node:fs';
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
for (const path of ['index.html', 'src', 'public']) cpSync(path, `dist/${path === 'public' ? '' : path}`, { recursive: true });
console.log('Static MVP build created in dist/. Package with Capacitor/Cordova or Unity WebView shell for APK testing.');
