# Communication/views.py (Ndani ya SendItineraryQuoteEmailView.post)
 
        # 1. Prepare Context Data (Tumia fallback ya snapshot kama tulivyoongea awali)
def context():
        context_data = {
            'client_name': f"{client_info.salutation} {client_info.first_name} {client_info.last_name}".strip(),
            'tour_title': version.snapshot_tour_title or version.client_request.tour_title,
            'tour_code': version.client_request.tour_code,
            'company_name': company_name,
            'sender_name': sender_name,
            'preview_link': request.data.get('preview_link', f"{getattr(settings, 'FRONTEND_URL', '')}/preview/safari/itinerary/{client_id}/{version_id}"),
            'grand_total': str(version.version_pricing_snapshot.grand_total) if hasattr(version, 'version_pricing_snapshot') and version.version_pricing_snapshot else "0.00",
        }

        # 2. Handle Custom Note
        custom_note = serializer.validated_data.get('custom_note', '').strip()
        custom_note_html = ""
        if custom_note:
            safe_note = custom_note.replace('\n', '<br>')
            custom_note_html = f"""
            <div style="background-color: #F0F9FF; border-left: 4px solid #0EA5E9; padding: 16px 20px; margin: 24px 0; border-radius: 6px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <p style="margin: 0 0 8px 0; color: #0C4A6E; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                    💬 A Personal Note from Your Travel Expert
                </p>
                <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6; font-style: italic;">
                    "{safe_note}"
                </p>
            </div>
            """

        # 3. Determine which body to use (Edited from frontend OR original template)
        body_to_render = request.data.get('edited_body', '').strip() or email_template.body_html

        # 4. Inject Custom Note intelligently
        if custom_note_html:
            if '{{custom_note_html}}' in body_to_render:
                # Replace the placeholder if it exists
                body_to_render = body_to_render.replace('{{custom_note_html}}', custom_note_html)
            else:
                # Otherwise, inject it after the first paragraph <p>...</p>
                import re
                match = re.search(r'<p.*?>.*?</p>', body_to_render, re.IGNORECASE | re.DOTALL)
                if match:
                    insert_pos = match.end()
                    body_to_render = body_to_render[:insert_pos] + custom_note_html + body_to_render[insert_pos:]
                else:
                    # Fallback: just put it at the top
                    body_to_render = custom_note_html + body_to_render

        # 5. RENDER THE PLACEHOLDERS (Hii ndiyo inabadilisha {{client_name}} kuwa jina halisi)
        final_body_html = Template(body_to_render).render(Context(context_data))

        # 6. Render Subject
        frontend_subject = request.data.get('subject', '').strip()
        if frontend_subject:
            final_subject = frontend_subject
        else:
            final_subject = Template(email_template.subject).render(Context(context_data))

        # 7. Prepare and Send Email
        text_fallback = f"Dear {context_data['client_name']},\n\nPlease view your personalized itinerary online at:\n{context_data['preview_link']}\n\nWarm regards,\n{sender_name}\n{company_name}"

        email = EmailMultiAlternatives(
            subject=final_subject,
            body=text_fallback,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[secure_recipient_email],
            reply_to=[request.user.email],
       )
        email.attach_alternative(final_body_html, "text/html")
        return None

        # ... (Code ya kutuma na kufanya log ibaki vilevile) ...