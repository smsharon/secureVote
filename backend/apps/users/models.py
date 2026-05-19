from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    
    This allows for future extensions to the user model
    while maintaining compatibility with Django's auth system.
    """
    
    class Meta:
        db_table = "auth_user"
        verbose_name = "user"
        verbose_name_plural = "users"
    
    def __str__(self):
        return self.get_full_name() or self.username
