import os

images_dir = os.path.join("assets", "images")

def write_svg(filepath, content):
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Generated {filepath}")

# 1. Office CPU
write_svg(os.path.join(images_dir, "cpu_office.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <rect x="15" y="15" width="130" height="130" rx="10" fill="#0369a1" stroke="#38bdf8" stroke-width="2.5"/>
  <polygon points="15,30 30,15 15,15" fill="#facc15"/>
  <rect x="35" y="35" width="90" height="90" rx="6" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
  <text x="80" y="65" font-family="Montserrat, Segoe UI, sans-serif" font-weight="900" font-size="11" fill="#0f172a" text-anchor="middle">OFFICE CPU</text>
  <text x="80" y="82" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#0284c7" text-anchor="middle">4 Cores • 4.3 GHz</text>
  <text x="80" y="98" font-family="Segoe UI, sans-serif" font-size="9" fill="#1e293b" text-anchor="middle">+ Вбудоване iGPU</text>
  <text x="80" y="112" font-family="Segoe UI, sans-serif" font-weight="600" font-size="8" fill="#16a34a" text-anchor="middle">TDP: 60 Вт • Економний</text>
</svg>''')

# 2. Gaming CPU
write_svg(os.path.join(images_dir, "cpu_gaming.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <rect x="15" y="15" width="130" height="130" rx="10" fill="#7c3aed" stroke="#c084fc" stroke-width="2.5"/>
  <polygon points="15,30 30,15 15,15" fill="#facc15"/>
  <rect x="35" y="35" width="90" height="90" rx="6" fill="#1e1b4b" stroke="#a855f7" stroke-width="2"/>
  <text x="80" y="63" font-family="Montserrat, Segoe UI, sans-serif" font-weight="900" font-size="11" fill="#f8fafc" text-anchor="middle">GAMING 3D-V</text>
  <text x="80" y="80" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">8C / 16T • 5.0 GHz</text>
  <text x="80" y="97" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="9" fill="#facc15" text-anchor="middle">96 MB L3 Cache</text>
  <text x="80" y="112" font-family="Segoe UI, sans-serif" font-weight="600" font-size="8" fill="#e9d5ff" text-anchor="middle">Високий FPS в іграх</text>
</svg>''')

# 3. Server CPU
write_svg(os.path.join(images_dir, "cpu_server.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 150" width="100%" height="100%">
  <!-- Large rectangular server socket -->
  <rect x="10" y="15" width="160" height="120" rx="8" fill="#065f46" stroke="#34d399" stroke-width="2.5"/>
  <rect x="25" y="28" width="130" height="94" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
  <text x="90" y="52" font-family="Montserrat, Segoe UI, sans-serif" font-weight="900" font-size="11" fill="#34d399" text-anchor="middle" letter-spacing="1">SERVER ENTERPRISE</text>
  <text x="90" y="70" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#f8fafc" text-anchor="middle">32 Ядра / 64 Потоки</text>
  <text x="90" y="86" font-family="Segoe UI, sans-serif" font-size="9" fill="#facc15" text-anchor="middle">8-канал ECC RAM • 256MB Кеш</text>
  <text x="90" y="102" font-family="Segoe UI, sans-serif" font-size="8" fill="#93c5fd" text-anchor="middle">128 ліній PCIe 5.0 • Робота 24/7</text>
</svg>''')

# 4. Outdated Dual Core CPU
write_svg(os.path.join(images_dir, "cpu_outdated.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <rect x="15" y="15" width="130" height="130" rx="10" fill="#334155" stroke="#64748b" stroke-width="2"/>
  <rect x="35" y="35" width="90" height="90" rx="6" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="80" y="65" font-family="Montserrat, Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#f1f5f9" text-anchor="middle">LEGACY DUAL-CORE</text>
  <text x="80" y="82" font-family="Segoe UI, sans-serif" font-size="9" fill="#cbd5e1" text-anchor="middle">2 ядра / 2 потоки</text>
  <text x="80" y="98" font-family="Segoe UI, sans-serif" font-size="9" fill="#ef4444" text-anchor="middle">1.8 GHz • Лише 2MB кеш</text>
  <text x="80" y="112" font-family="Segoe UI, sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">Застарілий (гальмує)</text>
</svg>''')

# 5. IoT Microcontroller Chip
write_svg(os.path.join(images_dir, "cpu_iot.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <rect x="25" y="25" width="110" height="110" rx="4" fill="#1e293b" stroke="#eab308" stroke-width="2"/>
  <!-- Many small micro pins -->
  <g fill="#ca8a04">
    <rect x="35" y="15" width="6" height="10"/>
    <rect x="55" y="15" width="6" height="10"/>
    <rect x="75" y="15" width="6" height="10"/>
    <rect x="95" y="15" width="6" height="10"/>
    <rect x="115" y="15" width="6" height="10"/>
  </g>
  <text x="80" y="65" font-family="Montserrat, Segoe UI, sans-serif" font-weight="900" font-size="9" fill="#facc15" text-anchor="middle">MICRO ARM IOT</text>
  <text x="80" y="82" font-family="Segoe UI, sans-serif" font-size="8.5" fill="#f8fafc" text-anchor="middle">1 мікроядро • 120 MHz</text>
  <text x="80" y="98" font-family="Segoe UI, sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">512 KB SRAM • 0.1 Вт</text>
  <text x="80" y="112" font-family="Segoe UI, sans-serif" font-size="7.5" fill="#f59e0b" text-anchor="middle">Лише для датчиків/годинників</text>
</svg>''')

# 6. Specialized Crypto/ASIC Chip
write_svg(os.path.join(images_dir, "cpu_asic.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <rect x="15" y="15" width="130" height="130" rx="8" fill="#18181b" stroke="#ef4444" stroke-width="2"/>
  <rect x="35" y="35" width="90" height="90" rx="4" fill="#27272a" stroke="#71717a" stroke-width="1.5"/>
  <text x="80" y="63" font-family="Montserrat, Segoe UI, sans-serif" font-weight="900" font-size="10" fill="#ef4444" text-anchor="middle">MINING ASIC CHIP</text>
  <text x="80" y="80" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="8.5" fill="#f8fafc" text-anchor="middle">Тільки хеш SHA-256</text>
  <text x="80" y="96" font-family="Segoe UI, sans-serif" font-size="8" fill="#fca5a5" text-anchor="middle">Не запускає Windows/ігри</text>
  <text x="80" y="112" font-family="Segoe UI, sans-serif" font-size="7.5" fill="#a1a1aa" text-anchor="middle">Без інструкцій x86 ПК</text>
</svg>''')

print("Generated 6 new CPU variant SVGs successfully!")
