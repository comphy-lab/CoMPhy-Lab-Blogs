export interface TexEntry {
  pdf: string
  dependencies: string[]
  inputs: Record<string, string>
  sha256: string
  pdfSha256: string
  toolchain?: Record<string, string>
}
export interface Manifest {
  version: number
  pages: Record<string, TexEntry>
}
export const pipelineInputs: string[]
export function sha256(bytes: string | Buffer): string
export function pdfPathFor(source: string): string
export function safePath(root: string, name: string): string
export function readInput(root: string, name: string): Promise<Buffer>
export function vaultFiles(root: string): Promise<string[]>
export function fingerprint(
  root: string,
  dependencies: string[],
  files: string[],
): Promise<{ inputs: Record<string, string>; sha256: string }>
export function validPdf(bytes: Buffer): boolean
export function freshTexPdf(
  root: string,
  source: string,
  manifest: Manifest | null,
  files: string[],
): Promise<{ bytes?: Buffer; entry?: TexEntry; reason?: string }>
