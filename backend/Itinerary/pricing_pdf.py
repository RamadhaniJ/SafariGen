import os
import html
from urllib.parse import urlparse
from django.http import HttpResponse, JsonResponse
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
from Itinerary.models import ItineraryPricingSnapshot

# 1. Ensure base URL doesn't have a trailing slash to avoid double slashes
REACT_PRINT_URL = os.getenv("REACT_PRINT_URL", "http://localhost:5173").rstrip('/')
FRONTEND_HOST = urlparse(REACT_PRINT_URL).hostname
PDF_TIMEOUT_MS = 60000
PDF_READY_TIMEOUT_MS = 45000

def generate_pricing_pdf(request, client_id, version_id):
    try:
        snapshot = ItineraryPricingSnapshot.objects.select_related(
               "version__client_request", 
               "generated_by__user"
           ).prefetch_related(
               "breakdown_items"
           ).get(
               version__client_request_id=client_id, 
               version_id=version_id
           )
    except ItineraryPricingSnapshot.DoesNotExist:
        return JsonResponse({"error": "Snapshot not found."}, status=404)

    tour_code = html.escape(snapshot.version.client_request.tour_code or "N/A")
    tour_title = html.escape(snapshot.version.client_request.tour_title or "Safari Proposal")
    client_name = f"{snapshot.version.client_request.client_requested.salutation}. {snapshot.version.client_request.client_requested.first_name} {snapshot.version.client_request.client_requested.last_name}".strip()
    client_name = html.escape(client_name or "Valued Guest")
    company_name = getattr(getattr(snapshot.version.client_request.client_requested, "created_by", None), "company_name", None) or "ACE Safaris Ltd."
    company_name = html.escape(company_name)


    print_url = f"{REACT_PRINT_URL}/print/pricing/{client_id}/{version_id}"

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
            )

            context = browser.new_context(
                viewport={"width": 1280, "height": 900},
                device_scale_factor=2,
                locale="en-US",
            )

            django_cookies = request.COOKIES
            if django_cookies:
                playwright_cookies = [
                    {"name": key, "value": value, "domain": FRONTEND_HOST, "path": "/"}
                    for key, value in django_cookies.items()
                ]
                context.add_cookies(playwright_cookies)

            page = context.new_page()

            page.on("console", lambda msg: print(f"[CONSOLE] {msg.type}: {msg.text}"))
            page.on("pageerror", lambda err: print(f"[PAGE ERROR] {err}"))
            page.on("requestfailed", lambda req: print(f"[REQ FAILED] {req.url}: {req.failure}"))

            page.goto(print_url, wait_until="networkidle", timeout=PDF_TIMEOUT_MS)

            try:
                page.wait_for_function("window.__PRICING_PDF_READY__ === true", timeout=PDF_READY_TIMEOUT_MS)
            except PlaywrightTimeout:
                print("⚠️ PRICING_PDF_READY never set — dumping page content:")
                print(page.content()[:3000])
                page.wait_for_timeout(3000)

            page.wait_for_timeout(1500)

            footer_template = f"""
            <div style="width:100%; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; font-size:9px; color:#6B6055; padding:6px 40px 0 40px; display:flex; align-items:center; justify-content:space-between; border-top:1px solid #E0D8C8;">
                <div style="display:flex; align-items:center; gap:8px; white-space:nowrap;">
                    <span style="font-weight:600; color:#2B2620;">{company_name}</span>
                    <span style="color:#C4BCAE;">•</span>
                    <span>Ref: <strong style="color:#2B2620; font-weight:600;">{tour_code}</strong></span>
                    <span style="color:#C4BCAE;">•</span>
                    <span style="color:#5C5247;">{client_name}</span>
                </div>
                <div style="padding:3px 12px; background:#EFE9DC; border:1px solid #E0D8C8; border-radius:9999px; color:#2B2620; font-weight:700; letter-spacing:0.3px; white-space:nowrap;">
                    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                </div>
            </div>
            """

            pdf_bytes = page.pdf(
                format="A4",
                print_background=True,
                prefer_css_page_size=False,
                display_header_footer=True,
                header_template="<span></span>",
                footer_template=footer_template,
                margin={"top": "40px", "right": "30px", "bottom": "60px", "left": "30px"}, 
            )

            context.close()
            browser.close()

    except PlaywrightTimeout as e:
        return JsonResponse({"error": f"Timeout on generation of PDF: {str(e)}"}, status=504)
    except Exception as e:
        return JsonResponse({"error": f"PDF generation failed: {str(e)}"}, status=500)

    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    filename = f"Pricing_{tour_title.replace(' ', '_')}_{tour_code}.pdf"
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    response["Content-Length"] = len(pdf_bytes)
    return response


