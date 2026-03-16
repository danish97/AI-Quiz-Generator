import requests
import re

from bs4 import BeautifulSoup
from urllib.parse import urlparse

MAX_CHARS = 4000

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; QuizFunnelBot/1.0)"
}
BLOCKED_PATTERN = re.compile(
    r"\b(cart|checkout|shipping|delivery|contact|payment|visa|mastercard|paypal|amex|refund|return|billing|tax|klarna)\b",
    re.IGNORECASE
)

def is_valid(url: str):
    parsed = urlparse(url)
    return parsed.scheme in ["http", "https"] and parsed.netloc

# Get rid of content that contains keywords related to shopping, payment, contact, etc.
def contains_keywords(text: str):
    return bool(BLOCKED_PATTERN.search(text))

# Extracting content from the landing page
def content_extractor(url: str) -> dict:
    
    if not is_valid(url):
        return {"error": "Invalid URL"}
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        return {"error": f'Unexpected error occurred: {str(e)}'}
    
    soup = BeautifulSoup(response.text, 'lxml')

    for tag in soup(['script', 'style']):
        tag.decompose()

    title = soup.title.string if soup.title else "No Title"

    meta_desc = ""

    meta = soup.find('meta', attrs={'name': 'description'})

    if meta:
        meta_desc = meta.get("content", "")
    
    headings = [
            h.get_text(strip=True) 
            for h in soup.find_all(['h1', 'h2', 'h3', 'h4'])
            if not contains_keywords(h.get_text())
        ]
    paragraphs = [
            p.get_text(strip=True) 
            for p in soup.find_all('p')
            if not contains_keywords(p.get_text())
        ]
    bullets = [
            li.get_text(strip=True) 
            for li in soup.find_all('li')
            if not contains_keywords(li.get_text())
        ]

    cleaned_text = {
        "title": title,
        "meta_description": meta_desc,
        "headings": headings[:10],
        "paragraphs": paragraphs[:20],
        "bullets": bullets[:20]
    }
    
    return cleaned_text

# Cleaning text by removing extra spaces and newlines
def normalize_text(text: str) -> str:
    text = text.replace('\n', " ").strip()
    return " ".join(text.split())


# removing duplicates and junk
def deduplicate_and_filter(lines: list) -> list:
    seen = set()
    clean_lines = []

    for line in lines:
        line = normalize_text(line)

        if len(line) < 15:
            continue

        if line.lower() not in seen:
            seen.add(line.lower())
            clean_lines.append(line)

    return clean_lines

#simplifying data for ai input
def ai_input(scrapped_data: dict) -> str:
    lines = []

    if scrapped_data.get("title"):
        lines.append(f'Product Title: {scrapped_data["title"]}')
    if scrapped_data.get("meta_description"):
        lines.append(f'Meta Description: {scrapped_data["meta_description"]}')
    
    lines.extend(scrapped_data.get("headings", []))
    lines.extend(scrapped_data.get("paragraphs", []))
    lines.extend(scrapped_data.get("bullets", []))

    clean_lines = deduplicate_and_filter(lines)
    combined_text = "\n".join(clean_lines)

    if len(combined_text) > MAX_CHARS: #staying inside safe limit for characters
        combined_text = combined_text[:MAX_CHARS]

    return combined_text
