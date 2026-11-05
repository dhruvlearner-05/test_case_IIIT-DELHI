import csv,json,collections,statistics
from pathlib import Path
p=Path(__file__).resolve().parents[1]/'dist'/'data'
a=list(csv.DictReader((p/'smb_leads.csv').open(encoding='utf-8-sig')))
z=[x for x in a if x['outcome']=='Activated']
def stats(rows):
 active=[x for x in rows if x['outcome']=='Activated']
 return dict(n=len(rows),active=len(active),conversion=round(100*len(active)/len(rows),2),spend=sum(int(x['acquisition_cost_inr']) for x in rows),cac=round(sum(int(x['acquisition_cost_inr']) for x in rows)/len(active),2) if active else None,median_mrr=statistics.median(int(x['monthly_bundle_value_inr']) for x in active) if active else None,churn=sum(x['churned_within_6_months']=='Y' for x in active),avg_days=statistics.mean(int(x['days_lead_to_activation']) for x in active) if active else None)
r={'all':stats(a),'segments':{k:stats([x for x in a if x['segment']==k]) for k in sorted(set(x['segment'] for x in a))},'sources':{k:stats([x for x in a if x['lead_source']==k]) for k in sorted(set(x['lead_source'] for x in a))},'drops':collections.Counter(x['drop_reason'] for x in a if x['outcome']!='Activated'),'languages':collections.Counter(x['preferred_language'] for x in a),'stages':collections.Counter(x['stage_reached'] for x in a),'calls':statistics.mean(int(x['customer_follow_up_calls']) for x in z),'gst':{k:stats([x for x in a if x['has_gstin']==k]) for k in ['Y','N']}}
print(json.dumps(r,indent=2))
(Path(__file__).resolve().parents[1]/'docs'/'analysis.json').write_text(json.dumps(r,indent=2))
