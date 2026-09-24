from django.contrib import admin
from Communication.models import CommunicationChannel, CommunicationLog, EmailTemplate

# Register your models here.


@admin.register(CommunicationChannel)
class AdminCommunicationChannel(admin.ModelAdmin):
    list_display = ["name","is_active","created_at"]



 
@admin.register(CommunicationLog)
class AdminCommunicationLog(admin.ModelAdmin):
    list_display = ["version","channel","recipient","status","sent_at","read_at"]




@admin.register(EmailTemplate)
class AdminEmailTemplate(admin.ModelAdmin):
    list_display = ["name","subject","is_active","created_at"]