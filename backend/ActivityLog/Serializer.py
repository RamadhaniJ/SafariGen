from rest_framework import serializers
from ActivityLog.models import ActivitiesLogs

class ActivitiesLogsSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(
        source="actor.full_name", 
        read_only=True, 
        allow_null=True,
        default="Unknown User"
    )

    actor_role = serializers.CharField(
        source ="actor.role",
        read_only=True, 
        allow_null=True,
               
    )

    actor_company_name = serializers.SerializerMethodField()
    
    tour_code = serializers.CharField(
        source="client_request.tour_code", 
        read_only=True, 
        allow_null=True
    )
    version_number = serializers.IntegerField(
        source="itinerary_version.version_number", 
        read_only=True, 
        allow_null=True
    )
    

    changes_display = serializers.SerializerMethodField()

    class Meta:
        model = ActivitiesLogs
        fields = (
            "id", 
            "actor_name", 
            "actor_role",
            "actor_company_name",
            "tour_code",
            "version_number",
            "action",
            "module",
            "changes",
            "changes_display",
            "description",
            "created_at"
        )
        read_only_fields = fields



    def get_changes_display(self, obj):
        if not obj.changes:
            return []
        
        formatted = []
        for field, value in obj.changes.items():
            if isinstance(value, dict) and 'from' in value and 'to' in value:
                formatted.append({
                    "field": field,
                    "old_value": value.get('from'),
                    "new_value": value.get('to')
                })

            else:
                formatted.append({
                    "field": field,
                    "old_value": None,  
                    "new_value": value
                })
        return formatted


    def get_actor_company_name(self, obj):

        if not obj.actor:
            return "Unknown Company"
        

        companies = obj.actor.companies.all()
        
        if not companies.exists():
            return "No Company"
        
 
        first_company = companies.first()
        
        total_companies = companies.count()
        

        if total_companies == 1:
            return first_company.name
        

        others_count = total_companies - 1
        return f"{first_company.name} & {others_count}+"

