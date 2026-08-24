export interface TokenItem {
  type: string;        // QUANTIFIER, PREDICATE, VARIABLE, CONSTANT, OPERATOR, PARENTHESIS, COMMA
  raw_type?: string;
  value: string;
  raw_value: string;
  position: number;
  length: number;
  line: number;
  column: number;
  sub_type?: string;
}

export interface ErrorItem {
  type: string;
  message: string;
  position: number;
  line: number;
  column: number;
  length: number;
  explanation: string;
  suggestion: string;
}

export interface StatisticsItem {
  predicates: number;
  unique_predicates?: number;
  predicate_names?: string[];
  variables: number;
  variable_names?: string[];
  quantifiers: number;
  operators: number;
  parentheses: number;
  total_tokens?: number;
}

export interface PipelineStep {
  step: string;
  name: string;
  status: "completed" | "error" | "pending" | "running";
  detail?: string;
}

export interface SemanticsItem {
  bound_variables: string[];
  free_variables: string[];
  is_sentence: boolean;
  sentence_type: string;
}

export interface ParseTreeNode {
  type: "Quantifier" | "BinaryOp" | "UnaryOp" | "Predicate" | "Argument" | string;
  label: string;
  quantifier?: string;
  variable?: string;
  operator?: string;
  name?: string;
  arguments?: string[];
  arity?: number;
  position?: number;
  length?: number;
  children?: ParseTreeNode[];
}

export interface ValidationResponse {
  valid: boolean;
  expression: string;
  normalized_expression?: string;
  tokens: TokenItem[];
  statistics: StatisticsItem;
  errors: ErrorItem[];
  parse_tree: ParseTreeNode | null;
  pipeline_steps: PipelineStep[];
  semantics?: SemanticsItem;
  history_id?: number;
}

export interface ValidationRequest {
  expression: string;
  save_to_history?: boolean;
}

export interface HistoryItem {
  id: number;
  expression: string;
  normalized_expression?: string;
  is_valid: boolean;
  token_count: number;
  error_count: number;
  error_summary?: string;
  created_at: string;
  statistics?: StatisticsItem;
  tokens?: TokenItem[];
  parse_tree?: ParseTreeNode | null;
  errors?: ErrorItem[];
}

export interface ExampleItem {
  id: string;
  title: string;
  expression: string;
  category: string;
  description: string;
  is_valid: boolean;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface PracticeQuestion {
  id: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  question: string;
  options: string[];
  expression_to_test?: string;
}

export interface PracticeCheckResponse {
  is_correct: boolean;
  correct_option_index: number;
  explanation: string;
  validation_detail?: {
    valid: boolean;
    token_count: number;
    error?: string;
  };
}

export interface AboutInfo {
  project_title: string;
  short_title: string;
  tagline: string;
  problem_statement: string;
  proposed_solution: string;
  architecture_pipeline: Array<{
    step: number;
    name: string;
    description: string;
  }>;
  modules: Array<{
    name: string;
    tech: string;
    responsibility: string;
  }>;
  tech_stack: {
    frontend: string[];
    backend: string[];
    database: string[];
    testing: string[];
  };
  formal_grammar_ebnf: string;
  viva_qa: Array<{
    q: string;
    a: string;
  }>;
}
