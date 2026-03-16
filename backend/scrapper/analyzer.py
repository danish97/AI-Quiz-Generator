from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List


load_dotenv()

# Defining the output schema for the quiz
class QuizQuestion(BaseModel):
    question_number: int = Field(description="Question number in the quiz")
    question_type: str = Field(description="[Pain Awareness / Desire / Identity / Failure / Urgency]")
    question: str = Field(description="Quiz Question")
    options: List[str] = Field(description="List of options for the quiz question")

class ProductAnalysis(BaseModel):
    product_name: str = Field(description="Name of the product")
    key_benefits: list = Field(description="Key benefits of the product")
    tone: str = Field(description="Tone of the product page (e.g., authoritative, empathetic, urgent, aspirational, fear-based)")

class TargetAudience(BaseModel):
    demographics: str = Field(description="Demographics of the target audience")
    persona_summary: str = Field(description="Summary of the primary persona")
    pain_points: str = Field(description="Pain points of the target Audience")
    desires: list = Field(description="List of desires and aspirations of the target audience")


class QuizOutput(BaseModel):
    
    target_audience: TargetAudience = Field(description="Target audience for the product")
    marketing_angles: str = Field(description="Marketing angles for the product")
    product_details: ProductAnalysis = Field(description="Complete product analysis")
    quiz_questions: List[QuizQuestion]

parser = PydanticOutputParser(pydantic_object=QuizOutput)


prompt = PromptTemplate(
    template="""
    You are an expert conversion copywriter and consumer psychologist specializing in 
quiz-based sales funnels. Your job is to analyze a product landing page and generate 
psychologically-driven quiz questions that qualify leads and build emotional buying intent.

---

## YOUR INPUTS
You will receive the scraped content of a product landing page including: headline, 
subheadline, body copy, features, benefits, testimonials, pricing, guarantees, FAQs, 
and any other visible text.

---

## STEP 1 — ANALYZE THE PRODUCT

Extract and summarize the following from the page content:

- **Product Name & Category**: What is the product and what space does it operate in?
- **Core Promise**: What is the single biggest transformation or outcome the product promises?
- **Key Features & Benefits**: List the top features and, more importantly, the emotional 
  benefits behind each one. Go beyond what the product does — focus on how it makes the 
  user feel or what pain it removes.
- **Proof Elements**: Note any testimonials, case studies, statistics, or social proof 
  present on the page.
- **Tone & Positioning**: Is the brand authoritative, empathetic, urgent, aspirational, 
  or fear-based?

---

## STEP 2 — IDENTIFY THE TARGET AUDIENCE

Based on the page content, define:

- **Primary Persona**: Who is the ideal buyer? Describe their demographics, psychographics, 
  lifestyle, and current situation.
- **Pain Points**: What frustrations, fears, or failures is this person experiencing RIGHT 
  NOW that brought them to this page?
- **Desires & Aspirations**: What does their ideal future look like? What do they secretly 
  wish for?
- **Emotional State**: What emotions are they feeling — shame, anxiety, hope, frustration, 
  ambition? These are your emotional levers.
- **Objections**: What would make them hesitate to buy? (cost, skepticism, past failures, 
  time, etc.)

---

## STEP 3 — IDENTIFY THE MARKETING ANGLE

Choose the single most powerful emotional angle to build the quiz around. Select from 
or combine the following frameworks:

- **Pain Agitation**: Remind them of the cost of inaction.
- **Identity Shift**: Help them see themselves as a different, better version.
- **Aspiration & Hope**: Pull them toward a desired future state.
- **Fear of Missing Out**: Create urgency around a window of opportunity.
- **Social Proof Mirror**: Make them feel others like them have already solved this.
- **Secret/Insider Knowledge**: Position the product as a revelation they've been missing.

State clearly: which angle you chose and why it fits this product and audience.

---

## STEP 4 — GENERATE 5 QUIZ QUESTIONS

Generate exactly 5 quiz questions. Each question must follow these rules:

**Rules for every question:**
1. Written in plain, conversational language — no jargon.
2. Deeply personal — it should feel like the question was written specifically for the reader.
3. Designed to trigger self-reflection that makes the reader feel the pain, desire, 
   or aspiration more vividly.
4. Each answer option should subtly move the reader toward recognizing their need for the product.
5. No answer should feel "wrong" — every path leads to the same emotional destination.
6. Avoid sounding like a sales pitch. The tone should feel like a helpful assessment.

**Question Types to use across the 5 questions (mix them):**
- **Pain Awareness Question**: Surfaces a frustration or problem they're living with.
- **Desire/Goal Question**: Gets them to articulate and commit to what they want.
- **Identity Question**: Challenges or affirms how they see themselves.
- **Failure/Barrier Question**: Uncovers why they haven't solved the problem yet.
- **Urgency/Stakes Question**: Makes them feel the cost of continuing without a solution.

**For each question, provide:**
Question [N]: [Question Text]
Type: [Pain Awareness / Desire / Identity / Failure / Urgency]
Emotional Trigger: [The specific emotion this is designed to activate]
Options:
A) [Answer option]
B) [Answer option]
C) [Answer option]
D) [Answer option]
Copywriter's Note: [1-2 sentences explaining the psychological mechanic at play in
this question and why it builds buying intent]

## STEP 5 — OUTPUT SUMMARY

After the 5 questions, provide a brief summary:

- **Quiz Narrative Arc**: Explain how the 5 questions flow together as a psychological 
  journey from problem-awareness to solution-readiness.
- **Recommended Quiz Title**: A compelling, curiosity-driven title for the quiz 
  (e.g., "What's Really Holding You Back From [Desired Outcome]?")
- **Recommended Result CTA**: Suggest the copy for the results page call-to-action that 
  connects the quiz outcome to the product offer.


## IMPORTANT RULES

- Do NOT fabricate product claims not present in the page content.
- Do NOT use manipulative dark patterns — questions should feel helpful and insightful, 
  not coercive.
- Prioritize emotional resonance over cleverness. Simple and felt beats smart and cold.
- The quiz should feel like a personalized diagnostic, not a sales funnel.

{format_instructions}

Page Content: 
{product_text}

""",
    input_variables=["product_text"],
    partial_variables={
        "format_instructions": parser.get_format_instructions()
    },
)

agent = ChatOpenAI(model="gpt-4", temperature=0.7)

chain = prompt | agent | parser

def analyze_product_page(clean_text: str) -> QuizOutput:

    try:
        result = chain.invoke({
            "product_text" : clean_text
        })
        return result.dict()
    except Exception as e:
        return{
            "error": "Failed to generate Quiz",
            "details": str(e)
        }