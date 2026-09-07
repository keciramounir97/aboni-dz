$ErrorActionPreference = 'Stop'
$base = 'http://localhost:5000/api'
$pass = 0
$fail = 0

function Assert($name, $cond, $detail = '') {
  if ($cond) {
    Write-Host "PASS  $name" -ForegroundColor Green
    $script:pass++
  } else {
    Write-Host "FAIL  $name  $detail" -ForegroundColor Red
    $script:fail++
  }
}

function Invoke-Json($method, $url, $body = $null, $token = $null) {
  $headers = @{ 'Content-Type' = 'application/json' }
  if ($token) { $headers['Authorization'] = "Bearer $token" }
  $params = @{ Method = $method; Uri = $url; Headers = $headers }
  if ($null -ne $body) { $params.Body = ($body | ConvertTo-Json -Depth 8) }
  return Invoke-RestMethod @params
}

Write-Host "`n=== Aboni smoke test ===`n"

# Health
$h = Invoke-Json GET "$base/health"
Assert 'health' ($h.success -eq $true -and $h.data.status -eq 'ok')

# Products public
$products = Invoke-Json GET "$base/products"
Assert 'products list' ($products.success -eq $true -and $products.data.Count -ge 1)
$slug = $products.data[0].slug
$one = Invoke-Json GET "$base/products/slug/$slug"
Assert 'product by slug' ($one.success -eq $true -and $one.data.slug -eq $slug)

# Auth login admin
$login = Invoke-Json POST "$base/auth/login" @{ email = 'admin@aboni.dz'; password = 'Admin@1234' }
$adminToken = $login.data.accessToken
Assert 'admin login' ($login.success -eq $true -and $adminToken)

$me = Invoke-Json GET "$base/auth/me" $null $adminToken
Assert 'admin me' ($me.data.role -eq 'super_admin')

# User login
$userLogin = Invoke-Json POST "$base/auth/login" @{ email = 'user@aboni.dz'; password = 'User@1234' }
$userToken = $userLogin.data.accessToken
Assert 'user login' ($userLogin.success -eq $true)

# Create order
$productId = $products.data[0].id
$order = Invoke-Json POST "$base/orders" @{ product_id = $productId; quantity = 1 } $userToken
Assert 'create order' ($order.success -eq $true -and $order.data.order_number)
$orderId = $order.data.id

# Submit proof
$proof = Invoke-Json PATCH "$base/orders/mine/$orderId/proof" @{ payment_proof_url = '/uploads/files/demo-proof.png' } $userToken
Assert 'submit proof' ($proof.data.status -eq 'payment_submitted')

# Admin review approve with delivery account
$review = Invoke-Json PATCH "$base/orders/admin/$orderId/review" @{
  status = 'approved'
  admin_note = 'Smoke test delivery'
  delivery_account = @{
    username = 'netflix.user'
    email = 'demo@stream.local'
    password = 'Secret123!'
    extra = 'Profile 1'
  }
} $adminToken
Assert 'approve order' ($review.data.status -eq 'delivered' -and $review.data.delivery_account.password)

# Admin products create
$newSlug = "smoke-spotify-$(Get-Random)"
$created = Invoke-Json POST "$base/products" @{
  slug = $newSlug
  name_en = 'Smoke Spotify'
  name_fr = 'Smoke Spotify FR'
  name_ar = 'سبوتيفاي تجريبي'
  description_en = 'Test product'
  description_fr = 'Produit test'
  description_ar = 'منتج تجريبي'
  category = 'spotify'
  price = 999
  currency = 'DZD'
  duration_days = 30
  is_active = $true
  stock = 50
  logo_url = 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/spotify.svg'
} $adminToken
Assert 'create product' ($created.success -eq $true -and $created.data.slug -eq $newSlug)

# Users list + patch permissions
$users = Invoke-Json GET "$base/users" $null $adminToken
Assert 'users list' ($users.data.Count -ge 3)
$staff = $users.data | Where-Object { $_.email -eq 'staff@aboni.dz' } | Select-Object -First 1
$patched = Invoke-Json PATCH "$base/users/$($staff.id)" @{
  permissions = @{
    products = $true
    orders = $true
    users = $false
    contacts = $true
    newsletter = $true
    analytics = $true
  }
} $adminToken
Assert 'patch user permissions' ($patched.data.permissions.analytics -eq $true)

# Contact + newsletter
$contact = Invoke-Json POST "$base/contacts" @{
  name = 'Smoke Tester'
  email = 'smoke@test.local'
  subject = 'Hello Aboni'
  message = 'This is a smoke test message body.'
}
Assert 'contact create' ($contact.success -eq $true)

$contacts = Invoke-Json GET "$base/contacts" $null $adminToken
Assert 'contacts list' ($contacts.data.Count -ge 1)

$nlEmail = "smoke$(Get-Random)@aboni.dz"
$nl = Invoke-Json POST "$base/newsletter/subscribe" @{ email = $nlEmail }
Assert 'newsletter subscribe' ($nl.success -eq $true)

$nls = Invoke-Json GET "$base/newsletter" $null $adminToken
$foundNl = @($nls.data | Where-Object { $_.email -eq $nlEmail })
Assert 'newsletter list' ($foundNl.Count -eq 1)

# Forgot / reset password
$forgot = Invoke-Json POST "$base/auth/forgot-password" @{ email = 'user@aboni.dz' }
Assert 'forgot password' ($forgot.success -eq $true -and [string]::IsNullOrEmpty($forgot.data.token) -eq $false)

try {
  $reset = Invoke-Json POST "$base/auth/reset-password" @{ token = $forgot.data.token; password = 'User@1234' }
  Assert 'reset password' ($reset.success -eq $true)
} catch {
  Assert 'reset password' $false $_.Exception.Message
}

# Frontend proxy / pages
try {
  $fe = Invoke-WebRequest -Uri 'http://localhost:5173/' -UseBasicParsing
  Assert 'frontend home' ($fe.StatusCode -eq 200 -and $fe.Content -match 'Aboni|root')
} catch {
  Assert 'frontend home' $false $_.Exception.Message
}

try {
  $proxy = Invoke-RestMethod -Uri 'http://localhost:5173/api/health'
  Assert 'vite api proxy' ($proxy.success -eq $true)
} catch {
  Assert 'vite api proxy' $false $_.Exception.Message
}

Write-Host "`n=== Results: $pass passed, $fail failed ===`n"
if ($fail -gt 0) { exit 1 } else { exit 0 }
