from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Customer
from .serializers import CustomerSerializer
from staff.auth import StaffTokenAuthentication
from .auth import create_token, CustomerTokenAuthentication

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    authentication_classes = [StaffTokenAuthentication, CustomerTokenAuthentication]
    permission_classes = [IsAuthenticated]


class LoginView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, format=None):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response({"detail": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            cust = Customer.objects.get(email=email, password=password)
        except Customer.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        token = create_token(cust)
        return Response({"token": token, "customer_id": cust.pk, "email": cust.email})


class RegisterView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, format=None):
        # allow new customer signup
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
