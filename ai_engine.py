import re


def analyze_deal(deal_context: str):
    """
    Local DealMind Intelligence Engine.

    No OpenAI API or paid service is used.
    Extracts structured intelligence using rule-based analysis.
    """

    text = deal_context.lower()

    risks = []
    buying_signals = []
    pain_points = []
    stakeholders = []
    competitors = []
    commercial_signals = []
    urgency = []

    # -----------------------------
    # RISKS
    # -----------------------------

    if "security" in text:
        risks.append({
            "title": "Security Concern",
            "severity": "High",
            "description": "Customer has raised security or data protection concerns."
        })

    if "competitor" in text or "salesforce" in text:
        risks.append({
            "title": "Competitive Pressure",
            "severity": "Medium",
            "description": "The customer is evaluating another solution."
        })

    if "price" in text or "pricing" in text or "expensive" in text:
        risks.append({
            "title": "Pricing Concern",
            "severity": "Medium",
            "description": "Pricing or budget may affect the buying decision."
        })

    # Pending responses
    delay_match = re.search(r"(\d+)\s+days?", text)

    if delay_match:
        days = int(delay_match.group(1))

        if days >= 7:
            risks.append({
                "title": "Delayed Response",
                "severity": "Medium",
                "description": f"A customer response or questionnaire has been pending for {days} days."
            })

    # -----------------------------
    # BUYING SIGNALS
    # -----------------------------

    if "requested pricing" in text or "pricing" in text:
        buying_signals.append(
            "Customer requested pricing information."
        )

    if "implementation" in text:
        buying_signals.append(
            "Customer requested implementation details."
        )

    if "proposal" in text:
        buying_signals.append(
            "Customer is engaging with the proposal process."
        )

    if "requested" in text:
        buying_signals.append(
            "Customer is actively requesting additional information."
        )

    if "cfo" in text:
        buying_signals.append(
            "Financial leadership has joined the evaluation."
        )

    # -----------------------------
    # PAIN POINTS
    # -----------------------------

    if "security" in text:
        pain_points.append(
            "Security and data protection"
        )

    if "price" in text or "pricing" in text:
        pain_points.append(
            "Pricing / budget"
        )

    if "implementation" in text:
        pain_points.append(
            "Implementation requirements"
        )

    if not pain_points:
        pain_points.append(
            "No clear customer pain point detected."
        )

    # -----------------------------
    # STAKEHOLDERS
    # -----------------------------

        # -----------------------------
    # STAKEHOLDER INTELLIGENCE
    # -----------------------------

    stakeholder_text = text

    # CTO / Technical Decision Maker
    if any(keyword in stakeholder_text for keyword in [
        "cto",
        "chief technology officer",
        "technical decision maker",
        "technology leader",
        "technical leader"
    ]):
        stakeholders.append({
            "name": "Technical Decision Maker",
            "role": "CTO",
            "focus": "Security, architecture and technical requirements"
        })

    # CFO / Financial Decision Maker
    if any(keyword in stakeholder_text for keyword in [
        "cfo",
        "chief financial officer",
        "finance head",
        "financial decision maker",
        "budget owner",
        "finance leader"
    ]):
        stakeholders.append({
            "name": "Financial Decision Maker",
            "role": "CFO",
            "focus": "Pricing, budget and commercial approval"
        })

    # VP Engineering / Engineering Leader
    if any(keyword in stakeholder_text for keyword in [
        "vp engineering",
        "vp of engineering",
        "vice president of engineering",
        "engineering manager",
        "engineering lead",
        "technical lead"
    ]):
        stakeholders.append({
            "name": "Technical Influencer",
            "role": "VP Engineering",
            "focus": "Integration, implementation and deployment"
        })

    # CEO / Executive Sponsor
    if any(keyword in stakeholder_text for keyword in [
        "ceo",
        "chief executive officer",
        "executive sponsor",
        "business leader"
    ]):
        stakeholders.append({
            "name": "Executive Sponsor",
            "role": "CEO",
            "focus": "Business value, strategic impact and final approval"
        })

    # Procurement
    if any(keyword in stakeholder_text for keyword in [
        "procurement",
        "purchasing",
        "procurement manager",
        "buyer"
    ]):
        stakeholders.append({
            "name": "Procurement Stakeholder",
            "role": "Procurement",
            "focus": "Commercial terms, contracts and purchasing process"
        })

    # If no stakeholder is detected
    if not stakeholders:
        stakeholders.append({
            "name": "Stakeholder Not Identified",
            "role": "Unknown",
            "focus": "Add meeting or CRM notes containing stakeholder information"
        })
    # -----------------------------
    # COMPETITORS
    # -----------------------------

    if "salesforce" in text:
        competitors.append("Salesforce")

    if "competitor" in text and not competitors:
        competitors.append("Unnamed competitor")

    # -----------------------------
    # COMMERCIAL SIGNALS
    # -----------------------------

    if "pricing" in text or "price" in text:
        commercial_signals.append(
            "Pricing has become part of the customer evaluation."
        )

    if "budget" in text:
        commercial_signals.append(
            "Budget considerations were mentioned."
        )

    if "proposal" in text:
        commercial_signals.append(
            "Proposal revision or commercial documentation is required."
        )

    # -----------------------------
    # URGENCY
    # -----------------------------

    if "friday" in text:
        urgency.append(
            "Revised proposal requested by Friday."
        )

    if "deadline" in text:
        urgency.append(
            "Customer has communicated a deadline."
        )

    if re.search(r"\b\d+\s+days?\b", text):
        urgency.append(
            "A time-sensitive customer response is involved."
        )

    # -----------------------------
    # SENTIMENT
    # -----------------------------

    if "like the product" in text or "interested" in text:
        sentiment = "Positive with concerns"
    elif "concern" in text or "worried" in text:
        sentiment = "Concerned"
    else:
        sentiment = "Neutral"

    # -----------------------------
    # DEAL HEALTH
    # -----------------------------

    high_risks = len([
        risk for risk in risks
        if risk["severity"] == "High"
    ])

    if high_risks >= 2:
        deal_health = "High Risk"
    elif len(risks) >= 3:
        deal_health = "Needs Attention"
    elif len(risks) >= 1:
        deal_health = "Moderate Risk"
    else:
        deal_health = "Stable"

    # -----------------------------
    # NEXT BEST ACTION
    # -----------------------------

    if "security" in text:
        next_best_action = (
            "Address the security objection first. "
            "Provide security documentation and complete the "
            "outstanding security questionnaire."
        )

    elif "pricing" in text:
        next_best_action = (
            "Follow up on pricing concerns and confirm the customer's "
            "budget, approval process, and decision timeline."
        )

    elif "competitor" in text:
        next_best_action = (
            "Understand the competitor's perceived advantage and "
            "prepare a focused differentiation message."
        )

    else:
        next_best_action = (
            "Schedule the next customer interaction and identify "
            "the next decision milestone."
        )

    # -----------------------------
    # DEAL DNA
    # -----------------------------

    deal_dna = {
        "customer_intent": (
            "Active evaluation with evidence of continued engagement."
            if buying_signals
            else "Early or unclear evaluation"
        ),
        "primary_blocker": (
            risks[0]["title"]
            if risks
            else "No major blocker detected"
        ),
        "competitive_pressure": (
            "Present"
            if competitors
            else "Not detected"
        ),
        "commercial_stage": (
            "Commercial discussion"
            if commercial_signals
            else "Not yet identified"
        ),
        "engagement": (
            "High"
            if len(buying_signals) >= 3
            else "Moderate"
            if buying_signals
            else "Low"
        )
    }

    # -----------------------------
    # FINAL STRUCTURED RESULT
    # -----------------------------

    return {
        "deal_health": deal_health,
        "sentiment": sentiment,
        "risks": risks,
        "buying_signals": buying_signals,
        "pain_points": pain_points,
        "stakeholders": stakeholders,
        "competitors": competitors,
        "commercial_signals": commercial_signals,
        "urgency": urgency,
        "next_best_action": next_best_action,
        "deal_dna": deal_dna
    }