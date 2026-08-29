Set objShell = CreateObject("Shell.Application")
strArgs = "-NoProfile -ExecutionPolicy Bypass -Command ""Add-Content -Path 'C:\Windows\System32\drivers\etc\hosts' -Value '`r`n167.235.9.123 naturesmud.shop www.naturesmud.shop api.naturesmud.shop admin-api.naturesmud.shop'; ipconfig /flushdns; [System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('Hosts file updated successfully! You can now open https://naturesmud.shop','Nature Mud Setup')"""
objShell.ShellExecute "powershell.exe", strArgs, "", "runas", 1
