from typing import List, Dict, Any, Optional

class ASTNode:
    def __init__(self, node_type: str, label: str, position: int = 0, length: int = 1):
        self.node_type = node_type
        self.label = label
        self.position = position
        self.length = length

    def to_dict(self) -> Dict[str, Any]:
        raise NotImplementedError

class QuantifierNode(ASTNode):
    def __init__(self, quantifier: str, variable: str, body: ASTNode, position: int = 0, length: int = 1):
        super().__init__("Quantifier", f"{quantifier}{variable}", position, length)
        self.quantifier = quantifier  # "∀" or "∃"
        self.variable = variable      # e.g., "x"
        self.body = body

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": "Quantifier",
            "label": f"{'FOR ALL' if self.quantifier == '∀' else 'EXISTS'} ({self.quantifier}{self.variable})",
            "quantifier": self.quantifier,
            "variable": self.variable,
            "position": self.position,
            "length": self.length,
            "children": [self.body.to_dict()] if self.body else []
        }

class BinaryOpNode(ASTNode):
    def __init__(self, operator: str, left: ASTNode, right: ASTNode, position: int = 0, length: int = 1):
        op_names = {
            "∧": "AND (Conjunction)",
            "∨": "OR (Disjunction)",
            "→": "IMPLIES (Implication)",
            "↔": "IFF (Equivalence)"
        }
        super().__init__("BinaryOp", op_names.get(operator, operator), position, length)
        self.operator = operator
        self.left = left
        self.right = right

    def to_dict(self) -> Dict[str, Any]:
        op_names = {
            "∧": "AND",
            "∨": "OR",
            "→": "IMPLIES",
            "↔": "IFF"
        }
        return {
            "type": "BinaryOp",
            "label": f"{self.operator} ({op_names.get(self.operator, self.operator)})",
            "operator": self.operator,
            "position": self.position,
            "length": self.length,
            "children": [self.left.to_dict(), self.right.to_dict()]
        }

class UnaryOpNode(ASTNode):
    def __init__(self, operator: str, operand: ASTNode, position: int = 0, length: int = 1):
        super().__init__("UnaryOp", f"NOT ({operator})", position, length)
        self.operator = operator
        self.operand = operand

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": "UnaryOp",
            "label": f"{self.operator} (NOT / Negation)",
            "operator": self.operator,
            "position": self.position,
            "length": self.length,
            "children": [self.operand.to_dict()] if self.operand else []
        }

class PredicateNode(ASTNode):
    def __init__(self, name: str, arguments: List[str], position: int = 0, length: int = 1):
        super().__init__("Predicate", f"{name}({', '.join(arguments)})", position, length)
        self.name = name
        self.arguments = arguments

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": "Predicate",
            "label": f"Predicate: {self.name}({', '.join(self.arguments)})",
            "name": self.name,
            "arguments": self.arguments,
            "arity": len(self.arguments),
            "position": self.position,
            "length": self.length,
            "children": [
                {
                    "type": "Argument",
                    "label": f"Arg {i+1}: {arg}",
                    "name": arg,
                    "children": []
                }
                for i, arg in enumerate(self.arguments)
            ]
        }
