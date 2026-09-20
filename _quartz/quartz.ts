import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { VaultLinks, SafeAliasRedirects } from "./quartz/plugins/site-links"

// QUARTZ_BASE_URL lets a preview build (on a custom host) emit
// absolute metadata URLs for that host instead of the production hostname in
// quartz.config.yaml. Production builds leave it unset.
const baseUrlOverride = process.env.QUARTZ_BASE_URL?.trim()
const config = await loadQuartzConfig(baseUrlOverride ? { baseUrl: baseUrlOverride } : undefined)
const crawlIndex = config.plugins.transformers.findIndex(
  (plugin) => plugin.name === "LinkProcessing",
)
if (crawlIndex < 0) throw new Error("CrawlLinks is required for vault link resolution")
config.plugins.transformers.splice(crawlIndex, 0, VaultLinks())
config.plugins.emitters = config.plugins.emitters.map((plugin) =>
  plugin.name === "AliasRedirects" ? SafeAliasRedirects() : plugin,
)
export default config
export const layout = await loadQuartzLayout()
