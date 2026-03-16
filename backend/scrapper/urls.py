from django.urls import path
from .views import ScrapProductView

urlpatterns = [
    path('generate', ScrapProductView.as_view(), name='scrape-product'),
]
