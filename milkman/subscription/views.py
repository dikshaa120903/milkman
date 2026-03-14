from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Subscription
from .serializers import SubscriptionSerializer
from staff.auth import StaffTokenAuthentication
from customer.auth import CustomerTokenAuthentication

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    authentication_classes = [StaffTokenAuthentication, CustomerTokenAuthentication]
    permission_classes = [IsAuthenticated]
