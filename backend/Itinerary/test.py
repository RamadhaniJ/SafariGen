from rest_framework import generics
from rest_framework.exceptions import NotFound
# ... your other imports ...

class PricingBreakdownToStaffView(generics.RetrieveAPIView):
    # authentication_classes = [CustomJwtCookiesAuth]
    # permission_classes = [IsAuthenticated ,IsStaff ]
    serializer_class = PricingSnapshotSerializer

    # 1. Removed 'request' from the arguments
    def get_object(self): 
        client_id = self.kwargs.get("client_id")
        version_id = self.kwargs.get("version_id")

        try:
           snapshot = ItineraryPricingSnapshot.objects.select_related(
               # 2. Changed to double underscores for relationship traversal
               "version__client_request", 
               "generated_by__user"
           ).prefetch_related(
               "breakdown_items"
           ).get(
               # 3. Changed to double underscores for the database lookup
               version__client_request_id=client_id, 
               version_id=version_id
           )
        except ItineraryPricingSnapshot.DoesNotExist:
             raise NotFound(detail="Pricing snapshot not found for this client request.")
        except ValueError:
            raise NotFound(detail="Invalid client Request ID format.")
            
        return snapshot