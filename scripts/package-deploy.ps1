# Packages a DirectAdmin deploy bundle from an existing production build.
#
# Run `npm run build` FIRST — this script only copies, it does not build.
#
# It deliberately excludes .next/dev (artifact of `next dev`) and .next/cache
# (local build cache), which together are ~95% of the folder and are useless —
# harmful, even — on the server. See docs/deploy-directadmin.md.

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not (Test-Path '.next\BUILD_ID')) {
  throw "No production build found. Run 'npm run build' first."
}

$out = 'deploy'
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory $out | Out-Null
New-Item -ItemType Directory "$out\.next" | Out-Null

# Build output: the three directories the server actually reads at runtime.
foreach ($dir in 'build', 'server', 'static') {
  Copy-Item ".next\$dir" "$out\.next\$dir" -Recurse
}

# Manifests at the root of .next. `trace`/`trace-build` are build telemetry.
Get-ChildItem '.next' -File |
  Where-Object { $_.Name -notlike 'trace*' } |
  Copy-Item -Destination "$out\.next"

# Everything else the running app needs. node_modules is intentionally absent:
# it only changes when package.json does, so it is uploaded separately.
Copy-Item 'public' "$out\public" -Recurse
Copy-Item 'server.js', 'package.json', 'package-lock.json', 'next.config.mjs' $out
if (Test-Path '.env.local') { Copy-Item '.env.local' $out }

$size = (Get-ChildItem $out -Recurse -File | Measure-Object Length -Sum).Sum
"Bundle ready in .\$out  ({0:N1} MB, BUILD_ID {1})" -f ($size / 1MB), (Get-Content '.next\BUILD_ID')

if (Test-Path 'deploy.zip') { Remove-Item 'deploy.zip' -Force }

# NOT Compress-Archive: on Windows PowerShell 5.1 it writes entry paths with
# backslashes, which violates the ZIP spec. Linux `unzip` then produces a single
# flat file literally named ".next\server\app\news.html" instead of a directory
# tree, and the deploy silently fails. Building the archive by hand is the only
# way to guarantee forward slashes.
Add-Type -AssemblyName System.IO.Compression.FileSystem
$root = (Resolve-Path $out).Path
$zip = [System.IO.Compression.ZipFile]::Open(
  (Join-Path (Get-Location) 'deploy.zip'), 'Create')
try {
  foreach ($file in Get-ChildItem $out -Recurse -File -Force) {
    $name = $file.FullName.Substring($root.Length + 1).Replace('\', '/')
    [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $zip, $file.FullName, $name, 'Optimal')
  }
} finally {
  $zip.Dispose()
}

"Archive: .\deploy.zip  ({0:N1} MB)" -f ((Get-Item 'deploy.zip').Length / 1MB)
