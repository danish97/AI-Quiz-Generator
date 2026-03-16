from rest_framework import serializers


class ScrapeRequestSerializer(serializers.Serializer):
    landing_page_url = serializers.URLField()