#!/usr/bin/env node

import { createWriteStream } from 'fs';
import { createReadStream } from 'fs';
import { statSync } from 'fs';
import { readdirSync } from 'fs';
import { join } from 'path';
import { arch, platform } from 'os';
import archiver from 'archiver';

const EXTENSION_NAME = 'limitlessmeet';
const VERSION = '0.1.0';

async function createZip() {
  const output = createWriteStream(`${EXTENSION_NAME}-${VERSION}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
  });

  output.on('close', () => {
    console.log(`✅ Extension packaged: ${EXTENSION_NAME}-${VERSION}.zip`);
    console.log(`📦 Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  // Add the built extension files
  archive.directory('dist/', false);
  
  // Add the manifest and other extension files
  archive.file('extension/manifest.json', { name: 'manifest.json' });
  
  // Add any assets
  if (statSync('extension/assets').isDirectory()) {
    archive.directory('extension/assets/', 'assets/');
  }

  await archive.finalize();
}

createZip().catch(console.error);