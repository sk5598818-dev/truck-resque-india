$dest = "C:\Users\sapat\AppData\Local\Programs\Git"
if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}
$zipPath = "C:\Users\sapat\AppData\Local\Temp\mingit.zip"
Write-Output "Downloading MinGit official portable from GitHub..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri "https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.1/MinGit-2.47.1-64-bit.zip" -OutFile $zipPath -UseBasicParsing
Write-Output "Extracting MinGit to $dest..."
Expand-Archive -Path $zipPath -DestinationPath $dest -Force
Remove-Item $zipPath -Force
$gitExe = "$dest\cmd\git.exe"
if (Test-Path $gitExe) {
    Write-Output "SUCCESS: MinGit installed!"
    & $gitExe --version
} else {
    Write-Output "FAILED: git.exe not found at $gitExe"
}
