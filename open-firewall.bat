@echo off
netsh advfirewall firewall add rule name="KROSS-8080" dir=in action=allow protocol=TCP localport=8080
netsh advfirewall firewall add rule name="KROSS-5173" dir=in action=allow protocol=TCP localport=5173
echo.
echo Gotovo. Teper na telefone: http://192.168.0.107:8080
pause
