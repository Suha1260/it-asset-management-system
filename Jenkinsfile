
stage('Start Application') {
    steps {
        bat '''
            powershell -NoProfile -ExecutionPolicy Bypass -Command "$p = Start-Process -FilePath 'node.exe' -ArgumentList 'server.js' -WorkingDirectory (Get-Location).Path -RedirectStandardOutput 'app.log' -RedirectStandardError 'app-error.log' -PassThru; $ready = $false; for ($i = 0; $i -lt 30; $i++) { Start-Sleep -Seconds 1; try { Invoke-WebRequest 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2 | Out-Null; $ready = $true; break } catch {} }; if (-not $ready) { Get-Content app.log -ErrorAction SilentlyContinue; Get-Content app-error.log -ErrorAction SilentlyContinue; exit 1 }"
        '''
    }
}
