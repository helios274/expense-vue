from django.db import models
from django.utils.timezone import now
from account.models import User


class Category(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='categories')

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Expense(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(
        Category, on_delete=models.SET_DEFAULT, default=1, related_name='expenses')
    description = models.CharField(max_length=200, null=True, blank=True)
    date = models.DateField(default=now)

    def __str__(self):
        return f"{self.category} ({self.amount})"

    class Meta:
        ordering = ['-date']
