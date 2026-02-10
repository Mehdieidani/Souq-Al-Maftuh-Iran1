from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ad
from .serializers import AdSerializer

class AdViewSet(viewsets.ModelViewSet):
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Ad.objects.filter(is_approved=True)

    @action(detail=False, methods=["post"])
    def create_ad(self, request):
        serializer = AdSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"message": "آگهی ثبت شد و منتظر تایید است"})
        return Response(serializer.errors, status=400)
