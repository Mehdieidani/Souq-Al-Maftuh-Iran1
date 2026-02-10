from django.contrib import admin
from .models import Ad, User

@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'is_approved')
    list_filter = ('is_approved',)
    actions = ['approve_ads']

    def approve_ads(self, request, queryset):
        queryset.update(is_approved=True)
    approve_ads.short_description = "تایید آگهی‌های منتخب السوق المفتوح"