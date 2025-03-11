let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const config = {
  target: 'serverless',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

function mergeConfig(config, userConfig) {
  if (!userConfig) {
    return
  }
  for (const key in userConfig) {
    if (typeof config[key] === 'object' && !Array.isArray(config[key])) {
      config[key] = { ...config[key], ...userConfig[key] }
    } else {
      config[key] = userConfig[key]
    }
  }
}

mergeConfig(config, userConfig)

export default config
