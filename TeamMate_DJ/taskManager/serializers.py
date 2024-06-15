from django.contrib.auth.models import  User, Group
from taskManager.models import Task, Tag
from rest_framework import serializers
import datetime

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
        
class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')  
    tags = TagSerializer(many=True, read_only=True)
    # tags_ids = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, write_only=True, source='tags')

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_due_date(self, value):
        if value < datetime.date.today():
            raise serializers.ValidationError("Due date cannot be in the past.")
        return value

    def validate_progress(self, value):
        if not 0 <= value <= 100:
            raise serializers.ValidationError("Progress must be between 0 and 100.")
        return value