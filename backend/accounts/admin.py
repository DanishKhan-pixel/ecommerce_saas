from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, ShippingAddress

# @admin.register(CustomUser)
# class CustomUserAdmin(admin.ModelAdmin):
#     list_display = ('email', 'role', 'is_staff', 'is_active')
#     list_filter = ('role', 'is_staff', 'is_active')
#     search_fields = ('email', 'first_name', 'last_name')
#     ordering = ('email',)


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = ("email", "username", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active")

    search_fields = ("email", "username")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name")}),
        ("Permissions", {"fields": ("role", "is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "role", "is_staff", "is_active"),
        }),
    )


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'city', 'country', 'is_default')
    list_filter = ('is_default', 'country')
    search_fields = ('full_name', 'city')
