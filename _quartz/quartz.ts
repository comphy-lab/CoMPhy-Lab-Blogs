import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

// QUARTZ_BASE_URL lets a preview build (for example on a tailnet host) emit
// absolute asset URLs for that host instead of the production hostname in
// quartz.config.yaml. Production builds leave it unset.
const baseUrlOverride = process.env.QUARTZ_BASE_URL?.trim()
const config = await loadQuartzConfig(baseUrlOverride ? { baseUrl: baseUrlOverride } : undefined)
export default config
export const layout = await loadQuartzLayout()
