# WorkMitra API Integration Test Script
# This script tests the complete end-to-end flow of the backend APIs using local HTTP requests.

$baseUrl = "http://localhost:8081/api"
$Headers = @{
    "Content-Type" = "application/json"
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      WorkMitra API Integration Test       " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Register a Customer
Write-Host "`n[1] Registering Customer (Suresh Babu)..." -ForegroundColor Yellow
$customerRegisterBody = @{
    name = "Suresh Babu"
    phone = "9876543211"
    password = "password123"
    role = "CUSTOMER"
} | ConvertTo-Json

try {
    $custRegResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $customerRegisterBody -Headers $Headers
    Write-Host "SUCCESS: Customer Registered. ID: $($custRegResponse.userId)" -ForegroundColor Green
} catch {
    $errMsg = $_.Exception.Response.GetResponseStream()
    if ($errMsg) {
        $reader = New-Object System.IO.StreamReader($errMsg)
        Write-Host "INFO: Customer registration skipped or failed: $($reader.ReadToEnd())" -ForegroundColor Gray
    } else {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 2. Register a Worker
Write-Host "`n[2] Registering Worker (Ramesh Kumar)..." -ForegroundColor Yellow
$workerRegisterBody = @{
    name = "Ramesh Kumar"
    phone = "9876543210"
    password = "password123"
    role = "WORKER"
} | ConvertTo-Json

try {
    $workRegResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $workerRegisterBody -Headers $Headers
    Write-Host "SUCCESS: Worker Registered. ID: $($workRegResponse.userId)" -ForegroundColor Green
    $workerId = $workRegResponse.userId
} catch {
    $errMsg = $_.Exception.Response.GetResponseStream()
    if ($errMsg) {
        $reader = New-Object System.IO.StreamReader($errMsg)
        $resp = $reader.ReadToEnd() | ConvertFrom-Json
        Write-Host "INFO: Worker registration skipped or already exists: $($resp.error)" -ForegroundColor Gray
    } else {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 3. Login as Customer to get JWT
Write-Host "`n[3] Logging in as Customer..." -ForegroundColor Yellow
$customerLoginBody = @{
    phone = "9876543211"
    password = "password123"
} | ConvertTo-Json

try {
    $custLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $customerLoginBody -Headers $Headers
    $customerToken = $custLoginResponse.token
    Write-Host "SUCCESS: Logged in! JWT Token obtained." -ForegroundColor Green
} catch {
    Write-Host "ERROR: Login failed. Check if server is running." -ForegroundColor Red
    return
}

# 4. Login as Worker to get JWT
Write-Host "`n[4] Logging in as Worker..." -ForegroundColor Yellow
$workerLoginBody = @{
    phone = "9876543210"
    password = "password123"
} | ConvertTo-Json

try {
    $workLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $workerLoginBody -Headers $Headers
    $workerToken = $workLoginResponse.token
    $workerId = $workLoginResponse.userId
    Write-Host "SUCCESS: Logged in! JWT Token obtained. Worker User ID: $workerId" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Login failed. Check if server is running." -ForegroundColor Red
    return
}

# 5. Create Worker Profile (Secured - Worker Only)
Write-Host "`n[5] Creating Worker Profile (Skill: ELECTRICIAN)..." -ForegroundColor Yellow
$workerHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $workerToken"
}
$profileBody = @{
    skill = "ELECTRICIAN"
    experience = 5
    location = "Gajuwaka"
    photoUrl = "https://images.unsplash.com/photo-1540569014015-19a7be504e3a"
} | ConvertTo-Json

try {
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/workers/profile" -Method Post -Body $profileBody -Headers $workerHeaders
    Write-Host "SUCCESS: Profile Setup Done! Location: $($profileResponse.location), Skill: $($profileResponse.skill)" -ForegroundColor Green
} catch {
    $errMsg = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errMsg)
    Write-Host "ERROR: Profile failed: $($reader.ReadToEnd())" -ForegroundColor Red
}

# 6. Browse Workers as Customer (Secured - Customer Only)
Write-Host "`n[6] Browsing Workers (Filter: ELECTRICIAN)..." -ForegroundColor Yellow
$customerHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $customerToken"
}

try {
    $workersList = Invoke-RestMethod -Uri "$baseUrl/workers?skill=ELECTRICIAN" -Method Get -Headers $customerHeaders
    Write-Host "SUCCESS: Found $($workersList.Count) electrician(s) nearby:" -ForegroundColor Green
    foreach ($w in $workersList) {
        Write-Host " - Name: $($w.name), Location: $($w.location), Exp: $($w.experience) years" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR: Failed to fetch workers." -ForegroundColor Red
}

# 7. Create Work Request (Secured - Customer Only)
Write-Host "`n[7] Creating Work Request for Worker ID $workerId..." -ForegroundColor Yellow
$requestBody = @{
    workerId = $workerId
    description = "Need house wiring repair. Living room lights are flickering."
    address = "MVP Colony, Sector 3, House 42"
    phone = "9876543211"
} | ConvertTo-Json

try {
    $requestResponse = Invoke-RestMethod -Uri "$baseUrl/requests" -Method Post -Body $requestBody -Headers $customerHeaders
    $requestId = $requestResponse.requestId
    Write-Host "SUCCESS: Work Request Created! Request ID: $requestId, Status: $($requestResponse.status)" -ForegroundColor Green
} catch {
    $errMsg = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errMsg)
    Write-Host "ERROR: Request failed: $($reader.ReadToEnd())" -ForegroundColor Red
}

# 8. View Incoming Work Requests as Worker (Secured - Worker Only)
Write-Host "`n[8] Worker checks incoming requests..." -ForegroundColor Yellow
try {
    $incomingRequests = Invoke-RestMethod -Uri "$baseUrl/requests/worker" -Method Get -Headers $workerHeaders
    Write-Host "SUCCESS: Found $($incomingRequests.Count) incoming request(s):" -ForegroundColor Green
    foreach ($r in $incomingRequests) {
        Write-Host " - Request ID: $($r.requestId), Customer: $($r.customerName), Work: $($r.description)" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR: Failed to fetch incoming requests." -ForegroundColor Red
}

# 9. Accept Work Request (Secured - Worker Only)
if ($requestId) {
    Write-Host "`n[9] Worker accepting Request ID $requestId..." -ForegroundColor Yellow
    $acceptBody = @{
        status = "ACCEPTED"
    } | ConvertTo-Json

    try {
        $statusResponse = Invoke-RestMethod -Uri "$baseUrl/requests/$requestId/status" -Method Put -Body $acceptBody -Headers $workerHeaders
        Write-Host "SUCCESS: Request Status Updated: $($statusResponse.status)" -ForegroundColor Green
    } catch {
        $errMsg = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errMsg)
        Write-Host "ERROR: Failed to update status: $($reader.ReadToEnd())" -ForegroundColor Red
    }
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "            Test Flow Completed           " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
