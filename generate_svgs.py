"""
Generator for HardwareQuest SVG assets.
Creates modern, colorful, lightweight vector graphics for PC components.
"""
import os

images_dir = os.path.join("assets", "images")
icons_dir = os.path.join("assets", "icons")
os.makedirs(images_dir, exist_ok=True)
os.makedirs(icons_dir, exist_ok=True)

def write_svg(filepath, content):
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Generated {filepath}")

# 1. CPU
write_svg(os.path.join(images_dir, "cpu.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="cpuBase" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="cpuCap" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="50%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <linearGradient id="goldPin" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
  </defs>
  <!-- PCB Substrate -->
  <rect x="20" y="20" width="160" height="160" rx="12" fill="#047857" stroke="#10b981" stroke-width="3"/>
  <!-- Corner notch -->
  <polygon points="20,40 40,20 20,20" fill="#facc15"/>
  <!-- Trace lines -->
  <path d="M40 30 H70 V50 M160 30 H130 V50 M40 170 H70 V150 M160 170 H130 V150" stroke="#34d399" stroke-width="2" fill="none" opacity="0.6"/>
  <!-- Gold contact dots -->
  <circle cx="35" cy="70" r="3" fill="#facc15"/>
  <circle cx="35" cy="90" r="3" fill="#facc15"/>
  <circle cx="35" cy="110" r="3" fill="#facc15"/>
  <circle cx="35" cy="130" r="3" fill="#facc15"/>
  <circle cx="165" cy="70" r="3" fill="#facc15"/>
  <circle cx="165" cy="90" r="3" fill="#facc15"/>
  <circle cx="165" cy="110" r="3" fill="#facc15"/>
  <circle cx="165" cy="130" r="3" fill="#facc15"/>
  <!-- Integrated Heat Spreader (IHS) -->
  <rect x="45" y="45" width="110" height="110" rx="8" fill="url(#cpuCap)" stroke="#475569" stroke-width="2"/>
  <rect x="52" y="52" width="96" height="96" rx="4" fill="#334155" opacity="0.15"/>
  <!-- CPU Branding / Text -->
  <text x="100" y="85" font-family="Segoe UI, sans-serif" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle" letter-spacing="2">CPU CORE</text>
  <text x="100" y="105" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="12" fill="#1e293b" text-anchor="middle">8 CORES • 4.5 GHz</text>
  <text x="100" y="122" font-family="Segoe UI, sans-serif" font-size="10" fill="#475569" text-anchor="middle">LGA 1700 / AM5</text>
  <circle cx="62" cy="62" r="3" fill="#64748b"/>
</svg>''')

# 2. RAM
write_svg(os.path.join(images_dir, "ram.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120" width="100%" height="100%">
  <defs>
    <linearGradient id="ramBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#075985"/>
    </linearGradient>
    <linearGradient id="heatSink" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- PCB -->
  <rect x="10" y="25" width="220" height="70" rx="4" fill="url(#ramBody)" stroke="#38bdf8" stroke-width="2"/>
  <!-- Heat spreader decorative ridges -->
  <rect x="20" y="30" width="200" height="40" rx="3" fill="url(#heatSink)"/>
  <!-- RGB Bar on top -->
  <path d="M22 30 H218 V34 H22 Z" fill="url(#ramBody)"/>
  <rect x="25" y="30" width="190" height="4" fill="#a855f7" filter="drop-shadow(0 0 3px #c084fc)"/>
  <!-- Memory Chips -->
  <rect x="30" y="40" width="26" height="24" rx="2" fill="#334155" stroke="#475569" stroke-width="1"/>
  <rect x="65" y="40" width="26" height="24" rx="2" fill="#334155" stroke="#475569" stroke-width="1"/>
  <rect x="100" y="40" width="26" height="24" rx="2" fill="#334155" stroke="#475569" stroke-width="1"/>
  <rect x="145" y="40" width="26" height="24" rx="2" fill="#334155" stroke="#475569" stroke-width="1"/>
  <rect x="180" y="40" width="26" height="24" rx="2" fill="#334155" stroke="#475569" stroke-width="1"/>
  <text x="120" y="86" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="11" fill="#e0f2fe" text-anchor="middle">DDR5 32GB 6000MHz</text>
  <!-- Golden connector pins -->
  <g fill="#facc15">
    <rect x="16" y="93" width="90" height="10"/>
    <!-- Key notch in center -->
    <rect x="115" y="93" width="105" height="10"/>
  </g>
  <!-- Individual pin lines -->
  <path d="M20 93 V103 M25 93 V103 M30 93 V103 M35 93 V103 M40 93 V103 M45 93 V103 M50 93 V103 M55 93 V103 M60 93 V103 M65 93 V103 M70 93 V103 M75 93 V103 M80 93 V103 M85 93 V103 M90 93 V103 M95 93 V103 M100 93 V103 M120 93 V103 M125 93 V103 M130 93 V103 M135 93 V103 M140 93 V103 M145 93 V103 M150 93 V103 M155 93 V103 M160 93 V103 M165 93 V103 M170 93 V103 M175 93 V103 M180 93 V103 M185 93 V103 M190 93 V103 M195 93 V103 M200 93 V103 M205 93 V103 M210 93 V103 M215 93 V103" stroke="#854d0e" stroke-width="1"/>
</svg>''')

# 3. SSD NVMe & SATA
write_svg(os.path.join(images_dir, "ssd.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120" width="100%" height="100%">
  <defs>
    <linearGradient id="ssdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1e24"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="nvmePcb" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#047857"/>
      <stop offset="100%" stop-color="#065f46"/>
    </linearGradient>
  </defs>
  <!-- M.2 NVMe SSD stick -->
  <rect x="20" y="28" width="195" height="64" rx="4" fill="url(#nvmePcb)" stroke="#10b981" stroke-width="2"/>
  <!-- Notch on left -->
  <circle cx="20" cy="60" r="5" fill="#0a0e17"/>
  <!-- NAND flash memory chips -->
  <rect x="75" y="36" width="45" height="48" rx="2" fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
  <rect x="130" y="36" width="45" height="48" rx="2" fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
  <!-- Controller Chip -->
  <rect x="42" y="44" width="24" height="32" rx="2" fill="#374151" stroke="#4b5563" stroke-width="1"/>
  <!-- PCIe Connector pins on right -->
  <rect x="213" y="35" width="8" height="18" fill="#facc15"/>
  <rect x="213" y="58" width="8" height="26" fill="#facc15"/>
  <text x="97" y="64" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="9" fill="#9ca3af" text-anchor="middle">NAND 1TB</text>
  <text x="152" y="64" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="9" fill="#9ca3af" text-anchor="middle">NAND 1TB</text>
  <text x="54" y="62" font-family="Segoe UI, sans-serif" font-size="7" fill="#60a5fa" text-anchor="middle">NVMe</text>
  <text x="110" y="105" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="12" fill="#34d399" text-anchor="middle">M.2 NVMe SSD 7000 MB/s</text>
</svg>''')

# 4. HDD
write_svg(os.path.join(images_dir, "hdd.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="hddPlatter" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e2e8f0"/>
      <stop offset="50%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
  </defs>
  <!-- HDD Enclosure -->
  <rect x="25" y="15" width="150" height="170" rx="10" fill="#1e293b" stroke="#475569" stroke-width="3"/>
  <!-- Recessed interior platter chamber -->
  <rect x="35" y="25" width="130" height="150" rx="6" fill="#0f172a"/>
  <!-- Circular magnetic platter -->
  <circle cx="100" cy="85" r="54" fill="url(#hddPlatter)" stroke="#64748b" stroke-width="2"/>
  <circle cx="100" cy="85" r="38" fill="none" stroke="#94a3b8" stroke-dasharray="3,3"/>
  <!-- Spindle Motor Hub -->
  <circle cx="100" cy="85" r="16" fill="#334155" stroke="#f8fafc" stroke-width="2"/>
  <circle cx="100" cy="85" r="5" fill="#f8fafc"/>
  <!-- Actuator arm and head -->
  <circle cx="50" cy="145" r="10" fill="#64748b" stroke="#cbd5e1" stroke-width="2"/>
  <path d="M52 143 L94 92 L98 94 L56 148 Z" fill="#94a3b8"/>
  <polygon points="94,92 105,87 98,94" fill="#facc15"/>
  <!-- Screws and connector -->
  <circle cx="32" cy="22" r="3" fill="#94a3b8"/>
  <circle cx="168" cy="22" r="3" fill="#94a3b8"/>
  <circle cx="32" cy="178" r="3" fill="#94a3b8"/>
  <circle cx="168" cy="178" r="3" fill="#94a3b8"/>
  <rect x="130" y="172" width="30" height="8" fill="#facc15"/>
  <text x="100" y="165" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">HDD 4TB (7200 RPM)</text>
</svg>''')

# 5. ROM BIOS
write_svg(os.path.join(images_dir, "rom.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <!-- Chip Body -->
  <rect x="40" y="25" width="80" height="110" rx="4" fill="#1e293b" stroke="#334155" stroke-width="2"/>
  <!-- Notch -->
  <circle cx="80" cy="25" r="6" fill="#0f172a"/>
  <!-- Pins Left -->
  <g fill="#cbd5e1">
    <rect x="22" y="36" width="18" height="6" rx="1"/>
    <rect x="22" y="52" width="18" height="6" rx="1"/>
    <rect x="22" y="68" width="18" height="6" rx="1"/>
    <rect x="22" y="84" width="18" height="6" rx="1"/>
    <rect x="22" y="100" width="18" height="6" rx="1"/>
    <rect x="22" y="116" width="18" height="6" rx="1"/>
    <!-- Pins Right -->
    <rect x="120" y="36" width="18" height="6" rx="1"/>
    <rect x="120" y="52" width="18" height="6" rx="1"/>
    <rect x="120" y="68" width="18" height="6" rx="1"/>
    <rect x="120" y="84" width="18" height="6" rx="1"/>
    <rect x="120" y="100" width="18" height="6" rx="1"/>
    <rect x="120" y="116" width="18" height="6" rx="1"/>
  </g>
  <text x="80" y="65" font-family="Segoe UI, sans-serif" font-weight="900" font-size="12" fill="#38bdf8" text-anchor="middle">BIOS / UEFI</text>
  <text x="80" y="82" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#94a3b8" text-anchor="middle">ROM CHIP</text>
  <text x="80" y="102" font-family="Segoe UI, sans-serif" font-size="8" fill="#facc15" text-anchor="middle">Енергонезалежна</text>
</svg>''')

# 6. Flash USB
write_svg(os.path.join(images_dir, "flash.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120" width="100%" height="100%">
  <!-- USB Connector -->
  <rect x="15" y="44" width="35" height="32" rx="2" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
  <rect x="25" y="50" width="8" height="6" fill="#475569"/>
  <rect x="25" y="64" width="8" height="6" fill="#475569"/>
  <!-- Flash Drive Body -->
  <rect x="48" y="32" width="112" height="56" rx="8" fill="#8b5cf6" stroke="#c084fc" stroke-width="2"/>
  <circle cx="145" cy="60" r="7" fill="#6d28d9"/>
  <!-- Status LED -->
  <circle cx="62" cy="60" r="3" fill="#4ade80"/>
  <text x="105" y="56" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">USB 3.2</text>
  <text x="105" y="72" font-family="Segoe UI, sans-serif" font-size="9" fill="#e9d5ff" text-anchor="middle">128 GB Flash</text>
</svg>''')

# 7. Optical Disk DVD
write_svg(os.path.join(images_dir, "dvd.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <defs>
    <radialGradient id="dvdRainbow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#cbd5e1"/>
      <stop offset="60%" stop-color="#a7f3d0"/>
      <stop offset="80%" stop-color="#bfdbfe"/>
      <stop offset="100%" stop-color="#fbcfe8"/>
    </radialGradient>
  </defs>
  <circle cx="80" cy="80" r="70" fill="url(#dvdRainbow)" stroke="#94a3b8" stroke-width="2"/>
  <!-- Track reflection ring -->
  <circle cx="80" cy="80" r="50" fill="none" stroke="#60a5fa" stroke-width="1.5" opacity="0.4"/>
  <circle cx="80" cy="80" r="30" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
  <!-- Center hole -->
  <circle cx="80" cy="80" r="12" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
  <text x="80" y="42" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#475569" text-anchor="middle">DVD-RW 4.7 GB</text>
</svg>''')

# 8. Motherboard
write_svg(os.path.join(images_dir, "motherboard.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- PCB -->
  <rect x="10" y="10" width="180" height="180" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2.5"/>
  <!-- CPU Socket -->
  <rect x="70" y="40" width="60" height="60" rx="4" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
  <circle cx="100" cy="70" r="16" fill="#334155"/>
  <text x="100" y="74" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="8" fill="#facc15" text-anchor="middle">SOCKET</text>
  <!-- RAM Slots -->
  <rect x="145" y="35" width="8" height="70" rx="1" fill="#0284c7" stroke="#38bdf8"/>
  <rect x="160" y="35" width="8" height="70" rx="1" fill="#0284c7" stroke="#38bdf8"/>
  <!-- PCIe Slots -->
  <rect x="30" y="120" width="100" height="10" rx="2" fill="#475569" stroke="#94a3b8"/>
  <rect x="30" y="145" width="70" height="8" rx="2" fill="#334155" stroke="#64748b"/>
  <!-- Chipset with heatsink -->
  <rect x="140" y="130" width="35" height="35" rx="3" fill="#0284c7" stroke="#38bdf8"/>
  <!-- VRM Heatsink -->
  <rect x="40" y="38" width="20" height="64" rx="2" fill="#475569"/>
  <!-- Back IO panel -->
  <rect x="12" y="25" width="14" height="60" fill="#334155"/>
  <text x="100" y="180" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">МАТЕРИНСЬКА ПЛАТА</text>
</svg>''')

# 9. Input Devices: Keyboard, Mouse, Scanner, Mic, Webcam, Graphics Tablet, Touchscreen, Gamepad
write_svg(os.path.join(images_dir, "keyboard.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="100%" height="100%">
  <rect x="10" y="20" width="180" height="80" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <!-- Key rows -->
  <g fill="#334155" stroke="#475569" stroke-width="1" rx="2">
    <!-- Row 1 -->
    <rect x="20" y="30" width="12" height="10" rx="2"/>
    <rect x="36" y="30" width="12" height="10" rx="2"/>
    <rect x="52" y="30" width="12" height="10" rx="2"/>
    <rect x="68" y="30" width="12" height="10" rx="2"/>
    <rect x="84" y="30" width="12" height="10" rx="2"/>
    <rect x="100" y="30" width="12" height="10" rx="2"/>
    <rect x="116" y="30" width="12" height="10" rx="2"/>
    <rect x="132" y="30" width="12" height="10" rx="2"/>
    <rect x="148" y="30" width="12" height="10" rx="2"/>
    <rect x="164" y="30" width="16" height="10" rx="2"/>
    <!-- Row 2 -->
    <rect x="20" y="44" width="16" height="10" rx="2"/>
    <rect x="40" y="44" width="12" height="10" rx="2"/>
    <rect x="56" y="44" width="12" height="10" rx="2"/>
    <rect x="72" y="44" width="12" height="10" rx="2"/>
    <rect x="88" y="44" width="12" height="10" rx="2"/>
    <rect x="104" y="44" width="12" height="10" rx="2"/>
    <rect x="120" y="44" width="12" height="10" rx="2"/>
    <rect x="136" y="44" width="12" height="10" rx="2"/>
    <rect x="152" y="44" width="28" height="10" rx="2"/>
    <!-- Row 3 (Spacebar) -->
    <rect x="20" y="58" width="20" height="10" rx="2"/>
    <rect x="44" y="58" width="12" height="10" rx="2"/>
    <rect x="60" y="58" width="60" height="10" rx="2" fill="#0284c7" stroke="#38bdf8"/>
    <rect x="124" y="58" width="12" height="10" rx="2"/>
    <rect x="140" y="58" width="40" height="10" rx="2"/>
  </g>
  <!-- Underglow / RGB -->
  <line x1="20" y1="88" x2="180" y2="88" stroke="#a855f7" stroke-width="3" filter="drop-shadow(0 0 4px #c084fc)"/>
  <text x="100" y="112" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">КЛАВІАТУРА</text>
</svg>''')

write_svg(os.path.join(images_dir, "mouse.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 180" width="100%" height="100%">
  <!-- Mouse body -->
  <path d="M70 15 C35 15, 25 50, 25 100 C25 145, 45 165, 70 165 C95 165, 115 145, 115 100 C115 50, 105 15, 70 15 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Button split line -->
  <line x1="70" y1="15" x2="70" y2="75" stroke="#38bdf8" stroke-width="1.5"/>
  <!-- Scroll Wheel -->
  <rect x="65" y="35" width="10" height="22" rx="4" fill="#0284c7" stroke="#67e8f9" stroke-width="1"/>
  <!-- DPI switch button -->
  <rect x="67" y="65" width="6" height="8" rx="2" fill="#facc15"/>
  <!-- Ergonomic side thumb grip -->
  <path d="M26 80 C29 95, 29 115, 26 130" stroke="#0ea5e9" stroke-width="3" fill="none"/>
  <!-- Glowing logo -->
  <circle cx="70" cy="120" r="12" fill="none" stroke="#a855f7" stroke-width="2"/>
  <polygon points="70,113 77,125 63,125" fill="#a855f7"/>
</svg>''')

write_svg(os.path.join(images_dir, "scanner.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140" width="100%" height="100%">
  <!-- Scanner base -->
  <rect x="15" y="35" width="150" height="80" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>
  <!-- Glass bed area -->
  <rect x="25" y="45" width="130" height="60" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>
  <!-- Scan Light Bar (Cyan beam) -->
  <line x1="70" y1="46" x2="70" y2="104" stroke="#00f3ff" stroke-width="4" filter="drop-shadow(0 0 6px #00f3ff)"/>
  <!-- Scanned sheet of paper preview -->
  <rect x="80" y="52" width="65" height="46" rx="2" fill="#ffffff" opacity="0.85"/>
  <line x1="88" y1="60" x2="135" y2="60" stroke="#94a3b8" stroke-width="2"/>
  <line x1="88" y1="68" x2="130" y2="68" stroke="#94a3b8" stroke-width="2"/>
  <line x1="88" y1="76" x2="120" y2="76" stroke="#94a3b8" stroke-width="2"/>
  <!-- Open Lid (angled) -->
  <polygon points="15,35 165,35 155,10 25,10" fill="#334155" stroke="#64748b" stroke-width="2"/>
  <text x="90" y="130" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">ПЛАНШЕТНИЙ СКАНЕР</text>
</svg>''')

write_svg(os.path.join(images_dir, "mic.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 180" width="100%" height="100%">
  <!-- Stand base -->
  <ellipse cx="70" cy="165" rx="35" ry="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>
  <rect x="67" y="115" width="6" height="50" fill="#64748b"/>
  <!-- U-shaped cradle holder -->
  <path d="M40 85 C40 120, 100 120, 100 85" fill="none" stroke="#94a3b8" stroke-width="4"/>
  <!-- Condenser Microphone Capsule -->
  <rect x="52" y="30" width="36" height="65" rx="18" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Mesh Grill Texture -->
  <rect x="55" y="32" width="30" height="30" rx="15" fill="#1e293b"/>
  <line x1="58" y1="40" x2="82" y2="40" stroke="#0284c7" stroke-width="1.5"/>
  <line x1="58" y1="47" x2="82" y2="47" stroke="#0284c7" stroke-width="1.5"/>
  <line x1="58" y1="54" x2="82" y2="54" stroke="#0284c7" stroke-width="1.5"/>
  <!-- Gain knob -->
  <circle cx="70" cy="78" r="4" fill="#facc15"/>
  <!-- Sound waves -->
  <path d="M30 45 C20 55, 20 65, 30 75" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <path d="M110 45 C120 55, 120 65, 110 75" fill="none" stroke="#38bdf8" stroke-width="2"/>
</svg>''')

write_svg(os.path.join(images_dir, "webcam.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <!-- Monitor clip / base -->
  <rect x="65" y="115" width="30" height="30" rx="3" fill="#334155"/>
  <rect x="50" y="140" width="60" height="8" rx="2" fill="#1e293b" stroke="#475569"/>
  <!-- Webcam cylindrical body -->
  <rect x="25" y="45" width="110" height="55" rx="27" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <!-- Camera Lens rings -->
  <circle cx="80" cy="72" r="22" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
  <circle cx="80" cy="72" r="14" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="80" cy="72" r="6" fill="#0c4a6e"/>
  <!-- Glass reflection glint -->
  <circle cx="83" cy="69" r="3" fill="#ffffff"/>
  <!-- Power & Privacy LED -->
  <circle cx="45" cy="72" r="3" fill="#4ade80"/>
  <!-- Stereo Mics -->
  <circle cx="120" cy="68" r="2" fill="#94a3b8"/>
  <circle cx="120" cy="76" r="2" fill="#94a3b8"/>
</svg>''')

write_svg(os.path.join(images_dir, "graphics_tablet.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="100%" height="100%">
  <!-- Tablet base -->
  <rect x="15" y="15" width="170" height="120" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="2.5"/>
  <!-- Drawing active area -->
  <rect x="60" y="25" width="115" height="100" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>
  <!-- Express keys -->
  <circle cx="36" cy="38" r="8" fill="#334155" stroke="#94a3b8"/>
  <circle cx="36" cy="60" r="8" fill="#334155" stroke="#94a3b8"/>
  <circle cx="36" cy="82" r="8" fill="#334155" stroke="#94a3b8"/>
  <circle cx="36" cy="104" r="8" fill="#334155" stroke="#94a3b8"/>
  <!-- Digital Stylus Pen (angled) -->
  <g transform="rotate(-30 135 60)">
    <rect x="125" y="20" width="10" height="70" rx="5" fill="#3b82f6" stroke="#93c5fd"/>
    <polygon points="125,90 135,90 130,105" fill="#1e293b"/>
    <circle cx="130" cy="50" r="2" fill="#facc15"/>
  </g>
  <text x="117" y="78" font-family="Segoe UI, sans-serif" font-size="10" fill="#a855f7" opacity="0.6" text-anchor="middle">ACTIVE AREA</text>
</svg>''')

write_svg(os.path.join(images_dir, "touchscreen.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 150" width="100%" height="100%">
  <!-- Screen Frame -->
  <rect x="20" y="15" width="140" height="105" rx="8" fill="#0f172a" stroke="#00f3ff" stroke-width="2"/>
  <rect x="28" y="23" width="124" height="89" rx="4" fill="#1e293b"/>
  <!-- Touch ripple effect -->
  <circle cx="90" cy="65" r="18" fill="none" stroke="#00f3ff" stroke-width="2" opacity="0.7"/>
  <circle cx="90" cy="65" r="28" fill="none" stroke="#00f3ff" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.4"/>
  <!-- Touching finger silhouette -->
  <path d="M90 65 L98 85 L94 125 L84 125 L82 85 Z" fill="#fbcfe8" stroke="#f472b6" stroke-width="2"/>
  <text x="90" y="140" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#00f3ff" text-anchor="middle">СЕНСОРНИЙ ЕКРАН</text>
</svg>''')

write_svg(os.path.join(images_dir, "gamepad.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140" width="100%" height="100%">
  <!-- Gamepad body -->
  <path d="M45 40 C65 38, 115 38, 135 40 C160 42, 175 75, 160 115 C150 135, 130 130, 115 105 C105 92, 75 92, 65 105 C50 130, 30 135, 20 115 C5 75, 20 42, 45 40 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- D-Pad (Left) -->
  <rect x="42" y="62" width="18" height="6" fill="#94a3b8"/>
  <rect x="48" y="56" width="6" height="18" fill="#94a3b8"/>
  <!-- Action Buttons (Right) -->
  <circle cx="125" cy="58" r="4" fill="#ef4444"/>
  <circle cx="135" cy="68" r="4" fill="#3b82f6"/>
  <circle cx="115" cy="68" r="4" fill="#eab308"/>
  <circle cx="125" cy="78" r="4" fill="#22c55e"/>
  <!-- Analog sticks -->
  <circle cx="68" cy="85" r="10" fill="#334155" stroke="#64748b"/>
  <circle cx="112" cy="85" r="10" fill="#334155" stroke="#64748b"/>
</svg>''')

# 10. Output Devices: Monitor, Laser Printer, Inkjet Printer, 3D Printer, Plotter, Projector, Speakers
write_svg(os.path.join(images_dir, "monitor.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="100%" height="100%">
  <!-- Stand base -->
  <ellipse cx="100" cy="150" rx="36" ry="6" fill="#334155" stroke="#475569" stroke-width="2"/>
  <rect x="95" y="115" width="10" height="35" fill="#475569"/>
  <!-- Display Panel -->
  <rect x="15" y="15" width="170" height="105" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Screen Area -->
  <rect x="22" y="22" width="156" height="91" rx="2" fill="#1e293b"/>
  <!-- Graphic wallpaper inside screen -->
  <polygon points="22,113 70,65 110,85 150,50 178,80 178,113" fill="#0284c7" opacity="0.5"/>
  <circle cx="140" cy="45" r="10" fill="#facc15" opacity="0.9"/>
  <text x="100" y="105" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="9" fill="#38bdf8" text-anchor="middle">144Hz • 4K UHD IPS</text>
</svg>''')

write_svg(os.path.join(images_dir, "printer_laser.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 150" width="100%" height="100%">
  <!-- Paper tray top -->
  <rect x="45" y="15" width="90" height="30" rx="2" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <line x1="55" y1="25" x2="125" y2="25" stroke="#94a3b8" stroke-width="2"/>
  <!-- Printer body -->
  <rect x="20" y="40" width="140" height="85" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <!-- Output slot -->
  <rect x="35" y="65" width="110" height="12" rx="3" fill="#0f172a"/>
  <!-- Printed page coming out -->
  <rect x="50" y="70" width="80" height="25" rx="1" fill="#f8fafc" stroke="#cbd5e1"/>
  <line x1="60" y1="78" x2="110" y2="78" stroke="#334155" stroke-width="1.5"/>
  <line x1="60" y1="84" x2="100" y2="84" stroke="#334155" stroke-width="1.5"/>
  <!-- Control Panel -->
  <circle cx="140" cy="54" r="4" fill="#22c55e"/>
  <circle cx="150" cy="54" r="3" fill="#38bdf8"/>
  <text x="90" y="142" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">ЛАЗЕРНИЙ ПРИНТЕР</text>
</svg>''')

write_svg(os.path.join(images_dir, "printer_inkjet.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 150" width="100%" height="100%">
  <!-- Printer Body -->
  <rect x="15" y="45" width="150" height="75" rx="6" fill="#1e293b" stroke="#ec4899" stroke-width="2"/>
  <!-- Ink Tanks Window (CMYK) -->
  <rect x="125" y="65" width="30" height="35" rx="3" fill="#0f172a" stroke="#475569"/>
  <rect x="128" y="72" width="4" height="24" fill="#06b6d4"/>
  <rect x="134" y="72" width="4" height="24" fill="#ec4899"/>
  <rect x="140" y="72" width="4" height="24" fill="#facc15"/>
  <rect x="146" y="72" width="4" height="24" fill="#0f172a" stroke="#fff" stroke-width="0.5"/>
  <!-- Photo coming out -->
  <rect x="35" y="60" width="80" height="45" rx="2" fill="#fdf2f8" stroke="#f472b6"/>
  <!-- Mini colorful photo illustration -->
  <circle cx="55" cy="78" r="8" fill="#fb923c"/>
  <polygon points="40,95 65,80 90,95" fill="#22c55e"/>
  <text x="90" y="140" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#ec4899" text-anchor="middle">СТРУМЕНЕВИЙ ФОТОПРИНТЕР</text>
</svg>''')

write_svg(os.path.join(images_dir, "printer_3d.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="100%" height="100%">
  <!-- Gantry Frame -->
  <rect x="25" y="20" width="130" height="135" fill="none" stroke="#38bdf8" stroke-width="4"/>
  <!-- Heated Bed plate -->
  <rect x="40" y="125" width="100" height="12" fill="#334155" stroke="#facc15" stroke-width="1.5"/>
  <!-- 3D printed object on bed -->
  <polygon points="90,75 110,125 70,125" fill="#a855f7" stroke="#c084fc" stroke-width="1.5"/>
  <!-- X-Axis rail & Extruder Carriage -->
  <line x1="25" y1="65" x2="155" y2="65" stroke="#94a3b8" stroke-width="4"/>
  <rect x="75" y="52" width="30" height="22" rx="3" fill="#ef4444"/>
  <!-- Extruder Nozzle -->
  <polygon points="86,74 94,74 90,82" fill="#facc15"/>
  <!-- Filament spool on top -->
  <circle cx="130" cy="16" r="10" fill="#a855f7" stroke="#cbd5e1" stroke-width="2"/>
  <text x="90" y="170" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#facc15" text-anchor="middle">3D-ПРИНТЕР</text>
</svg>''')

write_svg(os.path.join(images_dir, "plotter.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="100%" height="100%">
  <!-- Plotter Stand Legs -->
  <line x1="35" y1="90" x2="25" y2="150" stroke="#64748b" stroke-width="4"/>
  <line x1="165" y1="90" x2="175" y2="150" stroke="#64748b" stroke-width="4"/>
  <line x1="20" y1="150" x2="45" y2="150" stroke="#475569" stroke-width="4"/>
  <line x1="155" y1="150" x2="180" y2="150" stroke="#475569" stroke-width="4"/>
  <line x1="30" y1="125" x2="170" y2="125" stroke="#475569" stroke-width="2"/>
  <!-- Wide-format Body -->
  <rect x="20" y="45" width="160" height="48" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Blueprint Paper Roll hanging down (A0 format) -->
  <rect x="40" y="75" width="120" height="45" fill="#f0f9ff" stroke="#38bdf8" stroke-width="1"/>
  <!-- Blueprint CAD lines -->
  <line x1="50" y1="85" x2="150" y2="85" stroke="#0284c7" stroke-width="1.5"/>
  <line x1="60" y1="95" x2="120" y2="95" stroke="#0284c7" stroke-width="1.5"/>
  <rect x="125" y="90" width="20" height="18" fill="none" stroke="#0284c7"/>
  <!-- Print Carriage -->
  <rect x="80" y="48" width="22" height="12" fill="#facc15"/>
  <text x="100" y="35" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">ПЛОТЕР (ШИРОКОФОРМАТНИЙ)</text>
</svg>''')

write_svg(os.path.join(images_dir, "projector.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140" width="100%" height="100%">
  <!-- Projector Body -->
  <rect x="15" y="40" width="110" height="55" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <!-- Main Projector Lens -->
  <circle cx="105" cy="67" r="18" fill="#0f172a" stroke="#67e8f9" stroke-width="3"/>
  <circle cx="105" cy="67" r="10" fill="#0284c7"/>
  <!-- Light Beam projection -->
  <polygon points="123,60 190,25 190,110 123,74" fill="#38bdf8" opacity="0.25"/>
  <!-- Ventilation grill -->
  <line x1="30" y1="52" x2="70" y2="52" stroke="#475569" stroke-width="2"/>
  <line x1="30" y1="60" x2="70" y2="60" stroke="#475569" stroke-width="2"/>
  <line x1="30" y1="68" x2="70" y2="68" stroke="#475569" stroke-width="2"/>
  <line x1="30" y1="76" x2="70" y2="76" stroke="#475569" stroke-width="2"/>
  <!-- Legs -->
  <rect x="25" y="95" width="8" height="6" fill="#475569"/>
  <rect x="105" y="95" width="8" height="6" fill="#475569"/>
  <text x="70" y="125" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">ПРОЕКТОР</text>
</svg>''')

write_svg(os.path.join(images_dir, "speakers.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 150" width="100%" height="100%">
  <!-- Left Speaker -->
  <rect x="15" y="25" width="60" height="100" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <!-- Tweeter -->
  <circle cx="45" cy="50" r="12" fill="#0f172a" stroke="#475569" stroke-width="2"/>
  <circle cx="45" cy="50" r="5" fill="#facc15"/>
  <!-- Woofer -->
  <circle cx="45" cy="95" r="22" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="45" cy="95" r="10" fill="#1e293b" stroke="#67e8f9"/>
  <!-- Right Speaker -->
  <rect x="105" y="25" width="60" height="100" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="135" cy="50" r="12" fill="#0f172a" stroke="#475569" stroke-width="2"/>
  <circle cx="135" cy="50" r="5" fill="#facc15"/>
  <circle cx="135" cy="95" r="22" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="135" cy="95" r="10" fill="#1e293b" stroke="#67e8f9"/>
  <text x="90" y="142" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">АКУСТИЧНА СИСТЕМА</text>
</svg>''')

# 11. Network Devices: Modem, Router, Switch, NIC, WiFi Adapter
write_svg(os.path.join(images_dir, "modem.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140" width="100%" height="100%">
  <!-- ONT / Fiber Modem box -->
  <rect x="30" y="25" width="120" height="85" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <!-- Fiber optic input port & cable -->
  <path d="M10 95 H30" stroke="#facc15" stroke-width="3"/>
  <circle cx="10" cy="95" r="3" fill="#eab308"/>
  <!-- Status LEDs -->
  <circle cx="50" cy="45" r="4" fill="#22c55e"/>
  <circle cx="68" cy="45" r="4" fill="#22c55e"/>
  <circle cx="86" cy="45" r="4" fill="#22c55e"/>
  <circle cx="104" cy="45" r="4" fill="#22c55e"/>
  <text x="50" y="62" font-size="6" fill="#94a3b8" text-anchor="middle">POWER</text>
  <text x="68" y="62" font-size="6" fill="#94a3b8" text-anchor="middle">PON</text>
  <text x="86" y="62" font-size="6" fill="#94a3b8" text-anchor="middle">LOS</text>
  <text x="104" y="62" font-size="6" fill="#94a3b8" text-anchor="middle">LAN</text>
  <text x="90" y="92" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="9" fill="#38bdf8" text-anchor="middle">МОДЕМ / ONT</text>
  <text x="90" y="130" font-family="Segoe UI, sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Сигнал провайдера</text>
</svg>''')

write_svg(os.path.join(images_dir, "router.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="100%" height="100%">
  <!-- Antennas -->
  <line x1="50" y1="65" x2="30" y2="15" stroke="#64748b" stroke-width="4"/>
  <line x1="100" y1="65" x2="100" y2="10" stroke="#64748b" stroke-width="4"/>
  <line x1="150" y1="65" x2="170" y2="15" stroke="#64748b" stroke-width="4"/>
  <!-- Wi-Fi wave arcs -->
  <path d="M85 20 A 18 18 0 0 1 115 20" stroke="#00f3ff" stroke-width="2" fill="none" opacity="0.8"/>
  <path d="M75 12 A 28 28 0 0 1 125 12" stroke="#00f3ff" stroke-width="2" fill="none" opacity="0.5"/>
  <!-- Router Enclosure -->
  <rect x="25" y="65" width="150" height="50" rx="8" fill="#1e293b" stroke="#00f3ff" stroke-width="2"/>
  <!-- Glowing front accent -->
  <line x1="35" y1="90" x2="165" y2="90" stroke="#0284c7" stroke-width="2"/>
  <!-- LEDs -->
  <circle cx="50" cy="100" r="3" fill="#22c55e"/>
  <circle cx="70" cy="100" r="3" fill="#22c55e"/>
  <circle cx="90" cy="100" r="3" fill="#22c55e"/>
  <circle cx="110" cy="100" r="3" fill="#00f3ff"/>
  <circle cx="130" cy="100" r="3" fill="#00f3ff"/>
  <text x="100" y="135" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#00f3ff" text-anchor="middle">МАРШРУТИЗАТОР (РОУТЕР)</text>
</svg>''')

write_svg(os.path.join(images_dir, "switch.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 120" width="100%" height="100%">
  <!-- Switch 1U Metal Rack Case -->
  <rect x="15" y="30" width="190" height="55" rx="4" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
  <!-- RJ-45 Ethernet Ports -->
  <g fill="#1e293b" stroke="#38bdf8" stroke-width="1.5">
    <rect x="30" y="44" width="14" height="14" rx="2"/>
    <rect x="48" y="44" width="14" height="14" rx="2"/>
    <rect x="66" y="44" width="14" height="14" rx="2"/>
    <rect x="84" y="44" width="14" height="14" rx="2"/>
    <rect x="102" y="44" width="14" height="14" rx="2"/>
    <rect x="120" y="44" width="14" height="14" rx="2"/>
    <rect x="138" y="44" width="14" height="14" rx="2"/>
    <rect x="156" y="44" width="14" height="14" rx="2"/>
  </g>
  <!-- Flashing Port Activity LEDs -->
  <circle cx="37" cy="40" r="2" fill="#22c55e"/>
  <circle cx="55" cy="40" r="2" fill="#22c55e"/>
  <circle cx="73" cy="40" r="2" fill="#22c55e"/>
  <circle cx="91" cy="40" r="2" fill="#22c55e"/>
  <circle cx="109" cy="40" r="2" fill="#eab308"/>
  <circle cx="127" cy="40" r="2" fill="#22c55e"/>
  <circle cx="145" cy="40" r="2" fill="#22c55e"/>
  <circle cx="163" cy="40" r="2" fill="#22c55e"/>
  <text x="110" y="105" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">КОМУТАТОР (СВІЧ) - LAN</text>
</svg>''')

write_svg(os.path.join(images_dir, "nic.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140" width="100%" height="100%">
  <!-- Metal Bracket on left -->
  <rect x="20" y="15" width="8" height="110" fill="#94a3b8" stroke="#475569"/>
  <!-- RJ-45 Port in bracket -->
  <rect x="15" y="45" width="18" height="22" rx="2" fill="#0f172a" stroke="#facc15" stroke-width="1.5"/>
  <circle cx="20" cy="40" r="2" fill="#22c55e"/>
  <!-- PCB -->
  <polygon points="28,30 160,30 160,95 130,95 130,110 50,110 50,95 28,95" fill="#047857" stroke="#10b981" stroke-width="2"/>
  <!-- PCIe Connector pins -->
  <rect x="52" y="102" width="76" height="8" fill="#facc15"/>
  <!-- Controller Chip -->
  <rect x="75" y="48" width="35" height="35" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="92" y="69" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="8" fill="#38bdf8" text-anchor="middle">GIGABIT</text>
  <text x="100" y="130" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#10b981" text-anchor="middle">МЕРЕЖЕВА КАРТА (NIC)</text>
</svg>''')

write_svg(os.path.join(images_dir, "wifi_adapter.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" width="100%" height="100%">
  <!-- USB Plug -->
  <rect x="35" y="80" width="22" height="26" rx="2" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
  <!-- Dongle body -->
  <rect x="55" y="70" width="60" height="46" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <!-- Antenna attached -->
  <line x1="105" y1="70" x2="135" y2="15" stroke="#64748b" stroke-width="4"/>
  <!-- Wi-Fi wave -->
  <path d="M125 15 A 10 10 0 0 1 145 15" stroke="#00f3ff" stroke-width="2" fill="none"/>
  <path d="M120 8 A 18 18 0 0 1 150 8" stroke="#00f3ff" stroke-width="1.5" stroke-dasharray="2,2" fill="none"/>
  <text x="85" y="98" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="9" fill="#00f3ff" text-anchor="middle">Wi-Fi 6</text>
  <text x="80" y="132" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="9" fill="#38bdf8" text-anchor="middle">WI-FI АДАПТЕР</text>
</svg>''')

# 12. Computer Types: Desktop, Laptop, Monoblock, Tablet, Smartphone, Server, Supercomputer
write_svg(os.path.join(images_dir, "desktop.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180" width="100%" height="100%">
  <!-- Tower Case -->
  <rect x="110" y="20" width="70" height="135" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Glass Side Panel / RGB inside -->
  <rect x="115" y="35" width="55" height="110" rx="4" fill="#1e293b"/>
  <!-- Glowing fans inside -->
  <circle cx="142" cy="65" r="14" fill="none" stroke="#a855f7" stroke-width="2"/>
  <circle cx="142" cy="110" r="14" fill="none" stroke="#00f3ff" stroke-width="2"/>
  <!-- Monitor beside tower -->
  <rect x="15" y="45" width="85" height="60" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <rect x="20" y="50" width="75" height="48" fill="#0284c7" opacity="0.4"/>
  <!-- Stand -->
  <rect x="52" y="105" width="10" height="18" fill="#64748b"/>
  <rect x="35" y="123" width="45" height="5" rx="2" fill="#475569"/>
  <!-- Keyboard & Mouse -->
  <rect x="25" y="135" width="55" height="10" rx="2" fill="#334155"/>
  <ellipse cx="90" cy="140" rx="6" ry="4" fill="#334155"/>
  <text x="100" y="172" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">НАСТІЛЬНИЙ ПК (ДЕСКТОП)</text>
</svg>''')

write_svg(os.path.join(images_dir, "laptop.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 150" width="100%" height="100%">
  <!-- Laptop Screen Lid (angled) -->
  <polygon points="35,25 145,25 155,95 25,95" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <!-- Screen content -->
  <polygon points="40,32 140,32 148,90 32,90" fill="#1e293b"/>
  <circle cx="90" cy="60" r="14" fill="#0284c7" opacity="0.5"/>
  <circle cx="90" cy="28" r="1.5" fill="#4ade80"/>
  <!-- Base Chassis -->
  <polygon points="25,95 155,95 170,120 10,120" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <!-- Keyboard & Touchpad -->
  <polygon points="38,98 142,98 146,110 34,110" fill="#334155"/>
  <rect x="75" y="112" width="30" height="6" rx="1" fill="#475569"/>
  <text x="90" y="142" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">НОУТБУК (ЛЕПТОП)</text>
</svg>''')

write_svg(os.path.join(images_dir, "monoblock.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 150" width="100%" height="100%">
  <!-- Stand -->
  <path d="M75 110 L85 135 L60 135 L60 140 L120 140 L120 135 L95 135 L105 110 Z" fill="#64748b"/>
  <!-- All-in-one Screen Case -->
  <rect x="15" y="15" width="150" height="98" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <!-- Display -->
  <rect x="22" y="22" width="136" height="78" rx="2" fill="#0f172a"/>
  <!-- Camera dot -->
  <circle cx="90" cy="18" r="1.5" fill="#38bdf8"/>
  <!-- "All in one" label inside screen -->
  <text x="90" y="65" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="9" fill="#00f3ff" text-anchor="middle">ALL-IN-ONE (МОНОБЛОК)</text>
  <text x="90" y="78" font-family="Segoe UI, sans-serif" font-size="7" fill="#94a3b8" text-anchor="middle">ПК + Монітор в одному корпусі</text>
</svg>''')

write_svg(os.path.join(images_dir, "tablet.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 170" width="100%" height="100%">
  <!-- Tablet Frame -->
  <rect x="20" y="15" width="110" height="140" rx="12" fill="#0f172a" stroke="#a855f7" stroke-width="2.5"/>
  <!-- Glass Screen -->
  <rect x="28" y="25" width="94" height="118" rx="6" fill="#1e293b"/>
  <!-- Camera punch-hole -->
  <circle cx="75" cy="20" r="2" fill="#64748b"/>
  <!-- App grid icons -->
  <rect x="36" y="38" width="14" height="14" rx="3" fill="#38bdf8"/>
  <rect x="58" y="38" width="14" height="14" rx="3" fill="#facc15"/>
  <rect x="80" y="38" width="14" height="14" rx="3" fill="#4ade80"/>
  <rect x="100" y="38" width="14" height="14" rx="3" fill="#ec4899"/>
  <!-- Stylus pen alongside -->
  <rect x="135" y="30" width="5" height="80" rx="2" fill="#cbd5e1"/>
  <polygon points="135,110 140,110 137,118" fill="#1e293b"/>
  <text x="75" y="166" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="9" fill="#a855f7" text-anchor="middle">ПЛАНШЕТНИЙ ПК</text>
</svg>''')

write_svg(os.path.join(images_dir, "smartphone.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 180" width="100%" height="100%">
  <!-- Smartphone Frame -->
  <rect x="25" y="15" width="70" height="135" rx="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Display Screen -->
  <rect x="28" y="20" width="64" height="125" rx="10" fill="#1e293b"/>
  <!-- Dynamic Island / Notch -->
  <rect x="47" y="23" width="26" height="6" rx="3" fill="#0f172a"/>
  <!-- UI Clock -->
  <text x="60" y="55" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="14" fill="#f8fafc" text-anchor="middle">12:45</text>
  <!-- Home indicator line -->
  <rect x="46" y="138" width="28" height="3" rx="1.5" fill="#f8fafc" opacity="0.6"/>
  <text x="60" y="170" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">СМАРТФОН</text>
</svg>''')

write_svg(os.path.join(images_dir, "server.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="100%" height="100%">
  <!-- Server Rack Frame -->
  <rect x="25" y="15" width="130" height="145" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- 1U Unit 1 -->
  <rect x="32" y="24" width="116" height="24" rx="2" fill="#1e293b" stroke="#475569"/>
  <!-- Drive trays -->
  <rect x="36" y="28" width="12" height="16" fill="#334155"/>
  <rect x="52" y="28" width="12" height="16" fill="#334155"/>
  <rect x="68" y="28" width="12" height="16" fill="#334155"/>
  <circle cx="125" cy="36" r="2.5" fill="#22c55e"/>
  <circle cx="135" cy="36" r="2.5" fill="#00f3ff"/>
  <!-- 1U Unit 2 -->
  <rect x="32" y="52" width="116" height="24" rx="2" fill="#1e293b" stroke="#475569"/>
  <rect x="36" y="56" width="12" height="16" fill="#334155"/>
  <rect x="52" y="56" width="12" height="16" fill="#334155"/>
  <rect x="68" y="56" width="12" height="16" fill="#334155"/>
  <circle cx="125" cy="64" r="2.5" fill="#22c55e"/>
  <circle cx="135" cy="64" r="2.5" fill="#eab308"/>
  <!-- 2U Storage Array Unit 3 -->
  <rect x="32" y="80" width="116" height="42" rx="2" fill="#1e293b" stroke="#475569"/>
  <!-- 6 disk bays -->
  <rect x="36" y="85" width="14" height="32" fill="#334155"/>
  <rect x="53" y="85" width="14" height="32" fill="#334155"/>
  <rect x="70" y="85" width="14" height="32" fill="#334155"/>
  <rect x="87" y="85" width="14" height="32" fill="#334155"/>
  <circle cx="125" cy="95" r="2.5" fill="#22c55e"/>
  <circle cx="135" cy="95" r="2.5" fill="#00f3ff"/>
  <!-- 24/7 Enterprise label -->
  <text x="90" y="145" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="9" fill="#22c55e" text-anchor="middle">СЕРВЕР (24/7 РОБОТА)</text>
  <text x="90" y="174" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#38bdf8" text-anchor="middle">СЕРВЕРНА СТОЙКА</text>
</svg>''')

write_svg(os.path.join(images_dir, "supercomputer.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 170" width="100%" height="100%">
  <!-- Data Center Floor Grid -->
  <line x1="10" y1="145" x2="190" y2="145" stroke="#334155" stroke-width="2"/>
  <!-- Cluster Cabinet 1 -->
  <rect x="25" y="25" width="40" height="115" rx="3" fill="#0f172a" stroke="#00f3ff" stroke-width="2"/>
  <line x1="30" y1="45" x2="60" y2="45" stroke="#00f3ff" stroke-width="1"/>
  <line x1="30" y1="70" x2="60" y2="70" stroke="#00f3ff" stroke-width="1"/>
  <line x1="30" y1="95" x2="60" y2="95" stroke="#00f3ff" stroke-width="1"/>
  <!-- Cluster Cabinet 2 (Center) -->
  <rect x="80" y="20" width="40" height="120" rx="3" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
  <circle cx="100" cy="40" r="4" fill="#a855f7"/>
  <circle cx="100" cy="70" r="4" fill="#a855f7"/>
  <circle cx="100" cy="100" r="4" fill="#a855f7"/>
  <!-- Cluster Cabinet 3 -->
  <rect x="135" y="25" width="40" height="115" rx="3" fill="#0f172a" stroke="#00f3ff" stroke-width="2"/>
  <line x1="140" y1="45" x2="170" y2="45" stroke="#00f3ff" stroke-width="1"/>
  <line x1="140" y1="70" x2="170" y2="70" stroke="#00f3ff" stroke-width="1"/>
  <line x1="140" y1="95" x2="170" y2="95" stroke="#00f3ff" stroke-width="1"/>
  <!-- High speed interconnect cooling pipe above -->
  <path d="M45 25 V12 H155 V25" fill="none" stroke="#38bdf8" stroke-width="3"/>
  <text x="100" y="162" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="10" fill="#00f3ff" text-anchor="middle">СУПЕРКОМП'ЮТЕР (PETAFLOPS)</text>
</svg>''')

# 13. Project Logo & Certificate Badges
write_svg(os.path.join(icons_dir, "logo.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="100%" height="100%">
  <defs>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f3ff"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <!-- Futuristic Chip Icon -->
  <g transform="translate(5, 5)">
    <rect x="2" y="2" width="46" height="46" rx="8" fill="#0f172a" stroke="url(#logoGrad)" stroke-width="2.5"/>
    <!-- Glowing core -->
    <rect x="14" y="14" width="22" height="22" rx="4" fill="#0284c7" filter="drop-shadow(0 0 4px #00f3ff)"/>
    <polygon points="25,18 31,29 19,29" fill="#ffffff"/>
    <!-- Traces -->
    <line x1="2" y1="16" x2="12" y2="16" stroke="#38bdf8" stroke-width="2"/>
    <line x1="2" y1="34" x2="12" y2="34" stroke="#38bdf8" stroke-width="2"/>
    <line x1="38" y1="16" x2="48" y2="16" stroke="#a855f7" stroke-width="2"/>
    <line x1="38" y1="34" x2="48" y2="34" stroke="#a855f7" stroke-width="2"/>
  </g>
  <!-- Text Brand -->
  <text x="65" y="28" font-family="Montserrat, Segoe UI, sans-serif" font-weight="900" font-size="18" fill="url(#logoGrad)" letter-spacing="1">HARDWARE<tspan fill="#f8fafc">QUEST</tspan></text>
  <text x="66" y="44" font-family="Segoe UI, sans-serif" font-weight="600" font-size="10" fill="#94a3b8" letter-spacing="1.5">ЗБЕРИ СВІЙ ПК • 8 КЛАС</text>
</svg>''')

write_svg(os.path.join(icons_dir, "badge-gold.svg"), '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <defs>
    <radialGradient id="goldMedal" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#a16207"/>
    </radialGradient>
  </defs>
  <!-- Ribbon behind -->
  <polygon points="45,110 30,155 55,140 80,155 65,110" fill="#dc2626"/>
  <polygon points="115,110 100,155 125,140 150,155 135,110" fill="#b91c1c"/>
  <!-- Rosette Medal Star -->
  <circle cx="80" cy="75" r="54" fill="url(#goldMedal)" stroke="#ca8a04" stroke-width="3"/>
  <circle cx="80" cy="75" r="44" fill="#0f172a" stroke="#fef08a" stroke-width="2"/>
  <circle cx="80" cy="75" r="38" fill="none" stroke="#facc15" stroke-dasharray="3,2"/>
  <!-- Star icon / Laurel -->
  <polygon points="80,50 86,63 100,64 89,74 92,88 80,80 68,88 71,74 60,64 74,63" fill="#fef08a"/>
  <!-- Text around seal -->
  <text x="80" y="102" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="8" fill="#fef08a" text-anchor="middle" letter-spacing="1">ВІДМІННО</text>
</svg>''')

print("All SVG assets generated successfully!")
