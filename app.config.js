const fs = require('fs');
const path = require('path');
const appJson = require('./app.json');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .reduce((env, line) => {
      const [key, ...rest] = line.split('=');
      if (!key) return env;
      env[key.trim()] = rest.join('=').trim();
      return env;
    }, {});
}

const env = loadEnvFile(path.resolve(__dirname, '.env.local'));

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo.extra || {}),
      EXPO_PUBLIC_APPWRITE_ENDPOINT:
        process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
      EXPO_PUBLIC_APPWRITE_PROJECT_ID:
        process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
      NEXT_PUBLIC_APPWRITE_ENDPOINT:
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
      NEXT_PUBLIC_APPWRITE_PROJECT_ID:
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    },
  },
};
