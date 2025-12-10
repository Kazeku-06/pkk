# 🔧 CORS Troubleshooting Guide

## ❌ Error yang Muncul:
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy
```

## ✅ Solusi yang Sudah Diterapkan:

### 1. **Backend CORS Configuration (Fixed)**
```python
CORS(app, 
     origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     supports_credentials=True)
```

### 2. **File Upload Endpoint Added**
```python
@app.route('/storage/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(upload_dir, filename)
```

## 🚀 Cara Mengatasi:

### **Step 1: Restart Backend**
```bash
# Stop backend (Ctrl+C)
# Lalu jalankan:
restart-backend.bat
```

### **Step 2: Clear Browser Cache**
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### **Step 3: Test Connection**
```bash
test-connection.bat
```

### **Step 4: Alternative Solutions**

#### A. **Gunakan Incognito Mode**
- Chrome: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`

#### B. **Cek Port yang Benar**
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

#### C. **Restart Kedua Server**
```bash
# Terminal 1
cd backend
python run.py

# Terminal 2  
cd frontend
npm run dev
```

## 🔍 Debugging CORS:

### **1. Cek Backend Response Headers**
```bash
curl -I http://localhost:5000/api/auth/login
```

### **2. Cek Frontend Origin**
```javascript
console.log(window.location.origin); // Should be http://localhost:5173
```

### **3. Browser Developer Tools**
- F12 → Network Tab
- Lihat request headers dan response headers
- Cari `Access-Control-Allow-Origin`

## ⚠️ Common Issues:

### **Issue 1: Wrong Port**
- ❌ Frontend di port 3000
- ✅ Frontend harus di port 5173

### **Issue 2: Wrong Protocol**
- ❌ https://localhost:5173
- ✅ http://localhost:5173

### **Issue 3: Browser Cache**
- ❌ Old CORS policy cached
- ✅ Clear cache atau incognito mode

### **Issue 4: Backend Not Running**
- ❌ Backend stopped
- ✅ Check http://localhost:5000

## ✅ Verification Checklist:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Browser cache cleared
- [ ] CORS headers configured
- [ ] No proxy/VPN interfering

## 🎯 Expected Result:

Setelah fix ini, login request akan berhasil dan Anda akan melihat:
```
POST http://localhost:5000/api/auth/login 200 OK
```

## 📞 Still Having Issues?

1. **Restart komputer** (last resort)
2. **Coba browser lain** (Chrome, Firefox, Edge)
3. **Disable antivirus/firewall** sementara
4. **Check Windows Defender** firewall settings