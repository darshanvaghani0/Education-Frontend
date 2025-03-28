const fs = require('fs');
const path = require('path');

// Path to build.gradle file
const buildGradlePath = path.join(__dirname, 'android', 'app', 'build.gradle');
const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');

// Regular expressions to find versionCode and versionName
const versionCodeRegex = /versionCode (\d+)/;
const versionNameRegex = /versionName "(\d+\.\d+\.\d+)"/;

// Extract current versionCode and versionName
const versionCodeMatch = versionCodeRegex.exec(buildGradleContent);
const versionNameMatch = versionNameRegex.exec(buildGradleContent);

if (versionCodeMatch && versionNameMatch) {
  // Increment versionName (e.g., 0.0.1 -> 0.0.2)
  const currentVersionName = versionNameMatch[1];
  const [major, minor, patch] = currentVersionName.split('.').map(Number);
  const newPatch = patch + 1;
  const newVersionName = `${major}.${minor}.${newPatch}`;

  // Increment versionCode
  const currentVersionCode = parseInt(versionCodeMatch[1], 10);
  const newVersionCode = currentVersionCode + 1;

  // Replace old values with new values
  const newBuildGradleContent = buildGradleContent
    .replace(versionCodeRegex, `versionCode ${newVersionCode}`)
    .replace(versionNameRegex, `versionName "${newVersionName}"`);

  // Write updated content to build.gradle
  fs.writeFileSync(buildGradlePath, newBuildGradleContent, 'utf8');

    const outputPath = path.join(__dirname, 'version.json');
    fs.writeFileSync(outputPath, JSON.stringify({ newVersionName }, null, 2), 'utf8');
    console.log('Version extracted and saved to version.json:', newVersionName);
  
  console.log(`Updated versionCode to ${newVersionCode}`);
  console.log(`Updated versionName to ${newVersionName}`);
} else {
  console.error('Could not find versionCode or versionName in build.gradle');
}