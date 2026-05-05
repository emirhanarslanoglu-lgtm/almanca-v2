$f = "c:\Users\BenimBilgisayarim\Documents\GitHub\almanca-v2\style.css"
$c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
$enc = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($f, $c, $enc)
Write-Host "Done - re-saved as UTF-8 without BOM"
