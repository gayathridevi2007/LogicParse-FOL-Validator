from app.parser.validator import FOLValidator

validator = FOLValidator()

def test_validate_valid_formula():
    res = validator.validate("∀x (Student(x) → Learns(x))")
    assert res.valid is True
    assert len(res.errors) == 0
    assert res.statistics["predicates"] == 2
    assert res.statistics["quantifiers"] == 1
    assert res.statistics["operators"] == 1
    assert res.statistics["parentheses"] == 6
    assert res.parse_tree is not None
    assert res.parse_tree["type"] == "Quantifier"

def test_validate_existential_conjunction():
    res = validator.validate("∃x (Human(x) ∧ Smart(x))")
    assert res.valid is True
    assert res.statistics["quantifiers"] == 1
    assert res.statistics["predicates"] == 2
    assert res.statistics["operators"] == 1

def test_validate_invalid_missing_paren():
    res = validator.validate("∀x (Student(x) → Learns(x)")
    assert res.valid is False
    assert len(res.errors) > 0
    assert res.errors[0]["type"] == "MISSING_PARENTHESIS"
    assert "Missing closing parenthesis" in res.errors[0]["message"]
    assert res.errors[0]["suggestion"] is not None

def test_validate_invalid_standalone_variable():
    res = validator.validate("∀x (x → Student(x))")
    assert res.valid is False
    assert len(res.errors) > 0

def test_validate_arity_inconsistency():
    res = validator.validate("Parent(x, y) ∧ Parent(x)")
    assert res.valid is False
    assert any("Inconsistent arity" in err["message"] for err in res.errors)

def test_validate_semantics_analysis():
    res = validator.validate("∀x Student(x)")
    assert res.valid is True
    assert res.semantics["is_sentence"] is True
    assert res.semantics["bound_variables"] == ["x"]
    assert res.semantics["free_variables"] == []
