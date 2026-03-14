---
title: "딥러닝 기반 텍스트 분류: BERT 모델 활용"
date: 2026-03-13
category: "Machine Learning"
tags: [텍스트분석, 머신러닝, 데이터분석, BERT, ELECTRA]
---

TF-IDF는 단어의 빈도만 고려하기 때문에, 단어의 문맥을 이해하지 못한다는 한계가 있다.
- "나는 사과를 좋아해"와 "나는 사과를 싫어해"에서 '사과'는 같은 빈도로 계산되지만, 문맥에 따라 긍정/부정의 의미가 달라질 수 있다.

BERT(Bidirectional Encoder Representations from Transformers)는 딥러닝 기반의 자연어 처리 모델로, 단어의 문맥을 양방향으로 이해할 수 있다.

1. 사전학습(Pre-training)
- 대규모 텍스트 데이터(Wikipedia, BookCorpus 등)를 사용하여 모델을 학습시킨다.
2. 미세조정(Fine-tuning)
- 사전학습된 모델을 특정 작업(감성분석, 질의응답 등)에 맞게 추가 학습시킨다.
3. 양방향 문맥 이해
- 문장의 앞 뒤 문맥을 고려하여 단어의 의미를 파악한다.

## Hugging Face
- AI 모델을 공유하고 사용할 수 있는 오픈소스 플랫폼

### Pipeline
- 모델 + 토크나이저를 한 줄로 사용할 수 있게 해주는 도구

```python
# 감성분석 파이프라인 생성
from transformers import pipeline

classifier = pipeline("sentiment-analysis", model="모델이름")

# 텍스트 분류
result = classifier("I love this product!")
```
 ### 한국어 감성 분류 적용
 한국어는 한국어로 학습된 모델이 필요.
 
 | 모델 | 기반 아키텍처 | 학습 데이터 | 특징 |
|------|-------------|------------|------|
| `Copycats/koelectra-base-v3-generalized-sentiment-analysis` | KoELECTRA-v3 | 상품 리뷰 (범용) | 이진 감성 분류 특화 |
| `daekeun-ml/koelectra-small-v3-nsmc` | KoELECTRA-Small-v3 | NSMC (영화 리뷰) | 14M 경량 모델 |

```markdown
💡**ELECTRA와 BERT의 차이**
10개 단어로 이루어진 문장이 있을 때, BERT는 그 중 1~2개만 가려서 맞히지만, ELECTRA는 10개 전부를 진짜/가짜 판별 대상으로 활용하기 때문에 같은 양의 데이터를 학습해도 ELECTRA가 더 효율적이다.
```
BERT/ELECTRA에서는 전처리 파이프라인 중 정제부터 불용어 제거까지를 의도적으로 생략한다.
- 자체 토크나이저 내장
- 불용어가 문맥의 일부
- 사전학습 데이터와 일치

> 모델에 따라 전처리 전략이 달라진다. TF-IDF같은 단어 빈도 기반 모델을 정교한 전처리가 필수지만, BERT처럼 문맥을 이해하는 딥러닝 모델은 원본 그대로를 넣는 것이 최선이다.

