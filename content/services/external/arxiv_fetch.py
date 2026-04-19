# student_Reco/content/services/external/arxiv_fetch.py

import urllib.parse
import xml.etree.ElementTree as ET
import requests


ARXIV_API_URL = "http://export.arxiv.org/api/query"

def fetch_arxiv_papers(query, max_results=3):
    """
    Fetch research papers from ArXiv API.
    Does not require an API key.
    """
    # Query format for all: term
    search_query = f"all:{query.replace(' ', '+')}"
    
    params = {
        "search_query": search_query,
        "start": 0,
        "max_results": max_results,
        "sortBy": "relevance",
        "sortOrder": "descending"
    }

    try:
        resp = requests.get(ARXIV_API_URL, params=params, timeout=10)
        resp.raise_for_status()
        xml_data = resp.text
    except Exception as e:
        print("ArXiv API error:", e)
        return []

    results = []
    try:
        root = ET.fromstring(xml_data)
        # XML namespace 
        ns = {'atom': 'http://www.w3.org/2005/Atom'}
        
        for entry in root.findall('atom:entry', ns):
            title = entry.find('atom:title', ns)
            summary = entry.find('atom:summary', ns)
            link = entry.find("atom:link[@type='text/html']", ns)
            published = entry.find('atom:published', ns)
            
            title_text = title.text.replace("\n", " ") if title is not None else ""
            summary_text = summary.text.replace("\n", " ") if summary is not None else ""
            link_url = link.attrib['href'] if link is not None else ""
            published_date = published.text if published is not None else ""
            
            if not link_url:
                continue

            results.append({
                "title": title_text.strip(),
                "description": summary_text.strip(),
                "source_name": "ArXiv",
                "source_url": link_url,
                "thumbnail_url": "", # ArXiv usually does not have thumbnails
                "published_date": published_date,
            })
    except Exception as e:
        print("ArXiv XML parsing error:", e)
        
    return results
