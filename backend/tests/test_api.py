from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["app"] == "LogicParse"

def test_api_validate_valid_expression():
    payload = {"expression": "∀x (Student(x) → Learns(x))", "save_to_history": True}
    response = client.post("/api/validate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True
    assert data["statistics"]["predicates"] == 2
    assert len(data["tokens"]) > 0
    assert data["parse_tree"] is not None

def test_api_validate_invalid_expression():
    payload = {"expression": "∀x (Student(x)", "save_to_history": True}
    response = client.post("/api/validate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is False
    assert len(data["errors"]) > 0
    assert data["parse_tree"] is None

def test_api_history_endpoints():
    # Fetch history list
    res = client.get("/api/history")
    assert res.status_code == 200
    history_list = res.json()
    assert isinstance(history_list, list)
    assert len(history_list) > 0

    first_id = history_list[0]["id"]
    detail_res = client.get(f"/api/history/{first_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == first_id

def test_api_examples():
    res = client.get("/api/examples")
    assert res.status_code == 200
    examples = res.json()
    assert len(examples) >= 6

def test_api_practice():
    res = client.get("/api/practice/questions")
    assert res.status_code == 200
    questions = res.json()
    assert len(questions) > 0

    # Test checking answer
    check_payload = {"question_id": 1, "selected_option_index": 0}
    check_res = client.post("/api/practice/check", json=check_payload)
    assert check_res.status_code == 200
    assert check_res.json()["is_correct"] is True
