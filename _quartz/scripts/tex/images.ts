import sharp from "sharp"

// A4 with 23 mm margins: 164 mm at 300 dpi is 1937 px. Round to 1900.
// Only JPEG sources are treated as photographs; PNG diagrams stay lossless.
// This module is a pipeline input, binding the derivative policy to freshness.
export async function rasterDerivative(bytes: Buffer, fraction: number) {
  const metadata = await sharp(bytes, { animated: false }).metadata()
  if (!metadata.width || !metadata.height) throw new Error("No raster dimensions")
  // Match lecture.lua's 0.65 text-height limit as well as its width limit.
  const heightFraction =
    (0.65 * 251 * metadata.width) / (164 * (metadata.pageHeight ?? metadata.height))
  const width = Math.min(
    metadata.width,
    Math.max(1, Math.round(1900 * Math.min(fraction, heightFraction))),
  )
  const image = sharp(bytes, { animated: false }).resize({ width, withoutEnlargement: true })
  const photographic = metadata.format === "jpeg" && !metadata.hasAlpha && width >= 900
  return {
    extension: photographic ? ".jpg" : ".png",
    bytes: await (
      photographic ? image.jpeg({ quality: 88, chromaSubsampling: "4:4:4" }) : image.png()
    ).toBuffer(),
  }
}
