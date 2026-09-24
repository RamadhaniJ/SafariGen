import os
import html
from django.http import HttpResponse, JsonResponse
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

from Clients.models import ClientRequestInformation 
from Itinerary.models import ItineraryVersion


REACT_PRINT_URL = os.getenv("REACT_PRINT_URL", "http://localhost:5173/print")
PDF_TIMEOUT_MS = 60000
PDF_READY_TIMEOUT_MS = 45000


def generate_safari_pdf(request, client_id, version_id):

    try:
        client = ItineraryVersion.objects.get(id=version_id, client_request_id = client_id )
    except ItineraryVersion.DoesNotExist:
        return JsonResponse({"error": "This itinerary does not found."}, status=404)

    # client_request = client.client_requested.order_by("-created_at").first()

    tour_code = client.client_request.tour_code 
    tour_title = client.client_request.tour_title 

    client_name = f"{client.client_request.client_requested.salutation}. {client.client_request.client_requested.first_name} {client.client_request.client_requested.last_name}".strip()
    company_name = getattr(getattr(client.client_request.client_requested, "created_by", None), "company_name", None) or "ACE Safaris Ltd."

    tour_code = html.escape(tour_code or "N/A")
    tour_title = html.escape(tour_title or "Safari Proposal")
    client_name = html.escape(client_name or "Valued Guest")
    company_name = html.escape(company_name)

    print_url = f"{REACT_PRINT_URL}/{client_id}/{version_id}"

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-dev-shm-usage",
                    "--font-render-hinting=none",
                ],
            )

            context = browser.new_context(
                viewport={"width": 1280, "height": 900},
                device_scale_factor=2,
                locale="en-US",
            )
            page = context.new_page()

            page.goto(print_url, wait_until="networkidle", timeout=PDF_TIMEOUT_MS)

            try:
                page.wait_for_function(
                    "window.__PDF_READY__ === true",
                    timeout=PDF_READY_TIMEOUT_MS,
                )
            except PlaywrightTimeout:
                page.wait_for_timeout(3000)

            page.wait_for_timeout(1500)

            # ── Footer template inayofanana na PageFooter yako ya React ──
            footer_template = f"""
            <div style="
                width:100%;
                font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
                font-size:9px;
                color:#6B6055;
                padding:6px 40px 0 40px;
                display:flex;
                align-items:center;
                justify-content:space-between;
                border-top:1px solid #E0D8C8;
            ">
                <div style="display:flex; align-items:center; gap:8px; white-space:nowrap;">
                    <span style="font-weight:600; color:#2B2620;">{company_name}</span>
                    <span style="color:#C4BCAE;">•</span>
                    <span>Ref: <strong style="color:#2B2620; font-weight:600;">{tour_code}</strong></span>
                    <span style="color:#C4BCAE;">•</span>
                    <span style="color:#5C5247;">{client_name}</span>
                </div>

                <div style="
                    padding:3px 12px;
                    background:#EFE9DC;
                    border:1px solid #E0D8C8;
                    border-radius:9999px;
                    color:#2B2620;
                    font-weight:700;
                    letter-spacing:0.3px;
                    white-space:nowrap;
                ">
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
                margin={
                    "top": "50px",
                    "right": "0",
                    "bottom": "50px",  
                    "left": "0",
                },
            )

            context.close()
            browser.close()

    except PlaywrightTimeout as e:
        return JsonResponse({"error": f"Timeout on generation of PDF: {str(e)}"}, status=504)
    except Exception as e:
        return JsonResponse({"error": f"PDF generation failed: {str(e)}"}, status=500)

    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    filename = f"{tour_title}.pdf"
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    response["Content-Length"] = len(pdf_bytes)
    return response