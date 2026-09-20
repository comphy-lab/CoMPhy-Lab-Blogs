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
const aliasIndex = config.plugins.emitters.findIndex(
  (plugin) => plugin.name === "AliasRedirects",
)
if (aliasIndex < 0) throw new Error("AliasRedirects is required for safe alias routing")
config.plugins.emitters[aliasIndex] = SafeAliasRedirects()
export default config
export const layout = await loadQuartzLayout()
