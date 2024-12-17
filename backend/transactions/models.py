from django.db import models
from django.core.exceptions import ValidationError
from account.models import User
from utils import constants


class Account(models.Model):

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='accounts'
    )
    name = models.CharField(max_length=100)
    account_type = models.CharField(
        max_length=20, choices=constants.ACCOUNT_TYPES)
    balance = models.DecimalField(
        max_digits=15, decimal_places=2, default=0.00
    )

    def __str__(self):
        return self.name


class Category(models.Model):

    name = models.CharField(max_length=100)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='categories', null=True, blank=True
    )
    is_default = models.BooleanField(default=False)
    parent_category = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.CASCADE, related_name='subcategories'
    )
    type = models.CharField(
        max_length=10, choices=constants.CATEGORY_TYPES, default='expense')

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.type})"


class Tag(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='tags'
    )

    def __str__(self):
        return self.name


class Transaction(models.Model):

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='transactions'
    )
    type = models.CharField(max_length=10, choices=constants.TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    category = models.ForeignKey(
        'Category', on_delete=models.SET_NULL, null=True, blank=True
    )
    description = models.TextField(max_length=200, blank=True, default="")
    account = models.ForeignKey(
        'Account', on_delete=models.SET_NULL, null=True, blank=True
    )
    tags = models.ManyToManyField('Tag', blank=True)
    entity = models.CharField(max_length=100, blank=True)
    receipt = models.FileField(upload_to='receipts/', null=True, blank=True)

    class Meta:
        ordering = ['-date']

    def clean(self):
        # Validate that the category type matches the transaction type
        if self.category and self.category.type != self.type:
            raise ValidationError(
                f"The selected category is not valid for a {self.type} transaction."
            )

    def __str__(self):
        return f"{self.type.capitalize()}: {self.category} ({self.amount})"
