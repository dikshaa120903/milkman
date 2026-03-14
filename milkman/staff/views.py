from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from customer.auth import CustomerTokenAuthentication
from .models import Staff
from .serializers import StaffSerializer
from .auth import create_token, StaffTokenAuthentication

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
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
            staff = Staff.objects.get(email=email, password=password)
        except Staff.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        token = create_token(staff)
        return Response({"token": token, "staff_id": staff.pk, "email": staff.email})
