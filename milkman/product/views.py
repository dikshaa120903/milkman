from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product
from .serializers import ProductSerializer
from staff.auth import StaffTokenAuthentication
from customer.auth import CustomerTokenAuthentication

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [CustomerTokenAuthentication, StaffTokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
