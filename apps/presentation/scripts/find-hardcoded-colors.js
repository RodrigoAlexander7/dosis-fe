#!/usr/bin/env node

/**
 * Color Migration Script
 * 
 * This script helps identify files that still use hardcoded colors
 * Run: node scripts/find-hardcoded-colors.js
 */

const fs = require('fs');
const path = require('path');

const hardcodedColorPatterns = [
  /#[0-9A-Fa-f]{6}/g,  // 6-digit hex
  /#[0-9A-Fa-f]{3}(?![0-9A-Fa-f])/g,  // 3-digit hex
  /#[0-9A-Fa-f]{8}/g,  // 8-digit hex with alpha
];

const excludePatterns = [
  'node_modules',
  '.git',
  'build',
  'dist',
  'colors.ts',  // Our color file itself
  'MIGRATION_GUIDE.ts',
  '.json',
  '.md',
];

function shouldExclude(filePath) {
  return excludePatterns.some(pattern => filePath.includes(pattern));
}

function findHardcodedColors(directory, results = []) {
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (shouldExclude(filePath)) return;

    if (stat.isDirectory()) {
      findHardcodedColors(filePath, results);
    } else if (file.match(/\.(tsx?|jsx?)$/)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const colors = [];

      hardcodedColorPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          colors.push(...matches);
        }
      });

      if (colors.length > 0) {
        results.push({
          file: filePath,
          colors: [...new Set(colors)],
          count: colors.length,
        });
      }
    }
  });

  return results;
}

function generateReport() {
  console.log('🔍 Scanning for hardcoded colors...\n');

  // __dirname is scripts/, so go up one level to get to presentation root
  const presentationPath = path.join(__dirname, '..');
  const results = findHardcodedColors(presentationPath);

  if (results.length === 0) {
    console.log('✅ No hardcoded colors found! All files are using the centralized color system.\n');
    return;
  }

  console.log(`Found ${results.length} files with hardcoded colors:\n`);

  results
    .sort((a, b) => b.count - a.count)
    .forEach(({ file, colors, count }) => {
      const relativePath = path.relative(presentationPath, file);
      console.log(`📄 ${relativePath}`);
      console.log(`   Colors: ${colors.join(', ')}`);
      console.log(`   Count: ${count}\n`);
    });

  console.log('\n💡 To fix these files:');
  console.log('1. Import: import { AppColors } from "@/utils/styles/colors";');
  console.log('2. Replace hardcoded colors with AppColors.<category>');
  console.log('3. See MIGRATION_GUIDE.ts for detailed mappings\n');
}

// Run the script
if (require.main === module) {
  generateReport();
}

module.exports = { findHardcodedColors };
