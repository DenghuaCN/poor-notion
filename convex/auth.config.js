const config = {
  providers: [
    {
      // 本地开发时使用.env.local的环境变量
      // 部署时需要配置在convex dashboard -> settings -> environment-variables中
      domain: process.env.CLERK_DEV_DOMAIN,
      applicationID: process.env.CLERK_APP_ID,
    }
  ]
}

export default config;