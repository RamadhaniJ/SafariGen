import os
import html
from django.http import HttpResponse, JsonResponse
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

from Clients.models import ClientRequestInformation 
from Itinerary.models import ItineraryVersion


REACT_PRINT_URL = os.getenv("REACT_PRINT_URL", "http://localhost:5173/print")
PDF_TIMEOUT_MS = 180000
PDF_READY_TIMEOUT_MS = 45000

import time
t0 = time.time()



def generate_safari_pdf(request, client_id, version_id):

    try:
        client = ItineraryVersion.objects.get(id=version_id, client_request_id = client_id )
    except ItineraryVersion.DoesNotExist:
        return JsonResponse({"error": "This itinerary does not found."}, status=404)

    # client_request = client.client_requested.order_by("-created_at").first()
 
    tour_code = client.client_request.tour_code 
    tour_title = client.client_request.tour_title 

    client_name = f"{client.client_request.client_requested.salutation}. {client.client_request.client_requested.first_name} {client.client_request.client_requested.last_name}".strip()
    company_name = getattr(getattr(client.client_request.client_requested, "company", None), "name", None) or "ACE Safaris Ltd."

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
                device_scale_factor=1,
                locale="en-US",
            )
            page = context.new_page()
            context.route(
                    "**/{google-analytics,googletagmanager,hotjar,facebook}.com/**",
                    lambda r: r.abort(),
                )
            page.on("requestfailed", lambda req: print(f"[FAIL] {req.url} — {req.failure}"))
            page.goto(print_url, wait_until="domcontentloaded", timeout=PDF_TIMEOUT_MS)
            print(f"[TIMING] goto: {time.time() - t0:.1f}s")

            page.evaluate("""
                            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                                img.loading = 'eager';
                            });
                        """)
            print(f"[TIMING] eager: {time.time() - t0:.1f}s")
            

            try:
                page.wait_for_load_state(
                    "load",
                    timeout=60000,
                )
            except PlaywrightTimeout:
                pass
            print(f"[TIMING] load state: {time.time() - t0:.1f}s")

            page.wait_for_timeout(1500)
            print(f"[TIMING] settle: {time.time() - t0:.1f}s")


            # ── Footer template (CORRECTED) ──
            footer_template = f"""
            <div style="
                width: 100%;
                box-sizing: border-box;
                font-family: Georgia, 'Times New Roman', serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            ">

                <!-- ══ Gold shimmer hairline (top edge of footer band) ══ -->
                <div style="
                    width: 100%;
                    height: 1px;
                    background: linear-gradient(to right,
                        transparent 0%,
                        rgba(185,139,62,0.18) 10%,
                        #B98B3E 35%,
                        #E4C888 50%,
                        #B98B3E 65%,
                        rgba(185,139,62,0.18) 90%,
                        transparent 100%);
                "></div>

                <!-- ══ Footer body band (cream, sits BELOW the hairline) ══ -->
                <div style="
                    width: 100%;
                    box-sizing: border-box;
                    background: transparent;
                    padding: 7px 40px 8px 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 14px;
                ">

                    <!-- ── LEFT: brand · reference ── -->
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        white-space: nowrap;
                        flex-shrink: 0;
                    ">
                        <span style="
                            display: inline-block;
                            width: 5px; height: 5px;
                            background: #B98B3E;
                            transform: rotate(45deg);
                        "></span>

                        <span style="
                            font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
                            font-weight: 700;
                            color: #8A6528;
                            letter-spacing: 0.18em;
                            text-transform: uppercase;
                            font-size: 8.5px;
                        ">{company_name}</span>

                        <span style="color: rgba(138,101,40,0.55); font-size: 10px; line-height: 1;">·</span>

                        <span style="
                            font-family: Georgia, 'Times New Roman', serif;
                            font-style: italic;
                            color: #8A6528;
                            font-weight: 700;
                            font-size: 10.5px;
                            letter-spacing: 0.06em;
                        ">№&nbsp;{tour_code}</span>
                    </div>

                    <!-- ── CENTER: ornament divider ── -->
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        flex: 1;
                        justify-content: center;
                        min-width: 0;
                    ">
                        <span style="
                            height: 1px;
                            flex: 1;
                            max-width: 110px;
                            background: linear-gradient(to right, transparent, rgba(185,139,62,0.7));
                        "></span>
                        <span style="
                            display: inline-block;
                            width: 3px; height: 3px;
                            background: #B98B3E;
                            transform: rotate(45deg);
                        "></span>
                        <span style="
                            display: inline-block;
                            width: 5px; height: 5px;
                            border: 1px solid #B98B3E;
                            transform: rotate(45deg);
                        "></span>
                        <span style="
                            display: inline-block;
                            width: 3px; height: 3px;
                            background: #B98B3E;
                            transform: rotate(45deg);
                        "></span>
                        <span style="
                            height: 1px;
                            flex: 1;
                            max-width: 110px;
                            background: linear-gradient(to left, transparent, rgba(185,139,62,0.7));
                        "></span>
                    </div>

                    <!-- ── RIGHT: prepared-for · page chip ── -->
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        white-space: nowrap;
                        flex-shrink: 0;
                    ">
                        <span style="
                            font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
                            color: rgba(138,101,40,0.75);
                            font-size: 8px;
                            font-weight: 500;
                            letter-spacing: 0.16em;
                            text-transform: uppercase;
                        ">{client_name}</span>

                        <span style="
                            display: inline-flex;
                            align-items: center;
                            gap: 5px;
                            padding: 3.5px 11px;
                            background: transparent;
                            color: #8A6528;
                            border: 1px solid #B98B3E;
                            border-radius: 9999px;
                            font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
                            font-size: 9px;
                            font-weight: 700;
                            letter-spacing: 0.14em;
                            line-height: 1;
                        ">
                            <span style="
                                display: inline-block;
                                width: 4px; height: 4px;
                                background: #B98B3E;
                                transform: rotate(45deg);
                            "></span>
                            <span class="pageNumber"></span>
                            <span style="opacity: 0.45; font-weight: 500;">/</span>
                            <span class="totalPages"></span>
                        </span>
                    </div>

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
                    "bottom": "58px",  
                    "left": "0",
                },
            )
            print(f"[TIMING] pdf: {time.time() - t0:.1f}s")
            print(f"[TIMING] TOTAL: {time.time() - t0:.1f}s")

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