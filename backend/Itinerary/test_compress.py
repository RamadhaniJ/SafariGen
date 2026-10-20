# import os
# import subprocess
# import tempfile


# def compress_pdf_with_ghostscript(pdf_bytes, quality="ebook"):
#     """Exact same function as in pdf_view.py"""
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_in:
#         tmp_in.write(pdf_bytes)
#         input_path = tmp_in.name

#     output_path = input_path.replace(".pdf", "_compressed.pdf")

#     try:
#         command = [
#             "gs",
#             "-sDEVICE=pdfwrite",
#             "-dCompatibilityLevel=1.4",
#             f"-dPDFSETTINGS=/{quality}",
#             "-dNOPAUSE",
#             "-dQUIET",
#             "-dBATCH",
#             f"-sOutputFile={output_path}",
#             input_path,
#         ]
#         subprocess.run(command, check=True, capture_output=True, timeout=120)

#         with open(output_path, "rb") as f:
#             compressed_bytes = f.read()

#         return compressed_bytes

#     except FileNotFoundError:
#         print("[GS] Ghostscript (gs) haijasakinishwa — natumia PDF ya awali")
#         return pdf_bytes
#     except subprocess.CalledProcessError as e:
#         print(f"[GS] Ghostscript imeshindikana: {e}")
#         return pdf_bytes
#     except subprocess.TimeoutExpired:
#         print("[GS] Ghostscript imechukua muda mrefu")
#         return pdf_bytes
#     except Exception as e:
#         print(f"[GS] Hitilafu: {e}")
#         return pdf_bytes
#     finally:
#         if os.path.exists(input_path):
#             os.unlink(input_path)
#         if os.path.exists(output_path):
#             os.unlink(output_path)


# # ── Test ──
# INPUT_PDF = "7_daysinNgoroNgoroNationalPark.pdf"
# OUTPUT_PDF = "7_days_compressed.pdf"

# if not os.path.exists(INPUT_PDF):
#     print(f"❌ File haipo: {INPUT_PDF}")
#     print(f"   Uko kwenye: {os.getcwd()}")
#     print(f"   PDFs zilizopo: {[f for f in os.listdir('.') if f.endswith('.pdf')]}")
#     raise SystemExit(1)

# with open(INPUT_PDF, "rb") as f:
#     original = f.read()

# print(f"📄 Kabla:  {len(original)/1024/1024:.2f} MB")

# compressed = compress_pdf_with_ghostscript(original, quality="ebook")

# print(f"📄 Baada:  {len(compressed)/1024/1024:.2f} MB")
# ratio = (1 - len(compressed)/len(original)) * 100
# print(f"📉 Imepungua: {ratio:.1f}%")

# with open(OUTPUT_PDF, "wb") as f:
#     f.write(compressed)

# print(f"✅ PDF mpya: {OUTPUT_PDF}")