from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .extractor import content_extractor, ai_input
from .serializers import ScrapeRequestSerializer
from .analyzer import analyze_product_page
from .throttles import QuizGenerationThrottle

# Create your views here.

class ScrapProductView(APIView):
    throttle_classes = [QuizGenerationThrottle]

    def post(self, request):
        serializer = ScrapeRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        url = serializer.validated_data['landing_page_url']

        scrapped_data = content_extractor(url)
        if "error" in scrapped_data:
            return Response({"error": scrapped_data["error"]}, status=status.HTTP_400_BAD_REQUEST)
        
        clean_text = ai_input(scrapped_data)

        ai_result = analyze_product_page(clean_text)
        if "error" in ai_result:
            return Response(
                {"error": ai_result["error"], "details": ai_result.get("details", "")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {
                "status": "success",
                "quiz_data": ai_result
            },
            status=status.HTTP_200_OK
        )