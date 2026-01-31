from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict

model = SentenceTransformer("all-MiniLM-L6-v2")


STORE = []


def add_embedding(conv_id: str, text: str):
    vec = model.encode(text)
    STORE.append((conv_id, vec))


def similar(text: str, k: int = 3):
    if not STORE:
        return []

    q = model.encode(text)
    scored = [
        (cid, float(np.dot(q, v)))
        for cid, v in STORE
    ]
    return sorted(scored, key=lambda x: x[1], reverse=True)[:k]


def store_conversation_embeddings(
    conv_id: str,
    segments: List[Dict],
    facts: List[Dict],
    summary: Dict
):

    texts = []

    
    for seg in segments:
        texts.append(seg["text"])

   
    for fact in facts:
        texts.append(f"{fact['key']}: {fact['value']}")

    
    if summary and "summary_long" in summary:
        texts.append(summary["summary_long"])

    embeddings = model.encode(texts)

    for vec in embeddings:
        STORE.append((conv_id, vec))

    return {
        "conv_id": conv_id,
        "stored_vectors": len(embeddings)
    }
