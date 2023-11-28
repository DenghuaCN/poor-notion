const config = {
  providers: [
    {
      domain: process.env.CLERK_DEV_DOMAIN,
      applicationID: process.env.CLERK_APP_ID,
    }
  ]
}

export default config;