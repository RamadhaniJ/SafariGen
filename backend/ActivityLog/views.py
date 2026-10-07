from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from ActivityLog.models import ActivitiesLogs
from ActivityLog.Serializer import ActivitiesLogsSerializer
from Users.authentication import CustomJwtCookiesAuth
from Users.view_auth import IsManager, IsAdmin


class ActivityLogsView(generics.ListAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsManager]  
    
    serializer_class = ActivitiesLogsSerializer
    
 
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    

    filterset_fields = ['action', 'module', 'actor']

   
    search_fields = [
        'description',
        'client_request__tour_code',
        'client_request__tour_title',
        'actor__full_name',
        'actor__email',
        'client__first_name',
        'client__last_name'
    ]
    

    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        
       
        user_company_ids = user.companies.values_list('id', flat=True)
        
        queryset = ActivitiesLogs.objects.filter(
            client__company_id__in=user_company_ids  
        ).select_related(
            'actor',
            'client',
            'client_request',
            'itinerary_version'
        ).order_by('-created_at')
        
        return queryset