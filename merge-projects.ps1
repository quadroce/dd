# Percorsi sorgente e destinazione
$sourceAdmin = "C:\Users\franc\Downloads\scoutfeed-main\src"
$targetAdmin = "C:\Users\franc\dropdaily\dd\apps\admin\src"

# Crea cartella destinazione se mancante
If (!(Test-Path $targetAdmin)) {
    New-Item -ItemType Directory -Force -Path $targetAdmin | Out-Null
}

# Copia codice admin
If (Test-Path $sourceAdmin) {
    Write-Host "Copio la dashboard admin da: $sourceAdmin"
    Copy-Item "$sourceAdmin\*" "$targetAdmin" -Recurse -Force
    Write-Host "Fatto! Codice copiato in: $targetAdmin"
} else {
    Write-Host "Attenzione: Cartella sorgente non trovata: $sourceAdmin"
}
