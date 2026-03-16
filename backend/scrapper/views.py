from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
from .extractor import content_extractor, ai_input
from .serializers import ScrapeRequestSerializer
from .analyzer import analyze_product_page
from .throttles import QuizGenerationThrottle

logger = logging.getLogger(__name__)

# Create your views here.

class ScrapProductView(APIView):
    throttle_classes = [QuizGenerationThrottle]

    def post(self, request):
        logger.info("=== Request received ===")
        
        serializer = ScrapeRequestSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        logger.info("Serializer valid")
        url = serializer.validated_data['landing_page_url']
        logger.info(f"URL: {url}")
        
        scrapped_data = content_extractor(url)
        logger.info(f"Scrape complete: {scrapped_data}")
        if "error" in scrapped_data:
            return Response({"error": scrapped_data["error"]}, status=status.HTTP_400_BAD_REQUEST)
        
        clean_text = ai_input(scrapped_data)
        logger.info("AI input prepared")
        
        ai_result = analyze_product_page(clean_text)
        logger.info(f"AI result: {ai_result}")
        if "error" in ai_result:
            return Response(
                {"error": ai_result["error"], "details": ai_result.get("details", "")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(
            {"status": "success", "quiz_data": ai_result},
            status=status.HTTP_200_OK
        )