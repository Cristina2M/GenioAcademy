import shutil
import os

source_dir = r"C:\Users\crist\.gemini\antigravity\brain\fd17aa0e-2820-4c61-925e-62b04d4d453b"
dest_dir = r"c:\Users\crist\OneDrive\Escritorio\PROYECTO-DESARROLLO-WEB\PROYECTO\GenioAcademy\mockups_expo"

files_to_copy = [
    "slide_1_portada_1778342498574.png",
    "slide_2_problema_1778342510716.png",
    "slide_3_pilares_1778342525696.png",
    "slide_4_arquitectura_1778342539462.png",
    "slide_5_demo_1778342564255.png",
    "slide_6_decisiones_1778342578762.png",
    "slide_7_retos_1778342593184.png",
    "slide_8_conclusion_1778342606078.png"
]

for file in files_to_copy:
    src = os.path.join(source_dir, file)
    dst = os.path.join(dest_dir, file.split('_17')[0] + ".png") # Clean up the names a bit
    try:
        shutil.copy2(src, dst)
        print(f"Copied {file} to {dst}")
    except FileNotFoundError:
        print(f"File not found: {src}")

