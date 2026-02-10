from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_vip = models.BooleanField(default=False)
    wallet_usdt = models.DecimalField(max_digits=12, decimal_places=2, default=0)

class Ad(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    price = models.BigIntegerField()
    currency = models.CharField(max_length=20, default='تومان')
    is_approved = models.BooleanField(default=False) # تایید مدیر السوق المفتوح
    created_at = models.DateTimeField(auto_now_add=True)