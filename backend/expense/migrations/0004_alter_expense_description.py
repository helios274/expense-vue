# Generated by Django 4.2.6 on 2023-10-26 05:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('expense', '0003_alter_category_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expense',
            name='description',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
