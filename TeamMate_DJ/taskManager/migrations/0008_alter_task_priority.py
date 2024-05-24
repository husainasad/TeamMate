# Generated by Django 5.0.6 on 2024-05-20 00:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taskManager', '0007_alter_task_options_alter_task_priority'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='priority',
            field=models.CharField(choices=[('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')], default='High', max_length=6),
        ),
    ]